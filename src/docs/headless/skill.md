---
title: The hsql Agent Skill
description: What hsql's Agent Skill teaches an agent, and three ways to install it — hsql --skill, the plugin marketplace, or the copy published here.
---

<script>
    import Tip from "$lib/components/tip.svelte"
    import Note from "$lib/components/note.svelte"
</script>

hsql ships an [Agent Skill](https://agentskills.io): a markdown file that an
agent loads when the work involves a database, and that then stays in context
for the rest of the session. It is how an agent learns to drive hsql well
without you writing any of it down.

```bash
hsql --skill -o ~/.claude/skills/hsql/
```

```output
note: wrote 5 files to /home/user/.claude/skills/hsql: SKILL.md, references/config.md, references/queries.md, references/scripting.md, references/troubleshooting.md
```

## What It Says

Nine short sections of standing guidance, not a checklist:

1. **Ask before you assume** — `hsql --info` for versions, config files and
   adapter capabilities; `hsql --help -a NAME` for one adapter's connection
   options.
2. **Keep credentials off the command line** — a
   [profile](/docs/headless/config) and `-P`, with an environment variable for
   the secret.
3. **Orient in the [catalog](/docs/headless/catalog) before writing SQL** —
   `--catalog`, `--path`, `--catalog-search`, and the `query_name` column
   instead of an identifier you quoted by hand.
4. **Run it** — `-c` and `-f`, `--result`, `--on-error`.
5. **Pick a [format](/docs/headless/formats) on purpose** — `-tAc` for one
   value, `--csv` for a pipe, `--markdown` for a reply, parquet for anything
   large.
6. **[The row limit](/docs/headless/safety) is real** — 500 by default; read
   `--stats`, and never `2>/dev/null`.
7. **Branch on the [exit code](/docs/headless/exit-codes)** — a `2` is the
   caller's bug, a `1` is the SQL's, a `3` is the environment's.
8. **Ask before you write** — prefer `--read-only`, and say what a DDL or DML
   statement will change before running it.
9. **Know when to hand off** — anything destructive, anything a human will want
   to iterate on: stop, and tell them to open `harlequin -P <profile>`.

Four reference files sit beside it, and an agent reads one when it reaches that
job: `queries.md`, `config.md`, `scripting.md` and `troubleshooting.md`.

<Note>

The skill's `allowed-tools` pre-approves the read-only modes only —
`hsql --info`, `--spec`, `--catalog` and `--catalog-search` — so an agent can
orient itself without a permission prompt. Running a query is still a decision
somebody makes.

</Note>

## Three Ways to Install It

### 1. From the hsql You Have

```bash
hsql --skill -o ~/.claude/skills/hsql/     # for you, in every project
hsql --skill -o .claude/skills/hsql/       # for this repo, committed with it
```

This needs no network, and the skill it writes is necessarily the skill for the
hsql on that machine — the one place _which version am I reading about_ cannot
be got wrong. It works in any harness that reads a skills directory.

With no `-o`, `hsql --skill` writes `SKILL.md` to stdout, so you can read it
before you install it.

### 2. As a Claude Code Plugin

The same skill is a plugin in Harlequin's repository:

```
/plugin marketplace add tconbeer/harlequin
/plugin install hsql@harlequin
```

The marketplace only has to be added once; after that, `/plugin install` is the
whole install, and updates come with the repository rather than with your
Python environment.

### 3. From This Site

The published copy is the artifact vendored here from the latest release, and
it is fetchable without installing anything:
[harlequin.sh/artifacts/SKILL.md](/artifacts/SKILL.md). Its four reference files
sit beside it, at `/artifacts/references/queries.md` and its siblings.

Reach for this one when hsql is not installed on the machine doing the reading —
a hosted agent deciding whether hsql is the right tool, for instance. When hsql
_is_ installed, prefer the first option: a skill that came out of the wheel
cannot describe a different version than the one it is driving.

<Tip>

The skill teaches habits, not options. When the agent needs a flag it does not
have, the [CLI reference](/docs/headless/reference) is one page, and
`hsql --spec` is the same thing as JSON on the machine itself.

</Tip>
