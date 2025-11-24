import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export const authOptions = {
  providers: [
    // 1. Google Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    // 2. Credentials Provider (Email/Pass login ke liye)
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await dbConnect();

        // Basic Validation
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter an email and password');
        }

        // User Dhundo
        const user = await User.findOne({ email: credentials.email });

        // Agar user nahi mila ya Google user hai (password nahi hai)
        if (!user || !user.password) {
          throw new Error('No user found with this email');
        }

        // 🛑 IMPORTANT: Admin Role Check
        // Sirf Admin ya Superadmin hi login kar paye
        if (user.role !== 'admin' && user.role !== 'superadmin') {
          throw new Error('Access Denied: You are not an admin!');
        }

        // Password Check
        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordCorrect) {
          throw new Error('Invalid password');
        }

        // Sab sahi hai toh user return karo
        return user;
      }
    })
  ],
  
  // ✅ YE HAI FIX: Isse wo black screen nahi aayegi
  pages: {
    signIn: '/login',  // Default login page ki jagah tera page use hoga
    error: '/login',   // Error aane par bhi tere page par wapas aayega
  },

  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub;
        session.user.role = token.role; // Role frontend bhejo
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role; // Role token me save karo
      }
      return token;
    }
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};