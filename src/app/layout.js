import { Inter } from "next/font/google";
import "./globals.css"; // ✅ Ye file sirf yahan import hoti hai
import AuthProvider from "@/components/auth/AuthProvider"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "NovaNews",
  description: "News Portal",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* 👇 AuthProvider YAHAN lagana hai */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}