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
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // 1. Dynamic whitelist — only emails in AUTHORIZED_HUNTERS can attempt
        //    auth even if their password is correct.
        const authorizedList = (process.env.AUTHORIZED_HUNTERS || "")
          .split(",")
          .map((email) => email.trim().toLowerCase())
          .filter((email) => email !== "");

        const emailLower = credentials.email.toLowerCase().trim();

        // 2. Whitelist check (intentionally generic error message —
        //    don't leak whether the email exists in the DB)
        if (!authorizedList.includes(emailLower)) {
          throw new Error(
            "Access Denied: You are not authorized to access this terminal.",
          );
        }

        // 3. Database lookup
        await dbConnect();
        const user = await User.findOne({ email: emailLower });

        if (!user) {
          throw new Error("No hunter found with this designation.");
        }

        // 4. Password verification
        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password,
        );

        if (!isPasswordCorrect) {
          throw new Error("Invalid decryption key (Password).");
        }

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
