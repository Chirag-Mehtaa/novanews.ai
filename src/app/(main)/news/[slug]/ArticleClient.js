'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Clock, Share2, Bookmark, 
  Facebook, Twitter, Linkedin, Tag,
  Bot, Sparkles, Minus, TrendingUp, TrendingDown
} from 'lucide-react';
import Link from 'next/link';

// 👇 FIX: Curly braces { } wapis laga diye hain
import { CommentSection } from './CommentSection'; 
import ScrollToTop from '@/components/ScrollToTop'; 

// Helper to format date
const formatDate = (dateString) => {
    if(!dateString) return "";
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

// --- Sentiment Badge Component ---
const SentimentBadge = ({ sentiment }) => {
  let styles = 'bg-slate-700/50 text-slate-300 border-slate-600';
  let icon = <Minus className="w-3 h-3" />;
  let label = sentiment || 'Neutral';

  if (sentiment === 'Positive') {
    styles = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    icon = <TrendingUp className="w-3 h-3" />;
  } else if (sentiment === 'Negative') {
    styles = 'bg-red-500/10 text-red-400 border-red-500/30';
    icon = <TrendingDown className="w-3 h-3" />;
  }

  return (
    <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${styles}`}>
      {icon}
      <span>{label}</span>
    </div>
  );
};

// --- AI Summary Component ---
const AISummaryBox = ({ summary, sentiment }) => {
  return (
    <div className="relative overflow-hidden rounded-xl border border-teal-400/30 bg-[#112240]/50 backdrop-blur-sm p-6 my-8 shadow-lg shadow-teal-400/5">
      <div className="absolute top-0 right-0 w-20 h-20 bg-teal-400/10 rounded-bl-full -mr-10 -mt-10"></div>
      <div className="absolute bottom-0 left-0 w-16 h-1 border-b-2 border-l-2 border-teal-400/20 rounded-bl-xl"></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 text-teal-400">
            <Bot className="w-6 h-6" />
            <span className="font-serif font-bold tracking-wider text-lg">NOVA AI INSIGHT</span>
          </div>
          <SentimentBadge sentiment={sentiment} />
        </div>

        <div className="flex items-start space-x-3">
          <Sparkles className="w-5 h-5 text-orange-400 mt-1 shrink-0 animate-pulse" />
          <p className="text-gray-300 text-lg leading-relaxed font-light">
            {summary}
          </p>
        </div>
        
        <div className="mt-4 flex justify-end">
          <span className="text-xs text-teal-400/60 font-mono">
            PROCESSED BY NOVA-LLM-V4 • {new Date().toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};

// --- Main Client Component ---
export default function ArticleClient({ news }) {
  // Mapping prop 'news' to 'article' to match your design logic
  const article = news;

  const [scrollProgress, setScrollProgress] = useState(0);

  // Scroll Progress Logic Only
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setScrollProgress(totalScroll / windowHeight);
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!article) return null; 

  return (
    <div className="min-h-screen bg-[#0A192F] text-[#E6F1FF] pt-24 pb-20 font-sans relative selection:bg-[#64FFDA]/30">
      
      {/* Auto Scroll To Top */}
      <ScrollToTop />

      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-50 bg-[#112240]">
          <div className="h-full bg-[#64ffda] shadow-[0_0_10px_#64FFDA]" style={{ width: `${scrollProgress * 100}%` }}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        
        {/* Navigation & Actions */}
        <div className="mb-8 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-[#8892B0] hover:text-[#64FFDA] transition-colors text-sm font-medium group">
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Feed
            </Link>
            <div className="flex gap-3">
                <button className="p-2.5 rounded-full bg-[#112240] border border-white/10 hover:border-[#64ffda] text-[#8892b0] hover:text-[#64ffda] transition-all"><Bookmark size={18} /></button>
                <button className="p-2.5 rounded-full bg-[#112240] border border-white/10 hover:border-[#64ffda] text-[#8892b0] hover:text-[#64ffda] transition-all"><Share2 size={18} /></button>
            </div>
        </div>

        {/* Article Header */}
        <header className="mb-10">
            <div className="flex items-center gap-3 mb-5">
                <span className="px-3 py-1 bg-[#64FFDA] text-[#0A192F] text-xs font-bold uppercase tracking-widest rounded-sm shadow-lg shadow-[#64FFDA]/20">
                    {Array.isArray(article.category) ? article.category[0] : article.category}
                </span>
                <span className="text-[#8892B0] text-xs flex items-center gap-1 font-medium"><Clock size={14} className="text-[#64FFDA]" /> {formatDate(article.createdAt)}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-white leading-tight mb-6">{article.title}</h1>
            
            {/* AI Summary Box */}
            {article.summary && (
                <div className="mb-8">
                    <AISummaryBox summary={article.summary} sentiment={article.sentiment || 'Neutral'} />
                </div>
            )}
            
            {/* Author Info */}
            <div className="flex items-center justify-between py-6 border-y border-white/10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#64FFDA] to-blue-600 flex items-center justify-center text-[#0A192F] font-bold text-lg shadow-lg">
                        {article.author ? article.author[0].toUpperCase() : "A"}
                    </div>
                    <div><div className="text-base font-bold text-white">{article.author || "Nova Editor"}</div><div className="text-xs text-[#8892B0]">Verified Author</div></div>
                </div>
                <div className="flex gap-4">
                   <Facebook size={20} className="text-slate-400 hover:text-blue-500 cursor-pointer" />
                   <Twitter size={20} className="text-slate-400 hover:text-sky-400 cursor-pointer" />
                   <Linkedin size={20} className="text-slate-400 hover:text-blue-700 cursor-pointer" />
                </div>
            </div>
        </header>

        {/* Featured Image */}
        <div className="mb-12 relative rounded-2xl overflow-hidden aspect-video shadow-2xl border border-white/5 bg-[#112240]">
            <img 
                src={article.imageUrl || "https://placehold.co/1200x600/112240/64FFDA?text=No+Image"} 
                alt={article.title} 
                className="w-full h-full object-cover"
                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/1200x600/112240/64FFDA?text=Image+Not+Found"; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f]/40 to-transparent pointer-events-none"></div>
        </div>

        {/* Content */}
        <div 
            className="prose prose-lg prose-invert max-w-none mb-12 text-slate-300 leading-8 font-light 
            prose-headings:font-serif prose-headings:text-white 
            prose-a:text-[#64FFDA] hover:prose-a:text-white prose-a:transition-colors
            prose-strong:text-white prose-strong:font-bold
            prose-ul:list-disc prose-ol:list-decimal
            prose-blockquote:border-l-4 prose-blockquote:border-[#64FFDA] prose-blockquote:bg-[#112240]/30 prose-blockquote:p-4 prose-blockquote:italic prose-blockquote:rounded-r-lg
            prose-img:rounded-xl prose-img:shadow-lg"
            dangerouslySetInnerHTML={{ __html: article.content }} 
        />

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-3 pt-8 border-t border-white/10 mb-12">
                {(typeof article.tags === 'string' ? article.tags.split(',') : article.tags).map((tag, i) => (
                    tag.trim() !== "" && (
                        <span key={i} className="px-4 py-2 rounded-lg bg-[#112240] border border-white/5 text-sm text-slate-300 flex items-center gap-2">
                            <Tag size={14} className="text-[#64FFDA]" /> {tag.trim()}
                        </span>
                    )
                ))}
            </div>
        )}

        {/* Comments */}
        <CommentSection postId={article._id} /> 

      </div>
    </div>
  );
}