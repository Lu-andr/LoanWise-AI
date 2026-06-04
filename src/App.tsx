import { useState, useEffect } from 'react';
import { 
  Home, 
  Calculator, 
  Activity, 
  History as HistoryIcon, 
  Settings as SettingsIcon, 
  BookOpen, 
  Sparkles, 
  TrendingUp, 
  HelpCircle,
  Menu,
  X
} from 'lucide-react';
import { LoanInput, AssessmentRecord, UserProfile } from './types';
import LandingPage from './components/LandingPage';
import AssessmentForm from './components/AssessmentForm';
import ResultsDashboard from './components/ResultsDashboard';
import InsightsPage from './components/InsightsPage';
import HistoryPage from './components/HistoryPage';
import SettingsPage from './components/SettingsPage';
import PRDViewer from './components/PRDViewer';
import { evaluateLoanAssessment } from './utils/calculator';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'landing' | 'assessment' | 'results' | 'insights' | 'history' | 'settings' | 'prd'>('landing');
  const [records, setRecords] = useState<AssessmentRecord[]>([]);
  const [activeRecord, setActiveRecord] = useState<AssessmentRecord | null>(null);
  const [draftPrefill, setDraftPrefill] = useState<Partial<LoanInput> | undefined>(undefined);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  // Profile preferences
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Sarah Jenkins',
    city: 'New York',
    currency: 'USD',
    themeMode: 'futuristic-glass'
  });

  const [isAnalyzingAI, setIsAnalyzingAI] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string>('');

  // Load state from local storage on bootstrap
  useEffect(() => {
    const cachedHistory = localStorage.getItem('loanwise_history_v1');
    if (cachedHistory) {
      try { setRecords(JSON.parse(cachedHistory)); } catch (e) { console.error(e); }
    }

    const cachedProfile = localStorage.getItem('loanwise_profile_v1');
    if (cachedProfile) {
      try { setProfile(JSON.parse(cachedProfile)); } catch (e) { console.error(e); }
    }
  }, []);

  // Save history state
  const saveRecordsToCache = (newRecords: AssessmentRecord[]) => {
    setRecords(newRecords);
    localStorage.setItem('loanwise_history_v1', JSON.stringify(newRecords));
  };

  const handleSaveRecord = (rec: AssessmentRecord) => {
    // Avoid double entries
    if (records.some(r => r.id === rec.id)) return;
    const updated = [rec, ...records];
    saveRecordsToCache(updated);
  };

  const handleDeleteRecord = (id: string) => {
    const filtered = records.filter(r => r.id !== id);
    saveRecordsToCache(filtered);
    if (activeRecord?.id === id) {
      setActiveRecord(null);
    }
  };

  const handleClearHistory = () => {
    saveRecordsToCache([]);
    setActiveRecord(null);
  };

  const handleProfileChange = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    localStorage.setItem('loanwise_profile_v1', JSON.stringify(updatedProfile));
  };

  const handleFactoryReset = () => {
    localStorage.removeItem('loanwise_history_v1');
    localStorage.removeItem('loanwise_profile_v1');
    localStorage.removeItem('loanwise_form_draft');
    setRecords([]);
    setActiveRecord(null);
    setProfile({
      name: 'Sarah Jenkins',
      city: 'New York',
      currency: 'USD',
      themeMode: 'futuristic-glass'
    });
    setCurrentScreen('landing');
  };

  // Run full evaluation
  const handleRunAssessment = async (input: LoanInput) => {
    setIsAnalyzingAI(true);
    setAiError('');

    // Step 1: Pre-run deterministic math model
    const calculatedMetrics = evaluateLoanAssessment(input);
    const mockId = Math.random().toString(36).substring(2, 9);
    
    let tempRecord: AssessmentRecord = {
      id: mockId,
      date: new Date().toISOString(),
      input,
      metrics: calculatedMetrics
    };

    setActiveRecord(tempRecord);
    setCurrentScreen('results');

    // Step 2: Trigger secure NodeJS endpoint proxying to Gemini
    try {
      const response = await fetch('/api/loan-advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input, metrics: calculatedMetrics }),
      });

      if (!response.ok) throw new Error('API server advice generation failed');
      const data = await response.json();
      
      const enrichedRecord = {
        ...tempRecord,
        aiAdvice: data
      };
      
      setActiveRecord(enrichedRecord);
      
      // Auto-save successful analyses to history list automatically representing premium UX
      const updatedList = [enrichedRecord, ...records];
      saveRecordsToCache(updatedList);

    } catch (err: any) {
      console.warn('Fallback to local deterministic evaluation due to offline/missing key parameters:', err);
      // Fallback model representation
      const fallbackAdvice = {
        summary: `Dynamic advisor warning: Server proxies are running offline. Determined credit health rating as ${calculatedMetrics.creditRating} based on score points metrics.`,
        reasons: [
          `Your credit score rating of ${input.creditScore} indicates a ${calculatedMetrics.creditRating} leverage condition.`,
          `Combined Debt-To-Income (DTI) ratio is estimated at ${calculatedMetrics.dtiRatio}% under a proposed monthly EMI overhead.`
        ],
        recommendations: [
          'Verify that environment variables exist in your system settings registry to unlock automated audits.',
          'Consistently allocate debt commitments below 35-40% of incoming cashflows.'
        ],
        improvements: [
          'Consolidate minor credit cards or consumer limits to reduce outstanding DTI leverage lines immediately.',
          'Filing appropriate corrections with credit bureaus can elevate FICO performance ratings.'
        ],
        alternatives: [
          `Limit requested debt principal to $${Math.round(input.loanAmount * 0.75)} to establish stronger underwriting cushions.`,
          'Inquire with direct retail commercial lenders regarding securing options or third-party co-signers.'
        ]
      };
      
      const enrichedRecord = {
        ...tempRecord,
        aiAdvice: fallbackAdvice
      };
      
      setActiveRecord(enrichedRecord);
      const updatedList = [enrichedRecord, ...records];
      saveRecordsToCache(updatedList);
    } finally {
      setIsAnalyzingAI(false);
    }
  };

  const handleStartPrefilledForm = (prefillData?: { income: number; emi: number }) => {
    if (prefillData) {
      setDraftPrefill({
        monthlyIncome: prefillData.income,
        existingEmi: prefillData.emi,
        monthlyExpenses: Math.round(prefillData.income * 0.35),
        savings: Math.round(prefillData.income * 0.2),
        loanAmount: 150000,
        loanTenure: 15,
        creditScore: 700,
        employmentType: 'salaried',
        experience: 3,
        age: 28,
        city: 'New York',
        loanType: 'home'
      });
    } else {
      setDraftPrefill(undefined);
    }
    setCurrentScreen('assessment');
  };

  const loadRecordIntoDashboard = (rec: AssessmentRecord) => {
    setActiveRecord(rec);
    setCurrentScreen('results');
  };

  // Theme spectrum configurations
  const themeClass = () => {
    switch (profile.themeMode) {
      case 'midnight-gold':
        return 'bg-slate-950 text-slate-100 min-h-screen selection:bg-amber-400 selection:text-slate-950';
      case 'neon-slate':
        return 'bg-[#121820] text-[#D8E1E8] min-h-screen selection:bg-[#55D6FF] selection:text-[#121820]';
      default:
        return 'bg-[#F7F9FF] text-slate-800 min-h-screen selection:bg-indigo-200 selection:text-slate-900';
    }
  };

  const borderClass = () => {
    return profile.themeMode === 'futuristic-glass' ? 'border-indigo-100/80 bg-white/70 backdrop-blur-xl' : 'border-slate-800 bg-slate-900/80 backdrop-blur-xl';
  };

  return (
    <div className={themeClass()} id="loanwise-applet-shell">
      
      {/* Dynamic Visual background gradients depending on Theme settings */}
      <div className="absolute top-0 left-0 w-full overflow-hidden pointer-events-none h-[400px]">
        {profile.themeMode === 'midnight-gold' ? (
          <>
            <div className="absolute top-[-100px] left-[20%] w-[450px] h-[450px] bg-amber-500 rounded-full filter blur-[150px] opacity-10"></div>
            <div className="absolute top-[-50px] right-[10%] w-[350px] h-[350px] bg-slate-700 rounded-full filter blur-[120px] opacity-10"></div>
          </>
        ) : profile.themeMode === 'neon-slate' ? (
          <>
            <div className="absolute top-[-100px] left-[15%] w-[400px] h-[400px] bg-[#55D6FF] rounded-full filter blur-[130px] opacity-10"></div>
            <div className="absolute top-[-50px] right-[15%] w-[350px] h-[350px] bg-[#22C55E] rounded-full filter blur-[120px] opacity-5"></div>
          </>
        ) : (
          <>
            <div className="absolute top-[-150px] left-[10%] w-[600px] h-[600px] bg-[#5B4CF0] rounded-full filter blur-[160px] opacity-10"></div>
            <div className="absolute top-[-50px] right-[20%] w-[400px] h-[400px] bg-[#55D6FF] rounded-full filter blur-[140px] opacity-10"></div>
          </>
        )}
      </div>

      {/* Structured Header */}
      <header className={`sticky top-0 z-40 border-b ${borderClass()} transition-colors duration-200`} id="app-nav-header">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          
          {/* Logo brand */}
          <div 
            onClick={() => setCurrentScreen('landing')}
            className="flex items-center gap-2 cursor-pointer transition-transform hover:scale-102 flex-shrink-0"
            id="brand-logo-container"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#5B4CF0] to-[#7A6FFF] flex items-center justify-center text-white font-extrabold shadow-md shadow-indigo-500/20">
              W
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-slate-805 block">LoanWise AI</span>
              <span className="text-[9px] uppercase tracking-widest font-bold text-slate-400 block -mt-1">{profile.name} context</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1.5" id="desktop-navbar">
            {[
              { id: 'landing', label: 'Home', icon: Home },
              { id: 'assessment', label: 'Eligibility Diagnostic', icon: Calculator },
              { id: 'insights', label: 'What-If Simulator', icon: TrendingUp },
              { id: 'history', label: 'Audit History', icon: HistoryIcon },
              { id: 'settings', label: 'Preferences', icon: SettingsIcon },
              { id: 'prd', label: 'Architect Blueprint', icon: BookOpen },
            ].map((navItem) => {
              const Icon = navItem.icon;
              const isActive = currentScreen === navItem.id || (navItem.id === 'assessment' && currentScreen === 'results');
              return (
                <button
                  key={navItem.id}
                  id={`nav-btn-${navItem.id}`}
                  onClick={() => {
                    setCurrentScreen(navItem.id as any);
                    setIsMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold rounded-xl transition-all ${
                    isActive 
                      ? (profile.themeMode === 'midnight-gold' 
                          ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' 
                          : profile.themeMode === 'neon-slate' 
                            ? 'bg-[#55D6FF]/10 text-[#55D6FF] border border-[#55D6FF]/20' 
                            : 'bg-indigo-50 text-indigo-700 border border-indigo-100')
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Icon size={14} />
                  {navItem.label}
                </button>
              );
            })}
          </nav>

          {/* Mobile hamburger */}
          <button
            id="mobile-hamburger-btn"
            onClick={() => setIsMenuOpen(p => !p)}
            className="lg:hidden p-2 text-slate-500 hover:text-slate-800 rounded-lg"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile slide down navbar */}
        {isMenuOpen && (
          <div className="lg:hidden px-4 py-3 bg-white border-t border-slate-100 space-y-1 block shadow-md animate-fade-in" id="mobile-navbar">
            {[
              { id: 'landing', label: 'Home', icon: Home },
              { id: 'assessment', label: 'Eligibility Diagnostic', icon: Calculator },
              { id: 'insights', label: 'What-If Simulator', icon: TrendingUp },
              { id: 'history', label: 'Audit History', icon: HistoryIcon },
              { id: 'settings', label: 'Preferences', icon: SettingsIcon },
              { id: 'prd', label: 'Architect Blueprint', icon: BookOpen },
            ].map((navItem) => {
              const Icon = navItem.icon;
              const isActive = currentScreen === navItem.id || (navItem.id === 'assessment' && currentScreen === 'results');
              return (
                <button
                  key={navItem.id}
                  id={`m-nav-btn-${navItem.id}`}
                  onClick={() => {
                    setCurrentScreen(navItem.id as any);
                    setIsMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-4 py-3 text-xs font-bold rounded-xl transition-all ${
                    isActive 
                      ? 'bg-indigo-50 text-indigo-750 border border-indigo-100' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Icon size={14} />
                  {navItem.label}
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Main Container */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-8 pb-20">
        
        {/* LANDING PAGE SCREEN */}
        {currentScreen === 'landing' && (
          <LandingPage 
            onStartAssessment={handleStartPrefilledForm} 
            onNavigateToPRD={() => {
              setCurrentScreen('prd');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* ASSESSMENT SCREEN */}
        {currentScreen === 'assessment' && (
          <div className="space-y-6 animate-fade-in" id="form-layout-shell">
            <div className="text-center max-w-lg mx-auto mb-2">
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center justify-center gap-2">
                 Eligibility Calculator Vetting System
              </h1>
              <p className="text-xs text-slate-500 leading-normal">
                Submit accurate employment and liability fields. The calculator runs secure parameters before routing details to advisor proxies.
              </p>
            </div>
            <AssessmentForm 
              initialValues={draftPrefill} 
              onSubmitAssessment={handleRunAssessment} 
            />
          </div>
        )}

        {/* RESULTS SCREEN */}
        {currentScreen === 'results' && activeRecord && (
          <div className="animate-fade-in" id="results-layout-shell">
            {isAnalyzingAI && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-100 text-yellow-800 rounded-2xl flex items-center justify-between text-xs animate-pulse font-medium">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-ping"></span>
                  Vetting credit ratios locally... Submitting compiled metrics to Gemini AI Advisor Proxy. Please hold.
                </span>
              </div>
            )}
            <ResultsDashboard 
              record={activeRecord} 
              onRestart={() => setCurrentScreen('assessment')} 
              onSaveHistory={handleSaveRecord}
            />
          </div>
        )}

        {/* INSIGHTS/SIMULATOR SCREEN */}
        {currentScreen === 'insights' && (
          <div className="animate-fade-in">
            <InsightsPage currentRecord={activeRecord?.input} />
          </div>
        )}

        {/* HISTORY SCREEN */}
        {currentScreen === 'history' && (
          <div className="animate-fade-in">
            <HistoryPage 
              records={records} 
              onSelectRecord={loadRecordIntoDashboard} 
              onDeleteRecord={handleDeleteRecord} 
              onClearHistory={handleClearHistory} 
            />
          </div>
        )}

        {/* SETTINGS SCREEN */}
        {currentScreen === 'settings' && (
          <div className="animate-fade-in">
            <SettingsPage 
              profile={profile} 
              onChangeProfile={handleProfileChange}
              onFactoryReset={handleFactoryReset}
            />
          </div>
        )}

        {/* BLUEPRINT PRD SCREEN */}
        {currentScreen === 'prd' && (
          <div className="animate-fade-in">
            <PRDViewer onStartApp={() => {
              setCurrentScreen('landing');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} />
          </div>
        )}

      </main>

      {/* Humble Footer with Architect portal shortcuts and indicators */}
      <footer className="border-t border-slate-100/50 mt-12 py-6 text-center text-slate-400 text-xs text-transparent bg-clip-text bg-gradient-to-r from-slate-450 to-slate-400 flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto px-4 gap-4" id="app-footer">
        <div>
          <span>&copy; 2026 LoanWise AI Advisor System. Powered by Google AI Studio Gemini Runtimes.</span>
        </div>
        <div className="flex gap-4 items-center">
          <button 
            id="footer-prd-action"
            onClick={() => {
              setCurrentScreen('prd');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-[11px] font-bold text-indigo-600 hover:text-indigo-805 transition-colors bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100"
          >
            Review PRD & Tech Manual Blueprint
          </button>
          <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-500 bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/20 rounded-md">Vetting Environment Live</span>
        </div>
      </footer>
    </div>
  );
}
