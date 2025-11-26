import NewsClient from './NewsClient'; 
import { connectToDB } from "@/lib/db";
import News from "@/models/News";

// 🔥 IMPORTANT SETTINGS
// Page ko Dynamic banaya taaki Netlify build time par freeze na kare
export const dynamic = 'force-dynamic';
// Cache ko disable kiya taaki hamesha latest news mile
export const fetchCache = 'force-no-store';

// --- SERVER SIDE DATA FETCHING ---
async function getNews() {
  try {
    // 1. Database Connect karo
    await connectToDB();

    // 2. Direct Data nikalo
    // $regex: 'business', $options: 'i' -> Iska matlab 'Business', 'business', 'BUSINESS' sab chalega
    const rawNews = await News.find({ 
      category: { $regex: 'business', $options: 'i' } 
    }).sort({ createdAt: -1 });

    // 3. Data ko JSON mein convert karo
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