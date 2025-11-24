"use client"; 

import React, { useState } from 'react';
import { Menu, X, User, LogOut } from 'lucide-react'; // Search icon hata diya
import Link from 'next/link';
import { useSession, signIn, signOut } from "next-auth/react"; 

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session } = useSession(); 

  const navItems = [
    { name: 'World', href: '/category/world' },
    { name: 'Business', href: '/category/business' },
    { name: 'Technology', href: '/category/technology' },
    { name: 'Science', href: '/category/science' },
    { name: 'Entertainment', href: '/category/entertainment' },
  ];

  return (
    <header className="relative bg-navy-dark/80 backdrop-blur-sm border-b border-navy-light/50 z-[60]">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-teal-accent">NovaNews</Link>

          <div className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <Link key={item.name} href={item.href} className="font-medium text-text-secondary hover:text-teal-accent transition-colors">
                {item.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {/* Search Button Removed Here */}
            
            {/* Conditional Rendering based on Session */}
            {session ? (
              <div className="flex items-center gap-3">
                 <img 
                   src={session.user.image} 
                   alt="Profile" 
                   className="w-9 h-9 rounded-full border-2 border-teal-accent"
                 />
                 <button onClick={() => signOut()} className="p-2 text-red-400 hover:bg-white/10 rounded-full transition-all" title="Sign Out">
                   <LogOut size={18} />
                 </button>
              </div>
            ) : (
              <button onClick={() => signIn("google")} className="flex items-center space-x-2 px-4 py-2 bg-navy-light rounded-lg text-text-primary hover:bg-opacity-80 transition-colors border border-white/10">
                <User className="w-5 h-5 text-teal-accent" />
                <span>Sign In</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
             {session && (
                <img src={session.user.image} className="w-8 h-8 rounded-full border border-teal-accent mr-2" />
             )}
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-md text-text-secondary hover:text-teal-accent hover:bg-navy-light">
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-navy-dark/95 backdrop-blur-md px-4 pt-2 pb-4 space-y-2 absolute w-full left-0 z-50 border-b border-teal-accent/20 shadow-2xl">
          {navItems.map((item) => (
            <Link key={item.name} href={item.href} className="block px-3 py-3 rounded-md text-base font-bold text-white hover:bg-navy-light hover:text-teal-accent border-b border-white/5 last:border-0" onClick={() => setIsMobileMenuOpen(false)}>
              {item.name}
            </Link>
          ))}
          <div className="pt-2">
            {session ? (
                <button onClick={() => signOut()} className="w-full flex items-center justify-center space-x-2 px-3 py-3 bg-red-500/10 text-red-400 font-bold rounded-lg hover:bg-red-500/20 transition-colors">
                    <LogOut className="w-5 h-5" /> <span>Sign Out</span>
                </button>
            ) : (
                <button onClick={() => signIn("google")} className="w-full flex items-center justify-center space-x-2 px-3 py-3 bg-teal-accent text-navy-dark font-bold rounded-lg hover:bg-white transition-colors">
                    <User className="w-5 h-5" /> <span>Sign In</span>
                </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};