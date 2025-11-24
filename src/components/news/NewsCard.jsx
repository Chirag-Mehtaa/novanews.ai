import React from 'react';
import Link from 'next/link'; // Remember to uncomment this in real project
import { AISummaryBox } from './AISummaryBox';
import { ArrowRight, Clock } from 'lucide-react';

// Helper for Mock Link
// const Link = ({ href, children, className }) => <a href={href} className={className}>{children}</a>;

export const NewsCard = ({ article }) => {
  return (
    <div className="group relative flex flex-col h-full bg-navy-light/40 border border-white/5 rounded-2xl overflow-hidden hover:bg-navy-light/60 hover:border-teal-accent/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-teal-accent/5">
      
      {/* Image Container */}
      <div className="relative w-full h-48 overflow-hidden">
        <img
          src={article.imageUrl || 'https://placehold.co/600x400/0A192F/E6F1FF?text=NovaNews'}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/90 to-transparent opacity-60" />
        
        {/* Category Badge on Image */}
        <span className="absolute top-3 left-3 bg-navy-dark/80 backdrop-blur-md text-teal-accent text-[10px] font-bold uppercase px-3 py-1 rounded-full border border-teal-accent/20 shadow-lg">
            {article.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex-grow">
            {/* Date (Optional) */}
            <div className="flex items-center gap-2 text-slate-500 text-xs mb-2">
                <Clock size={12} />
                <span>{new Date(article.publishedAt || Date.now()).toLocaleDateString()}</span>
            </div>

            {/* Title */}
            <Link href={`/news/${article.slug}`} className="block">
                <h3 className="font-serif text-lg font-bold text-white leading-snug group-hover:text-teal-accent transition-colors line-clamp-2 mb-3">
                {article.title}
                </h3>
            </Link>
            
            {/* Excerpt */}
            <p className="text-slate-400 text-sm line-clamp-2 mb-4">
                {article.excerpt}
            </p>

            {/* AI Summary */}
            {article.aiSummary && (
                <div className="mt-auto">
                    <AISummaryBox summary={article.aiSummary} sentiment={article.sentiment} />
                </div>
            )}
        </div>
        
        {/* Footer Link */}
        <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
          <Link href={`/news/${article.slug}`} className="inline-flex items-center gap-2 text-xs font-bold text-teal-accent uppercase tracking-wider hover:gap-3 transition-all">
            Read Story <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};