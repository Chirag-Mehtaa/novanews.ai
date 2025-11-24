"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ChevronLeft, ChevronRight, Clock, ArrowRight, Hash, TrendingUp, Zap, Monitor, Film, Microscope, Loader2, FileText, Bell } from 'lucide-react';

const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });

// --- COMPONENT: MINI NEWS CARD ---
const MiniNewsCard = ({ article }) => {
  const categories = Array.isArray(article.category) ? article.category : [article.category];
  return (
    <Link href={`/news/${article.slug}`} className="group block h-full">
      <div className="w-[280px] h-[220px] bg-[#112240]/30 border border-[#e6f1ff]/5 rounded-xl overflow-hidden hover:border-[#64ffda]/40 transition-all duration-300 hover:shadow-lg hover:shadow-[#64ffda]/5 relative flex flex-col">
        <div className="h-32 overflow-hidden relative">
          <img 
             src={article.imageUrl || "https://placehold.co/600x400?text=No+Image"} 
             alt={article.title}
             className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
             onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x400?text=News"; }}
          />
          <div className="absolute top-2 left-2 flex gap-1">
             {categories.slice(0, 1).map((cat, i) => (
                 <span key={i} className="text-[10px] font-bold bg-black/60 backdrop-blur text-[#64ffda] px-2 py-0.5 rounded border border-[#64ffda]/20 uppercase tracking-wider">
                     {cat}
                 </span>
             ))}
          </div>
        </div>
        <div className="p-3 flex flex-col flex-grow relative">
           <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f]/80 to-transparent pointer-events-none" />
           <h3 className="relative text-sm font-bold text-[#e6f1ff] leading-snug line-clamp-2 group-hover:text-[#64ffda] transition-colors font-serif">
              {article.title}
           </h3>
           <div className="relative mt-auto flex items-center gap-2 text-[10px] text-[#8892b0] pt-2">
               <Clock size={10} />
               <span>{formatDate(article.createdAt || new Date())}</span>
           </div>
        </div>
      </div>
    </Link>
  );
};

// --- COMPONENT: TICKER ROW ---
const CategoryTicker = ({ title, icon: Icon, articles = [], speed = "50s", reverse = false }) => {
  if (!articles || articles.length === 0) return null;
  return (
    <div className="mb-12 relative">
        <div className="flex items-center gap-2 mb-4 px-4 sm:px-0">
            <div className="p-1.5 rounded bg-[#64ffda]/10"><Icon size={18} className="text-[#64ffda]" /></div>
            <h2 className="text-lg font-bold text-[#e6f1ff] tracking-tight">{title}</h2>
            <div className="h-[1px] flex-grow bg-gradient-to-r from-[#64ffda]/20 to-transparent ml-4"></div>
        </div>
        <div className="group relative flex overflow-hidden -mx-4 sm:mx-0 sm:rounded-l-xl">
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#0a192f] to-transparent z-10 pointer-events-none"></div>
            <div className={`flex gap-4 animate-marquee hover:pause ${reverse ? 'animate-marquee-reverse' : ''}`} style={{ animationDuration: speed }}>
                {[...articles, ...articles, ...articles].slice(0, 15).map((article, i) => (
                    <div key={article._id + i} className="flex-shrink-0 transform transition-transform duration-300 hover:scale-105 hover:z-20">
                        <MiniNewsCard article={article} />
                    </div>
                ))}
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#0a192f] to-transparent z-10 pointer-events-none"></div>
        </div>
    </div>
  );
};

