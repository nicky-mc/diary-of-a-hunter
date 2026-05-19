// src/app/admin/blog/[slug]/edit/page.tsx
//
// Server component — loads the post by slug and hands it to the client form.

import { notFound } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import BlogPost, { IBlogPost } from "@/app/models/blogPost";
import EditBlogForm from "./EditBlogForm";

export const metadata = {
  title: "Edit Field Report | Restricted",
};

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function EditBlogPostPage(props: PageProps) {
  const { slug } = await props.params;

  await dbConnect();

  const post = (await BlogPost.findOne({ slug })
    .lean()) as unknown as IBlogPost | null;

  if (!post) {
    notFound();
  }

  return (
    <EditBlogForm
      // Serialise the Mongoose document into a plain object for the client
      initial={{
        id: post._id.toString(),
        title: post.title,
        tags: (post.tags ?? []).join(", "),
        content: post.content,
        excerpt: post.excerpt ?? "",
        isPublished: post.isPublished ?? false,
        coverImage: post.coverImage ?? null,
      }}
    />
  );
}
