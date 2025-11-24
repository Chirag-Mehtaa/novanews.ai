"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Edit, Trash2, Plus, Loader2, User } from 'lucide-react'; // User icon add kiya
import { useSession } from 'next-auth/react'; 

export default function NewsListPage() {
  const { data: session } = useSession(); 
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Logic
  const fetchNews = async () => {
    try {
      const res = await fetch('/api/admin/news');
      const data = await res.json();
      
      if (Array.isArray(data)) {
        setNews(data);
      } else if (data.data) {
        setNews(data.data);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNews(); }, []);

  // 2. Delete Logic
  const handleDelete = async (id) => {
    if(!confirm("Are you sure you want to delete this article?")) return;
    
    try {
        const res = await fetch(`/api/admin/news?id=${id}`, { method: 'DELETE' });
        
        if(res.ok) {
            setNews(prev => prev.filter(item => item._id !== id));
            alert("Article Deleted!");
        } else {
            const err = await res.json();
            alert(err.message || "Failed to delete");
        }
    } catch (error) { 
        console.error(error); 
    }
  };

  // 3. Permission Logic
  const canDelete = session?.user?.role === 'superadmin' || session?.user?.role === 'admin';

  return (
    <div className="p-8 max-w-7xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">All Articles</h1>
            <p className="text-gray-500 text-sm mt-1">Manage and organize your publications.</p>
        </div>
        <Link href="/admin/news/create" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg flex items-center gap-2 text-sm transition-all">
          <Plus size={18} /> Create New
        </Link>
      </div>

      {/* News Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
            <div className="p-12 flex justify-center text-indigo-600">
                <Loader2 size={32} className="animate-spin" />
            </div>
        ) : (
            <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
                <tr className="text-gray-500 text-xs uppercase tracking-wider font-semibold">
                    <th className="p-5">Article Details</th>
                    {/* 🔥 NEW COLUMN HEADER */}
                    <th className="p-5">Author</th>
                    <th className="p-5">Category</th>
                    <th className="p-5">Date</th>
                    <th className="p-5">Status</th>
                    <th className="p-5 text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {news.length > 0 ? (
                    news.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50/80 transition-colors group">
                        
                        <td className="p-5">
                            <div className="font-bold text-gray-900 text-sm line-clamp-1">{item.title}</div>
                        </td>

                        {/* 🔥 NEW COLUMN DATA: AUTHOR */}
                        <td className="p-5">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold border border-blue-100">
                                   {/* Agar author name hai to first letter, nahi to 'A' */}
                                   {item.author ? item.author[0].toUpperCase() : <User size={12} />}
                                </div>
                                <span className="text-sm text-gray-600 font-medium">
                                    {item.author || "Unknown"}
                                </span>
                            </div>
                        </td>
                        
                        <td className="p-5">
                            <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-bold border border-gray-200">
                                {item.category || "General"}
                            </span>
                        </td>
                        
                        <td className="p-5 text-sm text-gray-500">
                            {new Date(item.createdAt).toLocaleDateString()}
                        </td>
                        
                        <td className="p-5">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                item.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                                {item.status || "Published"}
                            </span>
                        </td>
                        
                        <td className="p-5 text-right">
                            <div className="flex justify-end gap-2">
                                <Link href={`/admin/news/edit/${item._id}`} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Edit">
                                    <Edit size={18} />
                                </Link>
                                
                                {canDelete && (
                                    <button 
                                        onClick={() => handleDelete(item._id)} 
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                )}
                            </div>
                        </td>
                    </tr>
                    ))
                ) : (
                    // Colspan increased to 6 to fit new column
                    <tr><td colSpan="6" className="p-12 text-center text-gray-400">No articles found.</td></tr>
                )}
            </tbody>
            </table>
        )}
      </div>
    </div>
  );
}