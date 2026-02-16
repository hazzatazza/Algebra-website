
import React from 'react';
import { Game } from '../types';

interface GameCardProps {
  game: Game;
  onClick: () => void;
  onDelete?: (e: React.MouseEvent) => void;
  index: number;
}

const GameCard: React.FC<GameCardProps> = ({ game, onClick, onDelete, index }) => {
  return (
    <div 
      onClick={onClick}
      style={{ animationDelay: `${index * 0.1}s` }}
      className="bg-slate-900/80 rounded-[2rem] overflow-hidden border-2 border-slate-800 hover:border-blue-500 hover:-translate-y-3 transition-all duration-300 flex flex-col group cursor-pointer shadow-xl animate-in fade-in slide-in-from-bottom-8 relative"
    >
      {game.isCustom && onDelete && (
        <button 
          onClick={onDelete}
          className="absolute top-2 right-2 z-20 bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white p-2 rounded-xl border border-red-500/40 transition-all opacity-0 group-hover:opacity-100"
          title="Delete custom game"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
        </button>
      )}

      <div className="relative aspect-[16/10] bg-slate-800 overflow-hidden">
        {game.thumbnail ? (
          <img 
            src={game.thumbnail} 
            alt={game.title} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${game.isCustom ? 'from-purple-900 to-indigo-950' : 'from-slate-800 to-slate-950'}`}>
             <span className="font-bungee text-2xl text-white/20 uppercase tracking-widest">{game.isCustom ? 'Custom' : 'Play'}</span>
          </div>
        )}
        
        <div className="absolute top-4 left-4">
           <span className={`${game.isCustom ? 'bg-purple-600' : 'bg-blue-600'} text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full text-white shadow-lg`}>
             {game.category || 'Arcade'}
           </span>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="bg-white text-black p-3 rounded-full shadow-2xl scale-50 group-hover:scale-100 transition-transform duration-300">
               <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            </div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-2xl font-black mb-2 text-white group-hover:text-blue-400 transition-colors uppercase font-bungee">
          {game.title}
        </h3>
        <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed font-medium">
          {game.description}
        </p>
      </div>
    </div>
  );
};

export default GameCard;
