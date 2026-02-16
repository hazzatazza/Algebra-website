
import React from 'react';
import { Page } from '../types.ts';

interface NavbarProps {
  onNavigate: (page: Page) => void;
  currentPage: Page;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage }) => {
  return (
    <nav className="sticky top-0 z-50 bg-black/60 backdrop-blur-xl border-b border-blue-500/20 px-6 py-3">
      <div className="container mx-auto flex justify-between items-center">
        <div 
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500 blur-lg opacity-40 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative w-10 h-10 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-2xl border border-white/20 transform group-hover:rotate-12 transition-transform">
              <span className="text-white font-black text-xl font-bungee">A</span>
            </div>
          </div>
          <h1 className="text-xl font-black font-bungee tracking-tighter text-white group-hover:text-blue-400 transition-colors uppercase">
            Algebra Practise
          </h1>
        </div>
        
        <div className="flex gap-4 items-center">
          <button 
            onClick={() => onNavigate('home')}
            className={`px-4 py-2 rounded-lg font-bold text-xs tracking-widest transition-all ${currentPage === 'home' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            HOME
          </button>
          
          <button 
             onClick={() => {
                const win = window.open('about:blank', '_blank');
                if (win) {
                  win.document.title = 'Home | Compass';
                  win.document.body.style.margin = '0';
                  win.document.body.style.height = '100vh';
                  win.document.body.style.backgroundColor = '#000';
                  win.document.body.innerHTML = `
                    <style>body,html,iframe{margin:0;padding:0;height:100%;width:100%;overflow:hidden;border:none;}</style>
                    <iframe src="${window.location.href}" allowfullscreen></iframe>
                  `;
                }
             }}
             className="hidden md:flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black px-4 py-2 rounded-lg border border-slate-800 transition-all active:scale-95 hover:border-blue-500"
          >
            CLOAK
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
