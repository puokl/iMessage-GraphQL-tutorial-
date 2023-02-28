import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../../../prisma/lib/prismadb";

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET as string,
  // we add the custom properties to out nextauth session
  callbacks: {
    async session({ session, token, user }) {
      // everytime the authenticated user session is fetched from the db that function is going to fire

      return { ...session, user: { ...session.user, ...user } };
      // return { ...session, customProperty: "Phuoc" };
    },
  },
});
