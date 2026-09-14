---
title: Warm Sessions
description: hsql --serve holds one connection open as a named session and --session sends invocations to it — what a session remembers, and how to keep one safe.
---

<script>
    import Note from "$lib/components/note.svelte"
    import Tip from "$lib/components/tip.svelte"
    import Warning from "$lib/components/warning.svelte"
</script>

A warm session is not "hsql, but faster." It is **a database session you can
send commands to**: one connection, held open, running the invocations you send
it. Temp tables, settings and transactions live in that session the way they
live in a psql prompt, and the next invocation sees them.

The speed is a consequence. A served invocation answers in a few milliseconds,
because Python, the adapter and the connection are already up; a cold one pays
for all three, every time.

<Note>

Sessions are POSIX only. A session is reached over a unix socket, which native
Windows does not have. WSL2 is Linux, and gets them.

</Note>

## Starting One

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

## Sending It Queries

`--session NAME` sends an invocation to that session instead of connecting:

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

`HSQL_SESSION=dev` says the same thing for every invocation in an environment:

```bash
export HSQL_SESSION=dev
hsql -c "select count(*) from recent"
```

The two spellings differ in what happens when no such session is running. A
typed `--session` is an assertion, and hsql exits [`3`](/docs/hsql/exit-codes)
rather than quietly running without the state you were counting on.
`HSQL_SESSION` is a preference, so the invocation runs cold and says so:

```output
note: no session named 'dev' is running, so this invocation is running cold. Start one with `hsql --serve dev ...`.
```

That warning is not suppressible: a session that quietly stopped is a temp
table that quietly vanished, and nobody should have to guess at which happened.

## What a Session Remembers

This is the part to hold in your head, because it is the part that is not true
of any other hsql invocation:

- **Temp tables persist.** `create temp table` in one invocation is queryable by
  the next. It is the most useful thing about a session.
- **Settings persist.** `SET`, `search_path`, time zones, DuckDB `PRAGMA`s,
  extensions you installed. A `SET` in one invocation changes the results of the
  next twenty.
- **In-memory databases persist.** `hsql --serve scratch ":memory:"` is a
  scratch warehouse that outlives the invocations that write to it.
- **Transactions persist**, and this is the sharp edge.

<Warning>

A `begin` that no invocation committed is still open — holding its locks, and
wrapping every request after it. A cold invocation rolled that back when the
process exited; a session has no process exit to roll it back. Commit in the
same invocation you begin in, or reset the session.

</Warning>

## Resetting and Inspecting

`--session-reset` closes the connection and opens a fresh one, without
restarting the process, so the imports stay warm. Temp tables, settings and any
open transaction are gone:

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
waiting behind the one running. Secrets are masked here as they are everywhere
else hsql prints a config value. `transaction_mode` is the adapter's
[transaction mode](/docs/transactions) where it has one; a session moved out of
the mode it connected in says so on stderr after every request.

## Which Options Go Where

Every option belongs to exactly one of three groups, and hsql refuses the ones
that are in the wrong place rather than ignoring them.

| Group            | Options                                                                         | Where                            |
| ---------------- | ------------------------------------------------------------------------------- | -------------------------------- |
| Connection       | `CONN_STR`, `-a`, `-r`, the [SSH options](/docs/ssh), and every adapter option  | `--serve`, once                  |
| Session lifetime | `--idle-timeout`, `--max-lifetime`, `--queue-timeout`                           | `--serve`, once                  |
| Per request      | `-c`, `-f`, `--format`, `-o`, `--limit`, `--timeout`, `--catalog`, and the rest | `--session`, on every invocation |

```bash
hsql --session dev -r -c "select 1"
```

```output
hsql: error: --read-only is a connection option. The session named 'dev' was started without it, and its connection is fixed. Drop it here, or start a session with it: 'hsql --serve NAME --read-only ...'.
```

`-P` and `--config-path` are neither: they name where values come from, so they
work on both sides. A profile that sets a connection key is refused on a request
the same way the flag would be, and one that sets only per-request keys — a
`format`, a `limit` — is read for the request as usual.

## One Request at a Time

A session has one connection, so it runs one request at a time; a second waits
its turn. `--queue-timeout SECONDS` on `--serve` bounds that wait, and a request
that spends it exits [`4`](/docs/hsql/exit-codes) without ever reaching the
database.

`Ctrl-C` cancels a request on the session, whether it had started or was still
waiting its turn, and hsql exits `130` as it does cold. Where the adapter
[cannot cancel a query](/docs/hsql/safety), hsql says on stderr that the query
is still running and still holding the session; `--session-status` is how you
watch for it to finish.

## When a Session Stops

A session is a live authenticated connection, so it is bounded unless you say
otherwise. It stops itself after 30 minutes with no request, or 8 hours after it
connected, whichever comes first:

```bash
hsql --serve dev -P dev --idle-timeout 3600 --max-lifetime 0
```

`0` switches either clock off. The idle clock does not run while a request does,
or while a client is connected, so a long query is not idle. A lifetime that runs
out mid-query lets that request finish first — and stops taking connections
straight away, so the query cannot be cancelled while it runs out the clock.

<Tip>

"My session died between calls" is the idle timeout. `--idle-timeout 0` is the
answer, and `expires_in_s` in `--session-status` is how long you have.

</Tip>

## Keeping a Session Safe

A session holds an authenticated connection — and an [SSH tunnel](/docs/ssh), if
it opened one — for as long as it runs, so it is worth a minute of thought:

- **Start it from a [profile](/docs/config-file).** A session's command line is
  readable in `ps` by every process on the machine for as long as the session
  runs, and hsql warns when a secret is on one.
- **It is yours alone.** The socket lives in a private, `0700` directory owned by
  you, and the server refuses a connection from any other user.
- **Nothing is automatic.** A session is never started for you, never on by
  default, and a request is never silently served by one you did not name.
- **A session outliving its purpose is a credential left open.** That is what the
  two clocks above are for.

Client and server must be the same version of hsql; an upgrade underneath a
running session is refused rather than served.

## Starting One for an Agent

An agent that runs one query per turn pays the start-up cost every turn. Start a
session when the agent's own session starts, and point it at that session with
the environment variable — so that if the hook did not run, the agent's queries
still work, with a warning.

For Claude Code, in `.claude/settings.json`:

```json
&lbrace;
  "env": &lbrace; "HSQL_SESSION": "dev" &rbrace;,
  "hooks": &lbrace;
    "SessionStart": [
      &lbrace;
        "hooks": [
          &lbrace;
            "type": "command",
            "command": "hsql --session dev --session-status >/dev/null 2>&1 || setsid hsql --serve dev -P dev >>/tmp/hsql-dev.log 2>&1 &"
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
