/**
 * Docs search: the query language, the index it runs against, and the ranking.
 *
 * The corpus is small — 71 pages, ~20,000 words — and the whole index ships to
 * the browser, so a search costs no round trip. What ships is not the text
 * alone: tokenizing 20,000 words in the browser is a ~73ms pass on a fast
 * machine and several hundred milliseconds on a phone, and it would land in the
 * middle of the first keystroke. So the tokenizing happens at build time and the
 * tokens ship with the text, as a sorted dictionary and one postings string per
 * term. Finding every page whose text has a word starting with "conf" is then
 * two binary searches over the dictionary rather than a scan of every token in
 * the docs.
 *
 * `tokenize` lives here rather than beside the builder in `$lib/server` because
 * both sides must use the same one. A dictionary built by a tokenizer the query
 * does not share is a dictionary full of terms no query can reach, and the
 * symptom is not an error — it is a result that quietly never appears.
 * `search_index.test.ts` re-tokenizes the shipped text and holds it against the
 * shipped postings for exactly this reason.
 *
 * The query language is the one people already have muscle memory for, from
 * Google and from Postgres' `websearch_to_tsquery`: bare words are prefix
 * matches and AND together, `"a phrase"` is exact and adjacent, `-word`
 * excludes, and `OR` binds looser than the implicit AND, so `a b OR c` is
 * `(a AND b) OR c`.
 */

/* -------------------------------------------------------------------------- */
/* The index                                                                   */
/* -------------------------------------------------------------------------- */

/** Where a term was found. A posting carries these ORed together. */
export const FIELD = {
  title: 1,
  heading: 2,
  description: 4,
  body: 8,
} as const;

/** How much a hit in each field is worth. A title is what the page *is*. */
const FIELD_WEIGHT: Record<number, number> = {
  [FIELD.title]: 10,
  [FIELD.heading]: 5,
  [FIELD.description]: 3,
  [FIELD.body]: 1,
};

export type IndexPage = {
  // Path under /docs, e.g. "duckdb/motherduck".
  slug: string;
  title: string;
  topic: string | null;
  description: string;
  // Indices into `SearchIndex.sections`, in document order.
  sections: number[];
};

export type IndexSection = {
  // Index into `SearchIndex.pages`.
  page: number;
  // null for the lead-in above a page's first heading.
  heading: string | null;
  // The id the rendered heading answers to; null when there is no heading.
  anchor: string | null;
  // The section as plain text: no fences, no link targets, no emphasis marks.
  text: string;
};

export type SearchIndex = {
  version: 1;
  pages: IndexPage[];
  sections: IndexSection[];
  // The dictionary, sorted. `termRange` binary-searches it, so the order is
  // load-bearing rather than cosmetic.
  terms: string[];
  // One string per term, parallel to `terms`: comma-separated
  // `sectionDelta.tf.fieldMask` triples, section ids delta-encoded ascending.
  postings: string[];
};

export type Posting = {
  section: number;
  // Occurrences of the term in that section, across every field.
  tf: number;
  // FIELD bits ORed together.
  fields: number;
};

/**
 * The fields of one section, as the text to index and the bit to index it under.
 *
 * The builder and the engine both call this: the builder to decide what goes
 * into the postings, the engine to check a phrase's adjacency against the same
 * strings the postings were built from. A page's title and description hang off
 * its first section, which is where a title-only match takes its excerpt from.
 */
export function sectionFields(
  page: { title: string; description: string },
  section: { heading: string | null; text: string },
  isFirst: boolean,
): { field: number; text: string }[] {
  const fields: { field: number; text: string }[] = [];
  if (isFirst) {
    fields.push({ field: FIELD.title, text: page.title });
    if (page.description)
      fields.push({ field: FIELD.description, text: page.description });
  }
  if (section.heading)
    fields.push({ field: FIELD.heading, text: section.heading });
  fields.push({ field: FIELD.body, text: section.text });
  return fields;
}

