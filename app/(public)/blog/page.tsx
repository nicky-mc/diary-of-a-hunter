// src/app/(public)/blog/page.tsx
import dbConnect from "@/lib/mongodb";
import BlogPost, { IBlogPost } from "@/app/models/blogPost";
import Link from "next/link";
import { CldImage } from "next-cloudinary";

// Define a strict interface for the post data we get back from Lean
interface BlogPostSummary {
  _id: string;
  title: string;
  excerpt: string;
  tags: string[];
  publishedAt: Date;
  coverImage: {
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
    .select("title excerpt tags publishedAt coverImage")
    .lean()) as unknown as BlogPostSummary[];

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <header className="border-b-2 border-[#8B5A2B] pb-8 mb-12">
        <h1 className="font-serif text-5xl font-bold uppercase tracking-tighter text-slate-900 dark:text-[#EAE0D5]">
          Field Notes
        </h1>
        <p className="mt-4 text-lg text-slate-700 dark:text-slate-400 font-medium">
          Chronological records from the hunt. Trust nothing but the ink.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <article
            key={post._id.toString()}
            className="group flex flex-col bg-white/50 dark:bg-[#121212]/50 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all"
          >
            <div className="aspect-video relative overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
              <CldImage
                src={post.coverImage.url}
                alt={post.coverImage.altText}
                fill
                className="object-cover"
              />
            </div>

            <div className="p-6 flex flex-col flex-grow">
              <h2 className="font-serif text-2xl font-bold mb-3 group-hover:text-[#8B5A2B] transition-colors">
                <Link href={`/blog/${post._id.toString()}`}>{post.title}</Link>
              </h2>

              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-6">
                {post.excerpt}
              </p>

              <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[11px] uppercase tracking-widest text-slate-500">
                <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                <Link
                  href={`/blog/${post._id.toString()}`}
                  className="font-bold text-[#8B5A2B] hover:underline"
                >
                  Read Intel →
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
