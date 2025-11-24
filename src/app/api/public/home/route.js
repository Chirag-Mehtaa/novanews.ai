import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import News from "@/models/News";

export const dynamic = "force-dynamic"; 

const getCategoryColor = (category) => {
  switch(category) {
    case 'Technology': return 0x64FFDA; // Cyan
    case 'Business': return 0xFFA500;   // Orange
    case 'Science': return 0xFF00FF;    // Magenta
    case 'Politics': return 0xFF0000;   // Red
    default: return 0xFFFFFF; // White
  }
};

export async function GET() {
  try {
    await dbConnect();

    // 1. Fetch Latest 20 Published News
    const allNews = await News.find({ status: "Published" }) 
      .sort({ createdAt: -1 })
      .limit(20);

    // 2. Prepare Globe Data (Top 10)
    const globeFeed = allNews.slice(0, 10).map((item) => {
        
        // Source Location (DB se lo, ya default Delhi)
        const srcLat = item.location?.lat || 28.6139;
        const srcLng = item.location?.lng || 77.2090;

        // 🔥 FIX: Generate Random Target (Taaki line lambi bane)
        // Hum source se thoda door random point nikalenge
        const targetLat = (Math.random() * 140) - 70; 
        const targetLng = (srcLng + 90 + Math.random() * 180) % 360 - 180; 

        return {
            id: item._id,
            name: item.location?.city || "Global Update",
            lat: srcLat,
            lon: srcLng,
            target: { lat: targetLat, lon: targetLng }, // Line yahan tak jayegi
            color: getCategoryColor(item.category),
            news: {
                title: item.title,
                summary: item.summary ? item.summary.substring(0, 80) + "..." : "Read more...",
                metric: "Live"
            }
        };
    });

    // 3. Other Data
    const latestNews = allNews.slice(0, 6);
    const techNews = await News.find({ status: "Published", category: "Technology" }).limit(4);

    return NextResponse.json({
      success: true,
      data: {
        globe: globeFeed,
        latest: latestNews,
        technology: techNews
      }
    });

  } catch (error) {
    console.error("Home API Error:", error);
    return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
  }
}