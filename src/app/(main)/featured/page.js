import React from 'react';
import FeaturedClient from '@/components/news/FeaturedUI'; // Ensure UI component exists

// 🔥 CACHE SETTING: 30 Minutes (1800 Seconds)
// Ab 30 minute tak server data refresh nahi karega, super fast load hoga.
export const revalidate = 1800; 

async function getNews() {
  try {
    const apiUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    
    // Fetch from API
    const res = await fetch(`${apiUrl}/api/admin/news`, { 
       next: { revalidate: 1800 } // 30 Min Cache here too
    });

    if (!res.ok) return [];
    const json = await res.json();
    
    let newsData = [];
    if (json.success && json.data) newsData = json.data;
    else if (Array.isArray(json)) newsData = json;

    // Data Clean up
    return newsData.map(item => ({
      ...item,
      category: Array.isArray(item.category) ? item.category : [item.category]
    }));

  } catch (error) {
    console.error("Fetch Error:", error);
    return [];
  }
}

export default async function FeaturedPage() {
  // Server Side Data Fetching (Fast due to Cache)
  const news = await getNews(); 
  
  // Pass data to Client Component
  return <FeaturedClient initialNews={news} />;
}