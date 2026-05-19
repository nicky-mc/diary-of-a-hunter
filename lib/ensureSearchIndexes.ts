// src/lib/ensureSearchIndexes.ts
//
// Mongoose's default `autoIndex: true` only kicks in when a collection
// is first created. For collections that already existed before the
// `text` index was added to the schema, the index never lands —
// `$text` queries then fail with "text index required for $text query".
//
// `syncIndexes()` reconciles the live index list against the schema
// definition: it adds new ones and drops removed ones. We call it once
// per Node process (cached via the module-scoped promise) before the
// first search runs, so the user never has to think about it.
//
// In production you might prefer to run this from a deploy script
// instead of on the request path. For dev + small prod this is fine —
// the work is idempotent and only happens once.

import dbConnect from "@/lib/mongodb";
import BlogPost from "@/app/models/blogPost";
import WikiEntry from "@/app/models/wikiEntry";

let cached: Promise<void> | null = null;

export async function ensureSearchIndexes(): Promise<void> {
  if (cached) return cached;

  cached = (async () => {
    await dbConnect();
    try {
      // Run in parallel — they're independent collections
      await Promise.all([
        BlogPost.syncIndexes(),
        WikiEntry.syncIndexes(),
      ]);
    } catch (err) {
      // Reset on failure so the next request retries instead of
      // returning a cached rejection forever
      cached = null;
      throw err;
    }
  })();

  return cached;
}
