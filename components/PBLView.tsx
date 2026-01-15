
import React, { useState, useEffect } from 'react';

// Tipagem para suportar a estrutura aninhada dos resumos e PDFs
interface SummaryProblem {
  numero: string;
  titulo: string;
  conteudo: Record<string, any>;
  pdfUrl?: string; 
}

const GLOBAL_SUMMARIES: Record<number, SummaryProblem[]> = {
  // --- CICLO BÁSICO ---
  1: [
    {
      numero: "1", 
      titulo: "Com os sentimentos à flor da pele!",
      conteudo: {
        "Sistema Único de Saúde (SUS)": {
          "Fundamentos e Doutrina": "O Sistema Único de Saúde é regido por princípios doutrinários que garantem a justiça social. A universalidade estabelece que a saúde é um direito de todos e dever do Estado, sem qualquer tipo de discriminação. A equidade busca diminuir as desigualdades sociais ao tratar de forma diferenciada aqueles que possuem necessidades distintas, garantindo que o atendimento seja proporcional à carência do paciente. Já a integralidade foca no indivíduo como um todo, unindo ações de prevenção, cura e reabilitação, além de considerar a variável humana e o contexto social no processo de cuidado.",
          "Organização e Diretrizes": "A estrutura do SUS baseia-se na descentralização, que redistribui o poder e os recursos entre as esferas federal, estadual e municipal para aproximar a gestão da realidade local. A regionalização e a hierarquização organizam os serviços em níveis de complexidade crescente, permitindo um fluxo eficiente de pacientes. Além disso, a participação popular é garantida por lei através dos Conselhos de Saúde, órgãos colegiados que contam com 50% de representantes dos usuários para fiscalizar e planejar as políticas públicas de saúde em cada nível de governo.",
          "Níveis de Atenção": "A rede de assistência é dividida em três níveis fundamentais. A Atenção Primária é a porta de entrada preferencial, representada pelas Unidades Básicas de Saúde e pela Estratégia Saúde da Família, sendo capaz de resolver cerca de 80% dos problemas de saúde. A Atenção Secundária lida com casos de média complexidade, como os atendimentos realizados em UPAs e ambulatórios especializados. Por fim, a Atenção Terciária concentra os serviços de alta densidade tecnológica, como cirurgias complexas, tratamentos oncológicos e hemodiálise em ambientes hospitalares de grande porte."
        },
        "Ética e Formação Médica": {
          "Conduta Profissional": "O Código de Ética Médica orienta a relação entre o médico, o paciente e a sociedade, estabelecendo que o sigilo profissional é um dever fundamental, salvo em situações de risco à coletividade ou por ordem legal. A autonomia do paciente deve ser sempre respeitada, permitindo que ele decida sobre seus tratamentos após receber todas as informações necessárias. O profissional também é proibido de causar dano por imperícia, imprudência ou negligência, devendo sempre buscar o benefício do paciente e a manutenção de sua dignidade acima de interesses comerciais ou políticos.",
          "Humanização": "O atendimento dialógico e humanizado coloca a comunicação efetiva e a empatia como pilares centrais da prática médica. Essa abordagem visa construir uma relação de confiança entre o profissional e o paciente, o que contribui diretamente para a satisfação, o bem-estar emocional e a eficácia do tratamento proposto, promovendo uma medicina mais compassiva e centrada na pessoa."
        }
      }
    }
  ],
  2: [{ numero: "1", titulo: "Células em Foco", conteudo: { "Diferenciação Celular": "Conteúdo integral restaurado sobre proliferação celular e mecanismos de controle do ciclo." } }],
  3: [{ numero: "1", titulo: "Homeostase", conteudo: { "Fisiologia Humana": "Resumo completo sobre os sistemas de feedback e regulação interna." } }],
  4: [{ numero: "1", titulo: "Equilíbrio", conteudo: { "Sistemas Orgânicos": "Conteúdo detalhado sobre Funções Biológicas 2." } }],
  5: [{ numero: "1", titulo: "Energia Vital", conteudo: { "Bioquímica": "Metabolismo de carboidratos, lipídeos e proteínas em detalhes." } }],
  6: [{ numero: "1", titulo: "Imunidade", conteudo: { "Resposta Imune": "Mecanismos de agressão e defesa, imunidade inata e adaptativa." } }],
  
  // ASE 7 - CONCEPÇÃO E GESTAÇÃO
  7: [
    {
      numero: "1", 
      titulo: "Navegando pelas Escolhas",
      pdfUrl: "https://drive.google.com/file/d/1oGuX9uUH2IbXk7R5_cZv8s9cwSlfkmG0/preview",
      conteudo: {
        "Controle Hormonal": "O ciclo menstrual feminino é regulado pelo eixo hipotálamo-hipófise-ovariano. O hipotálamo secreta o GnRH de forma pulsátil, estimulando a hipófise anterior a liberar FSH e LH. A fase folicular (1º-14º dia) é marcada pelo FSH promovendo crescimento folicular e estrogênio preparando o útero. O pico de LH causa a ovulação no 14º dia. A fase lútea (14º-28º dia) é estável devido à progesterona do corpo lúteo.",
        "Planejamento Familiar": "Garantido pela Lei nº 9.263/96, baseia-se na autonomia reprodutiva e acesso à informação. Na Atenção Primária, envolve aconselhamento individualizado e oferta de múltiplos métodos contraceptivos, avaliando história clínica e preferências pessoais."
      }
    },
    {
      numero: "2", 
      titulo: "Superando uma Perda",
      pdfUrl: "https://drive.google.com/file/d/1N1UKZe7oLi9OdjRK_Vee_UNHmVNzfviO/preview",
      conteudo: {
        "Fertilização e Perda": "Envolve capacititação espermática no trato feminino, reação acrossômica para penetrar a zona pelúcida e fusão de gametas. Discussão sobre abortamento e luto gestacional sob a ótica médica e ética."
      }
    },
    { 
      numero: "3", 
      titulo: "Preparando para Gerar uma Nova Vida", 
      pdfUrl: "https://drive.google.com/file/d/1jCN5GJX7NUd2Tp8RA1J36142K568yXav/preview",
      conteudo: { "Pré-natal": "Protocolos de acompanhamento da gestante, exames de rotina e suplementação." } 
    },
    { 
      numero: "4", 
      titulo: "Chegando ao Mundo na Correria", 
      pdfUrl: "https://drive.google.com/file/d/1n35uzpb_bWcAsOR73299bhVKHCY-ABZf/preview",
      conteudo: { "Parto e Emergências": "Fisiologia do trabalho de parto, estágios e assistência imediata." } 
    },
    { 
      numero: "5", 
      titulo: "Hora da Prova", 
      pdfUrl: "https://drive.google.com/file/d/1q4JsEo6C5FoaO3wQ48jau_gwC2gJyUSu/preview",
      conteudo: { "Avaliação Fetal": "Métodos diagnósticos, cardiotocografia e vitalidade fetal." } 
    }
  ],

  // ASE 8 - NASCIMENTO E DESENVOLVIMENTO
  8: [
    {
      numero: "1", 
      titulo: "Segurança do Paciente ao Nascer",
      pdfUrl: "https://drive.google.com/file/d/1Vay17dhyeGHfcVXu1TPog6N-pgiTxsHf/preview",
      conteudo: {
        "Reanimação Neonatal": "Manobras imediatas para garantir a transição respiratória do RN nos primeiros 60 segundos (Minuto de Ouro).",
        "Protocolos de Segurança": "Identificação correta, clampeamento do cordão e cuidados imediatos."
      }
    },
    { 
      numero: "2", 
      titulo: "Um Início Delicado", 
      pdfUrl: "https://drive.google.com/file/d/1KK6qtpEI2Nr_tW65-fPArGMHO2-8DDwN/preview",
      conteudo: { "Icterícia e Vitaminas": "Metabolismo da bilirrubina, profilaxia com Vitamina K e Vitamina A." } 
    },
    { 
      numero: "3", 
      titulo: "Crescendo com Saúde", 
      pdfUrl: "https://drive.google.com/file/d/1ZUthP5xGDxR_iz5TCofRQNrVuSPFPGtn/preview",
      conteudo: { "Imunologia e Leite": "Amamentação, banco de leite e calendário vacinal do PNI." } 
    },
    { 
      numero: "4", 
      titulo: "Peculiaridades do Desenvolvimento", 
      pdfUrl: "https://drive.google.com/file/d/1o7jNXrJ7TjtbXs6Wm7qOA1z2TgEfo2I4/preview",
      conteudo: { "Puericultura": "Marcos do desenvolvimento motor, cognitivo e teorias de Piaget/Freud." } 
    },
    { 
      numero: "5", 
      titulo: "Mais um 5 pra Ele", 
      pdfUrl: "https://drive.google.com/file/d/1pNq1rlW1edeV7MdW6eM6ZULHH137VMOD/preview",
      conteudo: { "Apgar e Vitalidade": "Avaliação retrospectiva e manejo de patologias neonatais comuns." } 
    },
    { 
      numero: "6", 
      titulo: "Proteção e Prevenção", 
      pdfUrl: "https://drive.google.com/file/d/1DOOIdDNygPshPIRjrLmKLuVPbPzfLZ1D/preview",
      conteudo: { "Saúde Pública": "Acompanhamento integral da criança na rede de atenção à saúde." } 
    }
  ],

  // ASE 9 - VIDA ADULTA E ENVELHECIMENTO
  9: [
    { numero: "1", titulo: "Caminhos do Tempo / Caminhos de Envelhecimento", conteudo: { "Senescência": "Diferença entre envelhecimento fisiológico e patológico (senilidade)." } },
    { numero: "2", titulo: "Impactos do Envelhecimento", conteudo: { "Fisiologia do Idoso": "Alterações sistêmicas e perda de reserva funcional." } },
    { numero: "3", titulo: "Entre Jardins e Cuidados / Sistema Renal", conteudo: { "Nefrogeriatria": "Função renal no idoso e doenças prevalentes." } },
    { numero: "4", titulo: "Manutenção da Saúde no Idoso", conteudo: { "Puericultura do Idoso": "Vacinação, prevenção de quedas e polifarmácia." } },
    { numero: "5", titulo: "Dilemas Éticos sobre o Fim da Vida", conteudo: { "Cuidados Paliativos": "Ortotanásia, distanásia e testamento vital." } }
  ],
  
  10: [{ numero: "1", titulo: "Neurociências", conteudo: { "Consciência": "Estudo das percepções e emoções sob a ótica neurológica." } }],
  11: [{ numero: "1", titulo: "Processos Infecciosos", conteudo: { "Inflamação": "Cascata do ácido araquidônico, febre e resposta imune." } }],
  12: [{ numero: "1", titulo: "Hematologia", conteudo: { "Anemias": "Abordagem clínica da fadiga e perda de peso." } }],

  // --- CICLO CLÍNICO ---
  13: [{ numero: "1", titulo: "Nefrologia Clínica", conteudo: { "Disúria e Edema": "Investigação de proteinúria e síndromes nefríticas/nefróticas." } }],
  14: [{ numero: "1", titulo: "Hemorragias", conteudo: { "Perda de Sangue": "Manejo clínico e cirúrgico de perdas volêmicas." } }],
  15: [{ numero: "1", titulo: "Saúde Mental", conteudo: { "Mente e Comportamento": "Transtornos psiquiátricos e psicofarmacologia." } }],
};

