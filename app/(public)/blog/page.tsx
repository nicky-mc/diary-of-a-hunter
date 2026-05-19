// src/app/(public)/blog/page.tsx
import dbConnect from "@/lib/mongodb";
import BlogPost, { IBlogPost } from "@/app/models/blogPost";
import Link from "next/link";
// next/image rather than CldImage — see app/(public)/wiki/[slug]/page.tsx
// for the explanation. CldImage breaks server-component boundaries here.
import Image from "next/image";

// Define a strict interface for the post data we get back from Lean
interface BlogPostSummary {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  tags: string[];
  publishedAt: Date;
  // Optional — posts can be filed before a cover image is added
  coverImage?: {
    url: string;
    altText: string;
  };
}

export const revalidate = 60;

export default async function BlogLibrary() {
  await dbConnect();

  // We cast the lean result to our specific summary interface
  const posts = (await BlogPost.find({ isPublished: true })
    .sort({ publishedAt: -1 })
    .select("title slug excerpt tags publishedAt coverImage")
    .lean()) as unknown as BlogPostSummary[];

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <header className="border-b-2 border-hunter-warm pb-8 mb-12">
        <h1 className="font-serif text-5xl font-bold uppercase tracking-tighter text-slate-900 dark:text-hunter-bone">
          Field Notes
        </h1>
        <p className="mt-4 text-lg text-slate-700 dark:text-slate-400 font-medium">
          Chronological records from the hunt. Trust nothing but the ink.
        </p>
      </header>

      {posts.length === 0 ? (
        <div className="text-center py-24 border-2 border-dashed border-hunter-warm/30 rounded-lg">
          <p className="font-mono text-slate-500 italic">
            No field reports filed yet. The shadows are quiet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
          <article
            key={post._id.toString()}
            className="group flex flex-col bg-white/50 dark:bg-hunter-shadow/50 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all"
          >
            <div className="aspect-video relative overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
              {post.coverImage?.url ? (
                <Image
                  src={post.coverImage.url}
                  alt={post.coverImage.altText || post.title}
                  fill
                  className="object-cover"
                />
              ) : (
                // Fallback when no cover image was uploaded — keeps the card from crashing
                <div className="absolute inset-0 bg-gradient-to-br from-hunter-dark via-hunter-mid to-hunter-night flex items-center justify-center">
                  <span className="font-serif italic text-hunter-gold/70 text-sm">
                    No visual intel
                  </span>
                </div>
              )}
            </div>

            <div className="p-6 flex flex-col flex-grow">
              <h2 className="font-serif text-2xl font-bold mb-3 group-hover:text-hunter-warm transition-colors">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>

              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-6">
                {post.excerpt}
              </p>

              <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[11px] uppercase tracking-widest text-slate-500">
                <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                <Link
                  href={`/blog/${post.slug}`}
                  className="font-bold text-hunter-warm hover:underline"
                >
                  Read Intel →
                </Link>
              </div>
            </div>
          </article>
          ))}
        </div>
      )}
    </div>
  );
}
