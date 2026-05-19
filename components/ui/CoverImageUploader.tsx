// src/components/ui/CoverImageUploader.tsx
"use client";

import { useState } from "react";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import { Upload, X, ImageIcon } from "lucide-react";

export interface CoverImageValue {
  url: string;
  altText: string;
}

interface CoverImageUploaderProps {
  /** The current image value (or null if none yet) */
  value: CoverImageValue | null;
  /** Called with the new value whenever the upload completes or alt text changes. Null clears it. */
  onChange: (value: CoverImageValue | null) => void;
  /** Optional label override */
  label?: string;
}

// Minimal shape we need from the Cloudinary widget result. next-cloudinary's
// types vary across versions, so we narrow defensively here.
interface CloudinaryUploadInfo {
  secure_url?: string;
  url?: string;
  public_id?: string;
}

/**
 * Drop this into any admin form to give it cover-image upload + preview + alt text.
 *
 * Requires NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
 * in .env.local. The preset must be configured as "unsigned" in the Cloudinary dashboard.
 */
export default function CoverImageUploader({
  value,
  onChange,
  label = "Cover Image",
}: CoverImageUploaderProps) {
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  const [missingPreset] = useState(!uploadPreset);

  if (missingPreset) {
    return (
      <div className="rounded border border-amber-700/40 bg-amber-500/10 p-4 text-sm font-mono text-amber-700 dark:text-amber-400">
        ⚠ Image uploads disabled — NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET is not set
        in .env.local.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
        {label}
      </label>

      {value ? (
        // PREVIEW + ALT TEXT
        <div className="space-y-3">
          <div className="relative aspect-video w-full overflow-hidden rounded border-2 border-hunter-warm/40 bg-black/5">
            <CldImage
              src={value.url}
              alt={value.altText || "Cover image preview"}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => onChange(null)}
              className="absolute top-2 right-2 rounded-full bg-black/70 p-1.5 text-white hover:bg-red-600 transition-colors"
              aria-label="Remove cover image"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <input
            type="text"
            value={value.altText}
            onChange={(e) =>
              onChange({ ...value, altText: e.target.value })
            }
            placeholder="Describe the image for accessibility (alt text)..."
            className="w-full rounded border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-hunter-shadow p-2 text-sm font-mono text-slate-900 dark:text-slate-100 focus:border-hunter-warm focus:ring-1 focus:ring-hunter-warm outline-none"
          />

          <CldUploadWidget
            uploadPreset={uploadPreset}
            options={{
              sources: ["local", "url", "camera"],
              maxFiles: 1,
              clientAllowedFormats: ["jpg", "jpeg", "png", "webp", "gif"],
              maxFileSize: 10_000_000, // 10MB ceiling
            }}
            onSuccess={(result) => {
              const info = result?.info as CloudinaryUploadInfo | undefined;
              const url = info?.secure_url || info?.url;
              if (url) {
                onChange({ url, altText: value.altText });
              }
            }}
          >
            {({ open }) => (
              <button
                type="button"
                onClick={() => open()}
                className="text-xs font-bold uppercase tracking-widest text-hunter-warm hover:underline"
              >
                Replace image
              </button>
            )}
          </CldUploadWidget>
        </div>
      ) : (
        // EMPTY DROP ZONE
        <CldUploadWidget
          uploadPreset={uploadPreset}
          options={{
            sources: ["local", "url", "camera"],
            maxFiles: 1,
            clientAllowedFormats: ["jpg", "jpeg", "png", "webp", "gif"],
            maxFileSize: 10_000_000,
          }}
          onSuccess={(result) => {
            const info = result?.info as CloudinaryUploadInfo | undefined;
            const url = info?.secure_url || info?.url;
            if (url) {
              // Alt text starts empty — the user is prompted to fill it in
              // via the input that appears after upload.
              onChange({ url, altText: "" });
            }
          }}
        >
          {({ open }) => (
            <button
              type="button"
              onClick={() => open()}
              className="group flex w-full flex-col items-center justify-center gap-3 rounded border-2 border-dashed border-hunter-warm/40 bg-white/30 dark:bg-hunter-shadow/50 px-6 py-12 hover:border-hunter-warm hover:bg-hunter-warm/5 transition-all"
            >
              <div className="rounded-full bg-hunter-warm/10 p-3 group-hover:bg-hunter-warm/20 transition-colors">
                <ImageIcon className="h-6 w-6 text-hunter-warm dark:text-hunter-gold" />
              </div>
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-hunter-mid dark:text-hunter-gold">
                <Upload className="h-4 w-4" />
                Upload cover image
              </div>
              <p className="text-xs font-mono text-slate-500">
                PNG, JPG, WEBP, or GIF · up to 10MB
              </p>
            </button>
          )}
        </CldUploadWidget>
      )}
    </div>
  );
}
