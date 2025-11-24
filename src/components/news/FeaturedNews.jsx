"use client"; // Client component for state and timer

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AISummaryBox } from './AISummaryBox';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const FeaturedNews = ({ articles = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Safety check: if no articles, don't render
  if (!articles || articles.length === 0) return null;

  // --- Auto-Play Logic ---
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === articles.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change every 5 seconds (2s is too fast for reading)

    return () => clearInterval(timer); // Cleanup on unmount
  }, [articles.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === articles.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? articles.length - 1 : prev - 1));
  };

  const currentArticle = articles[currentIndex];

  return (
    <section className="mb-16 relative group">
      {/* --- Main Container --- */}
      <div className="relative bg-navy-light rounded-2xl shadow-2xl overflow-hidden border border-teal-accent/30 h-[500px] md:h-[550px] flex flex-col md:flex-row transition-all duration-500">
        
        {/* --- Image Side (Left/Top) --- */}
        <div className="w-full md:w-3/5 h-64 md:h-full relative overflow-hidden">
          {/* Image overlay gradient for better text visibility if needed */}
          <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/80 to-transparent md:bg-gradient-to-r md:from-transparent md:to-navy-dark/90 z-10" />
          
          <img
            src={currentArticle.imageUrl || 'https://placehold.co/800x600/0A192F/E6F1FF?text=NovaNews'}
            alt={currentArticle.title}
            className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
          />
          
          {/* Category Badge (Overlay) */}
          <div className="absolute top-4 left-4 z-20 bg-teal-accent text-navy-dark font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider shadow-lg">
            {currentArticle.category}
          </div>
        </div>

        {/* --- Content Side (Right/Bottom) --- */}
        <div className="w-full md:w-2/5 p-6 md:p-10 flex flex-col justify-center relative z-20 bg-navy-light">
            
            {/* Featured Label */}
            <div className="flex items-center space-x-2 mb-4">
                <span className="h-1 w-8 bg-orange-accent rounded-full"></span>
                <span className="text-orange-accent text-xs font-bold uppercase tracking-widest">Top Story</span>
            </div>

            {/* Title with Animation Key */}
            <h2 key={currentArticle._id} className="font-serif text-2xl md:text-3xl font-bold text-white leading-tight mb-4 animate-fade-in">
                <Link href={`/news/${currentArticle.slug}`} className="hover:text-teal-accent transition-colors">
                    {currentArticle.title}
                </Link>
            </h2>

            <p className="text-text-secondary text-sm md:text-base line-clamp-3 mb-6">
                {currentArticle.excerpt}
            </p>

            {/* AI Summary (Optional in slider, kept small) */}
            {currentArticle.aiSummary && (
                <div className="mb-6 hidden md:block">
                    <AISummaryBox summary={currentArticle.aiSummary} sentiment={currentArticle.sentiment} />
                </div>
            )}

            {/* Read More Button */}
            <Link 
                href={`/news/${currentArticle.slug}`} 
                className="inline-flex items-center justify-center w-full md:w-auto px-6 py-3 bg-teal-accent hover:bg-white text-navy-dark font-bold rounded-lg transition-all duration-300 transform hover:-translate-y-1"
            >
                Read Full Story
            </Link>
        </div>

      </div>

      {/* --- Navigation Controls (Arrows) --- */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-teal-accent text-white hover:text-navy-dark rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 z-30"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-teal-accent text-white hover:text-navy-dark rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 z-30"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* --- Pagination Dots --- */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-30">
        {articles.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'w-8 bg-teal-accent' 
                : 'bg-gray-600 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>

    </section>
  );
};