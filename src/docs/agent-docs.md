---
title: Agent Docs
description: Every page of these docs is also published as markdown and as JSON — .md twins, llms.txt, llms-full.txt, and a docs API.
---

Every page of these docs is also published as markdown and as JSON, for agents
and other programs that read them.

Add `.md` to any docs URL for the raw page: `/docs/hsql/exit-codes.md`. The two
buttons beside a page title do the same thing.

- [llms.txt](/llms.txt) — every page on this site, with a one-line description.
- [llms-full.txt](/llms-full.txt) — the whole corpus in one file.
- [/api/docs/v1.json](/api/docs/v1.json) — the same index as JSON.
  `/api/docs/v1/<slug>.json` is one page, with its markdown.

An agent driving [hsql](/docs/hsql) does not have to read any of it:
`hsql --skill` installs an [Agent Skill](/docs/hsql/skill) that covers the same
ground, matched to the version installed.
