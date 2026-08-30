import { dev } from "$app/environment";

export const title = "Harlequin";
export const subtitle = "The SQL IDE for Your Terminal.";
export const description =
  "Harlequin is a drop-in replacement for the DuckDB CLI, SQLite CLI, psql, etc. that brings SQL IDE features to your terminal.";
// Where the site is published. Text this repo publishes *as text* — a raw
// markdown page, an entry in llms.txt — is read somewhere other than the origin
// that served it, so it absolutizes against this rather than against `url`: a
// localhost link is wrong even when localhost is what served it.
export const canonicalUrl = "https://harlequin.sh/";
export const url = dev ? "http://localhost:5173/" : canonicalUrl;
export const company = "Shandy Data LLC";
