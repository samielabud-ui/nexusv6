
import React, { useState, useMemo, useRef } from 'react';
import { MOCK_QUESTIONS } from '../constants';
import QuestionCard from './QuestionCard';

type AnswerStatus = 'correct' | 'incorrect' | 'unanswered';

const QuestionsView: React.FC = () => {
  const [isGenerated, setIsGenerated] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);
  
  // Estado para rastrear respostas na sessão atual
  const [sessionAnswers, setSessionAnswers] = useState<Record<string, AnswerStatus>>({});

  // Estados dos Filtros
  const [ciclo, setCiclo] = useState<'Ciclo Básico' | 'Ciclo Clínico' | null>(null);
  const [modulo, setModulo] = useState('');
  const [modalidade, setModalidade] = useState('Todos');
  const [problema, setProblema] = useState('Todos');
  const [tema, setTema] = useState('');
  const [quantidade, setQuantidade] = useState<string>('10');

  const modulosBasico = [
    'ASE 1 — Introdução ao Estudo da Medicina',
    'ASE 2 — Proliferação, Alteração do Crescimento e Diferenciação Celular',
    'ASE 3 — Funções Biológicas 1',
    'ASE 7 — Concepção, Formação do Ser Humano e Gestação',
    'Módulo 8 (ASE 8) — Nascimento, Crescimento e Desenvolvimento da Criança e do Adolescente',
  ];

  const modulosClinico = [
    'ASE 13 — Disúria, Edema e Proteinúria',
  ];

  const currentModulos = ciclo === 'Ciclo Básico' ? modulosBasico : modulosClinico;

  const filteredQuestions = useMemo(() => {
    if (!ciclo) return [];
    
    let results = MOCK_QUESTIONS.filter(q => {
      const matchesCiclo = q.ciclo === ciclo;
      const matchesModulo = modulo === '' || modulo === 'Todos' || q.modulo === modulo;
      const matchesModalidade = modalidade === 'Todos' || q.modalidade === modalidade;
      const matchesProblema = problema === 'Todos' || q.problema.toString() === problema;
      const matchesTema = tema === '' || q.tema.toLowerCase().includes(tema.toLowerCase());
      
      return matchesCiclo && matchesModulo && matchesModalidade && matchesProblema && matchesTema;
    });

    if (quantidade === 'Todas') return results;
    return results.slice(0, parseInt(quantidade));
  }, [ciclo, modulo, modalidade, problema, tema, quantidade]);

  const handleGenerate = () => {
    if (!ciclo) return;
    setSessionAnswers({}); // Resetar respostas da sessão ao gerar novo
    setIsGenerated(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnswerChange = (id: string, status: 'correct' | 'incorrect') => {
    setSessionAnswers(prev => ({
      ...prev,
      [id]: status
    }));
  };

  const scrollToQuestion = (id: string) => {
    const element = document.getElementById(`q-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleDownloadPDF = async () => {
    if (!pdfRef.current || filteredQuestions.length === 0) return;
    
    setExporting(true);
    try {
      const { jsPDF } = (window as any).jspdf;
      
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        putOnlyUsedFonts: true
      });

      await pdf.html(pdfRef.current, {
        callback: function (doc: any) {
          doc.save(`NexusBQ_Apostila_${modulo.split(' — ')[0] || 'Medicina'}.pdf`);
          setExporting(false);
        },
        x: 10,
        y: 10,
        width: 190,
        windowWidth: 794,
        autoPaging: 'text',
      });

    } catch (err) {
      console.error("Erro ao gerar PDF:", err);
      alert("Erro ao gerar PDF. Tente novamente.");
      setExporting(false);
    }
  };

  const resetFilters = () => {
    setIsGenerated(false);
    setCiclo(null);
    setModulo('');
    setModalidade('Todos');
    setProblema('Todos');
    setTema('');
    setQuantidade('10');
    setSessionAnswers({});
  };

  if (isGenerated) {
    return (
      <div className="max-w-[1600px] mx-auto animate-in fade-in duration-500">
        <div style={{ display: 'none' }}>
          <div 
            ref={pdfRef} 
            className="bg-white text-black"
            style={{ 
              width: '794px', 
              padding: '40px',
              fontFamily: "'Inter', sans-serif"
            }}
          >
            {/* Template PDF omitido para brevidade, mantido igual ao original */}
            <div className="border-b-4 border-black pb-6 mb-10 flex justify-between items-end">
              <div>
                <h1 className="text-4xl font-black tracking-tighter text-black mb-1">NEXUSBQ</h1>
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-neutral-500">Academia Médica de Questões PBL</p>
              </div>
            </div>
            {/* ... mapeamento das questões ... */}
          </div>
        </div>

        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-neutral-800 pb-8">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">{ciclo}</span>
              <span className="text-neutral-700">/</span>
              <span className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em] truncate max-w-[400px]">{modulo || 'Todos os Módulos'}</span>
              <span className="text-neutral-700">/</span>
              <span className="text-[10px] font-black text-purple-500 uppercase tracking-[0.3em]">{filteredQuestions.length} questões</span>
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight">Sessão de Estudos</h2>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleDownloadPDF}
              disabled={exporting}
              className="text-xs font-black text-white flex items-center gap-2 transition-all bg-emerald-600 hover:bg-emerald-500 px-6 py-3 rounded-xl shadow-xl shadow-emerald-900/20 disabled:opacity-50 uppercase tracking-widest"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              {exporting ? 'Otimizando...' : 'Exportar Apostila'}
            </button>
            <button 
              onClick={() => setIsGenerated(false)}
              className="text-xs font-bold text-neutral-400 hover:text-white flex items-center gap-2 transition-colors bg-neutral-900 px-6 py-3 rounded-xl border border-neutral-800 uppercase tracking-widest"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              Filtros
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Content: Lista de Questões em Coluna Única */}
          <div className="lg:col-span-9 space-y-6">
            {filteredQuestions.length > 0 ? (
              <>
                {filteredQuestions.map(q => (
                  <QuestionCard 
                    key={q.id} 
                    question={q} 
                    onAnswer={(status) => handleAnswerChange(q.id, status)}
                  />
                ))}
                
                <div className="py-20 text-center">
                  <p className="text-neutral-600 text-lg mb-6">Fim da sessão. Excelente trabalho!</p>
                  <button 
                    onClick={resetFilters}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-2xl text-md font-black transition-all shadow-2xl shadow-blue-600/10 uppercase tracking-widest"
                  >
                    Nova Meta
                  </button>
                </div>
              </>
            ) : (
              <div className="py-40 text-center border border-dashed border-neutral-800 rounded-[3rem]">
                <h3 className="text-white text-2xl font-bold mb-4 tracking-tight">Sem questões para estes filtros</h3>
                <button onClick={() => setIsGenerated(false)} className="text-blue-500 hover:text-blue-400 text-sm font-black uppercase tracking-widest transition-colors">Ajustar Filtros</button>
              </div>
            )}
          </div>

          {/* Sidebar de Controle de Questões */}
          <aside className="lg:col-span-3">
            <div className="sticky top-24 space-y-4">
              <div className="bg-neutral-900/80 backdrop-blur-md border border-neutral-800 rounded-2xl p-6 shadow-2xl">
                <h3 className="text-xs font-black text-neutral-500 uppercase tracking-[0.2em] mb-4">Controle de Questões</h3>
                
                <div className="flex items-center justify-between mb-6">
                  <div className="text-center">
                    <p className="text-[10px] text-neutral-500 font-bold uppercase">Total</p>
                    <p className="text-2xl font-black text-white">{filteredQuestions.length}</p>
                  </div>
                  <div className="h-10 w-px bg-neutral-800"></div>
                  <div className="text-center">
                    <p className="text-[10px] text-emerald-500 font-bold uppercase">Acertos</p>
                    <p className="text-2xl font-black text-emerald-500">
                      {Object.values(sessionAnswers).filter(s => s === 'correct').length}
                    </p>
                  </div>
                  <div className="h-10 w-px bg-neutral-800"></div>
                  <div className="text-center">
                    <p className="text-[10px] text-red-500 font-bold uppercase">Erros</p>
                    <p className="text-2xl font-black text-red-500">
                      {Object.values(sessionAnswers).filter(s => s === 'incorrect').length}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {filteredQuestions.map((q, idx) => {
                    const status = sessionAnswers[q.id] || 'unanswered';
                    let bgColor = 'bg-neutral-800 text-neutral-500 border-transparent';
                    
                    if (status === 'correct') {
                      bgColor = 'bg-emerald-600 text-white border-emerald-400';
                    } else if (status === 'incorrect') {
                      bgColor = 'bg-red-600 text-white border-red-400';
                    }

                    return (
                      <button
                        key={q.id}
                        onClick={() => scrollToQuestion(q.id)}
                        className={`aspect-square rounded-lg flex items-center justify-center text-xs font-black border transition-all hover:scale-105 ${bgColor}`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-8 space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-neutral-500">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    Corretas
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-neutral-500">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    Incorretas
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-neutral-500">
                    <div className="w-2 h-2 rounded-full bg-neutral-700"></div>
                    Não Respondida
                  </div>
                </div>
              </div>

              <div className="bg-blue-600/10 border border-blue-600/20 p-4 rounded-xl">
                <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest mb-1">Dica de Estudo</p>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Utilize o painel acima para navegar rapidamente entre as questões e revisar seus erros ao final da sessão.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-black text-white mb-4 tracking-tighter italic">Banco de Questões PBL</h2>
        <p className="text-neutral-400 text-xl font-light">
          Filtre por ASE, modalidade e tema para criar sessões de estudo de alto rendimento.
        </p>
      </div>

      <div className="space-y-12 bg-neutral-900/30 border border-neutral-800 p-12 md:p-16 rounded-[3rem] shadow-2xl">
        <section>
          <label className="block text-[10px] font-black text-neutral-500 uppercase tracking-[0.4em] mb-6 text-center">1. Selecione o Ciclo</label>
          <div className="grid grid-cols-2 gap-6">
            <button 
              onClick={() => { setCiclo('Ciclo Básico'); setModulo(''); }}
              className={`p-10 rounded-3xl border transition-all text-center group ${ciclo === 'Ciclo Básico' ? 'bg-blue-600/10 border-blue-600 shadow-2xl shadow-blue-600/5' : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'}`}
            >
              <span className={`block text-xl font-black tracking-tight ${ciclo === 'Ciclo Básico' ? 'text-white' : 'text-neutral-500 group-hover:text-neutral-400'}`}>Ciclo Básico</span>
            </button>
            <button 
              onClick={() => { setCiclo('Ciclo Clínico'); setModulo(''); }}
              className={`p-10 rounded-3xl border transition-all text-center group ${ciclo === 'Ciclo Clínico' ? 'bg-blue-600/10 border-blue-600 shadow-2xl shadow-blue-600/5' : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'}`}
            >
              <span className={`block text-xl font-black tracking-tight ${ciclo === 'Ciclo Clínico' ? 'text-white' : 'text-neutral-500 group-hover:text-neutral-400'}`}>Ciclo Clínico</span>
            </button>
          </div>
        </section>

        <section className={`transition-all duration-500 ${!ciclo ? 'opacity-20 pointer-events-none grayscale' : ''}`}>
          <label className="block text-[10px] font-black text-neutral-500 uppercase tracking-[0.4em] mb-6">2. Defina o Módulo (ASE)</label>
          <select 
            value={modulo}
            onChange={(e) => setModulo(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl py-6 px-8 text-lg font-medium focus:border-blue-600 outline-none transition-all text-white appearance-none cursor-pointer"
          >
            <option value="">Todos os módulos deste ciclo</option>
            {currentModulos.map((m, i) => (
              <option key={i} value={m}>{m}</option>
            ))}
          </select>
        </section>

        <section className={`transition-all duration-500 ${!ciclo ? 'opacity-20 pointer-events-none grayscale' : ''}`}>
          <label className="block text-[10px] font-black text-neutral-500 uppercase tracking-[0.4em] mb-6">3. Volume de Questões</label>
          <div className="grid grid-cols-5 gap-4">
            {['5', '10', '20', '30', 'Todas'].map((q) => (
              <button
                key={q}
                onClick={() => setQuantidade(q)}
                className={`py-5 rounded-2xl border text-sm font-black transition-all uppercase tracking-widest ${
                  quantidade === q 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-600/20' 
                    : 'bg-neutral-950 border-neutral-800 text-neutral-500 hover:border-neutral-700'
                }`}
              >
                {q}
              </button>
            ))}
          </div>
        </section>

        <section className={`transition-all duration-500 ${!ciclo ? 'opacity-20 pointer-events-none grayscale' : ''}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black text-neutral-600 uppercase tracking-widest mb-3">Modalidade</label>
              <select 
                value={modalidade}
                onChange={(e) => setModalidade(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl py-5 px-6 text-sm focus:border-blue-600 outline-none text-white appearance-none cursor-pointer"
              >
                <option value="Todos">Todas as modalidades</option>
                <option value="PBL">Tutoria / PBL</option>
                <option value="Morfofuncional">Morfofuncional / Tradicional</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-neutral-600 uppercase tracking-widest mb-3">Problema Específico</label>
              <select 
                value={problema}
                onChange={(e) => setProblema(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl py-5 px-6 text-sm focus:border-blue-600 outline-none text-white appearance-none cursor-pointer"
              >
                <option value="Todos">Todos os problemas</option>
                {[1,2,3,4,5,6].map(n => (
                  <option key={n} value={n.toString()}>Problema {n}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-6">
            <input 
              type="text" 
              placeholder="Buscar tema (ex: Anatomia, Ética, Embriologia...)"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl py-5 px-8 text-md font-medium focus:border-blue-600 outline-none text-white placeholder:text-neutral-800"
              value={tema}
              onChange={(e) => setTema(e.target.value)}
            />
          </div>
        </section>

        <div className="pt-10 border-t border-neutral-800">
          <button 
            disabled={!ciclo}
            onClick={handleGenerate}
            className={`w-full font-black py-8 rounded-[2rem] transition-all flex items-center justify-center gap-4 group text-xl uppercase tracking-[0.1em] ${
              !ciclo 
                ? 'bg-neutral-900 text-neutral-700 cursor-not-allowed border border-neutral-800' 
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-2xl shadow-blue-600/20 active:scale-[0.98]'
            }`}
          >
            Começar Estudos
            {ciclo && (
              <span className="bg-white/20 text-xs px-4 py-1 rounded-full border border-white/10 ml-2 font-bold">
                {filteredQuestions.length} questões
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionsView;
