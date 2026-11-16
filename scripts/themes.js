// Optimizes the theme screenshots in place. Textual's exports spell every space
// as `&#160;`, and svgo's parser refuses a document with more than 512 entities,
// so they become literal no-break spaces first.
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dir = process.argv[2] ?? "src/lib/assets/themes";
for (const name of readdirSync(dir).filter((file) => file.endsWith(".svg"))) {
  const path = join(dir, name);
  writeFileSync(path, readFileSync(path, "utf8").replaceAll("&#160;", " "));
}
execFileSync("svgo", ["-f", dir, "-o", dir], {
  stdio: "inherit",
  shell: process.platform === "win32",
});
