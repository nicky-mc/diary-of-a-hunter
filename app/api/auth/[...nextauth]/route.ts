// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

// Next.js App Router requires both GET and POST to be exported for NextAuth
export { handler as GET, handler as POST };
