// src/models/WikiEntry.ts
import mongoose, { Schema, Document, models } from "mongoose";

export interface IWikiEntry extends Document {
  title: string;
  slug: string;
  category: "bestiary" | "weapons" | "bloodlines" | "conspiracy";
  threatLevel: "Low" | "Moderate" | "Severe" | "Apocalyptic" | "Unknown";
  weaknesses: string[]; // e.g., ['Silver', 'Fire', 'Decapitation']
  content: string; // HTML string from Quill
  authorId: mongoose.Types.ObjectId;
  coverImage?: {
    url: string;
    altText: string;
  };
}

const WikiEntrySchema = new Schema<IWikiEntry>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    category: {
      type: String,
      required: true,
      enum: ["bestiary", "weapons", "bloodlines", "conspiracy"],
    },
    threatLevel: {
      type: String,
      default: "Unknown",
      enum: ["Low", "Moderate", "Severe", "Apocalyptic", "Unknown"],
    },
    weaknesses: [{ type: String, trim: true }],
    content: { type: String, required: true },
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    coverImage: {
      url: { type: String },
      altText: { type: String, maxLength: 150 },
    },
  },
  { timestamps: true },
);

const WikiEntry =
  models.WikiEntry || mongoose.model<IWikiEntry>("WikiEntry", WikiEntrySchema);
export default WikiEntry;
