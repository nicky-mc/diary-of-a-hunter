// src/app/(public)/blog/[slug]/page.tsx
import dbConnect from "@/lib/mongodb";
import BlogPost, { IBlogPost } from "@/app/models/blogPost";
import { notFound } from "next/navigation";
import { CldImage } from "next-cloudinary";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { redirectLegacyIdToSlug } from "@/lib/legacySlugRedirect";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 60;

export default async function BlogPostPage(props: PageProps) {
  const { slug } = await props.params;

  await dbConnect();

  // Honour legacy /blog/[_id] URLs (from before the slug switch) by
  // 308-redirecting to the canonical slug URL. No-op if `slug` looks
  // like an actual slug.
  await redirectLegacyIdToSlug(BlogPost, slug, "/blog");

  // findOne by slug — readable URLs and stable references that survive
  // a re-seed. The "Double Cast" kills the 'any' on nested properties.
  const post = (await BlogPost.findOne({
    slug,
    isPublished: true,
  }).lean()) as unknown as IBlogPost | null;

  if (!post) {
    notFound();
  }

  const displayDate = post.publishedAt
    ? new Date(post.publishedAt).toDateString()
    : "Date Unknown";

  return (
    <article className="min-h-screen pb-20 bg-hunter-parchment dark:bg-hunter-void">
      {/* HERO HEADER — fills the gap that -mt-20 below depends on */}
      <header className="relative h-[60vh] min-h-[420px] w-full overflow-hidden">
        {post.coverImage?.url ? (
          <CldImage
            src={post.coverImage.url}
            alt={post.coverImage.altText || post.title}
            fill
            priority
            sizes="100vw"
            className="object-cover grayscale-[40%]"
          />
        ) : (
          // Fallback gradient when no cover image has been uploaded yet
          <div className="absolute inset-0 bg-gradient-to-br from-hunter-dark via-hunter-mid to-hunter-night" />
        )}

        {/* Dark overlay so title text always reads cleanly over any image */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-hunter-parchment dark:to-hunter-void" />

        {/* Faint gritty noise — matches the homepage treatment */}
        <div className="pointer-events-none absolute inset-0 bg-[url('/noise.png')] opacity-15 mix-blend-overlay" />

        <div className="relative z-10 h-full container mx-auto max-w-4xl px-4 flex flex-col justify-end pb-32">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-hunter-gold hover:text-hunter-parchment transition-colors mb-6 w-fit"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Field Notes
          </Link>

          <h1 className="font-serif text-4xl md:text-6xl font-bold tracking-tight text-hunter-parchment drop-shadow-lg">
            {post.title}
          </h1>

          <p className="mt-4 text-xs uppercase tracking-[0.3em] text-hunter-gold font-mono">
            Filed {displayDate}
          </p>
        </div>
      </header>

      {/* CONTENT CARD — pulled up over the hero */}
      <div className="container mx-auto px-4 -mt-20 relative z-20">
        <div className="max-w-3xl mx-auto bg-[#FDFCF7] dark:bg-[#0D0D0D] p-8 md:p-16 border border-hunter-warm/30 shadow-2xl">
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-10">
              {post.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="text-xs font-mono text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-700 px-3 py-1"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div
            className="prose prose-slate dark:prose-invert lg:prose-xl max-w-none prose-headings:font-serif prose-a:text-hunter-warm dark:prose-a:text-hunter-gold"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <footer className="mt-16 pt-8 border-t border-hunter-warm/20 text-center">
            <p className="font-serif italic text-slate-600 dark:text-slate-400">
              {"Intel recorded on "}
              {displayDate}
            </p>
          </footer>
        </div>
      </div>
    </article>
  );
}