export function encodePostings(postings: Posting[]): string {
  let previous = 0;
  return postings
    .map(({ section, tf, fields }) => {
      const delta = section - previous;
      previous = section;
      return `${delta}.${tf}.${fields}`;
    })
    .join(",");
}

export function decodePostings(encoded: string): Posting[] {
  if (!encoded) return [];
  let section = 0;
  return encoded.split(",").map((triple) => {
    const [delta, tf, fields] = triple.split(".");
    section += Number(delta);
    return { section, tf: Number(tf), fields: Number(fields) };
  });
}

/**
 * Pages and sections, as an index: the dictionary and its postings.
 *
 * Pure, and separate from the builder in `$lib/server/search_index.ts`, which
 * only knows how to turn markdown into sections. Keeping the assembly here means
 * a test can index a handful of made-up pages and search them with the same code
 * that indexes the real corpus.
 */
export function buildIndex(
  pages: IndexPage[],
  sections: IndexSection[],
): SearchIndex {
  const found = new Map<string, Map<number, Posting>>();
  sections.forEach((section, id) => {
    const page = pages[section.page];
    for (const field of sectionFields(page, section, page.sections[0] === id)) {
      for (const { token } of tokenize(field.text)) {
        let postings = found.get(token);
        if (!postings) found.set(token, (postings = new Map()));
        const posting = postings.get(id);
        if (posting) {
          posting.tf += 1;
          posting.fields |= field.field;
        } else {
          postings.set(id, { section: id, tf: 1, fields: field.field });
        }
      }
    }
  });

  const dictionary = [...found.entries()].sort(([a], [b]) => (a < b ? -1 : 1));
  return {
    version: 1,
    pages,
    sections,
    terms: dictionary.map(([term]) => term),
    postings: dictionary.map(([, postings]) =>
      encodePostings(
        [...postings.values()].sort((a, b) => a.section - b.section),
      ),
    ),
  };
}

/* -------------------------------------------------------------------------- */
/* Tokenizing                                                                  */
/* -------------------------------------------------------------------------- */

export type Token = {
  // Folded: lower case, accents removed. What the dictionary holds.
  token: string;
  // Offsets into the *source* text, not the folded form, so an excerpt and an
  // on-page highlight can point at the characters a reader actually sees.
  start: number;
  end: number;
};

// A word starts with a letter or a digit and may carry `_`, `.` and `-` inside
// it. These pages are mostly about a command line: `motherduck_token`,
// `harlequin.sh` and `v2.13.0` are each one word, and splitting them into three
// would make them unsearchable as themselves. A leading `--` is not part of the
// word — `--limit` is found by searching `limit`, which is what people type.
const TOKEN = /[\p{L}\p{N}][\p{L}\p{N}_.-]*/gu;

/**
 * One word, as the dictionary holds it. Punctuation the tokenizer treats as a
 * separator needs no folding here — and that covers the curly quotes and
 * ellipses smartypants introduces, so the rendered page and the indexed
 * markdown tokenize alike without either side knowing about the other.
 */
export function foldTerm(word: string): string {
  return word
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[._-]+$/, "");
}

export function tokenize(text: string): Token[] {
  const tokens: Token[] = [];
  for (const match of text.matchAll(TOKEN)) {
    // Trailing punctuation belongs to the sentence, not the word: the `.` in
    // "run harlequin.sh." closes the sentence, the one before `sh` does not.
    const word = match[0].replace(/[._-]+$/, "");
    if (!word) continue;
    const token = foldTerm(word);
    if (!token) continue;
    tokens.push({
      token,
      start: match.index,
      end: match.index + word.length,
    });
  }
  return tokens;
}

/* -------------------------------------------------------------------------- */
/* The query                                                                   */
/* -------------------------------------------------------------------------- */

export type Clause = {
  negated: boolean;
  // Folded, in order. More than one means the clause must match them adjacently.
  terms: string[];
  // Whether the last term is a prefix. Quoting a phrase turns this off: a reader
  // who typed the quotes asked for those words, not for words beginning with them.
  prefix: boolean;
};

