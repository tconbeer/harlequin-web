---
title: Warm Sessions
description: "`--serve` and `--session` (the hsql server)"
---

<script>
    import Note from "$lib/components/note.svelte"
    import Tip from "$lib/components/tip.svelte"
    import Warning from "$lib/components/warning.svelte"
</script>

By default, every invocation of hsql starts a new process and
creates a fresh database connection. For repeated invocations, this can
be unnecessarily slow, and prevents more complex explorations using an open
session, like creating and querying temp tables.

`hsql --serve my_session -P dev` holds one connection open instead, and
`hsql --session my_session -c "..."` sends queries to it, so queries can
return in milliseconds, and temp tables and settings survive from one to the next.

<Note>

The hsql server is POSIX only. A session is reached over a unix socket, which native
Windows does not have. This feature does work on WSL2.

</Note>

## Starting The Server

`--serve NAME` connects, then holds that connection open as the session called
`NAME`:

```bash
hsql --serve dev -P dev
```

```output
note: session 'dev' is ready (duckdb). Send it queries with `hsql --session dev -c ...`, or set HSQL_SESSION=dev. Ctrl-C stops it.
```

It holds the terminal, writing a line per request to stderr, until you stop it
with `Ctrl-C`:

```output
note: request 1: exit 0 in 15ms
note: request 2: exit 0 in 167ms
note: session 'dev' stopped after 2 requests.
```

`--serve` starts a simple foreground process, which you can background with `&` or manage with a service manager like systemd (as a _user_ unit, since hsql uses a socket linked to your user).

## Executing Queries

`--session NAME` forwards a query to the session's server instead of creating a new connection to the database:

```bash
hsql --session dev -c "create temp table recent as select * from orders where ordered_at > now() - interval 7 day"
hsql --session dev -c "select count(*) from recent"
```

```output
 count_star()
--------------
 1892
(1 row)
```

Everything else about the invocation is unchanged: the same flags, the same
[formats](/docs/hsql/formats), the same [exit codes](/docs/hsql/exit-codes), the
same bytes on stdout. A request carries your working directory with it, so
`-f ./script.sql` and `-o ./out.csv` mean what they would have meant cold.

You can use the `HSQL_SESSION` environment variable instead of the `--session` option:

```bash
export HSQL_SESSION=dev
hsql -c "select count(*) from recent"
```

The two spellings differ in what happens when no such session is running. A
typed `--session` is an assertion, and hsql exits [`3`](/docs/hsql/exit-codes)
rather than quietly running without the state you were counting on.
`HSQL_SESSION` is a preference, so the invocation runs cold but emits a warning:

```output
note: no session named 'dev' is running, so this invocation is running cold. Start one with `hsql --serve dev ...`.
```

## Session State

When the server creates a session in the attached database, hsql invocations can become
stateful:

- **Temp tables persist.** `create temp table` in one invocation is queryable by
  the next.
- **Settings persist.** `SET`, `search_path`, time zones, DuckDB `PRAGMA`s,
  extensions, etc. A `SET` in one invocation changes the results of the
  next.
- **In-memory databases persist.** `hsql --serve scratch ":memory:"` is a
  scratch interactive warehouse.
- **Transactions persist.** A `begin` in one query will begin a transaction
  that won't be automatically closed; this can cause the server to hold
  locks until the session is reset or the server is shut down.

## Resetting and Inspecting

`--session-reset` closes the database connection and opens a fresh one, effectively
resetting the state above.

```bash
hsql --session dev --session-reset
```

```output
note: session 'dev' reconnected.
```

`--session-status` reports what the session is doing, as JSON, and answers even
while a query is running:

```bash
hsql --session dev --session-status
```

```output
&lbrace;"session":"dev","pid":2249,"version":"2.13.0","adapter":"duckdb","connection":":memory:","connection_options":&lbrace;&rbrace;,"uptime_s":13.7,"requests":2,"state":"idle","queued":0,"transaction_mode":null,"ssh":null,"idle_timeout_s":1800.0,"expires_in_s":1797.4&rbrace;
```

