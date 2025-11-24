'use client';

import React, { useState, useEffect } from 'react';
import { 
  Play, Star, Film, Music, Tv, TrendingUp, 
  Ticket, Headphones, Clapperboard, ChevronRight, 
  ChevronLeft, Heart, Share2, Info, Award, ArrowRight,
  X, Calendar, Gamepad2, Trophy, Flame, MonitorPlay, PlayCircle,
  ArrowUp, ArrowDown, Minus
} from 'lucide-react';
import Link from 'next/link';

// --- MOCK DATA ---

const heroContent = [
  {
    id: 1,
    title: "DUNE: PROPHECY",
    slug: "dune-prophecy-review",
    category: "Series Premiere",
    image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=1600&q=80", 
    rating: "9.4",
    excerpt: "10,000 years before the rise of Paul Atreides, the Bene Gesserit sisterhood is born in blood and betrayal.",
    type: "HBO ORIGINAL"
  },
  {
    id: 2,
    title: "GTA VI: VICE CITY RETURNS",
    slug: "gta-vi-trailer-breakdown",
    category: "Gaming Event",
    image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1600&q=80",
    rating: "9.9",
    excerpt: "Rockstar Games drops the final look at the neon-soaked streets of Vice City. Every hidden detail analyzed.",
    type: "WORLD PREMIERE"
  },
  {
    id: 3,
    title: "THE WEEKND: FINAL TOUR",
    slug: "weeknd-world-tour",
    category: "Music",
    image: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&w=1600&q=80",
    rating: "SOLD OUT",
    excerpt: "The global superstar announces his final tour under 'The Weeknd' moniker. Dates and cities inside.",
    type: "LIVE EVENT"
  }
];

