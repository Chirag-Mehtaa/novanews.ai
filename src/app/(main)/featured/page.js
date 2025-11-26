import React from 'react';
import FeaturedClient from '@/components/news/FeaturedUI'; 
// 👇 Ye imports zaroori hain
import { connectToDB } from "@/lib/db";
import News from "@/models/News";

// 🔥 CACHE SETTING: 30 Minutes (1800 Seconds)
// Next.js DB calls ko bhi cache kar lega is setting ke saath
export const revalidate = 1800; 

async function getNews() {
  try {
    // 👇 Fetch hata diya, direct DB connect kiya
    await connectToDB();
    
    // Direct Data Query
    // (Maine sort laga diya hai taaki latest news pehle aaye)
    const rawNews = await News.find({}).sort({ createdAt: -1 });

    // Data ko JSON banaya
    const newsData = JSON.parse(JSON.stringify(rawNews));

    // 👇 Tera purana Data Clean up logic (Same to same)
    return newsData.map(item => ({
      ...item,
      category: Array.isArray(item.category) ? item.category : [item.category],
      _id: item._id.toString() // ID safety
    }));

  } catch (error) {
    console.error("Database Error:", error);
    return [];
  }
}

export default async function FeaturedPage() {
  // Server Side Data Fetching (Fast due to DB Call + Cache)
  const news = await getNews(); 
  
  // Pass data to Client Component
  return <FeaturedClient initialNews={news} />;
}