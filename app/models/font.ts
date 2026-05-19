// src/app/models/font.ts
//
// A custom font uploaded by an admin via /admin/fonts.
//
// Stored separately from the built-in next/font fonts because those are
// statically loaded at build time. User-uploaded fonts use plain CSS
// @font-face rules injected by CustomFontStyles at runtime.

import mongoose, { Schema, models } from "mongoose";

export interface IFont {
  _id: string;
  // Human-readable label shown in the font dropdown ("Eldritch Display")
  name: string;
  // CSS font-family value — what gets written into the document's
  // `style="font-family: …"`. Defaults to a sluggified version of `name`.
  family: string;
  // Cloudinary delivery URL for the .woff2 file
  fileUrl: string;
  // Cloudinary public_id, kept so we can delete the asset when the font
  // is removed from the database
  publicId?: string;
  // CSS font-weight — most uploaded fonts will just be "400"; variable
  // fonts use "100 900" or similar
  weight: string;
  // "normal" | "italic"
  style: string;
  // Size in bytes — handy for the admin list
  fileSize: number;
  createdAt: Date;
  updatedAt: Date;
}

const FontSchema = new Schema<IFont>(
  {
    name: { type: String, required: true, trim: true, maxLength: 80 },
    family: {
      type: String,
      required: true,
      trim: true,
      maxLength: 80,
      unique: true,
    },
    fileUrl: { type: String, required: true },
    publicId: { type: String },
    weight: { type: String, default: "400" },
    style: { type: String, default: "normal" },
    fileSize: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const Font = models.Font || mongoose.model<IFont>("Font", FontSchema);
export default Font;
