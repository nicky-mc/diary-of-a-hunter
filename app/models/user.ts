// src/models/User.ts
import mongoose, { Schema, Document, models } from "mongoose";

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  name: string;
  role: string; // e.g., 'hunter', 'admin'
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
    passwordHash: {
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

const User = models.User || mongoose.model<IUser>("User", UserSchema);
export default User;
