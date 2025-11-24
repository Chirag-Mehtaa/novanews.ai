import React from 'react';

export const Footer = () => {
  return (
    <footer className="bg-navy-light border-t border-teal-accent/20 mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold text-teal-accent">NovaNews</h3>
            <p className="text-text-secondary mt-1">Global News, Reimagined.</p>
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-text-secondary hover:text-teal-accent">About</a>
            <a href="#" className="text-text-secondary hover:text-teal-accent">Privacy Policy</a>
            <a href="#" className="text-text-secondary hover:text-teal-accent">Terms of Use</a>
            <a href="#" className="text-text-secondary hover:text-teal-accent">Contact</a>
          </div>
        </div>
        <div className="mt-8 border-t border-navy-dark pt-4 text-center">
          <p className="text-sm text-text-secondary">
            &copy; {new Date().getFullYear()} NovaNews. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};