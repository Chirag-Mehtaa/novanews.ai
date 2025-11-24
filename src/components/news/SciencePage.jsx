'use client';

import React, { useState } from 'react';
import { 
  Atom, Microscope, Rocket, Globe, Dna, FlaskConical, 
  Flame, Wind, Droplets, ArrowRight, Clock, Star, 
  Radio, ThermometerSun, Database, Activity, Binary, 
  Zap, Brain, Eye, Layers, FileText, Download, Share2, PlayCircle, X
} from 'lucide-react';
import Link from 'next/link';

// --- MOCK DATA ---

const scienceHero = {
  id: 1,
  title: "JWST Deep Field: The Galaxy That Shouldn't Exist",
  slug: "jwst-impossible-galaxy",
  category: "Cosmology",
  image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1200&q=80",
  excerpt: "New spectral analysis reveals a galaxy formed 300M years after the Big Bang is larger than the Milky Way, challenging standard cosmological models.",
  author: "Dr. Elena R.",
  readTime: "8 min read",
  status: "PEER_REVIEWED"
};

const discoveryGrid = [
  { 
    id: 101, title: "Nuclear Fusion: Net Energy Gain Repeated", category: "Physics", 
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80", type: "BREAKTHROUGH", meta: "Output: 3.5 MJ"
  },
  { 
    id: 102, title: "Synthetic Biology: Bacteria Eating Plastic", category: "Bio-Eng", 
    image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=800&q=80", type: "STUDY", meta: "Efficiency: 99%"
  },
  { 
    id: 103, title: "Archaeology: 50,000 Year Old Virus Revived", category: "Paleontology", 
    image: "https://images.unsplash.com/photo-1516546453174-5e1098a4b4af?auto=format&fit=crop&w=800&q=80", type: "DISCOVERY", meta: "Risk: Low"
  },
  { 
    id: 104, title: "Neuroscience: Mapping Insect Brains", category: "Neuroscience", 
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=800&q=80", type: "MAPPING", meta: "Neurons: 3,016"
  }
];

