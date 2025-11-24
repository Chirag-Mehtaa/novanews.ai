"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link'; // RESTORED THIS
import { ArrowRight, ChevronLeft, ChevronRight, Clock } from 'lucide-react';

export const WorldFeaturedSlider = ({ articles = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  if (!articles.length) return null;

  const currentArticle = articles[currentIndex];

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);
    setCurrentIndex((prev) => (prev === articles.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);
    setCurrentIndex((prev) => (prev === 0 ? articles.length - 1 : prev - 1));
  };

  return (
    // h-[calc(100vh-64px)] ensures it takes full screen minus navbar height
    <div className="relative w-full h-[calc(100vh-64px)] overflow-hidden bg-navy-dark group font-sans">
      
      {/* --- 1. Cinematic Background Layer --- */}
      <div className="absolute inset-0 z-0">
         <div 
            key={currentArticle._id} 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] ease-out transform scale-100 animate-slow-zoom"
            style={{ backgroundImage: `url(${currentArticle.imageUrl})` }}
         >
            {/* Gradients for readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-navy-dark/90 via-navy-dark/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-transparent to-transparent opacity-80" />
         </div>
      </div>

      {/* --- 2. Floating Glass Card --- */}
      <div className="absolute inset-0 z-10 flex items-center px-4 sm:px-8 lg:px-16">
        
        <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-end md:items-center justify-between h-full pb-12 md:pb-0">
            
            {/* Content Card */}
            <div 
                key={currentArticle._id} 
                className="w-full md:w-1/2 lg:w-5/12 animate-slide-up-fade"
            >
                <div className="relative p-8 md:p-10 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50 overflow-hidden">
                    
                    {/* Decor Blob */}
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-teal-accent/20 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="flex items-center space-x-3 mb-6 relative z-10">
                        <span className="px-3 py-1 bg-teal-accent text-navy-dark text-xs font-bold uppercase tracking-widest rounded-sm">
                            {currentArticle.category}
                        </span>
                        <span className="text-gray-400 text-xs flex items-center">
                             <Clock className="w-3 h-3 mr-1" />
                             {new Date(currentArticle.publishedAt).toLocaleDateString()}
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white leading-tight mb-6 relative z-10 drop-shadow-lg">
                        {currentArticle.title}
                    </h1>

                    <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-8 border-l-2 border-teal-accent/50 pl-4 relative z-10 line-clamp-3">
                        {currentArticle.excerpt}
                    </p>

                    <div className="relative z-10">
                        {/* CHANGED: Used Link component for faster navigation */}
                        <Link 
                            href={`/news/${currentArticle.slug}`} 
                            className="group inline-flex items-center text-white font-semibold hover:text-teal-accent transition-colors"
                        >
                            <span className="border-b-2 border-teal-accent pb-1">Read Full Story</span>
                            <ArrowRight className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Navigation Controls (Desktop) */}
            <div className="hidden md:flex flex-col space-y-4 items-center ml-8">
                 {/* Vertical Indicators */}
                 <div className="flex flex-col space-y-3 mb-6">
                    {articles.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-1.5 transition-all duration-500 rounded-full ${
                            index === currentIndex 
                                ? 'h-8 bg-teal-accent shadow-[0_0_10px_rgba(100,255,218,0.6)]' 
                                : 'h-1.5 bg-white/20 hover:bg-white/40'
                            }`}
                        />
                    ))}
                </div>

                {/* Arrow Buttons */}
                <div className="flex flex-col space-y-2">
                     <button 
                        onClick={handlePrev}
                        className="p-3 rounded-full border border-white/10 bg-white/5 hover:bg-teal-accent hover:text-navy-dark hover:border-teal-accent text-white transition-all duration-300"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button 
                        onClick={handleNext}
                        className="p-3 rounded-full border border-white/10 bg-white/5 hover:bg-teal-accent hover:text-navy-dark hover:border-teal-accent text-white transition-all duration-300"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
      </div>

      {/* Navigation Controls (Mobile) */}
      <div className="absolute bottom-6 right-6 flex md:hidden space-x-4 z-20">
          <button onClick={handlePrev} className="p-3 rounded-full bg-black/40 text-white backdrop-blur-sm border border-white/10">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={handleNext} className="p-3 rounded-full bg-black/40 text-white backdrop-blur-sm border border-white/10">
            <ChevronRight className="w-5 h-5" />
          </button>
      </div>

      <style jsx>{`
        @keyframes slide-up-fade {
            0% { opacity: 0; transform: translateY(30px); }
            100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes slow-zoom {
            from { transform: scale(1); }
            to { transform: scale(1.1); }
        }
        .animate-slide-up-fade {
            animation: slide-up-fade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-slow-zoom {
            animation: slow-zoom 10s linear forwards;
        }
      `}</style>

    </div>
  );
};