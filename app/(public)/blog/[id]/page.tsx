// src/app/(public)/blog/[id]/page.tsx
import dbConnect from "@/lib/mongodb";
import BlogPost, { IBlogPost } from "@/app/models/blogPost";
import { notFound } from "next/navigation";
import { CldImage } from "next-cloudinary";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function BlogPostPage(props: PageProps) {
  const { id } = await props.params;

  await dbConnect();

  // The "Double Cast" kills the 'any' on nested properties like tags
  const post = (await BlogPost.findById(
    id,
  ).lean()) as unknown as IBlogPost | null;

  if (!post) {
    notFound();
  }

  const displayDate = post.publishedAt
    ? new Date(post.publishedAt).toDateString()
    : "Date Unknown";

  return (
    <article className="min-h-screen pb-20">
      {/* ... Header Code ... */}

      <div className="container mx-auto px-4 -mt-20 relative z-20">
        <div className="max-w-3xl mx-auto bg-[#FDFCF7] dark:bg-[#0D0D0D] p-8 md:p-16 border border-[#8B5A2B]/30">
          <div className="flex flex-wrap gap-2 mb-10">
            {/* Now TS knows 'tag' is a string because post is strictly IBlogPost */}
            {post.tags.map((tag: string) => (
              <span
                key={tag}
                className="text-xs font-mono text-slate-500 border border-slate-300 px-3 py-1"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div
            className="prose prose-slate dark:prose-invert lg:prose-xl"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <footer className="mt-16 pt-8 border-t border-[#8B5A2B]/20 text-center">
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
