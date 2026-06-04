import { useState } from 'react';
import { AssessmentRecord } from '../types';
import { 
  FileText, 
  Trash2, 
  ChevronRight, 
  Calendar, 
  Activity, 
  IndianRupee,
  Briefcase
} from 'lucide-react';

interface HistoryPageProps {
  records: AssessmentRecord[];
  onSelectRecord: (record: AssessmentRecord) => void;
  onDeleteRecord: (id: string) => void;
  onClearHistory: () => void;
}

export default function HistoryPage({ records, onSelectRecord, onDeleteRecord, onClearHistory }: HistoryPageProps) {
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  // Format dates
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Low': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Moderate': return 'bg-amber-50 text-amber-700 border-amber-100';
      default: return 'bg-rose-50 text-rose-700 border-rose-100';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6" id="history-registry-root">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Vetted Credit History Registry</h1>
          <p className="text-xs text-slate-500">Access and retrieve audited results cached securely inside your local registry index.</p>
        </div>
        {records.length > 0 && (
          <div className="relative">
            {!showClearConfirm ? (
              <button
                id="clear-all-history-action"
                onClick={() => setShowClearConfirm(true)}
                className="px-3.5 py-2 text-rose-600 border border-rose-100 bg-rose-50 hover:bg-rose-105 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1 w-full sm:w-auto"
              >
                <Trash2 size={13} /> Flush History Archive
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-rose-50 border border-rose-150 p-1.5 rounded-xl text-xs">
                <span className="text-rose-700 font-extrabold px-1">Flush all?</span>
                <button
                  onClick={() => {
                    onClearHistory();
                    setShowClearConfirm(false);
                  }}
                  className="px-2.5 py-1 bg-rose-600 text-white rounded-lg font-bold hover:bg-rose-700 transition-colors"
                >
                  Yes, Flush
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="px-2.5 py-1 bg-slate-205 text-slate-700 border border-slate-200 rounded-lg font-bold hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Grid listing */}
      {records.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center text-slate-400 space-y-3" id="history-empty-view">
          <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
            <FileText size={20} />
          </div>
          <p className="text-xs font-semibold text-slate-700">No archived loan audits discovered</p>
          <p className="text-[11px] text-slate-450 max-w-xs mx-auto leading-relaxed">
            Run a first credit advisor diagnostic check. When calculations finish, click "Archive Assessment" to cache snapshots here.
          </p>
        </div>
      ) : (
        <div className="space-y-3" id="history-records-list">
          {records.map((rec) => (
            <div 
              key={rec.id}
              className="bg-white border border-slate-100 hover:border-indigo-100 hover:shadow-xs rounded-2xl p-5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 bg-slate-50 text-slate-500 rounded-xl flex items-center justify-center font-mono text-[11px] font-bold">
                  {rec.input.loanType[0].toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-extrabold text-slate-850">₹{rec.input.loanAmount.toLocaleString('en-IN')} {rec.input.loanType.toUpperCase()}</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${getRiskColor(rec.metrics.riskLevel)}`}>
                      {rec.metrics.riskLevel} Risk
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-[10px] text-slate-400 mt-1 font-medium font-mono">
                    <span className="flex items-center gap-1"><Calendar size={11} /> {formatDate(rec.date)}</span>
                    <span className="flex items-center gap-1"><Activity size={11} /> DTI: {rec.metrics.dtiRatio}%</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 justify-end pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-50">
                {pendingDeleteId !== rec.id ? (
                  <button
                    id={`delete-record-${rec.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setPendingDeleteId(rec.id);
                    }}
                    className="p-2 text-slate-350 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors animate-fade-in"
                    title="Remove credit record"
                  >
                    <Trash2 size={14} />
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5 p-1 bg-rose-50 border border-rose-100 rounded-xl text-[10px] scale-95 transition-all animate-fade-in">
                    <span className="text-rose-700 font-bold px-1 select-none">Delete?</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteRecord(rec.id);
                        setPendingDeleteId(null);
                      }}
                      className="px-2 py-1 bg-rose-600 text-white rounded-lg font-bold hover:bg-rose-700"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPendingDeleteId(null);
                      }}
                      className="px-2 py-1 bg-white text-slate-600 border border-slate-205 rounded-lg hover:bg-slate-50"
                    >
                      No
                    </button>
                  </div>
                )}
                
                <button
                  id={`restore-record-${rec.id}`}
                  onClick={() => onSelectRecord(rec)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1 shadow-xs"
                >
                  View Details <ChevronRight size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