const allTrendingMovies = [
    { id: 101, slug: "oppenheimer-2", title: "Oppenheimer: Redux", image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=600&q=80", rating: "9.2", genre: "Drama" },
    { id: 102, slug: "cyberpunk-movie", title: "Cyberpunk: Edgerunners", image: "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?auto=format&fit=crop&w=600&q=80", rating: "9.5", genre: "Anime" },
    { id: 103, slug: "blade-runner-2099", title: "Blade Runner 2099", image: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?auto=format&fit=crop&w=600&q=80", rating: "8.9", genre: "Sci-Fi" },
    { id: 104, slug: "the-bear-s4", title: "The Bear: Season 4", image: "https://images.unsplash.com/photo-1556910103-1c02745a30bf?auto=format&fit=crop&w=600&q=80", rating: "9.8", genre: "Drama" },
    { id: 105, slug: "inception-remaster", title: "Inception Remastered", image: "https://images.unsplash.com/photo-1478720568477-152d9b164e63?auto=format&fit=crop&w=600&q=80", rating: "9.0", genre: "Thriller" },
    { id: 106, slug: "interstellar-imax", title: "Interstellar: IMAX Return", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80", rating: "9.7", genre: "Sci-Fi" },
    { id: 107, slug: "gladiator-2", title: "Gladiator II", image: "https://images.unsplash.com/photo-1533613220915-609f661a6fe1?auto=format&fit=crop&w=600&q=80", rating: "8.5", genre: "Action" },
    { id: 108, slug: "poor-things", title: "Poor Things", image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=80", rating: "9.1", genre: "Art" },
];

const allTrailers = [
    { id: 201, slug: "avatar-3-trailer", title: "Avatar 3: The Seed Bearer", duration: "2:34", image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80" },
    { id: 202, slug: "secret-wars-trailer", title: "Marvel's Secret Wars", duration: "1:55", image: "https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=800&q=80" },
    { id: 203, slug: "batman-2-trailer", title: "The Batman: Part II", duration: "3:10", image: "https://images.unsplash.com/photo-1509347528160-9a9e33742cd4?auto=format&fit=crop&w=800&q=80" },
    { id: 204, slug: "joker-2-trailer", title: "Joker: Folie à Deux", duration: "2:15", image: "https://images.unsplash.com/photo-1531297461136-82lw9z1?auto=format&fit=crop&w=800&q=80" },
    { id: 205, slug: "deadpool-3-trailer", title: "Deadpool & Wolverine", duration: "2:45", image: "https://images.unsplash.com/photo-1608889175123-8ee362201f81?auto=format&fit=crop&w=800&q=80" },
    { id: 206, slug: "superman-legacy-trailer", title: "Superman: Legacy", duration: "1:45", image: "https://images.unsplash.com/photo-1525362081669-2b476bb628c3?auto=format&fit=crop&w=800&q=80" },
];

const streamingData = {
    Netflix: [
        { id: 301, slug: "stranger-things-5", title: "Stranger Things 5", match: "98%", season: "FINAL", image: "https://placehold.co/300x200/112240/FFFFFF?text=Stranger+Things" },
        { id: 302, slug: "wednesday-s2", title: "Wednesday: Season 2", match: "95%", season: "S2", image: "https://placehold.co/300x200/112240/FFFFFF?text=Wednesday" },
        { id: 303, slug: "squid-game-2", title: "Squid Game: The Challenge", match: "92%", season: "S2", image: "https://placehold.co/300x200/112240/FFFFFF?text=Squid+Game" }
    ],
    HBO: [
        { id: 304, slug: "house-dragon-s3", title: "House of the Dragon", match: "99%", season: "S3", image: "https://placehold.co/300x200/112240/FFFFFF?text=HOTD" },
        { id: 305, slug: "last-of-us-s2", title: "The Last of Us", match: "97%", season: "S2", image: "https://placehold.co/300x200/112240/FFFFFF?text=TLOU" },
        { id: 306, slug: "white-lotus-s3", title: "The White Lotus", match: "94%", season: "S3", image: "https://placehold.co/300x200/112240/FFFFFF?text=White+Lotus" }
    ],
    Prime: [
        { id: 307, slug: "the-boys-s5", title: "The Boys", match: "96%", season: "S5", image: "https://placehold.co/300x200/112240/FFFFFF?text=The+Boys" },
        { id: 308, slug: "fallout-s2", title: "Fallout", match: "93%", season: "S2", image: "https://placehold.co/300x200/112240/FFFFFF?text=Fallout" },
        { id: 309, slug: "rings-power-s3", title: "Rings of Power", match: "89%", season: "S3", image: "https://placehold.co/300x200/112240/FFFFFF?text=Rings+Power" }
    ]
};

// RENAMED TO FULLBOXOFFICE
const fullBoxOffice = [
    { rank: 1, slug: "dune-2-box-office", title: "Dune: Part Two", gross: "$82.5M", total: "$494M", trend: "up", image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=200&q=80" },
    { rank: 2, slug: "kung-fu-panda-4", title: "Kung Fu Panda 4", gross: "$45.2M", total: "$260M", trend: "down", image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&w=200&q=80" },
    { rank: 3, slug: "godzilla-kong", title: "Godzilla x Kong", gross: "$31.0M", total: "$180M", trend: "same", image: "https://images.unsplash.com/photo-1608889175123-8ee362201f81?auto=format&fit=crop&w=200&q=80" },
    { rank: 4, slug: "civil-war-movie", title: "Civil War", gross: "$25.4M", total: "$90M", trend: "up", image: "https://images.unsplash.com/photo-1533613220915-609f661a6fe1?auto=format&fit=crop&w=200&q=80" },
    { rank: 5, slug: "ghostbusters-frozen", title: "Ghostbusters", gross: "$15.1M", total: "$75M", trend: "down", image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=200&q=80" },
    { rank: 6, slug: "bob-marley-love", title: "Bob Marley: One Love", gross: "$10.2M", total: "$150M", trend: "down", image: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&w=200&q=80" },
    { rank: 7, slug: "ordinary-angels", title: "Ordinary Angels", gross: "$8.5M", total: "$40M", trend: "up", image: "https://images.unsplash.com/photo-1556910103-1c02745a30bf?auto=format&fit=crop&w=200&q=80" },
    { rank: 8, slug: "madame-web", title: "Madame Web", gross: "$5.1M", total: "$98M", trend: "down", image: "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?auto=format&fit=crop&w=200&q=80" },
    { rank: 9, slug: "migration-movie", title: "Migration", gross: "$4.3M", total: "$250M", trend: "same", image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=200&q=80" },
    { rank: 10, slug: "wonka-movie", title: "Wonka", gross: "$3.8M", total: "$600M", trend: "down", image: "https://images.unsplash.com/photo-1478720568477-152d9b164e63?auto=format&fit=crop&w=200&q=80" },
];

const buzzTicker = [
  "#Oscars2025 Predictions", "#TaylorSwiftLive", "#GTA6Leaks", "#Deadpool3Trailer", "#StrangerThings5", "#HouseOfTheDragon"
];

const gamingNews = [
    { id: 401, slug: "lol-worlds-2025", title: "League of Legends Worlds 2025", tag: "ESPORTS", desc: "T1 defends their title in London. Full schedule inside.", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80" },
    { id: 402, slug: "demon-slayer-movie", title: "Demon Slayer: Infinity Castle Arc", tag: "ANIME", desc: "New movie trilogy announced. Release dates confirmed.", image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80" }
];

// --- SUB-COMPONENTS ---

const RatingBadge = ({ rating }) => (
    <div className="flex items-center gap-1 bg-yellow-500/20 border border-yellow-500/50 px-2 py-1 rounded text-yellow-400 text-xs font-bold">
        <Star size={10} className="fill-current" /> {rating}
    </div>
);

const SectionHeader = ({ title, icon: Icon, actionText = "View All", onClick }) => (
    <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
        <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <div className="p-2 bg-pink-600/20 rounded-lg text-pink-500">
                <Icon size={24} />
            </div>
            {title}
        </h2>
        <button 
            onClick={onClick}
            className="text-sm font-bold text-pink-500 hover:text-white flex items-center gap-1 transition-colors"
        >
            {actionText} <ChevronRight size={16} />
        </button>
    </div>
);

const BuzzTicker = () => {
  const loopData = [...buzzTicker, ...buzzTicker, ...buzzTicker];
  return (
    <div className="relative z-20 bg-[#0a0a0a] border-b border-pink-500/20 h-10 flex items-center overflow-hidden font-sans text-xs group">
        <div className="px-4 h-full flex items-center bg-[#0a0a0a] border-r border-pink-500/20 text-pink-500 font-black italic z-30 shadow-[10px_0_20px_rgba(0,0,0,1)]">
          <TrendingUp size={14} className="mr-2" /> THE BUZZ
        </div>
        <div className="flex animate-marquee-slow whitespace-nowrap gap-12 items-center pl-4 hover:[animation-play-state:paused]" style={{ animationDuration: '60s' }}>
          {loopData.map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-text-secondary shrink-0 cursor-pointer hover:text-pink-400 transition-colors">
              <span className="font-bold text-white">{item}</span>
            </div>
          ))}
        </div>
    </div>
  );
};

const TrendIcon = ({ type }) => {
    if(type === 'up') return <ArrowUp size={14} className="text-green-500" />;
    if(type === 'down') return <ArrowDown size={14} className="text-red-500" />;
    return <Minus size={14} className="text-gray-500" />;
};

export default function EntertainmentPage() {
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const currentHero = heroContent[currentHeroIndex];
  const [activeStreamTab, setActiveStreamTab] = useState('Netflix');
  
  // MODAL STATE: 'trending' | 'trailers' | 'box-office' | 'gaming' | null
  const [openModal, setOpenModal] = useState(null); 

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroContent.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentHeroIndex((prev) => (prev + 1) % heroContent.length);
  const prevSlide = () => setCurrentHeroIndex((prev) => (prev === 0 ? heroContent.length - 1 : prev - 1));

  return (
    <div className="min-h-screen bg-navy-dark text-text-primary font-sans pb-20 selection:bg-pink-500 selection:text-white overflow-x-hidden">
      
      {/* BACKGROUND GRADIENTS */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[150px]"></div>
         <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pink-900/10 rounded-full blur-[150px]"></div>
      </div>

      {/* --- UNIVERSAL MODAL FOR VIEW ALL --- */}
      {openModal && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in">
            <div className="w-full max-w-6xl h-[85vh] bg-[#111] border border-pink-500/30 rounded-2xl overflow-hidden flex flex-col shadow-[0_0_50px_rgba(236,72,153,0.2)] relative">
                
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#050505]">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        {openModal === 'trending' && <Flame className="text-pink-500" />}
                        {openModal === 'trailers' && <Clapperboard className="text-pink-500" />}
                        {openModal === 'box-office' && <Trophy className="text-yellow-500" />}
                        {openModal === 'gaming' && <Gamepad2 className="text-cyan-400" />}
                        
                        {openModal === 'trending' ? 'All Trending Movies' : 
                         openModal === 'trailers' ? 'All Latest Trailers' : 
                         openModal === 'box-office' ? 'Global Box Office Charts' : 
                         'Gaming & Anime Archive'}
                    </h2>
                    <button onClick={() => setOpenModal(null)} className="p-2 bg-white/5 hover:bg-pink-600 rounded-full transition-colors">
                        <X size={24} className="text-white" />
                    </button>
                </div>

                <div className="p-8 overflow-y-auto custom-scrollbar">
                    {/* CASE: TRENDING MOVIES */}
                    {openModal === 'trending' && (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {allTrendingMovies.map((movie) => (
                                <Link href={`/news/entertainment-${movie.slug}`} key={movie.id} className="group relative cursor-pointer block">
                                    <div className="aspect-[2/3] rounded-xl overflow-hidden border border-white/10 relative shadow-2xl transition-all duration-300 group-hover:scale-105 group-hover:border-pink-500/50">
                                        <img src={movie.image} className="w-full h-full object-cover" />
                                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur px-2 py-1 rounded text-xs font-bold text-yellow-400 flex items-center gap-1">
                                            <Star size={10} className="fill-current" /> {movie.rating}
                                        </div>
                                    </div>
                                    <div className="mt-3 text-center">
                                        <h3 className="font-bold text-white text-sm group-hover:text-pink-500 transition-colors">{movie.title}</h3>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* CASE: TRAILERS */}
                    {openModal === 'trailers' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {allTrailers.map((trailer) => (
                                <Link href={`/news/entertainment-${trailer.slug}`} key={trailer.id} className="group relative aspect-video rounded-xl overflow-hidden bg-navy-light border border-white/5 hover:border-pink-500/50 transition-all cursor-pointer">
                                    <img src={trailer.image} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                                        <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Play size={16} className="fill-white text-white ml-1" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black/90 to-transparent">
                                        <h4 className="text-white text-xs font-bold truncate">{trailer.title}</h4>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* CASE: BOX OFFICE LEADERBOARD */}
                    {openModal === 'box-office' && (
                        <div className="space-y-2">
                            <div className="grid grid-cols-12 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-white/10 pb-2 mb-2 px-4">
                                <div className="col-span-1">Rank</div>
                                <div className="col-span-5">Title</div>
                                <div className="col-span-2 text-right">Weekend</div>
                                <div className="col-span-2 text-right">Total</div>
                                <div className="col-span-2 text-center">Trend</div>
                            </div>
                            {/* HERE IS THE FIX: USING fullBoxOffice */}
                            {fullBoxOffice.map((movie) => (
                                <Link href={`/news/entertainment-${movie.slug}`} key={movie.rank} className="grid grid-cols-12 items-center p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors group">
                                    <div className="col-span-1 text-2xl font-black text-white/20 group-hover:text-pink-500 transition-colors">{movie.rank}</div>
                                    <div className="col-span-5 flex items-center gap-4">
                                        <div className="w-10 h-14 rounded overflow-hidden bg-gray-800">
                                            <img src={movie.image} className="w-full h-full object-cover" />
                                        </div>
                                        <h4 className="text-white font-bold group-hover:text-pink-400 transition-colors">{movie.title}</h4>
                                    </div>
                                    <div className="col-span-2 text-right font-mono text-white font-bold">{movie.gross}</div>
                                    <div className="col-span-2 text-right font-mono text-text-secondary">{movie.total}</div>
                                    <div className="col-span-2 flex justify-center">
                                        <TrendIcon type={movie.trend} />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* CASE: GAMING */}
                    {openModal === 'gaming' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {gamingNews.map((game) => (
                                <Link href={`/news/entertainment-${game.slug}`} key={game.id} className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer border border-white/10 block hover:border-cyan-400/50 transition-all">
                                    <img src={game.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 p-6">
                                        <span className={`text-xs font-bold ${game.tag === 'ESPORTS' ? 'text-pink-500 bg-pink-500/10 border-pink-500/20' : 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20'} px-2 py-1 rounded border mb-2 inline-block`}>{game.tag}</span>
                                        <h3 className="text-xl font-bold text-white mb-1 leading-tight">{game.title}</h3>
                                        <p className="text-gray-400 text-xs line-clamp-2">{game.desc}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}

      <BuzzTicker />

      {/* --- HERO SLIDER --- */}
      <div className="relative h-[75vh] w-full overflow-hidden group mb-16">
          <div key={currentHero.id} className="absolute inset-0 animate-fade-in-zoom">
              <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-navy-dark/20 to-transparent z-10"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-navy-dark via-navy-dark/50 to-transparent z-10"></div>
              <img src={currentHero.image} className="w-full h-full object-cover opacity-80" alt={currentHero.title} />
          </div>
          <div className="absolute inset-0 z-20 container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-20">
              <div className="max-w-4xl animate-slide-up">
                  <div className="flex items-center gap-3 mb-4">
                      <span className="bg-pink-600 text-white text-[10px] font-black px-3 py-1 rounded uppercase tracking-widest shadow-lg shadow-pink-600/20">{currentHero.type}</span>
                      <span className="flex items-center gap-1 text-yellow-400 font-bold text-sm"><Star className="fill-current" size={14} /> {currentHero.rating}</span>
                  </div>
                  <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-[0.9] tracking-tighter font-serif drop-shadow-2xl">{currentHero.title}</h1>
                  <p className="text-lg md:text-xl text-gray-300 mb-8 font-light leading-relaxed max-w-2xl border-l-4 border-pink-500 pl-6">{currentHero.excerpt}</p>
                  <div className="flex flex-wrap gap-4">
                      <Link href={`/news/${currentHero.slug}`} className="flex items-center gap-3 px-8 py-4 bg-pink-600 text-white font-bold rounded-lg hover:bg-pink-500 transition-all transform hover:-translate-y-1 shadow-lg shadow-pink-600/20">
                          <Play size={20} className="fill-current" /> Watch Trailer
                      </Link>
                      <button className="flex items-center gap-3 px-8 py-4 bg-navy-light/50 backdrop-blur-md border border-white/10 text-white font-bold rounded-lg hover:bg-white/10 transition-all">
                          <Info size={20} /> Full Details
                      </button>
                  </div>
              </div>
          </div>
          <div className="absolute bottom-10 right-10 z-30 flex gap-2">
              <button onClick={prevSlide} className="p-3 rounded-lg bg-navy-light/80 hover:bg-pink-600 text-white transition-all border border-white/10"><ChevronLeft size={24} /></button>
              <button onClick={nextSlide} className="p-3 rounded-lg bg-navy-light/80 hover:bg-pink-600 text-white transition-all border border-white/10"><ChevronRight size={24} /></button>
          </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* --- SECTION 1: TRENDING MOVIES --- */}
          <div className="mb-20">
              <SectionHeader title="Trending Now" icon={Flame} onClick={() => setOpenModal('trending')} />
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {allTrendingMovies.slice(0, 5).map(movie => (
                      <Link href={`/news/entertainment-${movie.slug}`} key={movie.id} className="group relative cursor-pointer block">
                          <div className="aspect-[2/3] rounded-xl overflow-hidden border border-white/10 relative shadow-2xl transition-all duration-300 group-hover:scale-105 group-hover:shadow-pink-500/20 group-hover:border-pink-500/50">
                              <img src={movie.image} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
                                  <Ticket size={32} className="text-pink-500 mb-2" />
                                  <span className="text-sm font-bold text-white uppercase tracking-wider mb-2">Get Tickets</span>
                                  <RatingBadge rating={movie.rating} />
                              </div>
                          </div>
                          <div className="mt-4"><h3 className="font-bold text-lg leading-tight group-hover:text-pink-500 transition-colors">{movie.title}</h3><span className="text-xs text-gray-500 font-bold uppercase tracking-wider">{movie.genre}</span></div>
                      </Link>
                  ))}
              </div>
          </div>

          {/* --- SECTION 2: LATEST TRAILERS --- */}
          <div className="mb-20">
              <SectionHeader title="Latest Trailers" icon={Clapperboard} onClick={() => setOpenModal('trailers')} />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allTrailers.slice(0, 3).map(trailer => (
                      <Link href={`/news/entertainment-${trailer.slug}`} key={trailer.id} className="group relative aspect-video rounded-xl overflow-hidden bg-navy-light border border-white/5 hover:border-pink-500/50 transition-all cursor-pointer block">
                          <img src={trailer.image} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                              <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"><Play size={20} className="fill-white text-white ml-1" /></div>
                          </div>
                          <div className="absolute bottom-3 right-3 bg-black/80 px-2 py-1 rounded text-xs font-mono font-bold text-white">{trailer.duration}</div>
                          <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/90 to-transparent"><h4 className="text-white font-bold truncate">{trailer.title}</h4></div>
                      </Link>
                  ))}
              </div>
          </div>

          {/* --- SECTION 3: SPLIT LAYOUT --- */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
              <div className="lg:col-span-8">
                  <div className="bg-navy-light/30 border border-white/5 rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-6">
                          <h3 className="text-xl font-bold text-white flex items-center gap-2"><MonitorPlay className="text-pink-500" /> Streaming Guide</h3>
                          <div className="flex bg-navy-dark rounded-lg p-1">
                              {Object.keys(streamingData).map(tab => (
                                  <button key={tab} onClick={() => setActiveStreamTab(tab)} className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeStreamTab === tab ? 'bg-pink-600 text-white' : 'text-text-secondary hover:text-white'}`}>{tab}</button>
                              ))}
                          </div>
                      </div>
                      <div className="space-y-4">
                          {streamingData[activeStreamTab].map((item) => (
                              <Link href={`/news/entertainment-${item.slug}`} key={item.id} className="flex gap-4 p-4 bg-navy-dark/50 rounded-xl border border-white/5 hover:border-pink-500/30 transition-all group cursor-pointer">
                                  <div className="w-32 h-20 rounded-lg overflow-hidden shrink-0 relative">
                                      <img src={item.image} className="w-full h-full object-cover" />
                                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Play size={20} className="text-white fill-current" /></div>
                                  </div>
                                  <div className="flex-grow flex flex-col justify-center">
                                      <div className="flex items-center gap-2 mb-1"><span className="text-[10px] font-bold bg-white/10 text-white px-2 py-0.5 rounded">{item.season}</span><span className="text-[10px] text-green-400 font-bold">{item.match} Match</span></div>
                                      <h4 className="text-lg font-bold text-white group-hover:text-pink-500 transition-colors">{item.title}</h4>
                                      <p className="text-xs text-text-secondary mt-1 line-clamp-1">New episodes dropping this Friday. Don't miss the finale.</p>
                                  </div>
                                  <div className="flex items-center"><button className="p-2 rounded-full border border-white/10 hover:bg-pink-600 hover:border-pink-600 transition-all"><ArrowRight size={16} /></button></div>
                              </Link>
                          ))}
                      </div>
                  </div>
              </div>

              <div className="lg:col-span-4">
                  <div className="bg-gradient-to-b from-navy-light to-navy-dark border border-white/10 rounded-2xl p-6">
                      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Trophy className="text-yellow-500" /> Box Office Top 5</h3>
                      <div className="space-y-1">
                          {fullBoxOffice.slice(0, 5).map((movie) => (
                              <Link href={`/news/entertainment-${movie.slug}`} key={movie.rank} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group">
                                  <div className="flex items-center gap-4">
                                      <span className={`text-2xl font-black w-6 ${movie.rank === 1 ? 'text-yellow-500' : 'text-gray-600'}`}>{movie.rank}</span>
                                      <div><h4 className="font-bold text-white text-sm group-hover:text-pink-500 transition-colors">{movie.title}</h4><span className="text-xs text-text-secondary">Wknd Gross</span></div>
                                  </div>
                                  <div className="text-right"><div className="font-mono font-bold text-white">{movie.gross}</div><div className={`text-[10px] font-bold uppercase ${movie.trend === 'up' ? 'text-green-500' : movie.trend === 'down' ? 'text-red-500' : 'text-gray-500'}`}>{movie.trend}</div></div>
                              </Link>
                          ))}
                      </div>
                      <button 
                        onClick={() => setOpenModal('box-office')}
                        className="w-full mt-6 py-3 border border-white/10 rounded-xl text-xs font-bold text-text-secondary hover:bg-white/5 hover:text-white transition-all"
                      >
                        View Full Charts
                      </button>
                  </div>
              </div>
          </div>

          {/* --- SECTION 4: GAMING & ANIME --- */}
          <div className="mb-24">
              <SectionHeader title="Gaming & Anime World" icon={Gamepad2} onClick={() => setOpenModal('gaming')} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {gamingNews.map((game) => (
                      <Link href={`/news/entertainment-${game.slug}`} key={game.id} className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer border border-white/10 block">
                          <img src={game.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                          <div className="absolute bottom-0 left-0 p-8">
                              <span className={`text-xs font-bold ${game.tag === 'ESPORTS' ? 'text-pink-500 bg-pink-500/10 border-pink-500/20' : 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20'} px-2 py-1 rounded border mb-3 inline-block`}>{game.tag}</span>
                              <h3 className="text-2xl font-bold text-white mb-2">{game.title}</h3>
                              <p className="text-gray-400 text-sm">{game.desc}</p>
                          </div>
                      </Link>
                  ))}
              </div>
          </div>

      </div>

      <style jsx global>{`
        @keyframes marquee-slow { 0% { transform: translateX(0); } 100% { transform: translateX(-100%); } }
        .animate-marquee-slow { animation: marquee-slow 60s linear infinite; }
        
        @keyframes fade-in-zoom { 
            0% { opacity: 0; transform: scale(1.1); } 
            100% { opacity: 1; transform: scale(1); } 
        }
        .animate-fade-in-zoom { animation: fade-in-zoom 1.5s ease-out forwards; }
        
        @keyframes slide-up { 
            0% { opacity: 0; transform: translateY(20px); } 
            100% { opacity: 1; transform: translateY(0); } 
        }
        .animate-slide-up { animation: slide-up 0.8s ease-out 0.5s forwards; opacity: 0; }

        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #0a192f; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #112240; border-radius: 10px; border: 1px solid #db2777; }
      `}</style>
    </div>
  );
}