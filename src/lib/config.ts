import { dev } from "$app/environment";

export const title = "Harlequin";
export const subtitle = "The SQL IDE for Your Terminal.";
export const description =
  "Harlequin is the SQL IDE for your terminal, and hsql is your agent's favorite SQL client: two interfaces to one query engine, for any database.";
// What Harlequin is, in prose, for the files that publish the docs with no
// homepage above them. `llms.txt` and `llms-full.txt` are read by something
// that has never seen the site and may never render a page of it, so the first
// thing either says has to be what the thing is — which is the homepage's job
// everywhere else, and this is the homepage's copy.
export const overview = `\`harlequin\` is the full-screen TUI: a data catalog, a query editor and a
results viewer, for a person at a keyboard. \`hsql\` is the command-line client
for scripts and agents: one statement or a file of them, several output
formats, compact results and safe defaults. They share adapters, config files,
profiles and a query engine, so you, your scripts and your agents can share one
tool.`;
// Where the site is published. Text this repo publishes *as text* — a raw
// markdown page, an entry in llms.txt — is read somewhere other than the origin
// that served it, so it absolutizes against this rather than against `url`: a
// localhost link is wrong even when localhost is what served it.
export const canonicalUrl = "https://harlequin.sh/";
export const url = dev ? "http://localhost:5173/" : canonicalUrl;
export const company = "Shandy Data LLC";
