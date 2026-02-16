
import React, { useRef, useMemo } from 'react';
import { Game } from '../types';

interface GamePlayerProps {
  game: Game;
  onBack: () => void;
}

const GamePlayer: React.FC<GamePlayerProps> = ({ game, onBack }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Generate a blob URL for custom HTML games to bypass sandbox/origin issues
  const effectiveUrl = useMemo(() => {
    if (game.htmlCode) {
      const blob = new Blob([game.htmlCode], { type: 'text/html' });
      return URL.createObjectURL(blob);
    }
    return game.iframeUrl;
  }, [game.htmlCode, game.iframeUrl]);

  const handleFullscreen = () => {
    const iframe = iframeRef.current;
    if (iframe) {
      if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
      } else if ((iframe as any).webkitRequestFullscreen) {
        (iframe as any).webkitRequestFullscreen();
      }
    }
  };

  const openInNewTab = () => {
    const win = window.open('about:blank', '_blank');
    if (win) {
      // For custom HTML, we need the raw code; for URLs, we need absolute paths
      let src = effectiveUrl;
      if (!game.htmlCode && !effectiveUrl.startsWith('http') && !effectiveUrl.startsWith('blob:')) {
        src = new URL(effectiveUrl, window.location.href).href;
      }
      
      const content = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Home | Compass</title>
            <style>
              body, html { margin: 0; padding: 0; height: 100%; width: 100%; overflow: hidden; background-color: #000; }
              iframe { width: 100%; height: 100%; border: none; }
            </style>
          </head>
          <body>
            <iframe 
              src="${src}" 
              style="width:100%; height:100%; border:none;"
              allow="autoplay; fullscreen; pointer-lock"
              allowfullscreen
            ></iframe>
          </body>
        </html>
      `;
      
      win.document.open();
      win.document.write(content);
      win.document.close();
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in zoom-in-95 fade-in duration-500">
      <div className="flex justify-between items-center bg-slate-900/40 p-3 rounded-2xl border border-white/5 backdrop-blur-sm">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white font-bold text-sm transition-all group px-4 py-2"
        >
          <svg className="group-hover:-translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          BACK TO HUB
        </button>
        <div className="flex gap-2">
           {!game.isCustom && (
             <button 
               onClick={openInNewTab}
               className="bg-slate-800 hover:bg-blue-600 text-white p-2 rounded-xl transition-all border border-white/10"
               title="Open Cloaked"
             >
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
             </button>
           )}
        </div>
      </div>

      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
        <div className="relative bg-black rounded-[2rem] overflow-hidden border-4 border-slate-900 shadow-2xl aspect-video w-full">
           <iframe 
             ref={iframeRef}
             src={effectiveUrl} 
             style={{ width: '100%', height: '100%', border: 'none' }}
             title={game.title}
             allow="autoplay; fullscreen; pointer-lock"
             allowFullScreen
           />
        </div>
      </div>

      <div className="bg-slate-900/80 border border-white/5 rounded-[2rem] p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-2xl backdrop-blur-md">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <h2 className="text-4xl font-black font-bungee text-white neon-glow uppercase tracking-tighter">{game.title}</h2>
             <span className={`${game.isCustom ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 'bg-blue-500/20 text-blue-400 border-blue-500/30'} text-[10px] font-black px-2 py-1 rounded-md border uppercase tracking-widest`}>
               {game.isCustom ? 'Custom Embed' : 'Live Now'}
             </span>
          </div>
          <p className="text-slate-400 font-medium max-w-xl text-lg">{game.description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          {!game.isCustom && (
            <button 
              onClick={openInNewTab}
              className="flex-grow md:flex-grow-0 flex items-center justify-center gap-3 bg-slate-800 hover:bg-slate-700 text-white font-black px-8 py-4 rounded-2xl transition-all border border-white/10 active:scale-95 text-lg uppercase font-bungee"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
              CLOAKED
            </button>
          )}

          <button 
            onClick={handleFullscreen}
            className="flex-grow md:flex-grow-0 flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 text-white font-black px-10 py-4 rounded-2xl transition-all shadow-xl shadow-blue-600/20 active:scale-95 text-lg uppercase font-bungee"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>
            FULLSCREEN
          </button>
        </div>
      </div>
    </div>
  );
};

export default GamePlayer;
