<script lang="ts">
  import HsqlFeature from "./hsql_feature.svelte";
  import type { TerminalLine } from "$lib/types";

  const inputs: TerminalLine[] = [
    { text: 'hsql -P dev -tAc "select 1"', kind: "command" },
    { text: "1" },
    {
      text: `hsql -P prod --result all --on-error stop \\
  -f ./setup.sql \\
  -c "select count(*) as raw from raw_table" \\
  -f ./build-models.sql \\
  -c "select count(*) as mod from model" `,
      kind: "command",
    },
  ];

  const layouts: TerminalLine[] = [
    { text: "hsql --csv --limit -1 -f report.sql > out.csv", kind: "command" },
    { text: "hsql -tAc \"select count(*) from 'out.csv'\"", kind: "command" },
    { text: "1284" },
    {
      text: `hsql --limit 1 --vertical -c "select count(*) from 'out.csv'"`,
      kind: "command",
    },
    { text: "-[ RECORD 1 ]-----------" },
    { text: "id           | 1234" },
    { text: "company_id   | 111" },
    { text: "company_name | Acme Corp" },
  ];

  const agents: TerminalLine[] = [
    { text: "hsql -P bigquery --markdown --stats -f q.sql", kind: "command" },
    { text: '{"status":"ok","rows":500,"truncated":true}', kind: "note" },
    { text: "| order_id | customer |" },
    { text: "| -------- | -------- |" },
    { text: "| 1001     | acme     |" },
  ];
</script>

<p class="text-center">
  A fast and powerful CLI designed for efficient and safe use by agents.
</p>
<ul class="w-full">
  <li>
    <HsqlFeature
      title="Flexible inputs"
      body="Execute one or more statements from the command line, files, or stdin."
      lines={inputs}
    />
  </li>
  <li>
    <HsqlFeature
      title="Any output"
      body="Write results to stdout or a file, in several customizable formats."
      lines={layouts}
    />
  </li>
  <li>
    <HsqlFeature
      title="Designed for Agents"
      body="Documented and discoverable commands that work on any database; safe defaults; compact output."
      lines={agents}
    />
  </li>
</ul>
