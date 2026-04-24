// setup-hunters.mjs
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

// Load variables from .env.local
dotenv.config({ path: ".env.local" });

const {
  MONGODB_URI,
  HUNTER_1_EMAIL,
  HUNTER_1_PASSWORD,
  HUNTER_2_EMAIL,
  HUNTER_2_PASSWORD,
} = process.env;

// Define a simple Schema to match your app's User model
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: { type: String },
});

// We specify the collection name "users" to be 100% sure
const User =
  mongoose.models.User || mongoose.model("User", UserSchema, "users");

async function seed() {
  if (!MONGODB_URI || !HUNTER_1_EMAIL || !HUNTER_1_PASSWORD) {
    console.error(
      "❌ Missing variables in .env.local. Check your HUNTER_1_EMAIL and PASSWORD.",
    );
    process.exit(1);
  }

  try {
    console.log("🔗 Connecting to the Vault...");
    await mongoose.connect(MONGODB_URI);

    const hunters = [
      {
        name: "Charlotte",
        email: HUNTER_1_EMAIL.toLowerCase(),
        password: HUNTER_1_PASSWORD,
      },
      {
        name: "Nicky",
        email: HUNTER_2_EMAIL.toLowerCase(),
        password: HUNTER_2_PASSWORD,
      },
    ];

    for (const hunter of hunters) {
      const exists = await User.findOne({ email: hunter.email });

      if (exists) {
        console.log(`- Hunter ${hunter.email} is already in the database.`);
        continue;
      }

      // Hash the password so it's not stored in plain text
      const hashedPassword = await bcrypt.hash(hunter.password, 12);

      await User.create({
        name: hunter.name,
        email: hunter.email.toLowerCase(),
        password: hashedPassword,
      });
      console.log(`✅ Successfully registered: ${hunter.name}`);
    }

    console.log("🏁 Database seeded. You can now log in.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  }
}

seed();
