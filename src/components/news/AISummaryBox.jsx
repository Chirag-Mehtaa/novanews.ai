import React from 'react';
import { Bot, Sparkles, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const SentimentBadge = ({ sentiment }) => {
  let color = 'bg-gray-500';
  let icon = <Minus className="w-3 h-3" />;
  let label = 'Neutral';

  if (sentiment === 'positive') {
    color = 'bg-teal-accent text-navy-dark';
    icon = <TrendingUp className="w-3 h-3" />;
    label = 'Positive';
  } else if (sentiment === 'negative') {
    color = 'bg-red-500 text-white';
    icon = <TrendingDown className="w-3 h-3" />;
    label = 'Negative';
  }

  return (
    <div className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-bold uppercase ${color}`}>
      {icon}
      <span>{label}</span>
    </div>
  );
};

export const AISummaryBox = ({ summary, sentiment }) => {
  return (
    <div className="relative overflow-hidden rounded-xl border border-teal-accent/30 bg-navy-light/50 backdrop-blur-sm p-6 my-8 shadow-lg shadow-teal-accent/5">
      {/* Decorative "Circuit" Elements */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-teal-accent/10 rounded-bl-full -mr-10 -mt-10"></div>
      <div className="absolute bottom-0 left-0 w-16 h-1 border-b-2 border-l-2 border-teal-accent/20 rounded-bl-xl"></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 text-teal-accent">
            <Bot className="w-6 h-6" />
            <span className="font-serif font-bold tracking-wider text-lg">NOVA AI INSIGHT</span>
          </div>
          <SentimentBadge sentiment={sentiment} />
        </div>

        <div className="flex items-start space-x-3">
          <Sparkles className="w-5 h-5 text-orange-accent mt-1 shrink-0 animate-pulse" />
          <p className="text-text-primary text-lg leading-relaxed font-light">
            {summary}
          </p>
        </div>
        
        <div className="mt-4 flex justify-end">
          <span className="text-xs text-teal-accent/60 font-mono">
            PROCESSED BY NOVA-LLM-V4 • {new Date().toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};