// 🔥 MAIN CLIENT COMPONENT (No Loading State Here)
export default function FeaturedClient({ initialNews }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  
  // 🔥 FIX: Use Props Directly (No useState for news, No useEffect for fetching)
  const news = initialNews || [];

  // Filter Logic
  const filteredNews = news.filter(n => n.title.toLowerCase().includes(searchTerm.toLowerCase()));
  const realFeatured = filteredNews.filter(n => !!n.isFeatured);
  const featuredStories = realFeatured.length > 0 ? realFeatured : filteredNews.slice(0, 5);

  // Category Filters
  const filterByCat = (cat) => filteredNews.filter(n => n.category.includes(cat));
  const techNews = filterByCat('Technology');
  const businessNews = filterByCat('Business');
  const scienceNews = filterByCat('Science');
  const entNews = filterByCat('Entertainment');

  // Slider Auto-play
  useEffect(() => {
    if(featuredStories.length === 0) return;
    const interval = setInterval(() => setCurrentSlide(p => (p + 1) % featuredStories.length), 6000);
    return () => clearInterval(interval);
  }, [featuredStories.length]);

  const nextSlide = () => setCurrentSlide(p => (p + 1) % featuredStories.length);
  const prevSlide = () => setCurrentSlide(p => (p === 0 ? featuredStories.length - 1 : p - 1));

  // 🔥 Removed "if (loading) return <Loader />"

  return (
    <div className="min-h-screen bg-[#0a192f] text-[#ccd6f6] pt-0 pb-20 font-sans overflow-x-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* SEARCH */}
        <div className="mb-8 pt-6">
            <div className="relative group w-full">
                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search global news..." className="w-full bg-[#112240]/50 backdrop-blur-sm border border-slate-700/50 text-[#e6f1ff] px-5 py-3 pr-14 rounded-lg text-sm focus:border-[#64ffda] outline-none shadow-lg placeholder:text-[#8892b0]" />
                <button className="absolute right-1.5 top-1.5 bottom-1.5 bg-[#64ffda] hover:bg-[#64ffda]/80 text-[#0a192f] px-3 rounded-md flex items-center justify-center transition-colors"><Search size={18} /></button>
            </div>
        </div>

        {/* FEATURED SLIDER */}
        {featuredStories.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-16">
                
                {/* Slider */}
                <div className="lg:col-span-8">
                    <div className="inline-flex items-center gap-2 mb-3 w-fit"><h2 className="text-lg font-bold text-[#e6f1ff] flex items-center gap-2 italic"><Hash size={20} className="text-[#64ffda]" /> Featured</h2></div>
                    <div className="relative h-[500px] rounded-xl overflow-hidden group shadow-2xl border border-[#112240] bg-[#112240]/20">
                        {featuredStories.map((story, index) => (
                            <div key={story._id} className={`absolute inset-0 transition-all duration-700 ease-in-out ${index === currentSlide ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                                <Link href={`/news/${story.slug}`} className="block w-full h-full relative cursor-pointer">
                                    <img src={story.imageUrl || "https://placehold.co/800x600?text=No+Image"} alt={story.title} className={`w-full h-full object-cover transition-transform duration-[8000ms] ease-linear ${index === currentSlide ? 'scale-110' : 'scale-100'}`} onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/800x600?text=News"; }} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-[#0a192f]/20 to-transparent opacity-90"></div>
                                    <div className="absolute bottom-8 left-8 right-8 md:max-w-xl">
                                        <div className="backdrop-blur-md bg-[#0a192f]/60 border border-[#e6f1ff]/10 p-6 rounded-2xl shadow-xl animate-fade-in-up">
                                            <div className="flex gap-1 mb-2">
                                                {story.category.map((cat, i) => <span key={i} className="px-2 py-0.5 bg-[#64ffda] text-[#0a192f] text-[10px] font-extrabold uppercase rounded inline-block">{cat}</span>)}
                                            </div>
                                            <h1 className="text-2xl md:text-3xl font-bold text-[#e6f1ff] mb-3 leading-tight font-serif hover:text-[#64ffda] transition-colors">{story.title}</h1>
                                            <div className="text-[#64ffda] hover:text-[#e6f1ff] transition-colors flex items-center gap-1 text-sm font-bold">Read Now <ArrowRight size={14} /></div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                        <div className="absolute top-6 right-6 flex gap-2 z-20">
                             <button onClick={(e) => { e.preventDefault(); prevSlide(); }} className="p-2 rounded-full bg-black/40 text-[#e6f1ff] hover:bg-[#64ffda] hover:text-[#0a192f] backdrop-blur-sm border border-[#e6f1ff]/10"><ChevronLeft size={20} /></button>
                             <button onClick={(e) => { e.preventDefault(); nextSlide(); }} className="p-2 rounded-full bg-black/40 text-[#e6f1ff] hover:bg-[#64ffda] hover:text-[#0a192f] backdrop-blur-sm border border-[#e6f1ff]/10"><ChevronRight size={20} /></button>
                        </div>
                    </div>
                </div>

                {/* Trending Sidebar */}
                <div className="lg:col-span-4 flex flex-col">
                    <h2 className="text-lg font-bold text-[#e6f1ff] mb-3 flex items-center gap-2 italic"><TrendingUp size={18} className="text-[#64ffda]" /> Trending</h2>
                    <div className="flex flex-col gap-4 h-full overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
                        {featuredStories.map((story, idx) => (
                            <Link href={`/news/${story.slug}`} key={story._id} onMouseEnter={() => setCurrentSlide(idx)} className={`group flex-1 min-h-[100px] transition-opacity ${currentSlide === idx ? 'opacity-100 ring-1 ring-[#64ffda]' : 'opacity-70 hover:opacity-100'}`}>
                                <div className="relative h-full w-full rounded-lg overflow-hidden border border-[#112240] shadow-lg bg-[#112240]/30 flex">
                                    <div className="w-1/3 h-full relative"><img src={story.imageUrl || "https://placehold.co/400x300"} alt={story.title} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100" /></div>
                                    <div className="w-2/3 p-4 flex flex-col justify-center bg-[#112240]/40">
                                        <h3 className="text-sm font-bold text-[#e6f1ff] leading-snug line-clamp-2 group-hover:text-[#64ffda]">{story.title}</h3>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center py-20 opacity-50">
                <FileText size={64} className="text-[#64ffda] mb-4"/>
                <h3 className="text-xl font-bold">No News Found</h3>
            </div>
        )}

        {/* Categories */}
        <CategoryTicker title="Latest News" icon={Zap} articles={filteredNews.slice(0, 10)} speed="55s" />
        <CategoryTicker title="Technology" icon={Monitor} articles={techNews} speed="60s" />
        <CategoryTicker title="Business" icon={TrendingUp} articles={businessNews} speed="65s" reverse={true} />
        <CategoryTicker title="Science" icon={Microscope} articles={scienceNews} speed="70s" reverse={true} />
        <CategoryTicker title="Entertainment" icon={Film} articles={entNews} speed="50s" />

      </div>
      <style jsx global>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes marquee-reverse { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }
        .animate-marquee { animation: marquee linear infinite; }
        .animate-marquee-reverse { animation: marquee-reverse linear infinite; }
        .hover\\:pause:hover { animation-play-state: paused; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #0a192f; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #112240; border-radius: 10px; }
      `}</style>
    </div>
  );
}