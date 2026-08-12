<script lang="ts">
  import HsqlFeature from "./hsql_feature.svelte";
  import type { TerminalLine } from "$lib/types";

  const adapters: TerminalLine[] = [
    { text: "hsql -a duckdb    -f report.sql", kind: "command" },
    { text: "hsql -a postgres  -f report.sql", kind: "command" },
    { text: "hsql -P warehouse -f report.sql", kind: "command" },
  ];

  const streams: TerminalLine[] = [
    { text: "hsql --csv -l 0 -f report.sql > out.csv", kind: "command" },
    { text: "1284 rows in 0.31s", kind: "note" },
    { text: "hsql -tAc \"select count(*) from 'out.csv'\"", kind: "command" },
    { text: "1284" },
  ];

  const codes: TerminalLine[] = [
    { text: "hsql -P prod -f checks.sql -F none", kind: "command" },
    { text: "hsql: error: could not connect to host", kind: "note" },
    { text: "echo $?", kind: "command" },
    { text: "3" },
  ];

  const agents: TerminalLine[] = [
    { text: "hsql -P prod --markdown --stats -f q.sql", kind: "command" },
    { text: '{"status":"ok","rows":500,"truncated":true}', kind: "note" },
    { text: "| order_id | customer |" },
    { text: "| -------- | -------- |" },
    { text: "| 1001     | acme     |" },
  ];
</script>

<p class="text-center">
  A fast and powerful CLI designed with efficiency and safety for agents.
</p>
<ul class="w-full">
  <li>
    <HsqlFeature
      title="One CLI, Every Database"
      body="Same flags, same formats, same exit codes, whether the profile points at DuckDB, Postgres, SQLite, BigQuery, or any other adapter."
      lines={adapters}
    />
  </li>
  <li>
    <HsqlFeature
      title="Data on stdout, Narration on stderr"
      body="Results never mix with row counts, timings, or warnings — so a redirect writes a clean file. Ten formats, from aligned tables to Parquet."
      lines={streams}
    />
  </li>
  <li>
    <HsqlFeature
      title="Exit Codes You Can Branch On"
      body="Documented and stable: 1 means the database rejected your SQL, 3 means it never connected. Different problems, different retries."
      lines={codes}
    />
  </li>
  <li>
    <HsqlFeature
      title="Ready for Your Agents"
      body="One contract for an agent to learn, profiles that keep credentials out of the transcript, Markdown a model can read back, and --stats for the shape of a result."
      lines={agents}
    />
  </li>
</ul>
