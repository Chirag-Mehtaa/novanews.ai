'use client';

import React, { useState, useEffect } from 'react';
import { 
  Cpu, Smartphone, Terminal, Shield, Zap, 
  Code, Wifi, Layers, ArrowRight, Play, Activity, Hash,
  ChevronLeft, ChevronRight, Rocket, Dna, Bot, Database, Link as LinkIcon, X, Lock
} from 'lucide-react';
import Link from 'next/link';

// --- MOCK DATA ---

const heroNewsData = [
  {
    id: 1,
    title: "THE SINGULARITY: Generative AI's Final Leap",
    slug: "generative-ai-leap",
    category: "Artificial Intelligence",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80",
    excerpt: "Neural networks are no longer just mimicking; they are reasoning. The line between code and consciousness is blurring.",
    author: "Dr. Alex Chen"
  },
  {
    id: 2,
    title: "QUANTUM SUPREMACY: IBM's New Chip Breaks Reality",
    slug: "quantum-supremacy",
    category: "Quantum Computing",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80",
    excerpt: "The new 1000-qubit processor solves problems in seconds that would take supercomputers thousands of years.",
    author: "Sarah Connor"
  },
  {
    id: 3,
    title: "NEURALINK V2: Human-Cloud Interface is Live",
    slug: "neuralink-v2",
    category: "Bio-Tech",
    image: "https://images.unsplash.com/photo-1555664424-778a69022365?auto=format&fit=crop&w=1200&q=80",
    excerpt: "The first successful wireless transmission of thought data directly to the cloud has been verified.",
    author: "Tech Desk"
  }
];