/** Groups are ORed; the clauses within a group are ANDed. */
export type ParsedQuery = { groups: Clause[][] };

/**
 * Web-search syntax, parsed.
 *
 * The edges, all of which a reader will hit by accident: an unclosed quote runs
 * to the end of the input rather than being dropped; a dangling `OR` disappears
 * instead of leaving an empty alternative that matches everything; `OR` is only
 * an operator when it stands alone unquoted, so `"or"` searches for the word.
 */
export function parseQuery(input: string): ParsedQuery {
  const groups: Clause[][] = [];
  let group: Clause[] = [];
  let i = 0;

  const push = (negated: boolean, raw: string, prefix: boolean) => {
    const terms = tokenize(raw).map((token) => token.token);
    if (terms.length) group.push({ negated, terms, prefix });
  };

  while (i < input.length) {
    if (/\s/.test(input[i])) {
      i++;
      continue;
    }
    // A `-` negates only when a word or a phrase follows it directly. `--limit`
    // is a flag, not an exclusion of "limit", and it is exactly the kind of
    // thing a reader of these docs types into a search box.
    let negated = false;
    if (
      input[i] === "-" &&
      i + 1 < input.length &&
      !/[-\s]/.test(input[i + 1])
    ) {
      negated = true;
      i++;
    }
    if (input[i] === '"') {
      const close = input.indexOf('"', i + 1);
      const raw = close === -1 ? input.slice(i + 1) : input.slice(i + 1, close);
      i = close === -1 ? input.length : close + 1;
      push(negated, raw, false);
      continue;
    }
    let end = i;
    while (end < input.length && !/\s/.test(input[end])) end++;
    const raw = input.slice(i, end);
    i = end;
    if (!negated && /^or$/i.test(raw)) {
      if (group.length) {
        groups.push(group);
        group = [];
      }
      continue;
    }
    push(negated, raw, true);
  }
  if (group.length) groups.push(group);
  return { groups };
}

/* -------------------------------------------------------------------------- */
/* Dictionary lookup                                                           */
/* -------------------------------------------------------------------------- */

