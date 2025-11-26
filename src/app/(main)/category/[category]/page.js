import React from 'react';
import CategoryClient from './CategoryClient';

// 🔥 FIX 1: Page ko dynamic banaya taaki build time par error na aaye
export const dynamic = 'force-dynamic';

// --- SERVER SIDE DATA FETCHING ---
async function getNews() {
  try {
    // 🔥 FIX 2: URL Logic sudhara hai. 
    // Netlify par 'NEXTAUTH_URL' ya 'URL' use karega, local par localhost.
    const baseUrl = process.env.NEXTAUTH_URL || process.env.URL || 'http://localhost:3000';
    
    console.log(`Fetching News from: ${baseUrl}...`); 

    // 🔥 FIX 3: 'no-store' lagaya hai taaki data guaranteed aaye (Caching issue hatane ke liye)
    const res = await fetch(`${baseUrl}/api/admin/news`, { 
      cache: 'no-store'
    });
    
    if (!res.ok) {
      console.error("Failed to fetch news, status:", res.status);
      return [];
    }
    
    const data = await res.json();
    
    let newsData = [];
    if (data.success && data.data) newsData = data.data;
    else if (Array.isArray(data)) newsData = data;

    // Data format clean kar rahe hain taaki client ko error na aaye (Tera original logic)
    return newsData.map(item => ({
        ...item,
        category: Array.isArray(item.category) ? item.category : [item.category],
        _id: item._id.toString()
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