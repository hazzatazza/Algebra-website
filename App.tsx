import React, { useState, useEffect, useRef } from 'react';
import { Game, Page } from './types.ts';
import Navbar from './components/Navbar.tsx';
import GameGrid from './components/GameGrid.tsx';
import AboutPage from './components/AboutPage.tsx';
import GamePlayer from './components/GamePlayer.tsx';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [games, setGames] = useState<Game[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'embed' | 'backup'>('embed');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [newGame, setNewGame] = useState({
    title: '',
    description: '',
    type: 'url' as 'url' | 'html',
    content: ''
  });

  const loadAllGames = async () => {
    try {
      setLoading(true);
      
      // Add a 5-second timeout to the fetch to prevent permanent loading if the server hangs
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch('./games.json', { signal: controller.signal });
      clearTimeout(timeoutId);
      
      let initialGames: Game[] = [];
      if (response.ok) {
        initialGames = await response.json();
      }
      
      const saved = localStorage.getItem('custom_games_v1');
      if (saved) {
        try {
          const customGames = JSON.parse(saved);
          if (Array.isArray(customGames)) {
            const customIds = new Set(customGames.map((g: Game) => g.id));
            const filteredInitial = initialGames.filter(g => !customIds.has(g.id));
            setGames([...filteredInitial, ...customGames]);
          } else {
            setGames(initialGames);
          }
        } catch (e) {
          console.error("Local storage corrupt, resetting to defaults.");
          setGames(initialGames);
        }
      } else {
        setGames(initialGames);
      }
    } catch (error) {
      console.error("Failed to load games database:", error);
      // Fallback: If fetch fails, we at least try to show local custom games
      const saved = localStorage.getItem('custom_games_v1');
      if (saved) {
        try {
          setGames(JSON.parse(saved));
        } catch {
          setGames([]);
        }
      }
    } finally {
      // Small timeout to ensure visual consistency
      setTimeout(() => setLoading(false), 200);
    }
  };

  useEffect(() => {
    loadAllGames();
  }, []);

  const handleAddGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGame.title || !newGame.content) return;

    const customGame: Game = {
      id: `custom-${Date.now()}`,
      title: newGame.title,
      description: newGame.description || 'Custom embedded game.',
      iframeUrl: newGame.type === 'url' ? newGame.content : '',
      htmlCode: newGame.type === 'html' ? newGame.content : undefined,
      isCustom: true,
      category: 'Custom'
    };

    try {
      const currentCustom = JSON.parse(localStorage.getItem('custom_games_v1') || '[]');
      const updatedCustomGames = [...currentCustom, customGame];
      localStorage.setItem('custom_games_v1', JSON.stringify(updatedCustomGames));
      loadAllGames();
    } catch (err) {
      console.error("Failed to save custom game:", err);
    }
    
    setIsModalOpen(false);
    setNewGame({ title: '', description: '', type: 'url', content: '' });
  };

  const handleDeleteGame = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const currentCustom = JSON.parse(localStorage.getItem('custom_games_v1') || '[]');
      const updatedCustom = currentCustom.filter((g: Game) => g.id !== id);
      localStorage.setItem('custom_games_v1', JSON.stringify(updatedCustom));
      loadAllGames();
    } catch (err) {
      console.error("Failed to delete game:", err);
    }
  };

  const handleRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported)) {
          const currentCustom = JSON.parse(localStorage.getItem('custom_games_v1') || '[]');
          const existingIds = new Set(currentCustom.map((g: any) => g.id));
          const newOnes = imported.filter((g: any) => !existingIds.has(g.id));
          
          localStorage.setItem('custom_games_v1', JSON.stringify([...currentCustom, ...newOnes]));
          loadAllGames();
          alert(`${newOnes.length} games restored successfully!`);
          setIsModalOpen(false);
        }
      } catch (err) {
        alert("Failed to read backup file. Make sure it's a valid JSON.");
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const filteredGames = games.filter(g => 
    g.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    g.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLaunchGame = (game: Game) => {
    setSelectedGame(game);
    setCurrentPage('playing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setCurrentPage('home');
    setSelectedGame(null);
  };

  return (
    <div className="min-h-screen flex flex-col relative z-10">
      <Navbar onNavigate={(p) => { setCurrentPage(p); setSelectedGame(null); }} currentPage={currentPage} />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {currentPage === 'home' && (
          <section className="animate-in fade-in duration-700">
            <div className="mb-12 text-center py-10 relative">
              <div className="absolute top-0 right-0 flex gap-2">
                <button 
                  onClick={() => { setModalTab('embed'); setIsModalOpen(true); }}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-black px-5 py-3 rounded-xl transition-all shadow-xl shadow-blue-600/20 active:scale-95 flex items-center gap-2 uppercase font-bungee text-xs"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                  EMBED
                </button>
                <button 
                  onClick={() => { setModalTab('backup'); setIsModalOpen(true); }}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-black px-4 py-3 rounded-xl transition-all active:scale-95"
                  title="Backup Settings"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline></svg>
                </button>
              </div>
              <h2 className="text-5xl font-black text-white mb-4 font-bungee tracking-wider neon-glow">
                ALGEBRA PRACTISE
              </h2>
              <div className="relative max-w-md mx-auto">
                <input 
                  type="text"
                  placeholder="SEARCH GAMES..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900/50 border-2 border-slate-800 rounded-full py-3 px-6 text-white font-bold focus:outline-none focus:border-blue-500 transition-all text-center uppercase tracking-widest text-sm"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </div>
              </div>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-64 gap-3">
                <div className="animate-pulse h-4 w-4 bg-blue-500 rounded-full"></div>
                <div className="animate-pulse h-4 w-4 bg-purple-500 rounded-full" style={{ animationDelay: '0.1s' }}></div>
                <div className="animate-pulse h-4 w-4 bg-pink-500 rounded-full" style={{ animationDelay: '0.2s' }}></div>
              </div>
            ) : (
              <GameGrid games={filteredGames} onLaunch={handleLaunchGame} onDelete={handleDeleteGame} />
            )}
          </section>
        )}

        {currentPage === 'playing' && selectedGame && (
          <GamePlayer game={selectedGame} onBack={handleBack} />
        )}

        {currentPage === 'about' && (
          <AboutPage />
        )}
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-slate-900 border-2 border-blue-500/30 rounded-[2rem] w-full max-w-xl overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-white/5 bg-gradient-to-r from-blue-900/20 to-transparent flex justify-between items-center">
              <div className="flex gap-4">
                <button 
                  onClick={() => setModalTab('embed')}
                  className={`text-sm font-black font-bungee uppercase tracking-tighter transition-colors ${modalTab === 'embed' ? 'text-white' : 'text-slate-600'}`}
                >
                  Embed
                </button>
                <button 
                  onClick={() => setModalTab('backup')}
                  className={`text-sm font-black font-bungee uppercase tracking-tighter transition-colors ${modalTab === 'backup' ? 'text-white' : 'text-slate-600'}`}
                >
                  Backup
                </button>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            
            <div className="p-6">
              {modalTab === 'embed' ? (
                <form onSubmit={handleAddGame} className="space-y-5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest font-bungee">Game Title</label>
                    <input 
                      autoFocus required type="text" 
                      value={newGame.title}
                      onChange={e => setNewGame({...newGame, title: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                      placeholder="My Awesome Game"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button type="button" onClick={() => setNewGame({...newGame, type: 'url'})} className={`py-2 rounded-xl font-bold border transition-all ${newGame.type === 'url' ? 'bg-blue-600 text-white border-blue-400' : 'bg-black/30 text-slate-500 border-white/5'}`}>URL</button>
                    <button type="button" onClick={() => setNewGame({...newGame, type: 'html'})} className={`py-2 rounded-xl font-bold border transition-all ${newGame.type === 'html' ? 'bg-blue-600 text-white border-blue-400' : 'bg-black/30 text-slate-500 border-white/5'}`}>HTML</button>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest font-bungee">Game Content</label>
                    <textarea 
                      required rows={4}
                      value={newGame.content}
                      onChange={e => setNewGame({...newGame, content: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors font-mono text-xs"
                      placeholder={newGame.type === 'url' ? 'https://...' : '<html>...'}
                    />
                  </div>
                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl transition-all font-bungee uppercase">Launch Game</button>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="bg-black/40 p-5 rounded-2xl border border-white/5">
                    <p className="text-slate-400 text-xs mb-6 text-center">Manage your local data and custom games.</p>
                    
                    <div className="flex flex-col gap-3">
                      <button 
                        onClick={() => {
                          const customOnly = games.filter(g => g.isCustom);
                          const dataStr = JSON.stringify(customOnly, null, 2);
                          const blob = new Blob([dataStr], {type: 'application/json'});
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = 'algebra-practise-backup.json';
                          a.click();
                        }} 
                        className="w-full bg-slate-800 hover:bg-slate-700 py-4 rounded-xl text-white font-black text-xs uppercase tracking-widest border border-white/5 transition-all active:scale-95"
                      >
                        Download Backup
                      </button>
                      
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                      >
                        Restore Backup
                      </button>
                    </div>
                    
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleRestore} 
                      accept=".json" 
                      className="hidden" 
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <footer className="py-8 mt-12 border-t border-white/5 opacity-50">
        <div className="container mx-auto text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">Algebra Practise &bull; 2025</p>
        </div>
      </footer>
    </div>
  );
};

export default App;