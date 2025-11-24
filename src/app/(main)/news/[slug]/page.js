import ArticleClient from './ArticleClient';
import Link from 'next/link';

// Data fetch function with CACHE
async function getArticle(slug) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  try {
    // 3600 seconds = 1 hour cache
    const res = await fetch(`${baseUrl}/api/admin/news`, {
      next: { revalidate: 3600 } 
    });
    
    if (!res.ok) return null;
    
    const data = await res.json();
    const allNews = Array.isArray(data) ? data : data.data || [];
    
    // Server side find
    const found = allNews.find(item => item.slug === slug);
    return found || null;
    
  } catch (error) {
    console.error("Server Fetch Error:", error);
    return null;
  }
}

export default async function Page({ params }) {
  // Params se slug nikalo
  const { slug } = params;
  
  // Server pe data fetch karo
  const article = await getArticle(slug);

  // Agar article nahi mila toh 404 dikhao (Server Side 404)
  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A192F] text-white">
        <h1 className="text-4xl font-bold mb-4 text-red-500">404</h1>
        <p className="text-slate-400 mb-6">Article not found or deleted.</p>
        <Link href="/" className="px-6 py-3 bg-[#64FFDA] text-[#0A192F] font-bold rounded-lg">Go Home</Link>
      </div>
    );
  }

  // Agar mil gaya toh Client Component ko pass karo
  return <ArticleClient article={article} />;
}