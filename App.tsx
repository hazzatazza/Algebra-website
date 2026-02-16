
import React, { useState, useEffect } from 'react';
import { Game, Page } from './types.ts';
import Navbar from './components/Navbar.tsx';
import GameGrid from './components/GameGrid.tsx';
import AboutPage from './components/AboutPage.tsx';
import GamePlayer from './components/GamePlayer.tsx';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'embed' | 'backup'>('embed');
  
  const [newGame, setNewGame] = useState({
    title: '',
    description: '',
    type: 'url' as 'url' | 'html',
    content: ''
  });

  const loadAllGames = async () => {
    try {
      setLoading(true);
      const response = await fetch('./games.json');
      let initialGames: Game[] = [];
      if (response.ok) {
        initialGames = await response.json();
      }
      
      const saved = localStorage.getItem('custom_games_v1');
      if (saved) {
        const customGames = JSON.parse(saved);
        const customIds = new Set(customGames.map((g: Game) => g.id));
        const filteredInitial = initialGames.filter(g => !customIds.has(g.id));
        setGames([...filteredInitial, ...customGames]);
      } else {
        setGames(initialGames);
      }
    } catch (error) {
      console.error("Failed to load games:", error);
    } finally {
      setTimeout(() => setLoading(false), 300);
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

    const currentCustom = JSON.parse(localStorage.getItem('custom_games_v1') || '[]');
    const updatedCustomGames = [...currentCustom, customGame];
    localStorage.setItem('custom_games_v1', JSON.stringify(updatedCustomGames));
    
    loadAllGames();
    setIsModalOpen(false);
    setNewGame({ title: '', description: '', type: 'url', content: '' });
  };

  const handleDeleteGame = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const currentCustom = JSON.parse(localStorage.getItem('custom_games_v1') || '[]');
    const updatedCustom = currentCustom.filter((g: Game) => g.id !== id);
    localStorage.setItem('custom_games_v1', JSON.stringify(updatedCustom));
    loadAllGames();
  };

  const handleExportHub = () => {
    const customOnly = games.filter(g => g.isCustom);
    const dataStr = JSON.stringify(customOnly, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', 'algebra-practise-backup.json');
    linkElement.click();
  };

  const handleImportHub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported)) {
          const currentCustom = JSON.parse(localStorage.getItem('custom_games_v1') || '[]');
          const merged = [...currentCustom];
          const currentIds = new Set(merged.map(g => g.id));
          
          imported.forEach(g => {
            if (!currentIds.has(g.id)) {
              merged.push({...g, isCustom: true});
            }
          });

          localStorage.setItem('custom_games_v1', JSON.stringify(merged));
          loadAllGames();
          alert('Hub restored successfully!');
        }
      } catch (err) {
        alert('Failed to import backup file. Invalid JSON.');
      }
    };
    reader.readAsText(file);
  };

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
    <div className="min-h-screen flex flex-col">
      <Navbar onNavigate={(p) => { setCurrentPage(p); setSelectedGame(null); }} currentPage={currentPage} />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {currentPage === 'home' && (
          <section className="animate-in fade-in duration-700">
            <div className="mb-12 text-center py-10 relative">
              <div className="absolute top-0 right-0 flex gap-2">
                <button 
                  onClick={() => { setModalTab('embed'); setIsModalOpen(true); }}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-black px-6 py-3 rounded-2xl transition-all shadow-xl shadow-blue-600/20 active:scale-95 flex items-center gap-2 uppercase font-bungee text-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                  Embed
                </button>
                <button 
                  onClick={() => { setModalTab('backup'); setIsModalOpen(true); }}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-black px-4 py-3 rounded-2xl transition-all active:scale-95"
                  title="Backup/Restore Hub"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                </button>
              </div>
              <h2 className="text-6xl font-black text-white mb-4 font-bungee tracking-wider neon-glow">
                LEVEL UP!
              </h2>
              <p className="text-blue-300 text-lg max-w-2xl mx-auto font-medium">
                Embed your own HTML or URLs. Use the backup tool to keep them permanent!
              </p>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-64 gap-4">
                <div className="animate-bounce h-8 w-8 bg-blue-500 rounded-full"></div>
                <div className="animate-bounce h-8 w-8 bg-purple-500 rounded-full" style={{ animationDelay: '0.1s' }}></div>
                <div className="animate-bounce h-8 w-8 bg-pink-500 rounded-full" style={{ animationDelay: '0.2s' }}></div>
              </div>
            ) : (
              <GameGrid games={games} onLaunch={handleLaunchGame} onDelete={handleDeleteGame} />
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
          <div className="bg-slate-900 border-2 border-blue-500/30 rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/5 bg-gradient-to-r from-blue-900/20 to-transparent flex justify-between items-center">
              <div className="flex gap-4">
                <button 
                  onClick={() => setModalTab('embed')}
                  className={`text-xl font-black font-bungee uppercase tracking-tighter transition-colors ${modalTab === 'embed' ? 'text-white' : 'text-slate-600 hover:text-slate-400'}`}
                >
                  Embed Game
                </button>
                <button 
                  onClick={() => setModalTab('backup')}
                  className={`text-xl font-black font-bungee uppercase tracking-tighter transition-colors ${modalTab === 'backup' ? 'text-white' : 'text-slate-600 hover:text-slate-400'}`}
                >
                  Backup/Restore
                </button>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            
            <div className="p-8">
              {modalTab === 'embed' ? (
                <form onSubmit={handleAddGame} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-blue-400 uppercase tracking-widest font-bungee">Game Title</label>
                    <input 
                      autoFocus
                      required
                      type="text" 
                      value={newGame.title}
                      onChange={e => setNewGame({...newGame, title: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                      placeholder="e.g., My Awesome Game"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      type="button"
                      onClick={() => setNewGame({...newGame, type: 'url'})}
                      className={`py-3 rounded-xl font-bold transition-all border ${newGame.type === 'url' ? 'bg-blue-600 border-blue-400 text-white' : 'bg-black/30 border-white/5 text-slate-500'}`}
                    >
                      URL LINK
                    </button>
                    <button 
                      type="button"
                      onClick={() => setNewGame({...newGame, type: 'html'})}
                      className={`py-3 rounded-xl font-bold transition-all border ${newGame.type === 'html' ? 'bg-blue-600 border-blue-400 text-white' : 'bg-black/30 border-white/5 text-slate-500'}`}
                    >
                      HTML CODE
                    </button>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-blue-400 uppercase tracking-widest font-bungee">
                      {newGame.type === 'url' ? 'Iframe URL' : 'HTML Embed Code'}
                    </label>
                    <textarea 
                      required
                      rows={6}
                      value={newGame.content}
                      onChange={e => setNewGame({...newGame, content: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors font-mono text-sm"
                      placeholder={newGame.type === 'url' ? 'https://example.com/game' : '<html><body>...</body></html>'}
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-blue-600/20 uppercase font-bungee text-lg"
                  >
                    Add Game to Hub
                  </button>
                </form>
              ) : (
                <div className="space-y-8 py-4">
                  <div className="bg-black/40 p-6 rounded-[2rem] border border-white/5 space-y-4">
                    <h4 className="text-white font-black uppercase tracking-widest font-bungee">Export Hub Data</h4>
                    <p className="text-slate-400 text-sm">Download your custom games as a JSON file to keep them safe permanently or share with others.</p>
                    <button 
                      onClick={handleExportHub}
                      className="w-full bg-slate-800 hover:bg-slate-700 text-white font-black py-3 rounded-xl transition-all border border-white/10 uppercase font-bungee"
                    >
                      Download Backup
                    </button>
                  </div>

                  <div className="bg-black/40 p-6 rounded-[2rem] border border-white/5 space-y-4">
                    <h4 className="text-white font-black uppercase tracking-widest font-bungee">Restore Hub Data</h4>
                    <p className="text-slate-400 text-sm">Upload a previously saved hub backup file to restore your custom game list.</p>
                    <div className="relative">
                      <input 
                        type="file" 
                        accept=".json"
                        onChange={handleImportHub}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <div className="w-full bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border-2 border-dashed border-blue-500/30 rounded-xl py-8 text-center transition-colors">
                        <p className="font-bold">CLICK TO UPLOAD BACKUP FILE</p>
                        <p className="text-xs opacity-60">JSON format only</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <footer className="py-10 mt-20 border-t border-white/5 bg-black/40 backdrop-blur-sm">
        <div className="container mx-auto px-4 flex flex-col items-center gap-4">
          <button 
            onClick={() => { setCurrentPage('about'); setSelectedGame(null); }}
            className="text-blue-400 hover:text-white transition-all text-sm font-bold uppercase tracking-widest hover:scale-110"
          >
            About Site
          </button>
          <div className="flex items-center gap-3">
             <div className="h-[1px] w-8 bg-blue-900"></div>
             <p className="text-slate-500 text-xs font-medium uppercase tracking-tighter">Powered by Hazza Engines</p>
             <div className="h-[1px] w-8 bg-blue-900"></div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
