import { artifact, assertArtifactsMatchManifest } from "$lib/server/artifacts";

// Static: the schema only changes when a harlequin release vendors a new copy,
// so this is a file on the CDN with no cold start and no way to fail at request
// time.
export const prerender = true;

// Every schema `harlequin` has generated since 2.10 carries this as its `$id`,
// which is why this route exists and why its path is not ours to rename.
const SCHEMA_ID = "https://harlequin.sh/schemas/config/v1.json";

/**
 * The artifact is served verbatim, so the only thing worth checking is that it
 * is the document it claims to be: valid JSON, and self-identifying as the URL
 * a reader dereferenced to get here. A schema served under an `$id` it does not
 * carry is worse than a 404 — a validator resolves `$ref`s against the `$id`.
 */
function schema(): string {
  const source = artifact("config-v1.json");
  const parsed = JSON.parse(source);
  if (parsed.$id !== SCHEMA_ID) {
    throw new Error(
      `static/artifacts/config-v1.json has $id ${parsed.$id}, but this route ` +
        `serves ${SCHEMA_ID}`,
    );
  }
  return source;
}

export async function GET() {
  await assertArtifactsMatchManifest();

  return new Response(schema(), {
    headers: {
      // In production these come from vercel.json: the route prerenders to a
      // static file, and Vercel types it by extension rather than carrying a
      // build-time response header over. They are set here for the dev server,
      // and because a route that serves a schema should say so on its own.
      "Content-Type": "application/schema+json",
      // Public, unauthenticated, and dereferenced by validators in browsers.
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
