"use client";
import React from 'react';
import Link from 'next/link';
import { ArrowRight, Zap, Globe, Cpu, Eye, Bell, ChevronRight, TrendingUp, Star, Clock } from 'lucide-react';
import ThreeJSGlobe from '@/components/globe/ThreeJSGlobe';
import { NewsTicker } from '@/components/news/NewsTicker';

// --- COMPONENTS ---
const MarketStrip = () => {
  const marketData = [
    { symbol: "BTC", price: "$94,230", change: "+2.4%", up: true },
    { symbol: "ETH", price: "$3,450", change: "+1.1%", up: true },
    { symbol: "NASDAQ", price: "18,920", change: "-0.5%", up: false },
    { symbol: "GOLD", price: "$2,640", change: "+0.2%", up: true },
    { symbol: "NIFTY", price: "24,800", change: "+0.8%", up: true },
    { symbol: "TSLA", price: "$340", change: "-1.2%", up: false },
    { symbol: "NVDA", price: "$145", change: "+3.5%", up: true },
  ];
  const loopData = [...marketData, ...marketData, ...marketData, ...marketData];
  
  return (
    <div className="w-full bg-[#0A192F]/90 backdrop-blur-md border-b border-white/10 h-9 flex items-center overflow-hidden text-[11px] font-mono tracking-wider z-50 relative text-gray-300">
      <div className="flex animate-marquee whitespace-nowrap gap-10 items-center pl-4 hover:[animation-play-state:paused]" style={{ animationDuration: '100s' }}>
        {loopData.map((stock, i) => (
          <div key={i} className="flex items-center gap-2 shrink-0">
            <span className="font-bold text-teal-400">{stock.symbol}</span>
            <span className="text-white">{stock.price}</span>
            <span className={stock.up ? "text-emerald-400" : "text-rose-400"}>{stock.change}</span>
            <span className={`w-0 h-0 border-l-[3px] border-r-[3px] border-b-[4px] border-transparent ${stock.up ? "border-b-emerald-400" : "border-t-rose-400 border-b-0"}`}></span>
          </div>
        ))}
      </div>
    </div>
  );
};

const NovaProAd = () => (
  <div className="relative w-full rounded-3xl overflow-hidden my-20 group cursor-pointer border border-white/10">
    <div className="absolute inset-0 bg-gradient-to-r from-purple-900 via-blue-900 to-teal-900 animate-gradient-x opacity-80"></div>
    <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-10 md:p-16">
      <div className="max-w-2xl text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-2 text-teal-400 font-mono text-xs font-bold tracking-widest mb-4">
          <Star size={14} className="fill-current animate-pulse" /> NOVA_PRIME_ACCESS
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight font-serif">See the Future <br/> Before it Happens.</h2>
        <button className="flex items-center gap-3 px-8 py-4 bg-white text-[#0A192F] font-bold rounded-full hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.3)] mx-auto md:mx-0">Start Free Trial <ArrowRight size={20} /></button>
      </div>
    </div>
  </div>
);

// 🔥 MAIN UI COMPONENT
export default function HomeUI({ data }) {
  const featuredStory = data.latest?.[0] || null;
  const sideStories = data.latest?.slice(1, 4) || [];
  const tickerData = data.latest || [];

  return (
    <div className="min-h-screen bg-[#0A192F] text-white font-sans overflow-x-hidden selection:bg-teal-400 selection:text-[#0A192F]">
      <MarketStrip />

      {/* Hero Section */}
      <div className="relative pt-8 pb-12 lg:pt-16 lg:pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 z-10 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-400/10 border border-teal-400/20 text-teal-400 text-xs font-bold uppercase tracking-widest mb-6 animate-fade-in">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping"></span> Live System V4.0
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-6 font-serif">
                Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">Global News</span> <br/> in Real-Time
              </h1>
              <p className="text-lg text-gray-400 max-w-xl mb-8 leading-relaxed border-l-0 lg:border-l-2 border-white/10 lg:pl-6 mx-auto lg:mx-0">
                Spin the globe, discover hotspots, and dive into AI-summarized stories.
              </p>
            </div>
            <div className="lg:w-1/2 h-[50vh] lg:h-[600px] w-full relative mt-10 lg:mt-0 flex items-center justify-center">
               <div className="w-full h-full relative z-10">
                  {/* Data passed directly */}
                  <ThreeJSGlobe newsData={data.globe} /> 
               </div>
            </div>
          </div>
        </div>
      </div>

      <div id="latest-news" className="border-y border-white/5 bg-white/5 backdrop-blur-sm mb-20">
         <NewsTicker articles={tickerData} />
      </div>

      <div id="featured" className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex items-end justify-between mb-10">
           <div><h2 className="text-3xl font-bold text-white flex items-center gap-3"><Cpu className="text-teal-400" /> Top Headlines</h2></div>
           <Link href="/category/world" className="text-teal-400 text-sm font-bold flex items-center gap-1 hover:underline">View All News <ChevronRight size={16} /></Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:h-[550px]">
            {featuredStory ? (
            <Link href={`/news/${featuredStory.slug}`} className="lg:col-span-7 relative group rounded-3xl overflow-hidden border border-white/10 bg-gray-900 shadow-2xl h-96 lg:h-full">
               {featuredStory.imageUrl && <img src={featuredStory.imageUrl} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-all duration-700 scale-100 group-hover:scale-105" />}
               <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-[#0A192F]/40 to-transparent"></div>
               <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
                  <span className="text-teal-400 font-bold tracking-widest text-xs uppercase mb-3 block">{featuredStory.category}</span>
                  <h3 className="text-2xl md:text-4xl font-bold text-white mb-4 font-serif leading-tight group-hover:text-teal-400 transition-colors">{featuredStory.title}</h3>
                  <p className="text-gray-300 text-sm md:text-lg line-clamp-2 mb-6 max-w-xl hidden md:block">{featuredStory.summary}</p>
               </div>
            </Link>
            ) : <div className="lg:col-span-7 h-full flex items-center justify-center border border-white/10 rounded-3xl text-gray-500 bg-white/5">No News</div>}

            <div className="lg:col-span-5 flex flex-col gap-4 h-full">
               {sideStories.map((story) => (
                 <Link href={`/news/${story.slug}`} key={story._id} className="flex-1 relative group rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-teal-400/30 transition-all min-h-[140px]">
                    <div className="absolute inset-0 flex">
                       <div className="w-1/3 h-full relative overflow-hidden bg-gray-800">
                          {story.imageUrl && <img src={story.imageUrl} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all duration-500" />}
                       </div>
                       <div className="w-2/3 p-5 flex flex-col justify-center">
                          <span className="text-[10px] font-bold text-gray-400 uppercase mb-1 flex items-center gap-2"><span className="w-1.5 h-1.5 bg-teal-400 rounded-full"></span> {story.category}</span>
                          <h4 className="text-base font-bold text-white leading-snug group-hover:text-teal-400 transition-colors line-clamp-2">{story.title}</h4>
                       </div>
                    </div>
                 </Link>
               ))}
               <div className="flex-1 bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-2xl border border-white/10 p-5 flex items-center justify-between">
                  <div><h4 className="text-white font-bold text-lg mb-1">Daily Briefing</h4><p className="text-xs text-gray-400">Subscribe for alerts.</p></div>
                  <button className="bg-white/10 hover:bg-white hover:text-[#0A192F] text-white p-3 rounded-full transition-all border border-white/10"><Bell size={20} /></button>
               </div>
            </div>
        </div>
        <NovaProAd />
      </div>
      <style jsx global>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee linear infinite; }
      `}</style>
    </div>
  );
}