"use client";

import React from 'react';
import { NewsCard } from './NewsCard';
import { TrendingUp } from 'lucide-react';

export const NewsTicker = ({ articles }) => {
  return (
    <section id="latest-news" className="relative w-full py-10 overflow-hidden bg-navy-dark">
        
        {/* Section Header */}
        <div className="container mx-auto px-4 mb-8 flex items-center gap-3">
            <div className="p-2 bg-teal-accent/10 rounded-lg">
                <TrendingUp className="text-teal-accent w-6 h-6" />
            </div>
            <h2 className="text-3xl font-bold text-white font-serif">
              Latest <span className="text-teal-accent">Headlines</span>
            </h2>
        </div>
        
        {/* Floating Animation Container */}
        <div className="group relative flex overflow-hidden py-4">
           {/* Inner wrapper that animates */}
           <div className="flex animate-marquee gap-6 hover:pause pl-4">
              {/* Original List */}
              {articles.map(article => (
                <div key={article._id} className="w-[320px] flex-shrink-0 transform transition-all duration-300 hover:scale-[1.02] hover:z-10">
                  <NewsCard article={article} />
                </div>
              ))}
              
              {/* Duplicate List (for infinite loop) */}
              {articles.map(article => (
                <div key={`${article._id}-dup`} className="w-[320px] flex-shrink-0 transform transition-all duration-300 hover:scale-[1.02] hover:z-10">
                  <NewsCard article={article} />
                </div>
              ))}
           </div>
        </div>
        
        {/* Fade Edges (Vignette) */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-navy-dark to-transparent pointer-events-none z-20"></div>
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-navy-dark to-transparent pointer-events-none z-20"></div>

        {/* Custom Styles */}
        <style jsx global>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee 60s linear infinite; /* Slowed down slightly for readability */
          }
          .hover\\:pause:hover {
            animation-play-state: paused;
          }
        `}</style>
      </section>
  );
};