`state` is `idle`, `busy` or `unavailable`, and `queued` is how many requests are
waiting behind the one running.

## Configuring Sessions

Options belongs to one of three groups. hsql will refuse options passed to the wrong mode (in some cases,
only if they contradict the existing session).

| Group            | Options                                                                         | Where                            |
| ---------------- | ------------------------------------------------------------------------------- | -------------------------------- |
| Connection       | `CONN_STR`, `-a`, `-r`, the [SSH options](/docs/ssh), and every adapter option  | `--serve`, once                  |
| Session lifetime | `--idle-timeout`, `--max-lifetime`, `--queue-timeout`                           | `--serve`, once                  |
| Per request      | `-c`, `-f`, `--format`, `-o`, `--limit`, `--timeout`, `--catalog`, and the rest | `--session`, on every invocation |
| Meta             | `-P`/`--profile`, `--config-path`                                               | Anywhere                         |

```bash
hsql --session dev --read-only -c "select 1"
```

```output
hsql: error: --read-only is a connection option. The session named 'dev' was started without it, and its connection is fixed. Drop it here, or start a session with it: 'hsql --serve NAME --read-only ...'.
```

`-P` and `--config-path` are special meta-options: they determine where config values
are loaded from, so they can be used with either `--serve` or `--session`. When used with
`--session`, profiles that contradict `--serve` options may be refused.

## Queuing

A session has one database connection, so it runs one query at a time; a second
invocation with `--session` is queued behind the first if necessary.
`--queue-timeout SECONDS` on `--serve` bounds that wait, and a request
that times out exits [`4`](/docs/hsql/exit-codes).

`Ctrl-C` from the `--session` (client) invocation cancels a request, whether it had
started or was still queued, and hsql exits `130` as it does cold. Where the adapter
[cannot cancel a query](/docs/hsql/safety), hsql prints a warning on stderr that the query
is still running and still holding the session; `--session-status` can provide more
information.

## When a Session Stops

A session is a live authenticated database connection, so by default it will time out
after 30 minutes with no requests, or 8 hours after it connected, whichever comes first.
Both timeouts are configurable:

```bash
hsql --serve dev -P dev --idle-timeout 3600 --max-lifetime 0
```

`0` disables either timeout. Neither timeout can interrupt a query that is in-flight,
but `--max-lifetime` can stop a queued query from executing.

## Security

A session holds an authenticated database connection (and an [SSH tunnel](/docs/ssh), if
it opened one) for as long as it runs, so it has additional security-related safeguards:

- A session's command line is readable in `ps` by every process on the machine for as
  long as the session runs, so hsql warns when a secret is passed in via a command-line
  option (instead of via a profile).
- The socket lives in a private, `0700` directory owned by the invoking user,
  and the server refuses a connection from any other user.
- A session must be started explicitly, with `--serve`.
- Sessions time out by default (see above).
- The hsql client and server must be running the same version of hsql.

## Agent Integrations

Agent hooks can automatically open a session for an agent to use.

For Claude Code, in `.claude/settings.json`:

```json
&lbrace;
  "env": &lbrace; "HSQL_SESSION": "claude" &rbrace;,
  "hooks": &lbrace;
    "SessionStart": [
      &lbrace;
        "hooks": [
          &lbrace;
            "type": "command",
            "command": "hsql --session claude --session-status >/dev/null 2>&1 || setsid hsql --serve claude -P dev >>/tmp/hsql-claude-dev.log 2>&1 &"
          &rbrace;
        ]
      &rbrace;
    ]
  &rbrace;
&rbrace;
```

`--session-status` exits `3` when nothing is listening, so the session is started
once and reused after that; `setsid` detaches it, so the hook returns rather than
holding the agent up. The [Agent Skill](/docs/hsql/skill) covers the rest of what
an agent should know about hsql.
