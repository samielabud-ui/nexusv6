
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import StatsDashboard from './components/StatsDashboard';
import QuestionsView from './components/QuestionsView';
import PBLView from './components/PBLView';
import AuthView from './components/AuthView';
import CycleSelection from './components/CycleSelection';
import { auth, db } from './lib/firebase';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, getDoc, updateDoc, onSnapshot, collection, query, where } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const App: React.FC = () => {
  const [view, setView] = useState<'inicio' | 'questoes' | 'pbl'>('inicio');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [updatingName, setUpdatingName] = useState(false);
  const [newName, setNewName] = useState('');
  
  const [userStats, setUserStats] = useState({
    displayName: '',
    totalAnswered: 0,
    totalCorrect: 0,
    totalErrors: 0,
    streak: 0,
    points: 0,
    ciclo: ''
  });
  const [ranking, setRanking] = useState<any[]>([]);

  // Auto-scroll para o topo quando a visualização principal muda
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view]);

  useEffect(() => {
    let unsubStats: (() => void) | undefined;
    let unsubRanking: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser) {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userDocRef);
          
          if (userSnap.exists() && userSnap.data().setupComplete) {
            setNeedsSetup(false);
            
            unsubStats = onSnapshot(userDocRef, (doc) => {
              if (doc.exists()) {
                const data = doc.data();
                setUserStats({
                  displayName: data.displayName || '',
                  totalAnswered: data.totalAnswered || 0,
                  totalCorrect: data.totalCorrect || 0,
                  totalErrors: data.totalErrors || 0,
                  streak: data.streak || 0,
                  points: data.points || 0,
                  ciclo: data.ciclo || ''
                });
              }
            });

            const ciclo = userSnap.data().ciclo;
            if (ciclo) {
              const q = query(collection(db, "users"), where("ciclo", "==", ciclo));
              unsubRanking = onSnapshot(q, (snapshot) => {
                const allUsers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                const rankData = allUsers
                  .sort((a: any, b: any) => (b.points || 0) - (a.points || 0))
                  .slice(0, 10)
                  .map((data: any, index) => ({
                    rank: index + 1,
                    name: data.displayName || "Estudante Anônimo",
                    points: data.points || 0,
                    isCurrentUser: data.id === currentUser.uid
                  }));
                setRanking(rankData);
              });
            }
          } else {
            setNeedsSetup(true);
          }
          setUser(currentUser);
        } else {
          setUser(null);
          setNeedsSetup(false);
          setRanking([]);
        }
      } catch (err) {
        console.error("Auth State Sync Error:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubStats) unsubStats();
      if (unsubRanking) unsubRanking();
    };
  }, []);

  const handleUpdateName = async () => {
    if (!newName.trim() || !user) return;
    setUpdatingName(true);
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { displayName: newName.trim() });
    } catch (err) {
      console.error("Erro ao atualizar nome:", err);
    } finally {
      setUpdatingName(false);
    }
  };

  const handleLogout = () => {
    setLoading(true);
    signOut(auth).finally(() => setLoading(false));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-neutral-500 text-xs font-mono uppercase tracking-widest animate-pulse">Carregando NexusBQ</p>
      </div>
    );
  }

  if (!user) return <AuthView />;
  if (needsSetup) return <CycleSelection onComplete={() => setNeedsSetup(false)} />;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5] flex flex-col">
      <Header currentView={view} onNavigate={setView} />
      
      <main className="max-w-[1800px] mx-auto pb-20 px-8 w-full flex-grow">
        {view === 'inicio' ? (
          <>
            <section className="py-12 text-center max-w-[1400px] mx-auto">
              {/* Perfil Incompleto Aviso */}
              {!userStats.displayName && (
                <div className="mb-8 bg-blue-600/10 border border-blue-600/30 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 animate-in slide-in-from-top-4 duration-500">
                  <div className="flex items-center gap-3 text-left">
                    <div className="w-10 h-10 bg-blue-600/20 rounded-full flex items-center justify-center text-blue-500">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Complete seu perfil</p>
                      <p className="text-xs text-neutral-400">Adicione seu nome para personalizar sua experiência.</p>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full md:w-auto">
                    <input 
                      type="text" 
                      placeholder="Seu nome"
                      className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs focus:border-blue-600 outline-none flex-grow"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                    />
                    <button 
                      onClick={handleUpdateName}
                      disabled={updatingName || !newName.trim()}
                      className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold disabled:opacity-50 transition-all"
                    >
                      {updatingName ? '...' : 'Salvar'}
                    </button>
                  </div>
                </div>
              )}

              <div className="flex justify-end mb-4">
                <button 
                  onClick={handleLogout}
                  className="group flex items-center gap-2 text-[10px] uppercase tracking-widest text-neutral-600 hover:text-red-500 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                  Sair
                </button>
              </div>
              
              <h1 className="text-5xl font-extrabold text-white mb-4 tracking-tight">
                Olá, {userStats.displayName || 'Estudante'}!
              </h1>
              <p className="text-xl text-neutral-400 font-light max-w-3xl mx-auto">
                Seu progresso no <span className="text-blue-500 font-medium">NexusBQ</span> está excelente. 
                Ciclo Atual: <span className="text-neutral-200">{userStats.ciclo}</span>.
              </p>
            </section>
            
            <div className="max-w-[1600px] mx-auto">
              <StatsDashboard stats={userStats} ranking={ranking} />
            </div>
          </>
        ) : view === 'questoes' ? (
          <div className="pt-12">
            <QuestionsView />
          </div>
        ) : (
          <div className="pt-12">
            <PBLView userDisplayName={userStats.displayName} />
          </div>
        )}
      </main>

      <footer className="border-t border-neutral-900 py-10 mt-auto">
        <div className="max-w-[1800px] mx-auto px-8 text-center">
          <p className="text-neutral-600 text-[10px] tracking-[0.3em] uppercase font-medium">
            &copy; {new Date().getFullYear()} NexusBQ &bull; Medicina PBL
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
