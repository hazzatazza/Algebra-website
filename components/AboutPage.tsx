
import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-20 px-10 bg-slate-900/80 rounded-[3rem] border-2 border-white/5 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col items-center text-center space-y-12">
        <div className="relative">
          <div className="absolute -inset-4 bg-blue-600 blur-2xl opacity-20 animate-pulse"></div>
          <div className="relative w-32 h-32 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] flex items-center justify-center shadow-2xl transform rotate-3">
             <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
          </div>
        </div>
        
        <div className="space-y-6">
          <p className="text-3xl font-bold text-blue-300">created by hazza 2025</p>
          <div className="h-1 w-20 bg-gradient-to-r from-transparent via-blue-500 to-transparent mx-auto"></div>
          <h1 className="text-6xl font-black text-white font-bungee tracking-tighter neon-glow uppercase">
            Algebra Practise &copy;
          </h1>
        </div>

        <div className="text-slate-400 text-lg leading-relaxed max-w-2xl font-medium">
          <p>
            i literally made this site with ai i hope it works at school
          </p>
        </div>

        <div className="pt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
          <div className="bg-black/60 p-8 rounded-3xl border border-white/5 hover:border-blue-500/40 transition-colors">
            <h4 className="text-blue-500 font-black text-xs uppercase tracking-widest mb-2 font-bungee">Speed</h4>
            <p className="text-white text-2xl font-bold">120 FPS+</p>
          </div>
          <div className="bg-black/60 p-8 rounded-3xl border border-white/5 hover:border-purple-500/40 transition-colors">
            <h4 className="text-purple-500 font-black text-xs uppercase tracking-widest mb-2 font-bungee">Privacy</h4>
            <p className="text-white text-2xl font-bold">Stealth View</p>
          </div>
          <div className="bg-black/60 p-8 rounded-3xl border border-white/5 hover:border-pink-500/40 transition-colors">
            <h4 className="text-pink-500 font-black text-xs uppercase tracking-widest mb-2 font-bungee">Library</h4>
            <p className="text-white text-2xl font-bold">Curated</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
