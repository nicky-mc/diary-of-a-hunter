// src/models/BlogPost.ts
import mongoose, { Schema, Document, models } from "mongoose";

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  content: string; // HTML string from TipTap/Quill
  excerpt: string;
  authorId: mongoose.Types.ObjectId; // References NextAuth user
  coverImage: {
    url: string; // Cloudinary URL
    altText: string; // CRITICAL for a11y & SEO
  };
  tags: string[]; // e.g., 'vampires', 'lore', 'weapons'
  isPublished: boolean;
  publishedAt: Date;
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    content: { type: String, required: true },
    excerpt: { type: String, required: true, maxLength: 300 },
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    coverImage: {
      url: { type: String, required: true },
      altText: {
        type: String,
        required: [
          true,
          "Alt text is strictly required for accessibility and survival.",
        ],
        maxLength: 150,
      },
    },
    tags: [{ type: String, trim: true }],
    isPublished: { type: Boolean, default: false },
    publishedAt: { type: Date },
  },
  { timestamps: true },
);

// Prevent model recompilation in Next.js development
const BlogPost =
  models.BlogPost || mongoose.model<IBlogPost>("BlogPost", BlogPostSchema);
export default BlogPost;