function lowerBound(terms: string[], key: string): number {
  let lo = 0;
  let hi = terms.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (terms[mid] < key) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

/**
 * The half-open range of dictionary entries starting with `prefix`.
 *
 * `￿` is above every code unit a term can contain, so it bounds the range
 * from the right without a scan.
 */
export function termRange(terms: string[], prefix: string): [number, number] {
  if (!prefix) return [0, 0];
  return [lowerBound(terms, prefix), lowerBound(terms, prefix + "￿")];
}

/** The range holding exactly `term`: empty when the dictionary lacks it. */
export function exactRange(terms: string[], term: string): [number, number] {
  const at = lowerBound(terms, term);
  return terms[at] === term ? [at, at + 1] : [at, at];
}

/* -------------------------------------------------------------------------- */
/* Matching within a section                                                   */
/* -------------------------------------------------------------------------- */

function matchesTerm(token: string, term: string, prefix: boolean): boolean {
  return prefix ? token.startsWith(term) : token === term;
}

/**
 * Where a clause matches, as half-open token index ranges. A phrase matches only
 * where its words are adjacent, which is the part the postings cannot answer.
 */
export function clauseSpans(
  tokens: Token[],
  clause: Clause,
): [number, number][] {
  const spans: [number, number][] = [];
  const width = clause.terms.length;
  for (let i = 0; i + width <= tokens.length; i++) {
    let matched = true;
    for (let k = 0; k < width; k++) {
      const isLast = k === width - 1;
      const prefix = clause.prefix && isLast;
      if (!matchesTerm(tokens[i + k].token, clause.terms[k], prefix)) {
        matched = false;
        break;
      }
    }
    if (matched) spans.push([i, i + width]);
  }
  return spans;
}

/** The character ranges a clause matches in `text`, for `<mark>`-ing them. */
export function highlightRanges(
  text: string,
  clauses: Clause[],
): [number, number][] {
  const tokens = tokenize(text);
  const ranges: [number, number][] = [];
  for (const clause of clauses) {
    if (clause.negated) continue;
    for (const [from, to] of clauseSpans(tokens, clause)) {
      ranges.push([tokens[from].start, tokens[to - 1].end]);
    }
  }
  return mergeRanges(ranges);
}

function mergeRanges(ranges: [number, number][]): [number, number][] {
  const sorted = [...ranges].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const merged: [number, number][] = [];
  for (const range of sorted) {
    const last = merged[merged.length - 1];
    if (last && range[0] <= last[1]) last[1] = Math.max(last[1], range[1]);
    else merged.push([...range]);
  }
  return merged;
}

/* -------------------------------------------------------------------------- */
/* Excerpts                                                                    */
/* -------------------------------------------------------------------------- */

/** A run of excerpt text, and whether it is part of a match. */
export type Segment = { text: string; hit: boolean };

const EXCERPT_TOKENS = 35;
const LEAD_IN_TOKENS = 5;

/**
 * The sentence or two around the best match, with the matches marked.
 *
 * Segments rather than a string of HTML: the component renders `<mark>` around
 * the hits itself, so nothing here can put markup into a page.
 *
 * "Best" is the window covering the most *distinct* clauses. A page that says
 * one of the words forty times should not beat the paragraph that says all of
 * them once, which is the paragraph the reader is looking for.
 */
export function excerpt(
  text: string,
  clauses: Clause[],
  width = EXCERPT_TOKENS,
): Segment[] {
  const tokens = tokenize(text);
  const positive = clauses.filter((clause) => !clause.negated);

  // Every match, tagged with the clause it came from.
  const hits: { from: number; to: number; clause: number }[] = [];
  positive.forEach((clause, index) => {
    for (const [from, to] of clauseSpans(tokens, clause)) {
      hits.push({ from, to, clause: index });
    }
  });
  hits.sort((a, b) => a.from - b.from);

  if (!hits.length) return [{ text: truncate(text, width), hit: false }];

  let best = hits[0].from;
  let bestCount = -1;
  for (const hit of hits) {
    const covered = new Set(
      hits
        .filter(
          (other) => other.from >= hit.from && other.to <= hit.from + width,
        )
        .map((other) => other.clause),
    );
    if (covered.size > bestCount) {
      bestCount = covered.size;
      best = hit.from;
    }
  }

  const from = Math.max(0, best - LEAD_IN_TOKENS);
  const to = Math.min(tokens.length, from + width);
  const start = tokens[from].start;
  const end = tokens[to - 1].end;

  const segments: Segment[] = [];
  const add = (slice: string, hit: boolean) => {
    if (!slice) return;
    const last = segments[segments.length - 1];
    if (last && last.hit === hit) last.text += slice;
    else segments.push({ text: slice, hit });
  };

  let at = start;
  for (const [hitStart, hitEnd] of mergeRanges(
    hits
      .filter((hit) => hit.from >= from && hit.to <= to)
      .map((hit): [number, number] => [
        tokens[hit.from].start,
        tokens[hit.to - 1].end,
      ]),
  )) {
    add(text.slice(at, hitStart), false);
    add(text.slice(hitStart, hitEnd), true);
    at = hitEnd;
  }
  add(text.slice(at, end), false);

  if (from > 0) segments.unshift({ text: "…", hit: false });
  if (to < tokens.length) segments.push({ text: "…", hit: false });
  return segments;
}

function truncate(text: string, width: number): string {
  const tokens = tokenize(text);
  if (tokens.length <= width) return text.trim();
  return `${text.slice(0, tokens[width - 1].end).trim()}…`;
}

/* -------------------------------------------------------------------------- */
/* The engine                                                                  */
/* -------------------------------------------------------------------------- */

export type ResultSection = {
  heading: string | null;
  anchor: string | null;
};

export type SearchResult = {
  slug: string;
  title: string;
  topic: string | null;
  description: string;
  score: number;
  /** The section the excerpt came from, and the one the result links to. */
  best: ResultSection & { excerpt: Segment[] };
  /** Other sections of the same page that matched, best first. */
  more: ResultSection[];
};

/** `/docs/duckdb/motherduck?q=token#connecting` — the link a result opens. */
export function resultHref(
  slug: string,
  query: string,
  anchor: string | null,
): string {
  const search = query ? `?q=${encodeURIComponent(query)}` : "";
  return `/docs/${slug}${search}${anchor ? `#${anchor}` : ""}`;
}

const MORE_SECTIONS = 2;

export type Engine = {
  search(query: string, limit?: number): SearchResult[];
};

/**
 * An engine over one index.
 *
 * It holds two caches, and both exist so that the text is touched as little as
 * possible: postings are decoded once per term, and a section is tokenized only
 * if it survives retrieval — to verify a phrase's adjacency, or to be excerpted.
 * A one-word query never tokenizes anything but itself.
 */
export function createEngine(index: SearchIndex): Engine {
  const decoded: (Posting[] | undefined)[] = new Array(index.terms.length);
  const tokenized = new Map<string, Token[]>();

  const postingsAt = (term: number): Posting[] =>
    (decoded[term] ??= decodePostings(index.postings[term]));

  const fieldsOf = (section: number) => {
    const page = index.pages[index.sections[section].page];
    return sectionFields(
      page,
      index.sections[section],
      page.sections[0] === section,
    );
  };

  const tokensOf = (section: number, field: number, text: string): Token[] => {
    const key = `${section}:${field}`;
    let tokens = tokenized.get(key);
    if (!tokens) tokenized.set(key, (tokens = tokenize(text)));
    return tokens;
  };

  type TermHit = { tf: number; fields: number; exact: boolean };

  /** Sections where a clause matches, with what the hit is worth in each. */
  function clauseHits(clause: Clause): Map<number, number> {
    // One map per term, so that a phrase can intersect them: a section that
    // lacks any one of the words cannot hold the phrase.
    const perTerm = clause.terms.map((term, position) => {
      const last = position === clause.terms.length - 1;
      const [from, to] =
        clause.prefix && last
          ? termRange(index.terms, term)
          : exactRange(index.terms, term);
      const found = new Map<
        number,
        { tf: number; fields: number; exact: boolean }
      >();
      for (let t = from; t < to; t++) {
        const exact = index.terms[t] === term;
        for (const posting of postingsAt(t)) {
          const seen = found.get(posting.section);
          if (seen) {
            seen.tf += posting.tf;
            seen.fields |= posting.fields;
            seen.exact ||= exact;
          } else {
            found.set(posting.section, {
              tf: posting.tf,
              fields: posting.fields,
              exact,
            });
          }
        }
      }
      return found;
    });

    const hits = new Map<number, number>();
    for (const section of perTerm[0].keys()) {
      // Every word has to be somewhere in the section before its adjacency is
      // worth checking, and the postings answer that without touching the text.
      const parts: TermHit[] = [];
      for (const term of perTerm) {
        const part = term.get(section);
        if (!part) break;
        parts.push(part);
      }
      if (parts.length < perTerm.length) continue;

      // A phrase's words all being present is not the phrase. Adjacency costs a
      // tokenize, so it is paid here, on the few sections that got this far.
      if (clause.terms.length > 1) {
        const adjacent = fieldsOf(section).some(
          (field) =>
            clauseSpans(tokensOf(section, field.field, field.text), clause)
              .length > 0,
        );
        if (!adjacent) continue;
      }

      const fields = parts.reduce((mask, part) => mask | part.fields, 0);
      const weight = Object.values(FIELD)
        .filter((bit) => fields & bit)
        .reduce((sum, bit) => sum + FIELD_WEIGHT[bit], 0);
      hits.set(
        section,
        weight *
          // Saturating, so that a page repeating a word cannot drown a page
          // that says it once in its title.
          (1 + Math.log(Math.min(...parts.map((part) => part.tf)))) *
          (parts.every((part) => part.exact) ? 1 : 0.6) *
          (clause.terms.length > 1 ? 2 : 1),
      );
    }
    return hits;
  }

  function runGroup(group: Clause[]): Map<number, Map<number, number>> {
    const positive = group.filter((clause) => !clause.negated);
    const negative = group.filter((clause) => clause.negated);
    // `-duckdb` on its own would otherwise be every page that never says it,
    // which is not an answer to anything anyone meant to ask.
    if (!positive.length) return new Map();

    const hits = positive.map(clauseHits);
    const excluded = new Set<number>();
    for (const clause of negative) {
      for (const section of clauseHits(clause).keys()) {
        excluded.add(index.sections[section].page);
      }
    }

    // Positives AND across the *page*: a page that answers half the query in one
    // section and half in the next has answered it.
    const pages = hits
      .map(
        (hit) =>
          new Set(
            [...hit.keys()].map((section) => index.sections[section].page),
          ),
      )
      .reduce(
        (all, some) => new Set([...all].filter((page) => some.has(page))),
      );

    const scores = new Map<number, Map<number, number>>();
    for (const page of pages) {
      if (excluded.has(page)) continue;
      const sections = new Map<number, number>();
      for (const section of index.pages[page].sections) {
        const score = hits.reduce(
          (sum, hit) => sum + (hit.get(section) ?? 0),
          0,
        );
        if (score > 0) sections.set(section, score);
      }
      // A page where one section answers the whole query beats one where the
      // words are scattered over four.
      const whole = index.pages[page].sections.some((section) =>
        hits.every((hit) => hit.has(section)),
      );
      if (whole) {
        for (const [section, score] of sections)
          sections.set(section, score * 1.25);
      }
      scores.set(page, sections);
    }
    return scores;
  }

  function search(query: string, limit = 20): SearchResult[] {
    const parsed = parseQuery(query);
    if (!parsed.groups.length) return [];

    // The clauses that decide what gets highlighted: whatever the reader asked
    // for, from whichever alternative matched.
    const positive = parsed.groups.flat().filter((clause) => !clause.negated);

    const best = new Map<number, Map<number, number>>();
    for (const group of parsed.groups) {
      for (const [page, sections] of runGroup(group)) {
        const total = (map: Map<number, number>) =>
          [...map.values()].reduce((sum, score) => sum + score, 0);
        const seen = best.get(page);
        if (!seen || total(sections) > total(seen)) best.set(page, sections);
      }
    }

    // Score first, then build: an excerpt costs a tokenize, and only the
    // results that come back are worth paying it for.
    return (
      [...best.entries()]
        .map(([page, sections]) => ({
          page,
          sections,
          score: [...sections.values()].reduce((sum, score) => sum + score, 0),
        }))
        // Ties break by sidebar order, which is the order `buildCorpus` emits and
        // therefore the order of `pages`: two equally good answers should come
        // back in the same order every time.
        .sort((a, b) => b.score - a.score || a.page - b.page)
        .slice(0, limit)
        .map(({ page, sections, score }) => {
          const ranked = [...sections.entries()].sort(
            (a, b) => b[1] - a[1] || a[0] - b[0],
          );
          const top = index.sections[ranked[0][0]];
          const found = index.pages[page];
          return {
            slug: found.slug,
            title: found.title,
            topic: found.topic,
            description: found.description,
            score,
            best: {
              heading: top.heading,
              anchor: top.anchor,
              // A page matched on its title alone has no body hit to quote, so it
              // falls back to the line that says what the page is.
              excerpt: excerpt(top.text || found.description, positive),
            },
            more: ranked
              .slice(1)
              .filter(([id]) => index.sections[id].heading)
              .slice(0, MORE_SECTIONS)
              .map(([id]) => ({
                heading: index.sections[id].heading,
                anchor: index.sections[id].anchor,
              })),
          };
        })
    );
  }

  return { search };
}
