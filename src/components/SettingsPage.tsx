import { useState } from 'react';
import { 
  User, 
  Trash2, 
  KeyRound, 
  HelpCircle, 
  CheckCircle,
  Settings,
  Sparkles,
  RefreshCw,
  Wallet
} from 'lucide-react';
import { UserProfile } from '../types';

interface SettingsPageProps {
  profile: UserProfile;
  onChangeProfile: (p: UserProfile) => void;
  onFactoryReset: () => void;
}

export default function SettingsPage({ profile, onChangeProfile, onFactoryReset }: SettingsPageProps) {
  const [userName, setUserName] = useState<string>(profile.name);
  const [city, setCity] = useState<string>(profile.city);
  const [currency, setCurrency] = useState<string>(profile.currency);
  const [themeMode, setThemeMode] = useState<UserProfile['themeMode']>(profile.themeMode);
  
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    onChangeProfile({
      name: userName,
      city,
      currency,
      themeMode
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-xl mx-auto space-y-8" id="settings-view-root">
      
      {/* Title block */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Vetting Workspace Preferences</h1>
        <p className="text-xs text-slate-500 font-medium">Control currency formatting, advisor profiles, and clear browser caches.</p>
      </div>

      {/* Main Settings Card */}
      <form onSubmit={handleProfileSave} className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-5">
        <h2 className="text-sm font-extrabold uppercase text-slate-400 tracking-widest border-b border-slate-50 pb-2">Advisor profile context</h2>

        {/* Profile name */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700" htmlFor="settings-username">Applicant Full Name</label>
          <input
            id="settings-username"
            type="text"
            className="w-full px-4 py-2.5 bg-slate-5 font-semibold text-xs rounded-xl border border-slate-200 focus:outline-[#5B4CF0]"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>

        {/* Profile city */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700" htmlFor="settings-city">Metropolitan Residence City</label>
          <input
            id="settings-city"
            type="text"
            className="w-full px-4 py-2.5 bg-slate-5 font-semibold text-xs rounded-xl border border-slate-200 focus:outline-[#5B4CF0]"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>

        {/* Currency select and theme presets */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700" htmlFor="settings-currency">Display Currency</label>
            <select
              id="settings-currency"
              className="w-full px-3 py-2.5 bg-slate-5 font-mono text-xs font-semibold rounded-xl border border-slate-200 focus:outline-[#5B4CF0]"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="USD">USD ($)</option>
              <option value="GBP">GBP (£)</option>
              <option value="EUR">EUR (€)</option>
              <option value="INR">INR (₹)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700" htmlFor="settings-theme">Visual Theme Preset</label>
            <select
              id="settings-theme"
              className="w-full px-3 py-2.5 bg-slate-5 font-sans font-semibold text-xs rounded-xl border border-slate-200 focus:outline-[#5B4CF0]"
              value={themeMode}
              onChange={(e) => setThemeMode(e.target.value as any)}
            >
              <option value="futuristic-glass">Futuristic Light Glass</option>
              <option value="midnight-gold">Midnight Dark Gold</option>
              <option value="neon-slate">Carbon Slate Neon</option>
            </select>
          </div>
        </div>

        <div className="flex gap-4 pt-4 border-t border-slate-50">
          <button
            id="save-settings-action"
            type="submit"
            className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
          >
            <Settings size={14} /> Commit Changes
          </button>
        </div>

        {savedSuccess && (
          <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-xl text-center text-xs font-semibold flex items-center justify-center gap-2" id="settings-save-success">
            <CheckCircle size={14} className="text-emerald-500" />
            Vetting profile successfully synced dynamically!
          </div>
        )}
      </form>

      {/* Guide explaining server-side credentials security (compliance check) */}
      <div className="bg-[#F7F9FF] border border-slate-100 p-6 rounded-3xl space-y-3" id="api-key-technical-note">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2">
          <KeyRound size={14} className="text-[#5B4CF0]" /> Environment Secrets & API Credentials
        </h3>
        <p className="text-xs text-slate-550 leading-relaxed">
          LoanWise AI implements security practices that isolate credentials complete with full-stack Node environments. Under this architecture, the <strong>GEMINI_API_KEY</strong> environment secret resides on server-side runtimes and is never leaked, bundled, or cached inside browser files.
        </p>
        <div className="p-3.5 bg-slate-900 text-slate-400 rounded-xl text-[10.5px] font-mono leading-relaxed border border-slate-800">
          <span className="text-teal-400">// API settings verified:</span><br/>
          GEMINI_API_KEY = &lt;Safe Backend Environment Secret Injection&gt;<br/>
          HTTP_HEADER = {`'User-Agent': 'aistudio-build'`}
        </div>
        <p className="text-[10px] text-slate-400 font-medium">To configure or update key values, leverage your secure Secrets configuration panel inside the Google AI Studio settings dashboard.</p>
      </div>

      {/* Extreme Reset options */}
      <div className="p-6 bg-rose-50/50 border border-rose-100 rounded-3xl space-y-3" id="factory-reset-section">
        <h3 className="text-xs font-bold text-rose-800 uppercase tracking-widest flex items-center gap-1.5">
          <Trash2 size={14} /> Factory Hard Reset Sandbox
        </h3>
        <p className="text-[11px] text-rose-700 leading-normal">
          Completely flush all browser data, including local storage drafts, saved profiles, and history dockets. This operation is immediate and permanent.
        </p>
        <button
          id="factory-reset-trigger-action"
          type="button"
          onClick={() => {
            if (confirm('Are you sure you want to hard reset your entire LoanWise sandbox? All drafts, settings, and histories will be permanently wiped.')) {
              onFactoryReset();
            }
          }}
          className="px-4 py-2 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold rounded-xl transition-all shadow-xs"
        >
          Factory Reset Applet Sandbox
        </button>
      </div>
    </div>
  );
}
