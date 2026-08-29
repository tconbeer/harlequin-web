/**
 * The vendored artifacts.
 *
 * `static/artifacts/` holds files that are *generated* in `tconbeer/harlequin`
 * and copied here by that repo's release workflow, which opens a PR against
 * this one. Nothing in this repo edits them by hand: the source of truth is the
 * wheel, and `manifest.json` records which release each copy came from.
 *
 * Vendoring rather than fetching at build time keeps the build hermetic — a
 * network blip cannot fail a deploy, and the worst failure mode is a page that
 * is a release behind rather than a page that is not there.
 */

// The files are `?raw` rather than JSON imports because the routes serve these
// bytes verbatim: the digests in the manifest are over the file as committed,
// and re-serializing a parsed object would not reproduce them.
const sources = import.meta.glob("/static/artifacts/**/*", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

export type ArtifactFile = {
  // Path relative to `static/artifacts/`, e.g. "references/config.md".
  path: string;
  // The path in `tconbeer/harlequin` the file was generated from.
  source: string;
  bytes: number;
  sha256: string;
};

export type ArtifactManifest = {
  // The `harlequin` release these artifacts were published from.
  version: string;
  generated_by: string;
  files: ArtifactFile[];
};

function read(path: string): string {
  const source = sources[`/static/artifacts/${path}`];
  if (source === undefined) {
    throw new Error(`No vendored artifact at static/artifacts/${path}`);
  }
  return source;
}

export const manifest = JSON.parse(read("manifest.json")) as ArtifactManifest;

/** One vendored artifact, verbatim, by its path in the manifest. */
export function artifact(path: string): string {
  return read(path);
}

async function sha256(bytes: Uint8Array): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * The artifacts arrive in an automated PR, so the build checks that the PR is
 * internally consistent before it can go out: every file the manifest names is
 * here, every file here is named by the manifest, and the bytes are the ones
 * the release hashed. A truncated copy or a hand-edit is otherwise a silent
 * wrong answer to whoever reads it.
 */
export async function assertArtifactsMatchManifest() {
  const unlisted = new Set(
    Object.keys(sources)
      .map((path) => path.slice("/static/artifacts/".length))
      .filter((path) => path !== "manifest.json"),
  );

  const problems: string[] = [];
  for (const file of manifest.files) {
    unlisted.delete(file.path);
    if (!(`/static/artifacts/${file.path}` in sources)) {
      problems.push(`${file.path}: named by the manifest, not on disk`);
      continue;
    }
    // The digests are over the bytes; `?raw` hands back a decoded string.
    const bytes = new TextEncoder().encode(read(file.path));
    if (bytes.byteLength !== file.bytes) {
      problems.push(
        `${file.path}: manifest says ${file.bytes} bytes, file is ${bytes.byteLength}`,
      );
      continue;
    }
    const digest = await sha256(bytes);
    if (digest !== file.sha256) {
      problems.push(
        `${file.path}: manifest says sha256 ${file.sha256}, file is ${digest}`,
      );
    }
  }

  for (const path of [...unlisted].sort()) {
    problems.push(`${path}: on disk, not named by the manifest`);
  }

  if (problems.length) {
    throw new Error(
      `static/artifacts does not match its manifest (vendored from harlequin ` +
        `${manifest.version}):\n  ${problems.join("\n  ")}`,
    );
  }
}
