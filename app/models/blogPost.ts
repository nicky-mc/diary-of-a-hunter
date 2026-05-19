// src/models/BlogPost.ts
import mongoose, { Schema, model, models } from "mongoose";

// This is what the data looks like in the DB (The POJO)
export interface IBlogPost {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  tags: string[]; // Strict array of strings
  authorId: mongoose.Types.ObjectId | string;
  isPublished: boolean;
  publishedAt: Date;
  // Optional — a post can be filed before a cover image is uploaded
  coverImage?: {
    url: string;
    altText: string;
  };
}

const BlogPostSchema = new Schema<IBlogPost>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  excerpt: { type: String },
  tags: [{ type: String }], // Ensure Mongoose knows this is a string array
  authorId: { type: Schema.Types.ObjectId, ref: "User" },
  isPublished: { type: Boolean, default: false },
  publishedAt: { type: Date, default: Date.now },
  coverImage: {
    url: { type: String },
    altText: { type: String },
  },
});

// Compound text index — see wiki/wikiEntry.ts for the rationale and
// production caveat about syncIndexes().
BlogPostSchema.index(
  {
    title: "text",
    tags: "text",
    excerpt: "text",
    content: "text",
  },
  {
    name: "blog_search",
    weights: { title: 10, tags: 5, excerpt: 3, content: 1 },
  },
);

export default models.BlogPost || model<IBlogPost>("BlogPost", BlogPostSchema);
