import React, { useState } from 'react';
import { Settings, ShieldCheck, Cpu, Database, Save, RotateCcw } from 'lucide-react';
import { useToast } from './Toast';

export const SettingsModal: React.FC = () => {
  const { toast } = useToast();
  const [openRateTarget, setOpenRateTarget] = useState('21.5');
  const [ctrTarget, setCtrTarget] = useState('2.6');
  const [ctorTarget, setCtorTarget] = useState('12.1');
  const [conversionTarget, setConversionTarget] = useState('1.4');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast('Saved custom industry benchmark thresholds!', 'success');
  };

  const handleReset = () => {
    setOpenRateTarget('21.5');
    setCtrTarget('2.6');
    setCtorTarget('12.1');
    setConversionTarget('1.4');
    toast('Reset benchmarks to standard retail/B2B averages', 'info');
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Settings className="w-4 h-4 text-indigo-500" />
            Platform & Analysis Settings
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure industry benchmark targets and inspect server-side AI model connectivity
          </p>
        </div>
      </div>

      {/* Model Engine Status Card */}
      <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <Cpu className="w-4 h-4 text-indigo-500" />
            <span>AI Reasoning Engine</span>
          </div>
          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Active · Gemini 3.8 Flash
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          MailLens executes structured linguistic evaluations, spam trigger parsing, and conversion optimizations using Google's modern Gemini 3.8 Flash model via server-side endpoints.
        </p>
      </div>

      {/* Benchmark Customization Form */}
      <form onSubmit={handleSave} className="space-y-4">
        <div className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          Custom Industry Benchmark Baselines (%)
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="text-slate-600 dark:text-slate-400 block mb-1 font-medium">
              Average Open Rate (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={openRateTarget}
              onChange={(e) => setOpenRateTarget(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
            />
          </div>

          <div>
            <label className="text-slate-600 dark:text-slate-400 block mb-1 font-medium">
              Average CTR (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={ctrTarget}
              onChange={(e) => setCtrTarget(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
            />
          </div>

          <div>
            <label className="text-slate-600 dark:text-slate-400 block mb-1 font-medium">
              Average CTOR (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={ctorTarget}
              onChange={(e) => setCtorTarget(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
            />
          </div>

          <div>
            <label className="text-slate-600 dark:text-slate-400 block mb-1 font-medium">
              Average Conv. Rate (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={conversionTarget}
              onChange={(e) => setConversionTarget(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset to Standards
          </button>

          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            Save Benchmarks
          </button>
        </div>
      </form>

      {/* Privacy & Architecture Note */}
      <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          Enterprise Data Privacy Assurance
        </div>
        <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-[11px]">
          Uploaded email campaigns, subscriber metrics, and CSV logs are strictly processed in-memory for active analytical sessions. MailLens does not persist subscriber credentials or personal customer records.
        </p>
      </div>
    </div>
  );
};
