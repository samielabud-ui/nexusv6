
import React from 'react';

interface HeaderProps {
  currentView: 'inicio' | 'questoes' | 'pbl';
  onNavigate: (view: 'inicio' | 'questoes' | 'pbl') => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onNavigate }) => {
  return (
    <header className="border-b border-neutral-800 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-[1800px] mx-auto px-8 h-16 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => onNavigate('inicio')}
        >
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-lg text-white">N</div>
          <span className="text-xl font-bold tracking-tight text-white">NexusBQ</span>
        </div>
        <nav className="flex items-center gap-8 text-sm font-medium">
          <button 
            onClick={() => onNavigate('inicio')}
            className={`transition-colors py-2 px-1 border-b-2 ${currentView === 'inicio' ? 'text-white border-blue-600' : 'text-neutral-400 border-transparent hover:text-white'}`}
          >
            Início
          </button>
          <button 
            onClick={() => onNavigate('pbl')}
            className={`transition-colors py-2 px-1 border-b-2 ${currentView === 'pbl' ? 'text-white border-blue-600' : 'text-neutral-400 border-transparent hover:text-white'}`}
          >
            PBL
          </button>
          <button 
            onClick={() => onNavigate('questoes')}
            className={`transition-colors py-2 px-1 border-b-2 ${currentView === 'questoes' ? 'text-white border-blue-600' : 'text-neutral-400 border-transparent hover:text-white'}`}
          >
            Questões
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
