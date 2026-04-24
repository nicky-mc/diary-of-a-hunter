// src/models/user.ts
import mongoose, { Schema, Document, models } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string; // Changed from passwordHash to password
  name: string;
  role: string;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      // Changed to password
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "hunter",
    },
  },
  { timestamps: true },
);

// Explicitly naming the collection 'users' is the safest path
const User = models.User || mongoose.model<IUser>("User", UserSchema, "users");
export default User;
