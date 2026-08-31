---
title: The hsql Agent Skill
description: What hsql's Agent Skill teaches an agent, and three ways to install it — hsql --skill, the plugin marketplace, or the copy published here.
---

<script>
    import Note from "$lib/components/note.svelte"
</script>

hsql ships an [Agent Skill](https://agentskills.io): a markdown file an agent
loads when the work involves a database, and keeps in context for the rest of
the session.

```bash
hsql --skill -o ~/.claude/skills/hsql/
```

```output
note: wrote 5 files to /home/user/.claude/skills/hsql: SKILL.md, references/config.md, references/queries.md, references/scripting.md, references/troubleshooting.md
```

## What It Says

Nine short sections of standing guidance:

1. **Ask before you assume** — `hsql --info` for versions, config files and
   capabilities; `hsql --help -a NAME` for one adapter's options.
2. **Keep credentials off the command line** — a
   [profile](/docs/hsql/config) and `-P`, with an environment variable for the
   secret.
3. **Read the [catalog](/docs/hsql/catalog) before writing SQL** — `--catalog`,
   `--path`, `--catalog-search`, and the `query_name` column rather than an
   identifier quoted by hand.
4. **Run it** — `-c` and `-f`, `--result`, `--on-error`.
5. **Pick a [format](/docs/hsql/formats) on purpose** — `-tAc` for one value,
   `--csv` for a pipe, `--markdown` for a reply, parquet for anything large.
6. **[The row limit](/docs/hsql/safety) is real** — 500 by default; read
   `--stats`, and do not use `2>/dev/null`.
7. **Branch on the [exit code](/docs/hsql/exit-codes)** — `2` is the caller's,
   `1` is the SQL's, `3` is the environment's.
8. **Ask before you write** — prefer `--read-only`, and say what a DDL or DML
   statement will change first.
9. **Know when to hand off** — anything destructive, or anything a human will
   want to iterate on: `harlequin -P <profile>`.

Four reference files sit beside it, read when the job calls for one:
`queries.md`, `config.md`, `scripting.md` and `troubleshooting.md`.

<Note>

`allowed-tools` pre-approves the read-only modes only — `hsql --info`,
`--spec`, `--catalog` and `--catalog-search` — so orienting costs no permission
prompt. Running a query is still a decision somebody makes.

</Note>

## Installing It

### From the hsql You Have

```bash
hsql --skill -o ~/.claude/skills/hsql/     # for you, in every project
hsql --skill -o .claude/skills/hsql/       # for this repo, committed with it
```

No network, and the skill matches the hsql on that machine. It works in any
harness that reads a skills directory. With no `-o`, `hsql --skill` writes
`SKILL.md` to stdout.

### As a Claude Code Plugin

The same skill is a plugin in Harlequin's repository:

```
/plugin marketplace add tconbeer/harlequin
/plugin install hsql@harlequin
```

The marketplace is added once. After that, updates come with the repository
rather than with your Python environment.

### From This Site

[harlequin.sh/artifacts/SKILL.md](/artifacts/SKILL.md) is the copy vendored
from the latest release, with its reference files beside it at
`/artifacts/references/queries.md` and its siblings. Useful when hsql is not
installed on the machine doing the reading. When it is installed, prefer
`hsql --skill`: that copy cannot describe a different version than the one it
is driving.

The skill covers habits rather than options. For a flag it does not mention,
the [CLI reference](/docs/hsql/reference) is one page, and `hsql --spec` is the
same thing as JSON.
