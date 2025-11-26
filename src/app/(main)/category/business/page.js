import NewsClient from './NewsClient'; // Import from above file
// 👇 Ye 2 lines nayi hain (Direct DB ke liye)
import { connectToDB } from "@/lib/db";
import News from "@/models/News";

// --- SERVER SIDE DATA FETCHING (No API/Fetch needed) ---
async function getNews() {
  try {
    // 1. Database Connect karo
    await connectToDB();

    // 2. Direct Data nikalo (Koi URL/Localhost ki zaroorat nahi)
    // Note: Maine yahan 'business' filter lagaya hai kyunki ye Business page hai.
    // Agar tujhe saari news chahiye to .find({}) kar dena.
    const rawNews = await News.find({ category: 'business' }).sort({ createdAt: -1 });

    // 3. Data ko JSON mein convert karo (Next.js ke liye zaroori step)
    const newsData = JSON.parse(JSON.stringify(rawNews));

    return newsData;

  } catch (error) {
    console.error("Database Error:", error);
    return [];
  }
}

export default async function BusinessNewsPage() {
  // Page load hote hi DB se data aayega
  const newsData = await getNews();
  
  return <NewsClient initialNews={newsData} />;
}