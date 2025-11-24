// app/category/page.jsx (Ya jaha bhi tumhara yeh page hai)
import CategoryClient from './CategoryClient'; // Neeche wali file import karo

// Data fetching function (Server Side)
async function getNews() {
  try {
    // 30 Min Cache yaha kaam karega perfectly
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/admin/news`, { 
      next: { revalidate: 1800 } 
    });
    
    if (!res.ok) return [];
    
    const data = await res.json();
    let newsData = [];
    if (data.success && data.data) newsData = data.data;
    else if (Array.isArray(data)) newsData = data;

    return newsData.map(item => ({
        ...item,
        category: Array.isArray(item.category) ? item.category : [item.category]
    }));
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
}

export default async function CategoryPage() {
  // Page load hone se pehle data ready hoga
  const news = await getNews();

  // Loading screen nahi aayega, seedha content aayega
  return <CategoryClient initialNews={news} />;
}