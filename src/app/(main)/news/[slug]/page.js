import React from 'react';
import ArticleClient from './ArticleClient'; 
import { connectToDB } from "@/lib/db";
import News from "@/models/News";

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

async function getSingleNews(slug) {
  try {
    await connectToDB();

    // 1. URL se aayi hui string ko clean karo (decode)
    // Example: "My%20News" -> "My News"
    const decodedSlug = decodeURIComponent(slug);
    
    console.log("🔍 Searching for Slug/ID:", decodedSlug);

    let newsItem = null;

    // 2. Check agar ye valid MongoDB ID hai (24 chars hex)
    // Ye zaroori hai kyunki agar hum galat format ID me dalenge to Mongoose crash ho jayega
    if (decodedSlug.match(/^[0-9a-fA-F]{24}$/)) {
      console.log("👉 It looks like an ID. Searching by ID...");
      newsItem = await News.findById(decodedSlug);
    } 
    
    // 3. Agar ID se nahi mila ya ID format nahi tha, to Slug se dhundo
    if (!newsItem) {
      console.log("👉 Searching by 'slug' field...");
      newsItem = await News.findOne({ slug: decodedSlug });
    }

    if (!newsItem) {
      console.log("❌ Article NOT FOUND in Database");
      return null;
    }

    console.log("✅ Article Found:", newsItem.title);

    // JSON serialization
    return JSON.parse(JSON.stringify(newsItem));

  } catch (error) {
    console.error("🔥 Database Error in Article Page:", error);
    return null;
  }
}

export default async function ArticlePage({ params }) {
  const { slug } = params;
  
  // Data fetch call
  const news = await getSingleNews(slug);

  // --- ERROR HANDLING UI ---
  // Agar news nahi mili to user ko blank page ki jagah ye dikhega
  if (!news) {
    return (
      <div className="min-h-screen bg-[#0A192F] text-white flex flex-col items-center justify-center p-5 text-center">
        <h1 className="text-4xl font-bold text-red-500 mb-4">404 - Article Not Found</h1>
        <p className="text-gray-300 mb-8">
          Hum database mein <strong>"{slug}"</strong> dhoondne ki koshish kar rahe the par kuch nahi mila.
        </p>
        <div className="p-4 bg-gray-800 rounded text-left text-xs font-mono text-green-400 overflow-auto max-w-lg w-full">
           <p>Debug Info:</p>
           <p>Slug received: {slug}</p>
        </div>
        <a href="/" className="mt-8 px-6 py-3 bg-teal-400 text-black font-bold rounded hover:bg-white transition">
          Go Back Home
        </a>
      </div>
    );
  }

  // Agar sab sahi hai to Article dikhao
  return <ArticleClient news={news} />;
}