import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await dbConnect();
        const user = await User.findOne({ email: credentials.email }).select("+password");
        if (!user) throw new Error("Invalid Email");
        if (!user.password) throw new Error("Use Google Login");
        const isMatch = await bcrypt.compare(credentials.password, user.password);
        if (!isMatch) throw new Error("Wrong Password");
        return user;
      }
    })
  ],
  callbacks: {
    // 🔥 YE FUNCTION USER KO DB MEIN SAVE KARTA HAI
    async signIn({ user, account }) {
      if (account.provider === "google") {
        await dbConnect();
        try {
          const existingUser = await User.findOne({ email: user.email });

          if (!existingUser) {
            console.log("---------------------------------");
            console.log("🆕 NEW GOOGLE USER DETECTED:", user.email);
            
            await User.create({
              name: user.name,
              email: user.email,
              image: user.image,
              role: "user",     // Default role
              provider: "google" // Provider mark karo
            });
            
            console.log("✅ USER SAVED TO DB SUCCESSFULLY");
            console.log("---------------------------------");
          } else {
            console.log("ℹ️ User already exists in DB:", user.email);
          }
          return true;
        } catch (err) {
          console.error("❌ Error saving Google user to DB:", err);
          return true; // Login hone do, bhale hi DB fail ho jaye (Temporary)
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user._id;
      }
      if(token.email) {
          await dbConnect();
          const dbUser = await User.findOne({ email: token.email });
          if(dbUser) {
             token.role = dbUser.role;
             token.id = dbUser._id;
          }
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    }
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: '/login' }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };