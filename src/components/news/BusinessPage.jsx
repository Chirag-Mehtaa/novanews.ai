'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, Play, Briefcase, 
  PieChart, Activity, ArrowRight, Globe, Zap, 
  Clock, ArrowUpRight, BarChart3, Loader2, Star 
} from 'lucide-react';
import Link from 'next/link';

// --- STOCK DATA (Static) ---
const stockData = [
  { symbol: 'NIFTY 50', price: '24,850.20', change: '+1.2%', up: true },
  { symbol: 'SENSEX', price: '81,200.15', change: '+0.8%', up: true },
  { symbol: 'BTC/USD', price: '$92,400', change: '-2.1%', up: false },
  { symbol: 'RELIANCE', price: '₹2,890', change: '-0.3%', up: false },
];

// --- HELPER: TIME FORMATTER ---
const formatTime = (dateString) => {
    if(!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.abs(now - date) / 36e5;
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    return date.toLocaleDateString();
};

const MarketStrip = () => {
  const loopData = [...stockData, ...stockData];
  return (
    <div className="w-full bg-navy-light/80 backdrop-blur border-b border-white/5 h-10 flex items-center overflow-hidden relative z-20 group">
      <div className="flex gap-16 items-center animate-marquee-slow group-hover:pause-animation whitespace-nowrap pl-4">
        {loopData.map((stock, i) => (
          <div key={i} className="flex items-center gap-3 text-xs font-mono font-semibold cursor-pointer hover:scale-110 transition-transform shrink-0">
            <span className="text-slate-400 tracking-wider">{stock.symbol}</span><span className="text-white">{stock.price}</span>
            <span className={`flex items-center ${stock.up ? 'text-teal-accent' : 'text-red-500'}`}>{stock.up ? <TrendingUp size={12} className="mr-1" /> : <TrendingDown size={12} className="mr-1" />}{stock.change}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---
export default function BusinessPage() {
  const [heroNewsList, setHeroNewsList] = useState([]);
  const [feedNewsList, setFeedNewsList] = useState([]);
  const [deepDiveList, setDeepDiveList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
        try {
            const res = await fetch('/api/admin/news'); 
            const data = await res.json();
            
            let allNews = [];
            if (data.success && data.data) allNews = data.data;
            else if (Array.isArray(data)) allNews = data;

            // 1. Filter Business Only (For Main Page)
            const businessOnly = allNews.filter(n => 
                n.category?.toLowerCase() === 'business' || n.category?.toLowerCase() === 'finance'
            );

            // 2. Filter World Only (For Deep Dive Sidebar)
            const worldOnly = allNews.filter(n => 
                n.category?.toLowerCase() === 'world' || n.category?.toLowerCase() === 'international'
            );

            // Separate Featured vs Feed (Business)
            const hero = businessOnly.filter(n => n.isFeatured === true);
            const feed = businessOnly.filter(n => n.isFeatured === false || n.isFeatured === undefined);

            setHeroNewsList(hero);
            setFeedNewsList(feed); // Business Feed

            // 🔥 Deep Dive: Sirf Top 3 World News
            setDeepDiveList(worldOnly.slice(0, 3)); 

        } catch (error) {
            console.error("Error fetching news:", error);
        } finally {
            setLoading(false);
        }
    };
    fetchNews();
  }, []);

  if (loading) return (<div className="min-h-screen bg-navy-dark flex items-center justify-center text-teal-accent"><Loader2 size={40} className="animate-spin" /></div>);

  // Layout Logic
  const mainHeroBtn = heroNewsList[0];
  const sideHeroBtns = heroNewsList.slice(1, 3);
  const extraHeroGrid = heroNewsList.slice(3, 6);

  return (
    <div className="min-h-screen bg-navy-dark text-text-primary font-sans pb-20">
      <MarketStrip />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-teal-accent mb-2"><Briefcase size={20} /><span className="text-xs font-bold uppercase tracking-widest">Nova Business</span></div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white leading-tight">Market <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-accent to-blue-500">Intelligence</span></h1>
          </div>
        </div>

        {/* --- HERO SECTION --- */}
        {heroNewsList.length > 0 ? (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
            
            {/* BIG LEFT CARD */}
            {mainHeroBtn && (
            <Link href={`/news/${mainHeroBtn.slug}`} className="lg:col-span-8 row-span-2 group relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-navy-light block cursor-pointer h-[500px]">
                <div className="absolute top-4 left-4 z-20 flex gap-2"><span className="bg-red-600 text-white text-[10px] font-bold uppercase px-2 py-1 rounded animate-pulse flex items-center gap-1"><span className="w-2 h-2 bg-white rounded-full"></span> Featured Intel</span></div>
                <div className="h-full w-full relative overflow-hidden">
                <img src={mainHeroBtn.imageUrl || "https://placehold.co/800x600/112240/64FFDA?text=No+Image"} alt={mainHeroBtn.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-transparent to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 w-full p-6 md:p-8">
                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-white leading-tight mb-3 group-hover:text-teal-accent transition-colors line-clamp-2">{mainHeroBtn.title}</h2>
                    <div className="flex items-center gap-4 text-slate-300 text-sm"><span>{formatTime(mainHeroBtn.createdAt)}</span><span className="w-1 h-1 bg-slate-500 rounded-full"></span><span>{mainHeroBtn.author || 'Nova Desk'}</span></div>
                </div>
            </Link>
            )}

            {/* SIDE 2 CARDS */}
            <div className="lg:col-span-4 flex flex-col gap-6 h-[500px]">
                {sideHeroBtns.map((news) => (
                    <Link href={`/news/${news.slug}`} key={news._id} className="flex-1 relative group rounded-2xl overflow-hidden border border-white/10 bg-navy-light/30 hover:border-teal-accent/30 transition-colors block flex flex-col">
                        <div className="h-[45%] overflow-hidden relative w-full">
                            <img src={news.imageUrl || "https://placehold.co/600x400/112240/64FFDA?text=No+Image"} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        </div>
                        <div className="p-4 h-[55%] flex flex-col justify-between">
                            <div>
                                <span className="text-teal-accent text-[10px] font-bold uppercase tracking-wider mb-1 block">{news.category}</span>
                                <h3 className="text-base md:text-lg font-bold text-white leading-snug group-hover:text-teal-accent transition-colors line-clamp-2">{news.title}</h3>
                            </div>
                            <div className="flex justify-between items-center pt-3 border-t border-white/5">
                                <span className="text-xs text-slate-500">{formatTime(news.createdAt)}</span>
                                <ArrowRight size={16} className="text-slate-400 group-hover:text-teal-accent group-hover:translate-x-1 transition-all" />
                            </div>
                        </div>
                    </Link>
                ))}
                {sideHeroBtns.length < 2 && <div className="flex-1 bg-navy-light/10 rounded-2xl border border-white/5 flex items-center justify-center text-slate-600 text-sm italic">More featured news coming soon...</div>}
            </div>
            </div>

            {/* EXTRA HERO GRID */}
            {extraHeroGrid.length > 0 && (
                <div className="mb-16">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2"><Star size={20} className="text-teal-accent"/> More Highlights</h3>
                        <Link href="/category/business/archive" className="flex items-center gap-2 text-sm text-teal-accent hover:text-white transition-colors border border-teal-accent/30 px-4 py-2 rounded-full hover:bg-teal-accent/10">View All <ArrowRight size={16} /></Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {extraHeroGrid.map((news) => (
                            <Link href={`/news/${news.slug}`} key={news._id} className="group relative rounded-xl overflow-hidden border border-white/10 bg-navy-light/30 hover:border-teal-accent/30 transition-all block h-full">
                                <div className="h-48 overflow-hidden"><img src={news.imageUrl || "https://placehold.co/600x400/112240/64FFDA?text=No+Image"} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" /></div>
                                <div className="p-5">
                                    <span className="text-teal-accent text-xs font-bold uppercase">{news.category}</span>
                                    <h3 className="text-lg font-bold text-white mt-2 mb-2 leading-snug group-hover:text-teal-accent transition-colors line-clamp-2">{news.title}</h3>
                                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/5"><span className="text-xs text-slate-500">{formatTime(news.createdAt)}</span><ArrowRight size={16} className="text-slate-400 group-hover:text-teal-accent group-hover:translate-x-1 transition-all" /></div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </>
        ) : (
            <div className="p-10 text-center text-slate-500 border border-white/10 rounded-xl mb-10">No Featured Market Intelligence marked in Admin.</div>
        )}

        {/* --- LOWER SECTION: GLOBAL FEED + DEEP DIVE --- */}
        <div className="mb-16">
            <div className="flex items-center justify-between mb-8"><h2 className="text-2xl font-bold text-white flex items-center gap-2"><Globe className="text-teal-accent" /> Global Market Feed</h2><div className="h-[1px] flex-grow bg-white/10 ml-4"></div></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* LEFT: Global Feed (Business News List) */}
                <div className="lg:col-span-2 flex flex-col gap-4">
                    {feedNewsList.length > 0 ? feedNewsList.map((news) => (
                        <Link href={`/news/${news.slug}`} key={news._id} className="group flex items-start gap-4 p-5 bg-navy-light/20 border border-white/5 rounded-xl hover:bg-navy-light/50 hover:border-teal-accent/30 transition-all cursor-pointer">
                            <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                                <img src={news.imageUrl || "https://placehold.co/200x200/112240/64FFDA?text=No+Image"} className="w-full h-full object-cover opacity-80 group-hover:opacity-100" />
                            </div>
                            <div className="flex-grow">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-xs text-teal-accent uppercase tracking-wider font-semibold">{news.category}</span>
                                    <span className="text-xs text-slate-600 flex items-center gap-1"><Clock size={10} /> {formatTime(news.createdAt)}</span>
                                </div>
                                <h3 className="text-lg font-bold text-white group-hover:text-teal-accent transition-colors font-serif leading-snug">{news.title}</h3>
                                <p className="text-slate-400 text-sm mt-2 line-clamp-2">{news.summary || "Click to read more..."}</p>
                            </div>
                        </Link>
                    )) : (
                        <p className="text-slate-500 text-sm p-5 border border-white/10 rounded-xl">No stories in Global Feed yet.</p>
                    )}
                </div>

                {/* 🔥 RIGHT: Deep Dive Sidebar (World News - Max 3) */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <div className="bg-gradient-to-b from-navy-light to-navy-dark border border-white/10 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Zap className="text-orange-accent" /> Deep Dive (World)</h3>
                        
                        <div className="space-y-6">
                            {deepDiveList.length > 0 ? deepDiveList.map((news) => (
                                <Link href={`/news/${news.slug}`} key={news._id} className="group block">
                                    <div className="h-32 rounded-lg overflow-hidden mb-3 relative border border-white/5">
                                        <img src={news.imageUrl || "https://placehold.co/600x400/112240/64FFDA?text=World"} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur px-2 py-1 rounded text-[10px] text-white font-bold uppercase">World</div>
                                    </div>
                                    <h4 className="text-white font-bold leading-snug group-hover:text-orange-accent transition-colors text-sm line-clamp-2">
                                        {news.title}
                                    </h4>
                                    <div className="mt-2 h-[1px] w-full bg-white/5 group-hover:bg-orange-accent/50 transition-colors"></div>
                                </Link>
                            )) : (
                                <p className="text-slate-500 text-xs">No World news available for Deep Dive.</p>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
      </div>
      <style jsx global>{`
        @keyframes marquee-slow { 0% { transform: translateX(0); } 100% { transform: translateX(-100%); } }
        .animate-marquee-slow { animation: marquee-slow 120s linear infinite; }
        .pause-animation:hover { animation-play-state: paused; }
        .group:hover .animate-marquee-slow { animation-play-state: paused; }
      `}</style>
    </div>
  );
}