// src/lib/legacySlugRedirect.ts
import { permanentRedirect } from "next/navigation";
import type { Model } from "mongoose";

// A Mongoose ObjectId serialised to hex is exactly 24 lowercase hex chars.
// We use this to detect legacy /blog/[_id] and /wiki/[_id] URLs that were
// shared/bookmarked before the slug-based routing landed.
const OBJECT_ID_RE = /^[a-f0-9]{24}$/i;

export function isObjectIdLike(value: string): boolean {
  return OBJECT_ID_RE.test(value);
}

/**
 * If `param` is a Mongoose ObjectId, look up the document by `_id` and issue
 * a permanent (308) redirect to the canonical slug URL. Search engines
 * follow this and update their index; bookmarked links still resolve.
 *
 * If the param isn't an ObjectId, this is a no-op and the caller proceeds
 * with its normal slug lookup.
 *
 * NOTE: `permanentRedirect` throws a special NEXT_REDIRECT error that React
 * uses to bail rendering — do NOT wrap this call in try/catch.
 */
export async function redirectLegacyIdToSlug<T extends { slug: string }>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  model: Model<any>,
  param: string,
  basePath: "/blog" | "/wiki",
): Promise<void> {
  if (!isObjectIdLike(param)) return;

  const doc = (await model
    .findById(param)
    .select("slug")
    .lean()) as unknown as T | null;

  if (doc?.slug) {
    permanentRedirect(`${basePath}/${doc.slug}`);
  }
  // If the ObjectId doesn't resolve to anything, fall through — the normal
  // findOne({ slug }) lookup will fail too and notFound() will fire.
}
