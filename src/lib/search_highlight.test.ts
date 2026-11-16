import { describe, expect, it } from "vitest";
import { flatten, locate } from "./search_highlight";

describe("flatten", () => {
  it("joins the pieces and remembers where each began", () => {
    const flat = flatten(["one", "two", "three"]);
    expect(flat.text).toBe("one\ntwo\nthree");
    expect(flat.starts).toEqual([0, 4, 8]);
  });

  it("keeps the end of one piece from running into the next", () => {
    // Without a separator this reads as one word, and a search for "endstart"
    // would light up two paragraphs that do not contain it.
    expect(flatten(["end", "start"]).text).not.toContain("endstart");
  });

  it("handles an empty node without losing the count", () => {
    const flat = flatten(["a", "", "b"]);
    expect(flat.starts).toEqual([0, 2, 3]);
    expect(locate(flat, 3, "start")).toEqual({ piece: 2, offset: 0 });
  });
});

describe("locate", () => {
  const flat = flatten(["one", "two", "three"]);

  it.each([
    [0, { piece: 0, offset: 0 }],
    [2, { piece: 0, offset: 2 }],
    [4, { piece: 1, offset: 0 }],
    [8, { piece: 2, offset: 0 }],
    [12, { piece: 2, offset: 4 }],
  ])("places start offset %i", (offset, expected) => {
    expect(locate(flat, offset, "start")).toEqual(expected);
  });

  it("puts an exclusive end on the piece that just ended", () => {
    // "one" is [0, 3). Placed as a start, 3 would be the separator; placed as
    // an end it is the character after "one", which is in piece 0.
    expect(locate(flat, 3, "end")).toEqual({ piece: 0, offset: 3 });
    expect(locate(flat, 7, "end")).toEqual({ piece: 1, offset: 3 });
  });

  it("clamps an offset that fell in a separator", () => {
    expect(locate(flat, 3, "start")).toEqual({ piece: 0, offset: 3 });
  });

  it("does not walk off the front", () => {
    expect(locate(flat, 0, "end")).toEqual({ piece: 0, offset: 0 });
  });
});
