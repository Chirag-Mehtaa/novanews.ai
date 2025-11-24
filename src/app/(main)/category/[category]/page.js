import React from 'react';
import CategoryClient from './CategoryClient'; // ⚠️ Dhyan de: Agar CategoryClient kisi aur folder me hai to path sahi kar lena

// --- SERVER SIDE DATA FETCHING ---
async function getNews() {
  try {
    // API URL set karna zaroori hai server side fetch ke liye
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    
    console.log("Fetching News from Server (Cache: 30 mins)..."); 

    // 🔥 30 Minute Cache (1800 Seconds)
    const res = await fetch(`${apiUrl}/api/admin/news`, { 
      next: { revalidate: 1800 } 
    });
    
    if (!res.ok) {
      console.error("Failed to fetch news, status:", res.status);
      return [];
    }
    
    const data = await res.json();
    
    let newsData = [];
    if (data.success && data.data) newsData = data.data;
    else if (Array.isArray(data)) newsData = data;

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