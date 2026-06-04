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

export default function SettingsPage({ profile, onChangeProfile }: Omit<SettingsPageProps, 'onFactoryReset'>) {
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
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">System Preferences</h1>
        <p className="text-xs text-slate-500 font-medium">Control currency formatting, profile details, and localized visual appearances.</p>
      </div>

      {/* Main Settings Card */}
      <form onSubmit={handleProfileSave} className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-5">
        <h2 className="text-sm font-extrabold uppercase text-slate-400 tracking-widest border-b border-slate-50 pb-2">User Profile Settings</h2>

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
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="GBP">GBP (£)</option>
              <option value="EUR">EUR (€)</option>
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
            Profile successfully saved!
          </div>
        )}
      </form>
    </div>
  );
}
