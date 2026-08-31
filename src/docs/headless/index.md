---
title: Headless & Agents
description: "The reference beneath the hsql tutorial: the catalog, formats, exit codes, config, safety, the generated CLI reference and the agent skill."
---

<script>
    import Tip from "$lib/components/tip.svelte"
</script>

[hsql](/docs/getting-started/hsql) is Harlequin's headless CLI: the same config
and query engine as the full-screen IDE, with an interface built for agents,
scripts and automations. This topic is the reference beneath that tutorial.

The tutorial is the page you read once, to learn what hsql is and how to run it.
These are the pages you — or the agent driving your shell — come back to: the
exact shape of the catalog, every format and layout switch, what each exit code
means, how a profile is discovered and merged, and what bounds an invocation.

## The Path Through It

- [Exit Codes and Streams](/docs/headless/exit-codes) — the six codes, what
  hsql puts on stdout and on stderr, `--stats`, and `--on-error`. Read this
  first if you are writing something that has to notice a failure.
- [Exploring the Catalog](/docs/headless/catalog) — `--catalog`, `--path` and
  `--catalog-search`: how to find out what is in a database before you write
  SQL against it.
- [Formats and Layouts](/docs/headless/formats) — every format, the shorthand
  flags, the layout switches, and `-o`.
- [Config Files and Profiles](/docs/headless/config) — where config files come
  from, how they merge, how to keep credentials out of them, and the five
  `--config` modes.
- [Running Safely](/docs/headless/safety) — `--read-only`, `--timeout`, the
  row limit, and the adapter capabilities that back them.
- [Differences from psql](/docs/headless/psql) — what carries over, and what
  does not.
- [Reference: hsql CLI](/docs/headless/reference) — every option, generated
  from hsql itself.
- [The hsql Agent Skill](/docs/headless/skill) — what the skill says, and three
  ways to install it.

## Two Kinds of Reader

hsql is meant to be driven by an agent as often as by a person, so these pages
are written for both, and the site serves them to both:

- Every page here has a markdown twin at its own URL with `.md` on the end —
  `/docs/headless/exit-codes.md`, for instance — and the two buttons beside a
  page's title copy or open it.
- [llms.txt](/llms.txt) indexes every page on this site with a one-line
  description; [llms-full.txt](/llms-full.txt) is the whole corpus in one file.
- [/api/docs/v1.json](/api/docs/v1.json) is the same index as JSON, and
  `/api/docs/v1/<slug>.json` is one page with its markdown.

<Tip>

If you are teaching an agent to use hsql, you do not have to write any of this
down yourself: `hsql --skill` installs an
[Agent Skill](/docs/headless/skill) that already says it, matched to the hsql
you have installed.

</Tip>

## Everything Else

hsql shares its adapters, its config files and its query engine with Harlequin,
so the rest of these docs apply to it unchanged:

- [Database Adapters](/docs/adapters) — what hsql can connect to, and how to
  install one.
- [Configuring Harlequin](/docs/config-file) — config files in full, including
  the keys that only the IDE reads.
- [Getting Help](/docs/getting-started/help) — where to ask, and where to file
  a bug.
