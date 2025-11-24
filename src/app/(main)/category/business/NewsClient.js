"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Clock, TrendingUp, Star, Globe, ArrowRight, Zap, ChevronRight, PlusCircle, ChevronDown, ChevronUp, CheckCircle, TrendingDown, Loader2 } from 'lucide-react';

const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

// --- MOCK MARKET DATA (Keep generic data here) ---
const marketData = [
  { name: "NIFTY 50", value: "22,145.65", change: "+0.85%", isUp: true },
  { name: "SENSEX", value: "73,256.10", change: "+0.72%", isUp: true },
  { name: "BANK NIFTY", value: "46,890.30", change: "-0.12%", isUp: false },
  { name: "USD/INR", value: "83.12", change: "+0.05%", isUp: true },
  { name: "NASDAQ", value: "16,085.11", change: "+1.14%", isUp: true },
  { name: "BTC/USD", value: "$67,450.00", change: "+3.45%", isUp: true },
];

const MarketTicker = () => {
  return (
    <div className="w-full bg-[#0a192f] border-b border-[#233554] overflow-hidden relative z-20">
      <div className="flex whitespace-nowrap animate-marquee hover:pause" style={{ animationDuration: '60s' }}>
        {[...marketData, ...marketData].map((item, i) => (
          <div key={i} className="inline-flex items-center gap-3 px-6 py-2 border-r border-[#233554]/50">
            <span className="text-[#8892b0] text-xs font-bold tracking-wider">{item.name}</span>
            <div className="flex items-center gap-1">
              <span className="text-[#e6f1ff] text-xs font-mono font-medium">{item.value}</span>
              <span className={`text-[10px] font-bold flex items-center ${item.isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                {item.isUp ? <TrendingUp size={10} className="mr-0.5" /> : <TrendingDown size={10} className="mr-0.5" />}
                {item.change}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- MAIN CLIENT COMPONENT ---
export default function NewsClient({ initialNews }) {
  // Direct props se data filter karo (No Loading State needed initially)
  const businessStories = initialNews.filter(item => {
      if (Array.isArray(item.category)) return item.category.includes('Business');
      return item.category === 'Business';
  });

  const [marketIntel] = useState(businessStories.filter(item => item.isFeatured === true));
  const [globalFeed] = useState(businessStories.filter(item => !item.isFeatured));
  
  // --- VIEW STATE ---
  const [showAllIntel, setShowAllIntel] = useState(false); 
  const [globalVisibleCount, setGlobalVisibleCount] = useState(6); 

  // --- HELPER COMPONENTS ---
  const HeroCard = ({ article }) => (
    <Link href={`/news/${article.slug}`} className="group relative h-full min-h-[450px] w-full rounded-2xl overflow-hidden border border-[#233554] hover:border-[#64ffda] transition-all shadow-2xl block bg-[#112240]">
        <img src={article.imageUrl || "https://placehold.co/800x600?text=Business"} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-70 group-hover:opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-[#0a192f]/50 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
            <div className="mb-3 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 bg-[#64ffda] text-[#0a192f] px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider"><Star size={10} fill="currentColor" /> Market Intel</span>
                <span className="text-[#8892b0] text-xs flex items-center gap-1 bg-[#112240]/80 px-2 py-0.5 rounded backdrop-blur-sm"><Clock size={10} /> {formatDate(article.createdAt)}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#e6f1ff] mb-3 leading-tight group-hover:text-[#64ffda] transition-colors font-serif">{article.title}</h2>
            <p className="text-gray-300 line-clamp-2 text-sm md:text-base mb-4 max-w-xl border-l-2 border-[#64ffda] pl-3">{article.summary}</p>
            <div className="text-[#64ffda] text-xs font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">READ ANALYSIS <ArrowRight size={12}/></div>
        </div>
    </Link>
  );

  const SideListItem = ({ article }) => (
    <Link href={`/news/${article.slug}`} className="flex gap-4 p-4 rounded-xl bg-[#112240]/40 border border-[#233554] hover:bg-[#112240] hover:border-[#64ffda]/50 transition-all group">
        <div className="w-24 h-20 rounded-lg overflow-hidden flex-shrink-0 relative border border-[#233554]/50">
            <img src={article.imageUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="flex flex-col justify-between py-0.5">
            <h3 className="font-bold text-[#e6f1ff] text-sm leading-snug mb-1 group-hover:text-[#64ffda] transition-colors line-clamp-2">{article.title}</h3>
            <div className="text-[10px] text-[#8892b0] flex items-center gap-2"><Clock size={10} /> {formatDate(article.createdAt)}</div>
        </div>
    </Link>
  );

  const sideListItems = showAllIntel ? marketIntel.slice(1) : marketIntel.slice(1, 4);
  const hasMoreIntel = marketIntel.length > 4;

  return (
    <div className="min-h-screen bg-[#0a192f] text-[#ccd6f6] pt-16 pb-20 font-sans">
      <MarketTicker />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#233554] pb-6">
            <div className="flex items-center gap-4">
                <div className="p-3.5 bg-[#112240] border border-[#233554] rounded-2xl shadow-lg"><TrendingUp className="text-[#64ffda]" size={32} /></div>
                <div>
                    <div className="text-[#64ffda] text-xs font-bold tracking-widest uppercase mb-1">NOVA BUSINESS</div>
                    <h1 className="text-4xl md:text-5xl font-bold text-[#e6f1ff] tracking-tight">Market <span className="text-[#64ffda]">Intelligence</span></h1>
                </div>
            </div>
        </div>

        {/* --- SECTION 1: MARKET INTELLIGENCE --- */}
        <div className="mb-20">
            {marketIntel.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-8 h-full"><HeroCard article={marketIntel[0]} /></div>
                    <div className="lg:col-span-4 flex flex-col">
                        <div className="flex items-center justify-between px-1 mb-2 border-b border-[#233554] pb-2">
                            <h3 className="text-[#e6f1ff] font-bold text-lg flex items-center gap-2"><Zap size={16} className="text-yellow-400"/> Top Stories</h3>
                            {marketIntel.length > 1 && (
                                <button onClick={() => setShowAllIntel(!showAllIntel)} className={`text-[11px] font-bold px-3 py-1 rounded-full border transition-all flex items-center gap-1 ${hasMoreIntel ? "text-[#64ffda] hover:text-[#0a192f] bg-[#112240] hover:bg-[#64ffda] border-[#64ffda]/30 hover:border-[#64ffda]" : "text-gray-500 border-transparent cursor-default"}`} disabled={!hasMoreIntel}>
                                    {hasMoreIntel ? (showAllIntel ? "Show Less" : "View All") : "Showing Top 3"} 
                                    {hasMoreIntel && (showAllIntel ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
                                </button>
                            )}
                        </div>
                        <div className={`flex flex-col gap-3 transition-all duration-300 ${showAllIntel ? 'max-h-[600px] overflow-y-auto pr-2 custom-scrollbar' : ''}`}>
                            {sideListItems.map(item => <SideListItem key={item._id} article={item} />)}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="h-64 flex flex-col items-center justify-center border border-dashed border-[#233554] rounded-2xl bg-[#112240]/30 text-[#8892b0]"><TrendingUp size={48} className="mb-4 opacity-50" /><p>No Featured Market Intelligence available right now.</p></div>
            )}
        </div>

        {/* --- SECTION 2: GLOBAL FEED --- */}
        <div>
            <div className="flex items-center justify-between mb-8 border-b border-[#233554] pb-4">
                <div className="flex items-center gap-3">
                    <Globe className="text-[#64ffda]" size={24} /><h2 className="text-2xl font-bold text-[#e6f1ff]">Global Market Feed</h2>
                    <span className="bg-[#233554] text-[#8892b0] text-xs px-2 py-0.5 rounded-full">{globalFeed.length}</span>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {globalFeed.length > 0 ? globalFeed.slice(0, globalVisibleCount).map((article) => (
                    <Link href={`/news/${article.slug}`} key={article._id} className="flex flex-col bg-[#112240] border border-[#233554] rounded-xl overflow-hidden hover:border-[#64ffda]/50 hover:shadow-lg hover:shadow-[#64ffda]/5 transition-all group h-full">
                        <div className="h-48 overflow-hidden relative">
                            <img src={article.imageUrl || "https://placehold.co/400x300"} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100" />
                        </div>
                        <div className="p-5 flex flex-col flex-grow">
                            <h3 className="text-lg font-bold text-[#e6f1ff] leading-snug mb-3 group-hover:text-[#64ffda] transition-colors line-clamp-2 font-serif">{article.title}</h3>
                            <p className="text-sm text-[#8892b0] line-clamp-3 mb-4 flex-grow">{article.summary}</p>
                            <div className="pt-4 border-t border-[#233554] flex items-center justify-between text-xs text-[#8892b0]">
                                <span className="flex items-center gap-1"><Clock size={12}/> {formatDate(article.createdAt)}</span>
                                <span className="text-[#64ffda] font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">Read <ArrowRight size={10}/></span>
                            </div>
                        </div>
                    </Link>
                )) : ( <div className="col-span-full p-12 text-center border border-dashed border-[#233554] rounded-xl text-[#8892b0] bg-[#112240]/30"><Globe size={32} className="mx-auto mb-3 opacity-50"/>No stories in Global Feed yet.</div> )}
            </div>

            {/* Load More Button */}
            <div className="flex justify-center pt-4">
                {globalFeed.length > globalVisibleCount ? (
                    <button onClick={() => setGlobalVisibleCount(prev => prev + 6)} className="group px-8 py-3 bg-[#112240] hover:bg-[#64ffda] text-[#64ffda] hover:text-[#0a192f] border border-[#64ffda] rounded-full font-bold transition-all flex items-center gap-2 shadow-lg hover:shadow-[#64ffda]/20">Load More Stories <PlusCircle size={18} className="group-hover:rotate-90 transition-transform"/></button>
                ) : (globalFeed.length > 0 && <div className="text-gray-500 text-sm flex items-center gap-2 bg-[#112240]/50 px-4 py-2 rounded-full border border-[#233554]"><CheckCircle size={16} /> You're all caught up!</div>)}
            </div>
        </div>
      </div>
      <style jsx global>{` @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } } .animate-marquee { animation: marquee linear infinite; } .hover\\:pause:hover { animation-play-state: paused; } .custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-track { background: #112240; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #64ffda; border-radius: 10px; } `}</style>
    </div>
  );
}