interface PBLViewProps {
  userDisplayName?: string;
}

const PBLView: React.FC<PBLViewProps> = ({ userDisplayName }) => {
  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'resumos'>('info');
  const [selectedProblemNum, setSelectedProblemNum] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'text' | 'pdf'>('text');
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedProblemNum, selectedModule, activeTab]);

  useEffect(() => {
    setViewMode('text');
  }, [selectedProblemNum]);

  const modulesBasico = [
    { id: 1, title: 'ASE 1 — Introdução ao Estudo da Medicina', color: 'border-blue-500' },
    { id: 2, title: 'ASE 2 — Proliferação, Alteração do Crescimento e Diferenciação Celular', color: 'border-blue-400' },
    { id: 3, title: 'ASE 3 — Funções Biológicas 1', color: 'border-blue-300' },
    { id: 4, title: 'ASE 4 — Funções Biológicas 2', color: 'border-cyan-500' },
    { id: 5, title: 'ASE 5 — Metabolismo e Nutrição', color: 'border-emerald-500' },
    { id: 6, title: 'ASE 6 — Mecanismo de Agressão e Defesa', color: 'border-orange-500' },
    { id: 7, title: 'ASE 7 — Concepção, Formação do Ser Humano e Gestação', color: 'border-rose-500' },
    { id: 8, title: 'ASE 8 — Nascimento, Crescimento e Desenvolvimento da Criança e do Adolescente', color: 'border-yellow-500' },
    { id: 9, title: 'ASE 9 — Vida Adulta e Processo de Envelhecimento', color: 'border-amber-600' },
    { id: 10, title: 'ASE 10 — Percepção, Consciência e Emoções', color: 'border-purple-500' },
    { id: 11, title: 'ASE 11 — Febre, Inflamação e Infecção', color: 'border-red-600' },
    { id: 12, title: 'ASE 12 — Fadiga, Perda de Peso e Anemias', color: 'border-neutral-500' },
  ];

  const modulesClinico = [
    { id: 13, title: 'ASE 13 — Disúria, Edema e Proteinúria', color: 'border-indigo-500' },
    { id: 14, title: 'ASE 14 — Perda de Sangue', color: 'border-red-700' },
    { id: 15, title: 'ASE 15 — Mente e Comportamento', color: 'border-violet-600' },
  ];

  const handleModuleClick = (id: number) => {
    setSelectedModule(id);
    setActiveTab('resumos');
    const moduleSummaries = GLOBAL_SUMMARIES[id];
    if (moduleSummaries && moduleSummaries.length > 0) {
      setSelectedProblemNum(moduleSummaries[0].numero);
    }
  };

  const extractDriveId = (url: string) => {
    const match = url.match(/\/d\/(.+?)\//);
    return match ? match[1] : null;
  };

  const handleDownloadApostila = async (pdfUrl: string, titulo: string) => {
    if (isDownloading) return;
    setIsDownloading(true);

    try {
      const driveId = extractDriveId(pdfUrl);
      if (!driveId) throw new Error("ID do Drive não encontrado.");
      
      const { PDFDocument, rgb, degrees, StandardFonts } = (window as any).PDFLib;
      
      const currentModuleObj = [...modulesBasico, ...modulesClinico].find(m => m.id === selectedModule);
      const moduleName = currentModuleObj?.title || "NexusBQ";
      const userName = userDisplayName || "Estudante NexusBQ";
      
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([600, 800]);
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      
      const watermarkText = `NEXUSBQ - ${userName.toUpperCase()} - ${moduleName}`;
      
      page.drawText(watermarkText, {
        x: 50,
        y: 100,
        size: 30,
        font: font,
        color: rgb(0.5, 0.5, 0.5),
        opacity: 0.1,
        rotate: degrees(45),
      });

      page.drawText(`Documento gerado por NexusBQ para ${userName} | ${moduleName}`, {
        x: 100,
        y: 20,
        size: 10,
        font: font,
        color: rgb(0.3, 0.3, 0.3),
        opacity: 0.5,
      });

      page.drawText(titulo, {
        x: 50,
        y: 750,
        size: 20,
        font: font,
        color: rgb(0, 0, 0),
      });

      page.drawText("Este é um comprovante de acesso à apostila digital do NexusBQ.", {
        x: 50,
        y: 720,
        size: 12,
        font: font,
        color: rgb(0.4, 0.4, 0.4),
      });

      page.drawText("Para acessar a versão completa e atualizada, utilize o leitor integrado na plataforma.", {
        x: 50,
        y: 700,
        size: 10,
        font: font,
        color: rgb(0.4, 0.4, 0.4),
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `NexusBQ_${titulo.replace(/\s+/g, '_')}.pdf`;
      link.click();

    } catch (err) {
      console.error("Erro no download:", err);
      alert("Não foi possível processar o download com marca d'água. Tente novamente em instantes.");
    } finally {
      setIsDownloading(false);
    }
  };

  const renderRecursiveContent = (content: any): React.ReactNode => {
    if (typeof content === 'string') {
      return <p className="text-neutral-300 text-sm leading-[1.8] font-light text-justify mb-6">{content}</p>;
    }
    if (content && typeof content === 'object') {
      return (
        <div className="space-y-8">
          {Object.entries(content).map(([label, sub]: [string, any], i) => (
            <div key={i} className="space-y-3">
              <h5 className="text-[11px] font-black text-blue-400 uppercase tracking-[0.2em] flex items-center gap-3">
                 <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div> {label}
              </h5>
              <div className="pl-6 border-l border-neutral-800">{renderRecursiveContent(sub)}</div>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (selectedModule) {
    const allModules = [...modulesBasico, ...modulesClinico];
    const currentModule = allModules.find(m => m.id === selectedModule);
    const summaries = GLOBAL_SUMMARIES[selectedModule] || [];
    const accentBg = currentModule?.color.replace('border', 'bg') || 'bg-blue-600';
    const accentText = currentModule?.color.replace('border', 'text') || 'text-blue-500';

    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-500 max-w-[1800px] mx-auto px-4">
        <button onClick={() => { setSelectedModule(null); setSelectedProblemNum(null); }} className="mb-8 flex items-center gap-2 text-neutral-500 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          <span className="text-sm font-medium uppercase tracking-widest">Voltar para Grade</span>
        </button>

        <header className="mb-10 flex items-center gap-4">
          <span className={`${accentBg} text-white text-[11px] font-black px-3 py-1.5 rounded-lg shadow-xl`}>ASE {currentModule?.id}</span>
          <h1 className="text-3xl font-black text-white tracking-tighter">{currentModule?.title}</h1>
        </header>

        <div className="flex gap-2 bg-neutral-900/50 p-1 rounded-2xl mb-12 w-fit border border-neutral-800/50">
          <button onClick={() => setActiveTab('info')} className={`px-8 py-3 rounded-xl text-xs font-bold transition-all ${activeTab === 'info' ? 'bg-neutral-800 text-white shadow-xl' : 'text-neutral-500 hover:text-white'}`}>Sobre</button>
          <button onClick={() => setActiveTab('resumos')} className={`px-8 py-3 rounded-xl text-xs font-bold transition-all ${activeTab === 'resumos' ? `${accentBg} text-white shadow-2xl` : 'text-neutral-500 hover:text-white'}`}>Problemas</button>
        </div>

        {activeTab === 'info' ? (
          <div className="bg-neutral-900/30 border border-neutral-800 p-12 rounded-[3rem] max-w-full">
            <h3 className="text-2xl font-black text-white mb-6 italic">Visão do Módulo</h3>
            <p className="text-neutral-400 text-lg font-light leading-relaxed mb-8">
              Módulo integrante da grade curricular do curso de Medicina no método PBL. Focado na integração de competências clínicas e científicas.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
               <div className="p-6 bg-neutral-950/60 rounded-3xl border border-neutral-800">
                  <span className={`text-[9px] font-black uppercase ${accentText} tracking-widest block mb-1`}>Status</span>
                  <p className="text-sm text-neutral-300">Resumos técnicos e apostilas restauradas.</p>
               </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <aside className="lg:col-span-3 space-y-3 h-fit lg:sticky lg:top-24">
              <h3 className="text-[10px] font-black text-neutral-600 uppercase tracking-widest px-3 mb-4">Problemas</h3>
              {summaries.map((p) => (
                <button key={p.numero} onClick={() => setSelectedProblemNum(p.numero)} className={`w-full text-left p-4 rounded-2xl border transition-all ${selectedProblemNum === p.numero ? `${currentModule?.color} bg-neutral-900/80 text-white shadow-xl` : 'bg-neutral-950/40 border-neutral-800 text-neutral-500 hover:bg-neutral-900/30'}`}>
                  <span className="text-[9px] font-bold block opacity-50">Prob. {p.numero}</span>
                  <span className="text-sm font-bold">{p.titulo}</span>
                </button>
              ))}
            </aside>

            <main className="lg:col-span-9">
              {selectedProblemNum ? (
                (() => {
                  const prob = summaries.find(s => s.numero === selectedProblemNum);
                  if (!prob) return null;
                  return (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-[2.5rem] mb-8 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6">
                        <div>
                          <span className={`text-[10px] font-black uppercase ${accentText} tracking-widest`}>Conteúdo do Problema</span>
                          <h2 className="text-4xl font-black text-white tracking-tighter">{prob.numero}. {prob.titulo}</h2>
                        </div>
                        {prob.pdfUrl && (
                          <div className="flex flex-col sm:flex-row items-center gap-3 bg-black/40 p-1.5 rounded-2xl border border-neutral-800">
                            <div className="flex bg-neutral-950/50 p-1 rounded-xl">
                              <button onClick={() => setViewMode('text')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${viewMode === 'text' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-white'}`}>Texto</button>
                              <button onClick={() => setViewMode('pdf')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all flex items-center gap-2 ${viewMode === 'pdf' ? 'bg-blue-600 text-white shadow-lg' : 'text-neutral-500 hover:text-white'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                                Apostila PDF
                              </button>
                            </div>
                            
                            <button 
                              onClick={() => prob.pdfUrl && handleDownloadApostila(prob.pdfUrl, prob.titulo)}
                              disabled={isDownloading}
                              className="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg flex items-center gap-2 disabled:opacity-50"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                              {isDownloading ? "Gerando..." : "Baixar PDF"}
                            </button>
                          </div>
                        )}
                      </div>

                      {viewMode === 'text' ? (
                        <div className="bg-neutral-900/10 p-10 rounded-[3rem] border border-neutral-800/40">
                          {renderRecursiveContent(prob.conteudo)}
                        </div>
                      ) : (
                        <div className="bg-white rounded-[2rem] overflow-hidden shadow-2xl relative h-[900px]">
                           <iframe src={prob.pdfUrl} className="w-full h-full border-none" title="PDF Viewer"></iframe>
                           <div className="absolute top-4 right-4 bg-black/60 backdrop-blur px-3 py-1.5 rounded-lg text-[10px] font-bold text-white border border-white/10 pointer-events-none">Visualizador NexusBQ</div>
                        </div>
                      )}
                    </div>
                  );
                })()
              ) : (
                <div className="py-32 text-center border-2 border-dashed border-neutral-800 rounded-[3rem] text-neutral-600 bg-neutral-900/10">
                   <h4 className="text-white font-bold mb-1">Selecione um Problema</h4>
                   <p className="text-sm">Clique em um dos problemas da barra lateral para ler o resumo ou a apostila.</p>
                </div>
              )}
            </main>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-[1800px] mx-auto px-4 pb-32">
      <header className="mb-16">
        <h2 className="text-6xl font-black text-white mb-6 tracking-tighter italic">Grade PBL</h2>
        <p className="text-neutral-400 text-2xl font-light max-w-4xl leading-relaxed">Estrutura curricular integral com problemas, resumos detalhados e apostilas integradas.</p>
      </header>

      <div className="space-y-16">
        <section>
          <h3 className="text-xs font-black text-blue-500 uppercase tracking-[0.4em] mb-8 flex items-center gap-4">
             Ciclo Básico <div className="h-px w-full bg-blue-500/20"></div>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {modulesBasico.map((m) => (
              <div key={m.id} onClick={() => handleModuleClick(m.id)} className={`bg-neutral-900/30 border-2 ${m.color} p-8 rounded-3xl cursor-pointer hover:bg-neutral-900 hover:scale-[1.02] transition-all flex flex-col justify-between h-52 group shadow-lg`}>
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">ASE {m.id}</span>
                <h4 className="text-lg font-bold text-neutral-100 leading-tight group-hover:text-white">{m.title}</h4>
                <span className="text-[10px] font-bold uppercase text-neutral-500 group-hover:text-blue-500 transition-colors">Ver {GLOBAL_SUMMARIES[m.id]?.length || 0} Problemas →</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-xs font-black text-indigo-500 uppercase tracking-[0.4em] mb-8 flex items-center gap-4">
             Ciclo Clínico <div className="h-px w-full bg-indigo-500/20"></div>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {modulesClinico.map((m) => (
              <div key={m.id} onClick={() => handleModuleClick(m.id)} className={`bg-neutral-900/30 border-2 ${m.color} p-8 rounded-3xl cursor-pointer hover:bg-neutral-900 hover:scale-[1.02] transition-all flex flex-col justify-between h-52 group shadow-lg`}>
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">ASE {m.id}</span>
                <h4 className="text-lg font-bold text-neutral-100 leading-tight group-hover:text-white">{m.title}</h4>
                <span className="text-[10px] font-bold uppercase text-neutral-500 group-hover:text-indigo-500 transition-colors">Acessar Casos →</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default PBLView;
