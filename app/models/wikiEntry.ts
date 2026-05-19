// src/models/WikiEntry.ts
import mongoose, { Schema, Document, models } from "mongoose";

/**
 * A single row in the wiki-style infobox under the cover image.
 *
 * Examples:
 *   { label: "Origin",  value: "Eastern Europe" }
 *   { label: "Diet",    value: "Blood" }
 *   { label: "Range",   value: "Effective at 200m" }   (for weapons)
 *   { label: "Founded", value: "13th century" }        (for bloodlines)
 *
 * Schema is intentionally loose — different categories have different
 * useful stats, and a fixed shape would force them all into one mould.
 */
export interface IWikiStat {
  label: string;
  value: string;
}

export interface IWikiEntry extends Document {
  title: string;
  slug: string;
  category: "bestiary" | "weapons" | "bloodlines" | "conspiracy";
  threatLevel: "Low" | "Moderate" | "Severe" | "Apocalyptic" | "Unknown";
  weaknesses: string[]; // e.g., ['Silver', 'Fire', 'Decapitation']
  stats?: IWikiStat[]; // Wiki-style infobox rows
  content: string; // HTML string from the rich text editor
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
    // Stats rows — `_id: false` keeps the subdocuments lean
    stats: [
      {
        _id: false,
        label: { type: String, required: true, trim: true, maxLength: 60 },
        value: { type: String, required: true, trim: true, maxLength: 200 },
      },
    ],
    content: { type: String, required: true },
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    coverImage: {
      url: { type: String },
      altText: { type: String, maxLength: 150 },
    },
  },
  { timestamps: true },
);

// Compound text index — MongoDB only permits one text index per collection,
// so every field we want full-text-searchable lives here. Weights make
// title matches outrank content matches in the search-score ranking.
//
// First-time collection setup: Mongoose calls `ensureIndexes` on connect,
// which is fine for dev. In production, run `WikiEntry.syncIndexes()` once
// after deploy or accept the slight first-query latency.
WikiEntrySchema.index(
  {
    title: "text",
    "stats.value": "text",
    weaknesses: "text",
    content: "text",
  },
  {
    name: "wiki_search",
    weights: { title: 10, "stats.value": 4, weaknesses: 3, content: 1 },
  },
);

const WikiEntry =
  models.WikiEntry || mongoose.model<IWikiEntry>("WikiEntry", WikiEntrySchema);
export default WikiEntry;