const gadgetReviews = [
  { id: 101, name: "Vision Pro 2", verdict: "9.2", tag: "Editor's Choice", image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=600&q=80" },
  { id: 102, name: "Pixel Fold X", verdict: "8.5", tag: "Best Value", image: "https://images.unsplash.com/photo-1598327105666-5b89351aff56?auto=format&fit=crop&w=600&q=80" },
  { id: 103, name: "CyberDeck Ultra", verdict: "9.8", tag: "Beast Mode", image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=600&q=80" }
];

const trendingTopics = [
  { label: "GPT-5_LEAK", status: "CRITICAL" },
  { label: "QUANTUM_OS", status: "STABLE" },
  { label: "NEURALINK_V2", status: "LIVE" },
  { label: "DARK_WEB_AI", status: "WARNING" },
  { label: "6G_TRIALS", status: "PENDING" },
  { label: "MARS_LINK", status: "OFFLINE" },
];

// EXPANDED TECH DATA (For DB Modal)
const allEmergingTech = [
    { id: 301, title: "SpaceX Starship: The Mars Colonization Timeline", category: "Space", status: "T-MINUS", icon: Rocket, image: "https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=800&q=80" },
    { id: 302, title: "CRISPR 2.0: Editing DNA in Real-time", category: "BioTech", status: "ALPHA", icon: Dna, image: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=800&q=80" },
    { id: 303, title: "Boston Dynamics: Atlas can now Parkour", category: "Robotics", status: "V.4.2", icon: Bot, image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80" },
    { id: 304, title: "Ethereum's Layer 3 Scaling Solution", category: "Web3", status: "BETA", icon: Database, image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80" },
    { id: 305, title: "6G Networks: 100x Faster than 5G", category: "Connectivity", status: "R&D", icon: Wifi, image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80" },
    { id: 306, title: "Solid State Batteries: EV Revolution", category: "Energy", status: "CONCEPT", icon: Zap, image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80" },
    // --- HIDDEN / CLASSIFIED ITEMS ---
    { id: 307, title: "Direct Fusion Drive: Interstellar Travel", category: "Propulsion", status: "CLASSIFIED", icon: Rocket, image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80" },
    { id: 308, title: "Quantum Internet: Unhackable Networks", category: "CyberSec", status: "PROTOTYPE", icon: Shield, image: "https://images.unsplash.com/photo-1558494949-ef526b0042a0?auto=format&fit=crop&w=800&q=80" },
    { id: 309, title: "Exo-Wombs: Artificial Gestation", category: "BioTech", status: "ETHICS_REV", icon: Activity, image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80" },
];

// --- SUB-COMPONENTS ---

const GlitchText = ({ text }) => (
  <div className="relative inline-block group">
    <span className="relative z-10">{text}</span>
    <span className="absolute top-0 left-0 -z-10 w-full h-full text-teal-accent opacity-0 group-hover:opacity-70 animate-glitch-1 translate-x-[2px]">{text}</span>
    <span className="absolute top-0 left-0 -z-10 w-full h-full text-red-500 opacity-0 group-hover:opacity-70 animate-glitch-2 -translate-x-[2px]">{text}</span>
  </div>
);

// 1. System Ticker
const SystemTicker = () => {
  const loopData = [...trendingTopics, ...trendingTopics, ...trendingTopics, ...trendingTopics, ...trendingTopics];

  return (
    <div className="relative z-20 bg-navy-dark/90 border-b border-teal-accent/20 h-10 flex items-center overflow-hidden font-mono text-xs group">
        <div className="px-4 h-full flex items-center bg-navy-dark border-r border-teal-accent/20 text-teal-accent font-bold relative z-30 shadow-[10px_0_20px_rgba(10,25,47,1)]">
          <Terminal size={14} className="mr-2 animate-pulse" /> 
          <span className="bg-teal-accent/10 px-2 py-0.5 rounded">SYS_LOG</span>
        </div>
        
        <div 
            className="flex animate-marquee-slow whitespace-nowrap gap-16 items-center pl-4 hover:[animation-play-state:paused]"
            style={{ animationDuration: '100s' }} 
        >
          {loopData.map((t, i) => (
            <div key={i} className="flex items-center gap-2 text-text-secondary shrink-0">
              <Hash size={10} className="text-teal-accent" /> 
              <span className="tracking-wider text-gray-400">{t.label}</span>
              <span className={`text-[9px] px-1.5 rounded-sm ${
                  t.status === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 
                  t.status === 'LIVE' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                  'bg-teal-accent/10 text-teal-accent border border-teal-accent/20'
              }`}>
                [{t.status}]
              </span>
            </div>
          ))}
        </div>
    </div>
  );
};

export default function TechPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [showDB, setShowDB] = useState(false); // STATE FOR DB MODAL
  
  // --- SLIDER STATE ---
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const currentHero = heroNewsData[currentHeroIndex];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroNewsData.length);
    }, 4000); 

    return () => clearInterval(timer); 
  }, []);

  const nextSlide = (e) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    setCurrentHeroIndex((prev) => (prev + 1) % heroNewsData.length);
  };

  const prevSlide = (e) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    setCurrentHeroIndex((prev) => (prev === 0 ? heroNewsData.length - 1 : prev - 1));
  };

  return (
    <div className="min-h-screen bg-navy-dark text-text-primary font-sans pb-20 relative overflow-hidden selection:bg-teal-accent selection:text-navy-dark">
      
      {/* BACKGROUND GRID */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#112240_1px,transparent_1px),linear-gradient(to_bottom,#112240_1px,transparent_1px)] bg-[size:40px_40px] opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-transparent to-navy-dark/80"></div>
      </div>

      {/* --- TECH DATABASE MODAL --- */}
      {showDB && (
        <div className="fixed inset-0 z-[100] bg-navy-dark/95 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in">
            <div className="w-full max-w-6xl h-[85vh] bg-[#050B14] border border-teal-accent/30 rounded-2xl overflow-hidden flex flex-col shadow-[0_0_50px_rgba(100,255,218,0.1)] relative">
                
                {/* Modal Header */}
                <div className="p-6 border-b border-teal-accent/20 flex justify-between items-center bg-navy-dark/90">
                    <div className="flex items-center gap-3 text-teal-accent font-mono">
                        <Database size={20} /> 
                        <span className="tracking-[0.2em] font-bold">RESTRICTED_TECH_DB_V4</span>
                    </div>
                    <button onClick={() => setShowDB(false)} className="p-2 bg-white/5 hover:bg-red-500/20 hover:text-red-400 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Modal Content Grid */}
                <div className="p-8 overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {allEmergingTech.map((tech) => (
                            <Link href={`/news/tech-${tech.id}`} key={tech.id} className="group relative h-48 bg-navy-light/20 rounded-xl overflow-hidden border border-white/5 hover:border-teal-accent/50 transition-all duration-300 hover:scale-[1.02]">
                                {/* Hidden "Classified" overlay for special items */}
                                {tech.status === 'CLASSIFIED' && (
                                    <div className="absolute top-2 right-2 z-30">
                                        <Lock size={14} className="text-red-500" />
                                    </div>
                                )}
                                
                                <div className="absolute inset-0 z-0">
                                    <img src={tech.image} className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity grayscale group-hover:grayscale-0" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-navy-dark/50 to-transparent"></div>
                                </div>

                                <div className="absolute inset-0 p-5 flex flex-col justify-between z-20">
                                    <div className="flex justify-between items-start">
                                        <div className="text-teal-accent">
                                            <tech.icon size={24} />
                                        </div>
                                        <span className={`font-mono text-[9px] font-bold border px-2 py-1 rounded ${
                                            tech.status === 'CLASSIFIED' ? 'text-red-400 border-red-500/30 bg-red-500/10' : 'text-teal-accent border-teal-accent/30 bg-teal-accent/10'
                                        }`}>
                                            {tech.status}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white leading-tight group-hover:text-teal-accent transition-colors font-mono">
                                            {tech.title}
                                        </h3>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* SYSTEM TICKER */}
      <SystemTicker />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-12 relative z-10">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-2 text-teal-accent mb-3 font-mono text-xs tracking-[0.2em]">
              <span className="w-2 h-2 bg-teal-accent rounded-full animate-ping"></span>
              SYSTEM ONLINE // V.4.0
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-none tracking-tighter mb-2">
              <GlitchText text="FUTURE" /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-accent to-blue-600">TECH</span>
            </h1>
            <p className="text-text-secondary max-w-md text-sm border-l-2 border-teal-accent/30 pl-4 mt-4">
              Decoding the source code of tomorrow. AI, Cybernetics, and Quantum Computing.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2 p-1.5 bg-navy-light/50 backdrop-blur-md rounded-lg border border-white/10">
            {['All', 'AI_Core', 'Hardware', 'CyberSec', 'Dev_Ops'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-md text-xs font-mono font-bold uppercase transition-all duration-300 ${
                  activeTab === tab 
                  ? 'bg-teal-accent text-navy-dark shadow-[0_0_20px_rgba(100,255,218,0.4)]' 
                  : 'text-text-secondary hover:text-white hover:bg-white/5'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* --- HERO SLIDER SECTION --- */}
        <div className="relative mb-24 group">
            <Link href={`/news/${currentHero.slug}`} className="block relative h-[550px] w-full rounded-xl overflow-hidden border border-white/10 bg-navy-light group-hover:border-teal-accent/50 transition-all duration-500">
                <div key={currentHero.id} className="absolute inset-0 z-0 animate-fade-in">
                    <img 
                        src={currentHero.image} 
                        alt={currentHero.title}
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-[1500ms]" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-transparent to-transparent"></div>
                </div>
                <div className="absolute top-6 right-6 flex items-center gap-4 z-10">
                    <div className="bg-navy-dark/80 backdrop-blur-sm border border-teal-accent/30 px-4 py-2 rounded-full flex items-center gap-3">
                        <Wifi size={16} className="text-teal-accent animate-pulse" />
                        <span className="text-xs font-mono text-teal-accent">NET_LINK: SECURE</span>
                    </div>
                </div>
                <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-teal-accent/60"></div>
                <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-teal-accent/60"></div>
                <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 z-10 pr-32">
                    <div className="max-w-4xl">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="bg-teal-accent text-navy-dark text-xs font-bold px-3 py-1 uppercase tracking-wider">Featured Protocol</span>
                            <span className="text-teal-accent font-mono text-xs">&lt;{currentHero.category} /&gt;</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight group-hover:text-teal-accent transition-colors animate-slide-up">
                            {currentHero.title}
                        </h2>
                        <div className="flex items-center gap-6">
                            <p className="text-text-secondary text-lg max-w-xl line-clamp-2 font-light">
                                {currentHero.excerpt}
                            </p>
                            <div className="w-12 h-12 rounded-full border border-teal-accent/50 flex items-center justify-center group-hover:bg-teal-accent group-hover:text-navy-dark transition-all">
                                <ArrowRight size={24} />
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
            
            <div className="absolute bottom-8 right-8 z-20 flex items-end gap-4">
                <div className="font-mono text-teal-accent text-lg font-bold tracking-widest bg-navy-dark/80 backdrop-blur px-4 py-2 rounded border border-teal-accent/20">
                    0{currentHeroIndex + 1} <span className="text-text-secondary text-sm">/ 0{heroNewsData.length}</span>
                </div>
                <div className="flex gap-2">
                    <button onClick={prevSlide} className="p-3 bg-navy-dark/80 backdrop-blur border border-white/10 text-white hover:border-teal-accent hover:text-teal-accent transition-all rounded hover:bg-white/5">
                        <ChevronLeft size={24} />
                    </button>
                    <button onClick={nextSlide} className="p-3 bg-navy-dark/80 backdrop-blur border border-white/10 text-white hover:border-teal-accent hover:text-teal-accent transition-all rounded hover:bg-white/5">
                        <ChevronRight size={24} />
                    </button>
                </div>
            </div>
        </div>

        {/* --- 3-COLUMN GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
            <div className="lg:col-span-1 flex flex-col gap-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Smartphone className="text-purple-500" /> Hardware_Lab
                    </h3>
                </div>
                {gadgetReviews.map((gadget) => (
                    <div key={gadget.id} className="relative h-48 rounded-lg overflow-hidden border border-white/10 group cursor-pointer hover:shadow-[0_0_20px_rgba(168,85,247,0.2)] transition-all duration-500">
                        <img src={gadget.image} className="w-full h-full object-cover opacity-50 group-hover:opacity-90 transition-all duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-r from-navy-dark/90 to-transparent"></div>
                        <div className="absolute top-3 right-3">
                            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-b from-purple-400 to-purple-600 font-mono">{gadget.verdict}</span>
                        </div>
                        <div className="absolute bottom-4 left-4">
                            <span className="text-[10px] text-purple-400 border border-purple-500/30 px-2 py-0.5 rounded uppercase mb-2 inline-block bg-navy-dark/50 backdrop-blur">{gadget.tag}</span>
                            <h4 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">{gadget.name}</h4>
                        </div>
                    </div>
                ))}
            </div>

            <div className="lg:col-span-2">
                <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Code className="text-teal-accent" /> Source_Code
                    </h3>
                    <div className="flex gap-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                </div>
                <div className="bg-navy-dark border border-white/10 rounded-xl p-1 overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                        {[1, 2, 3, 4].map((item) => (
                            <Link href={`/news/tech-${item}`} key={item} className="group bg-navy-light/40 p-6 border border-transparent hover:border-teal-accent/30 hover:bg-navy-light/60 transition-all relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Layers size={60} />
                                </div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-2 text-[10px] font-mono text-text-secondary">
                                        <span className="text-teal-accent">root@nova:~$</span> exec update
                                    </div>
                                    <span className="text-[10px] font-mono text-text-secondary">2h ago</span>
                                </div>
                                <h4 className="text-lg font-bold text-white mb-2 group-hover:text-teal-accent transition-colors leading-snug font-mono">Why Rust is rewriting the entire web infrastructure ecosystem</h4>
                                <div className="flex gap-2 mt-4">
                                    <span className="text-[10px] bg-white/5 px-2 py-1 rounded text-text-secondary font-mono">#DevOps</span>
                                    <span className="text-[10px] bg-white/5 px-2 py-1 rounded text-text-secondary font-mono">#Rust</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="mt-6 bg-red-950/20 border border-red-500/20 rounded-xl p-5 flex items-center justify-between group hover:bg-red-950/30 transition-colors cursor-pointer">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="absolute inset-0 bg-red-500 blur-lg opacity-20 animate-pulse"></div>
                            <Shield size={32} className="text-red-500 relative z-10" />
                        </div>
                        <div>
                            <h4 className="text-white font-bold font-mono">THREAT_LEVEL: <span className="text-red-500 animate-pulse">ELEVATED</span></h4>
                            <p className="text-red-400/60 text-xs mt-1 font-mono">Zero-day vulnerability detected in major cloud providers.</p>
                        </div>
                    </div>
                    <ArrowRight className="text-red-500 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
            </div>
        </div>

        {/* --- EMERGING TECH MATRIX --- */}
        <div className="mb-20">
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <Cpu className="text-teal-accent" /> Emerging Tech Matrix
                    </h2>
                    <p className="text-text-secondary text-sm">Tracking breakthrough technologies from Concept to Mainstream.</p>
                </div>
                <div className="h-[1px] flex-grow bg-white/10 ml-12 hidden md:block"></div>
                {/* BUTTON TRIGGERS THE MODAL */}
                <button 
                    onClick={() => setShowDB(true)}
                    className="ml-6 text-xs font-mono text-teal-accent border border-teal-accent/30 px-4 py-2 rounded hover:bg-teal-accent hover:text-navy-dark transition-all"
                >
                    VIEW_FULL_DB
                </button>
            </div>

            {/* Only showing first 6 items in preview grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allEmergingTech.slice(0, 6).map((tech) => (
                    <Link href={`/news/tech-${tech.id}`} key={tech.id} className="group relative h-64 bg-navy-light/30 rounded-2xl overflow-hidden border border-white/5 hover:border-teal-accent/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(100,255,218,0.1)]">
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-teal-accent/80 shadow-[0_0_10px_#64FFDA] opacity-0 group-hover:opacity-100 animate-scanline z-30 pointer-events-none"></div>
                        <div className="absolute inset-0 z-0">
                            <img src={tech.image} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-110 transition-transform duration-700 grayscale group-hover:grayscale-0" />
                            <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-navy-dark/50 to-transparent opacity-90"></div>
                        </div>
                        <div className="absolute inset-0 p-6 flex flex-col justify-between z-20">
                            <div className="flex justify-between items-start">
                                <div className="bg-navy-dark/80 backdrop-blur border border-white/10 p-2 rounded-lg text-teal-accent group-hover:text-white group-hover:border-teal-accent/50 transition-colors">
                                    <tech.icon size={20} />
                                </div>
                                <span className="font-mono text-[10px] font-bold bg-teal-accent/10 text-teal-accent border border-teal-accent/20 px-2 py-1 rounded">
                                    STATUS: {tech.status}
                                </span>
                            </div>
                            <div>
                                <span className="text-xs font-bold text-teal-accent uppercase tracking-widest mb-1 block opacity-80">
                                    {tech.category}
                                </span>
                                <h3 className="text-xl font-bold text-white leading-tight group-hover:text-teal-accent transition-colors">
                                    {tech.title}
                                </h3>
                            </div>
                        </div>
                        <div className="absolute bottom-0 right-0 w-12 h-12 bg-teal-accent/10 rounded-tl-3xl z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ArrowRight className="absolute bottom-3 right-3 text-teal-accent w-5 h-5" />
                        </div>
                    </Link>
                ))}
            </div>
        </div>

      </div>

      {/* CSS ANIMATIONS */}
      <style jsx global>{`
        @keyframes glitch-1 { 0% { clip-path: inset(20% 0 80% 0); } 100% { clip-path: inset(30% 0 30% 0); } }
        @keyframes glitch-2 { 0% { clip-path: inset(10% 0 60% 0); } 100% { clip-path: inset(50% 0 40% 0); } }
        .animate-glitch-1 { animation: glitch-1 2s infinite linear alternate-reverse; }
        .animate-glitch-2 { animation: glitch-2 2s infinite linear alternate-reverse; }
        
        @keyframes fade-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
        
        @keyframes slide-up { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-slide-up { animation: slide-up 0.6s ease-out forwards; }

        @keyframes scanline {
            0% { top: -10%; opacity: 0; }
            5% { opacity: 1; }
            100% { top: 110%; opacity: 0; }
        }
        .animate-scanline {
            animation: scanline 2s linear infinite;
        }
        @keyframes marquee-slow { 0% { transform: translateX(0); } 100% { transform: translateX(-100%); } }
        .animate-marquee-slow { animation: marquee-slow 100s linear infinite; }

        /* Scrollbar for Modal */
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #0a192f; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #112240; border-radius: 10px; border: 1px solid #64ffda; }
      `}</style>
    </div>
  );
}