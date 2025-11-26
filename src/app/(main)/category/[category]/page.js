import React from 'react';
import CategoryClient from './CategoryClient'; 
// 👇 Ye 2 lines add ki hain (Direct DB ke liye zaroori hain)
import { connectToDB } from "@/lib/db";
import News from "@/models/News";

// --- SERVER SIDE DATA FETCHING ---
async function getNews() {
  try {
    // 👇 Purana URL aur Fetch hata diya. Ab hum Direct DB connect karenge.
    await connectToDB();
    
    console.log("Fetching News directly from Database..."); 

    // 🔥 Direct Database Call (Network Error ka koi chance nahi)
    // Ye wahi data layega jo tumhari API la rahi thi
    const rawNews = await News.find({}).sort({ createdAt: -1 });
    
    // Data ko normal array mein convert karna zaroori hai Next.js ke liye
    let newsData = JSON.parse(JSON.stringify(rawNews));

    // 👇 Yahan se neeche ka sara logic EXACT SAME hai jo tumne diya tha
    
    // Data format clean kar rahe hain taaki client ko error na aaye
    return newsData.map(item => ({
        ...item,
        category: Array.isArray(item.category) ? item.category : [item.category],
        _id: item._id.toString() // ID ko string bana lete hain safety ke liye
    }));

  } catch (error) {
    console.error("Server Fetch Error:", error);
    return [];
  }
}

// --- MAIN SERVER COMPONENT ---
export default async function CategoryPage() {
  // Page load hone se pehle data ready ho jayega
  const news = await getNews();

  // Ab hum data ko prop ke through Client Component me bhej rahe hain
  return <CategoryClient initialNews={news} />;
}