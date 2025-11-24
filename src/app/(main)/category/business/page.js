import NewsClient from './NewsClient'; // Import from above file

// 1 Hour Cache Setup
async function getNews() {
  // IMPORTANT: Server component me Full URL chahiye hoti hai agar internal API hai.
  // Agar external DB call hai to seedha DB call karna better hai.
  // Yahan main dummy base url assume kar raha hu agar .env set nahi hai.
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'; 
  
  try {
    const res = await fetch(`${baseUrl}/api/admin/news`, {
      next: { revalidate: 3600 } // <-- YE HAI 1 GHANTE KA CACHE MAGIC
    });
    
    if (!res.ok) throw new Error('Failed to fetch data');
    const data = await res.json();
    
    if (data.success && data.data) return data.data;
    if (Array.isArray(data)) return data;
    return [];
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
}

export default async function BusinessNewsPage() {
  const newsData = await getNews();
  
  return <NewsClient initialNews={newsData} />;
}