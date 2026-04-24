import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/mongodb";
import User from "@/app/models/user";
// Ensure this points to your new model
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("--- AUTH ATTEMPT ---");

        if (!credentials?.email || !credentials?.password) {
          console.error("Auth Failed: Missing credentials input");
          return null;
        }

        // 1. Dynamic Whitelist Parsing
        const authorizedList = (process.env.AUTHORIZED_HUNTERS || "")
          .split(",")
          .map((email) => email.trim().toLowerCase())
          .filter((email) => email !== "");

        const emailLower = credentials.email.toLowerCase().trim();

        // 2. Whitelist Check
        if (!authorizedList.includes(emailLower)) {
          console.error(`Access Denied: ${emailLower} is not whitelisted.`);
          throw new Error(
            "Access Denied: You are not authorized to access this terminal.",
          );
        }

        // 3. Database Sync
        await dbConnect();

        // 4. Find Hunter (Matches 'password' field in your new model)
        const user = await User.findOne({ email: emailLower });

        if (!user) {
          console.error(
            `Auth Failed: ${emailLower} whitelisted but not found in DB.`,
          );
          throw new Error("No hunter found with this designation.");
        }

        // 5. Password Verification (Bcrypt)
        // Note: we use user.password here because we updated the model
        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password,
        );

        if (!isPasswordCorrect) {
          console.error(`Auth Failed: Incorrect password for ${emailLower}`);
          throw new Error("Invalid decryption key (Password).");
        }

        console.log(`Auth Success: Welcome, ${user.name}`);

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
