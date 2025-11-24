"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, ArrowLeft, Calendar, Clock } from 'lucide-react';

export default function ArchivePage() {
  const params = useParams();
  const categorySlug = params.category || "general";
  
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch('/api/admin/news');
        const data = await res.json();
        let allNews = Array.isArray(data) ? data : data.data || [];

        // Filter only this category
        const filtered = allNews.filter(n => 
            n.category?.toLowerCase() === categorySlug.toLowerCase()
        );
        setNewsList(filtered);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [categorySlug]);

  if (loading) return <div className="min-h-screen bg-[#0a192f] flex justify-center items-center text-[#64ffda]"><Loader2 size={40} className="animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-[#0a192f] text-white pb-20 pt-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-10">
            <Link href={`/category/${categorySlug}`} className="inline-flex items-center gap-2 text-slate-400 hover:text-[#64ffda] mb-4 transition-colors">
                <ArrowLeft size={18} /> Back to Dashboard
            </Link>
            <h1 className="text-4xl font-bold capitalize flex items-center gap-3">
                {categorySlug} <span className="text-[#64ffda]">Archive</span>
            </h1>
            <p className="text-slate-400 mt-2">Browsing all articles in Market Intelligence.</p>
        </div>

        {/* Grid */}
        {newsList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {newsList.map((news) => (
                    <Link href={`/news/${news.slug}`} key={news._id} className="group flex flex-col bg-[#112240] border border-white/5 rounded-xl overflow-hidden hover:border-[#64ffda]/50 transition-all hover:-translate-y-1 shadow-lg">
                        <div className="h-48 overflow-hidden relative">
                            <img 
                                src={news.imageUrl || "https://placehold.co/600x400/112240/64FFDA?text=Nova"} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100" 
                            />
                            {news.isFeatured && (
                                <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase">Featured</span>
                            )}
                        </div>
                        <div className="p-5 flex flex-col flex-grow">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-[#64ffda] text-xs font-bold uppercase tracking-wider">{news.category}</span>
                                <span className="text-slate-500 text-xs flex items-center gap-1"><Calendar size={12}/> {new Date(news.createdAt).toLocaleDateString()}</span>
                            </div>
                            <h3 className="text-lg font-bold text-white leading-snug mb-3 line-clamp-3 group-hover:text-[#64ffda] transition-colors">
                                {news.title}
                            </h3>
                            <div className="mt-auto pt-4 border-t border-white/5 flex items-center text-slate-400 text-sm group-hover:text-white transition-colors">
                                Read Article <ArrowLeft size={16} className="ml-auto rotate-180 text-[#64ffda]" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        ) : (
            <div className="p-20 text-center border border-dashed border-white/10 rounded-xl text-slate-500">
                No articles found in this archive.
            </div>
        )}

      </div>
    </div>
  );
}