
import React from 'react';
import { Game } from '../types';
import GameCard from './GameCard';

interface GameGridProps {
  games: Game[];
  onLaunch: (game: Game) => void;
  onDelete?: (id: string, e: React.MouseEvent) => void;
}

const GameGrid: React.FC<GameGridProps> = ({ games, onLaunch, onDelete }) => {
  if (games.length === 0) {
    return (
      <div className="text-center py-20 bg-blue-900/10 rounded-[3rem] border-4 border-dashed border-blue-900/30">
        <p className="text-blue-400 font-bold text-xl uppercase tracking-widest animate-pulse">Scanning for games...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
      {games.map((game, idx) => (
        <GameCard 
          key={game.id} 
          game={game} 
          onClick={() => onLaunch(game)} 
          onDelete={onDelete ? (e) => onDelete(game.id, e) : undefined}
          index={idx} 
        />
      ))}
    </div>
  );
};

export default GameGrid;
