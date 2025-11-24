"use client";
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, ChevronRight } from 'lucide-react';

export default function CategoryUI({ newsData, slug }) {
  // No loading state here, data comes from props
  return (
    <div className="min-h-screen bg-[#0A192F] text-white font-sans pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 border-b border-white/10 pb-6 flex flex-col md:flex-row justify-between items-end">
            <div>
                <Link href="/" className="text-teal-400 text-sm font-bold flex items-center gap-2 mb-4 hover:underline">
                    <ArrowLeft size={16} /> Back to Home
                </Link>
                <h1 className="text-5xl font-black text-white capitalize tracking-tight">
                    {slug} <span className="text-gray-600">News</span>
                </h1>
            </div>
            <div className="text-right mt-6 md:mt-0">
                <span className="bg-white/5 border border-white/10 px-4 py-2 rounded-full text-sm font-mono text-teal-400">
                    {newsData.length} Articles
                </span>
            </div>
        </div>

        {newsData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {newsData.map((news) => (
                    <Link href={`/news/${news.slug}`} key={news._id} className="group block h-full">
                        <div className="bg-[#112240] rounded-2xl overflow-hidden border border-white/5 hover:border-teal-400/50 transition-all duration-300 hover:-translate-y-2 shadow-xl h-full flex flex-col">
                            <div className="h-56 bg-gray-800 relative overflow-hidden">
                                <img src={news.imageUrl || "https://placehold.co/600x400"} alt={news.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700" />
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-teal-400 text-xs font-bold uppercase">{news.category}</span>
                                    <span className="text-gray-500 text-xs flex items-center gap-1"><Clock size={12} /> {new Date(news.createdAt).toLocaleDateString()}</span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3 leading-snug group-hover:text-teal-400 transition-colors line-clamp-2">{news.title}</h3>
                                <p className="text-gray-400 text-sm line-clamp-3 mb-6 flex-1">{news.summary}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        ) : (
            <div className="py-20 text-center border border-dashed border-white/10 rounded-3xl bg-white/5">
                <h3 className="text-2xl font-bold text-gray-300 mb-2">No News Found</h3>
                <p className="text-gray-500">No articles found for "{slug}".</p>
            </div>
        )}
      </div>
    </div>
  );
}