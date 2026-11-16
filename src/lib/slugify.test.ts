import { describe, expect, it } from "vitest";
import { slugifyText } from "./slugify";

describe("slugifyText", () => {
  it.each([
    ["Config Overview", "config-overview"],
    ["Exit Codes and Streams", "exit-codes-and-streams"],
    // The heading on `hsql/safety`. Anything the index links to has to survive
    // the same stripping the rendered heading does, punctuation included.
    ["--limit", "limit"],
    ["Amazon S3 (and friends)", "amazon-s3-and-friends"],
    ["MotherDuck", "motherduck"],
    ["", ""],
  ])("%o -> %o", (text, slug) => {
    expect(slugifyText(text)).toBe(slug);
  });
});