// EXPANDED VISUAL STORIES (Added Slugs for Linking)
const allVisualStories = [
    { id: 501, slug: "europa-life-ice", title: "Life Under the Ice: Europa", image: "https://images.unsplash.com/photo-1614728853913-1e32005e30b6?auto=format&fit=crop&w=600&q=80", category: "Exobiology" },
    { id: 502, slug: "lhc-particle-physics", title: "Inside the Large Hadron Collider", image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80", category: "Particle Physics" },
    { id: 503, slug: "solar-storm-anatomy", title: "The Anatomy of a Solar Storm", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80", category: "Solar Physics" },
    { id: 504, slug: "fungi-web-of-life", title: "Fungi: The Web of Life", image: "https://images.unsplash.com/photo-1633436375795-12b3b339712f?auto=format&fit=crop&w=600&q=80", category: "Mycology" },
    { id: 505, slug: "bioluminescence-deep-sea", title: "Deep Ocean Bioluminescence", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80", category: "Marine Bio" },
    { id: 506, slug: "volcanic-lightning", title: "Volcanic Lightning Storms", image: "https://images.unsplash.com/photo-1506224870987-7a3522b2c177?auto=format&fit=crop&w=600&q=80", category: "Geology" },
    { id: 507, slug: "medical-nanobots", title: "Nanobots in Bloodstream", image: "https://images.unsplash.com/photo-1579168765467-3b235f938439?auto=format&fit=crop&w=600&q=80", category: "Nano Tech" },
    { id: 508, slug: "pillars-of-creation", title: "The Pillars of Creation", image: "https://images.unsplash.com/photo-1543722530-d2c3201371e7?auto=format&fit=crop&w=600&q=80", category: "Astronomy" },
];

const journalFeed = [
    { id: 601, title: "Quantum Entanglement in Macroscopic Systems", journal: "Nature Physics", doi: "10.1038/s41567-025", date: "Oct 12", cites: 42 },
    { id: 602, title: "CRISPR-Cas9 Gene Editing in Primate Embryos", journal: "Cell", doi: "10.1016/j.cell.2025", date: "Oct 10", cites: 156 },
    { id: 603, title: "Atmospheric Composition of Exoplanet K2-18b", journal: "The Astrophysical Journal", doi: "10.3847/1538", date: "Oct 08", cites: 89 },
];

const factsTicker = [
  "OBSERVATION: Neutron star core density exceeds 10^17 kg/m³.",
  "ALERT: Solar flare X-Class detected. Aurora visibility high.",
  "FACT: Tardigrades can survive the vacuum of space.",
  "UPDATE: Voyager 1 transmitting readable data again.",
  "TRIVIA: Water exists in three states simultaneously at Triple Point."
];

const spaceEvents = [
    { date: "T-MINUS 4H", event: "Starship Orbital Flight Test", type: "LAUNCH", color: "text-orange-500" },
    { date: "DEC 14", event: "Geminids Meteor Shower Peak", type: "EVENT", color: "text-cyan-400" },
    { date: "JAN 05", event: "Earth at Perihelion (Closest Approach)", type: "ORBIT", color: "text-blue-400" },
];

// --- SUB-COMPONENTS ---

const HologramBadge = ({ text, type }) => {
    let color = "cyan";
    if(type === 'BREAKTHROUGH') color = "orange";
    if(type === 'REPORT') color = "red";
    if(type === 'MILESTONE') color = "purple";

    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border border-${color}-500/30 bg-${color}-500/10 text-${color}-400 text-[9px] font-mono uppercase tracking-wider shadow-[0_0_10px_rgba(0,0,0,0.5)]`}>
            <Binary size={8} /> {text}
        </span>
    );
};

const DiscoveryTicker = () => {
  const loopData = [...factsTicker, ...factsTicker, ...factsTicker];
  return (
    <div className="relative z-20 bg-navy-dark/90 border-b border-cyan-500/20 h-10 flex items-center overflow-hidden font-mono text-xs group">
        <div className="px-4 h-full flex items-center bg-navy-dark border-r border-cyan-500/20 text-cyan-400 font-bold relative z-30 shadow-[10px_0_20px_rgba(10,25,47,1)]">
          <Radio size={14} className="mr-2 animate-pulse" /> DATA_STREAM
        </div>
        <div className="flex animate-marquee-slow whitespace-nowrap gap-16 items-center pl-4 hover:[animation-play-state:paused]" style={{ animationDuration: '80s' }}>
          {loopData.map((fact, i) => (
            <div key={i} className="flex items-center gap-2 text-text-secondary shrink-0">
              <Atom size={12} className="text-cyan-500 spin-slow" /> 
              <span className="tracking-wide font-light">{fact}</span>
            </div>
          ))}
        </div>
    </div>
  );
};

export default function SciencePage() {
  const [activeTab, setActiveTab] = useState('All');
  const [showGallery, setShowGallery] = useState(false);

  return (
    <div className="min-h-screen bg-navy-dark text-text-primary font-sans pb-20 relative overflow-hidden selection:bg-cyan-500 selection:text-navy-dark">
      
      {/* BACKGROUND PARTICLES */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-navy-dark to-navy-dark"></div>
        <div className="absolute w-full h-full opacity-10" style={{ backgroundImage: 'radial-gradient(#22d3ee 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      </div>

      {/* --- GALLERY MODAL (Holographic Archive) --- */}
      {showGallery && (
        <div className="fixed inset-0 z-[100] bg-navy-dark/95 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in">
            <div className="w-full max-w-6xl h-[90vh] bg-navy-light/30 border border-cyan-500/30 rounded-2xl overflow-hidden flex flex-col shadow-[0_0_50px_rgba(34,211,238,0.1)] relative">
                
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-navy-dark/80">
                    <div className="flex items-center gap-3 text-cyan-400 font-mono">
                        <Database size={20} /> 
                        <span className="tracking-[0.2em] font-bold">VISUAL_ARCHIVE_DB</span>
                    </div>
                    <button onClick={() => setShowGallery(false)} className="p-2 bg-white/5 hover:bg-red-500/20 hover:text-red-400 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-8 overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {allVisualStories.map((story) => (
                            // LINK ADDED HERE IN MODAL
                            <Link href={`/news/${story.slug}`} key={story.id} className="group relative h-64 rounded-xl overflow-hidden cursor-pointer border border-white/5 hover:border-cyan-500/50 transition-all hover:scale-[1.02] block">
                                <img src={story.image} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-transparent to-transparent opacity-90"></div>
                                <div className="absolute bottom-0 left-0 p-4 w-full">
                                    <span className="text-[10px] font-bold text-cyan-400 uppercase mb-1 block">{story.category}</span>
                                    <h4 className="text-lg font-bold text-white leading-tight">{story.title}</h4>
                                </div>
                                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <PlayCircle className="text-cyan-400 w-8 h-8 drop-shadow-lg" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      )}

      <DiscoveryTicker />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-12 relative z-10">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="relative">
            <div className="absolute -top-12 -left-12 w-40 h-40 border border-cyan-500/10 rounded-full animate-spin-slow pointer-events-none"></div>
            <div className="absolute -top-8 -left-8 w-32 h-32 border border-dashed border-cyan-500/20 rounded-full animate-reverse-spin pointer-events-none"></div>
            
            <div className="flex items-center gap-2 text-cyan-400 mb-3 font-mono text-xs tracking-[0.2em]">
              <FlaskConical size={14} /> LAB_REPORT // 2025
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-none tracking-tighter mb-2 drop-shadow-[0_0_15px_rgba(34,211,238,0.2)]">
              SCIENCE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">FRONTIER</span>
            </h1>
            <p className="text-text-secondary max-w-md text-sm border-l-2 border-cyan-500/30 pl-4 mt-4 font-light">
              Decoding the architecture of the universe, from the quantum scale to the cosmic web.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2 p-1.5 bg-navy-light/30 backdrop-blur-md rounded-lg border border-white/10 shadow-lg">
            {['All', 'Cosmos', 'Biology', 'Quantum', 'Earth'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  activeTab === tab 
                  ? 'bg-cyan-500/90 text-navy-dark shadow-[0_0_15px_rgba(34,211,238,0.5)]' 
                  : 'text-text-secondary hover:text-white hover:bg-white/5'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* --- HERO SECTION --- */}
        <Link href={`/news/${scienceHero.slug}`} className="group block relative mb-24">
            <div className="relative grid grid-cols-1 lg:grid-cols-12 h-auto lg:h-[550px] w-full rounded-3xl overflow-hidden border border-white/10 bg-navy-light hover:border-cyan-500/40 transition-all duration-500 shadow-2xl group-hover:shadow-[0_0_30px_rgba(34,211,238,0.1)]">
                <div className="lg:col-span-8 relative h-[300px] lg:h-full overflow-hidden">
                    <img src={scienceHero.image} className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-all duration-[1.5s]" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-navy-light"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-light to-transparent lg:hidden"></div>
                    <div className="absolute top-6 left-6 flex gap-2">
                        <div className="bg-black/60 backdrop-blur border border-cyan-500/30 px-3 py-1 rounded-full text-cyan-400 text-xs font-bold flex items-center gap-2">
                            <Star size={12} className="fill-current" /> ASTRONOMY
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-4 p-8 lg:p-10 flex flex-col justify-center relative bg-navy-light/50 backdrop-blur-sm">
                    <Dna className="absolute top-6 right-6 text-cyan-500/10 w-24 h-24 -rotate-12 pointer-events-none animate-pulse" />
                    <div className="flex items-center gap-4 mb-6 text-xs font-mono text-cyan-500">
                        <span className="animate-pulse">● LIVE FEED</span>
                        <span>REF: #COSMOS-25</span>
                    </div>
                    <h2 className="text-2xl md:text-4xl font-bold text-white mb-6 leading-tight group-hover:text-cyan-400 transition-colors font-serif">
                        {scienceHero.title}
                    </h2>
                    <div className="bg-navy-dark/60 p-5 rounded-xl border border-white/5 backdrop-blur-sm mb-8 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-500 to-blue-600"></div>
                        <h4 className="text-[10px] font-bold text-text-secondary mb-2 uppercase tracking-widest">Research Abstract</h4>
                        <p className="text-gray-300 text-base font-light leading-relaxed">
                            {scienceHero.excerpt}
                        </p>
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-navy-dark font-bold shadow-lg">DR</div>
                            <div className="text-sm">
                                <div className="text-white font-bold">{scienceHero.author}</div>
                                <div className="text-text-secondary text-xs font-mono">{scienceHero.status}</div>
                            </div>
                        </div>
                        <div className="w-12 h-12 rounded-full border border-cyan-500/50 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-navy-dark transition-all shadow-[0_0_15px_rgba(34,211,238,0.1)]">
                            <ArrowRight size={24} />
                        </div>
                    </div>
                </div>
            </div>
        </Link>

        {/* --- MAIN GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-24">
            <div className="lg:col-span-8">
                <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3 border-b border-white/10 pb-4">
                    <Microscope className="text-cyan-500" /> Laboratory Feed
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {discoveryGrid.map((item) => (
                        <Link href={`/news/science-${item.id}`} key={item.id} className="group relative bg-navy-light/20 border border-white/5 rounded-2xl overflow-hidden hover:border-cyan-500/40 hover:bg-navy-light/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="h-40 w-full overflow-hidden relative">
                                <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 grayscale group-hover:grayscale-0" />
                                <div className="absolute inset-0 bg-gradient-to-t from-navy-dark to-transparent opacity-90"></div>
                                <div className="absolute top-3 right-3">
                                    <HologramBadge text={item.type} type={item.type} />
                                </div>
                            </div>
                            <div className="p-5 relative">
                                <div className="flex justify-between items-start mb-3">
                                    <span className="text-xs font-bold text-cyan-500 uppercase tracking-wide">{item.category}</span>
                                    <span className="text-[10px] font-mono text-text-secondary">{item.meta}</span>
                                </div>
                                <h4 className="text-lg font-bold text-white mb-3 leading-snug group-hover:text-cyan-400 transition-colors">
                                    {item.title}
                                </h4>
                                <div className="flex items-center gap-2 text-xs text-text-secondary group-hover:text-white transition-colors">
                                    <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse"></div>
                                    Read Analysis
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4 space-y-8">
                <div className="bg-[#0B1221] border border-white/10 rounded-2xl p-0 overflow-hidden relative shadow-xl">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="p-6 border-b border-white/5 bg-white/5 backdrop-blur-sm">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Rocket className="text-orange-500" /> Cosmic Watch
                        </h3>
                    </div>
                    <div className="p-4 space-y-1">
                        {spaceEvents.map((event, i) => (
                            <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 group">
                                <div className="text-center min-w-[60px]">
                                    <div className={`text-[10px] font-bold uppercase ${event.color} mb-1`}>{event.type}</div>
                                    <div className="w-2 h-2 bg-gray-700 rounded-full mx-auto group-hover:bg-white transition-colors"></div>
                                </div>
                                <div className="border-l border-white/10 pl-4">
                                    <div className="text-xs text-text-secondary font-mono mb-1">{event.date}</div>
                                    <div className="text-sm font-bold text-gray-200 leading-tight">{event.event}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-navy-light/20 border border-white/5 rounded-2xl p-6 backdrop-blur-sm">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <Activity className="text-green-500" /> Earth Vital Signs
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-4 bg-navy-dark/50 rounded-xl border border-white/5 text-center hover:border-red-500/30 transition-colors">
                            <ThermometerSun className="w-5 h-5 text-red-400 mx-auto mb-2" />
                            <div className="text-[10px] uppercase text-text-secondary tracking-wider mb-1">Temp</div>
                            <div className="text-xl font-mono font-bold text-white">+1.15°C</div>
                        </div>
                        <div className="p-4 bg-navy-dark/50 rounded-xl border border-white/5 text-center hover:border-blue-500/30 transition-colors">
                            <Wind className="w-5 h-5 text-blue-400 mx-auto mb-2" />
                            <div className="text-[10px] uppercase text-text-secondary tracking-wider mb-1">CO2</div>
                            <div className="text-xl font-mono font-bold text-white">421 ppm</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* --- VISUAL STORIES (Horizontal Gallery Preview) --- */}
        <div className="mb-24">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Eye className="text-cyan-500" /> In Focus: Visual Stories
                </h3>
                <button onClick={() => setShowGallery(true)} className="text-xs text-cyan-400 hover:text-white transition-colors flex items-center gap-1">
                    View Gallery <ArrowRight size={12} />
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {allVisualStories.slice(0, 4).map((story) => (
                    // LINK ADDED HERE IN PREVIEW
                    <Link href={`/news/${story.slug}`} key={story.id} className="group relative h-[400px] rounded-2xl overflow-hidden cursor-pointer block">
                        <img src={story.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                        <div className="absolute bottom-0 left-0 p-6 w-full translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            <span className="text-[10px] font-bold bg-cyan-500 text-navy-dark px-2 py-1 rounded uppercase mb-2 inline-block">
                                {story.category}
                            </span>
                            <h4 className="text-xl font-bold text-white leading-tight mb-2 group-hover:text-cyan-300 transition-colors">
                                {story.title}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                                <PlayCircle size={14} /> Watch Story
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>

        {/* --- LATEST JOURNAL FEED --- */}
        <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
                <FileText className="text-cyan-500" /> 
                <h3 className="text-2xl font-bold text-white">Latest Research Papers</h3>
            </div>

            <div className="space-y-4">
                {journalFeed.map((paper) => (
                    <div key={paper.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 bg-navy-light/20 border border-white/5 rounded-xl hover:bg-navy-light/40 hover:border-cyan-500/30 transition-all group">
                        <div className="flex-grow pr-8">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wide">{paper.journal}</span>
                                <span className="text-[10px] text-text-secondary font-mono border border-white/10 px-2 rounded">DOI: {paper.doi}</span>
                            </div>
                            <h4 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors mb-2">
                                {paper.title}
                            </h4>
                            <div className="flex items-center gap-4 text-xs text-text-secondary">
                                <span>{paper.date}</span>
                                <span>Cited by {paper.cites}</span>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-4 md:mt-0 shrink-0">
                            <button className="p-2 rounded-full bg-white/5 hover:bg-cyan-500/20 hover:text-cyan-400 text-text-secondary transition-colors">
                                <Share2 size={18} />
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500 hover:text-navy-dark font-bold text-xs transition-all">
                                <Download size={14} /> PDF
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>

      </div>

      {/* Custom CSS */}
      <style jsx global>{`
        @keyframes marquee-slow { 0% { transform: translateX(0); } 100% { transform: translateX(-100%); } }
        .animate-marquee-slow { animation: marquee-slow 80s linear infinite; }
        
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        
        @keyframes reverse-spin { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
        .animate-reverse-spin { animation: reverse-spin 25s linear infinite; }
        
        @keyframes fade-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }

        .spin-slow { animation: spin-slow 8s linear infinite; }
        
        /* Hide scrollbar for modal */
        .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(0,0,0,0.2);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(34,211,238,0.3);
            border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(34,211,238,0.6);
        }
      `}</style>
    </div>
  );
}