// src/lib/cloudinary.ts
import { v2 as cloudinary } from "cloudinary";

// Ensure the variables exist before trying to connect
if (
  !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
  !process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  throw new Error(
    "CRITICAL: Cloudinary credentials missing. The secure uplink is down.",
  );
}

// Configure the backend SDK
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // Always force HTTPS. We don't want anyone intercepting these files.
});

export default cloudinary;
