import React, { useState } from 'react';
import { EmailTone, ImprovedEmailResult } from '../types/campaign';
import {
  Sparkles,
  Copy,
  Check,
  ArrowRight,
  RefreshCw,
  SlidersHorizontal,
  X,
  FileCheck,
} from 'lucide-react';
import { useToast } from './Toast';

interface EmailRewriteModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalSubject: string;
  originalBody: string;
  onApplyImproved: (subject: string, body: string) => void;
}

export const EmailRewriteModal: React.FC<EmailRewriteModalProps> = ({
  isOpen,
  onClose,
  originalSubject,
  originalBody,
  onApplyImproved,
}) => {
  const { toast } = useToast();
  const [selectedTone, setSelectedTone] = useState<EmailTone>('persuasive');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ImprovedEmailResult | null>(null);
  const [copied, setCopied] = useState(false);

  const tones: Array<{ id: EmailTone; label: string; desc: string }> = [
    { id: 'persuasive', label: 'Persuasive', desc: 'Benefit-driven with strong conversion hooks' },
    { id: 'professional', label: 'Professional', desc: 'Polished, authoritative, and direct' },
    { id: 'friendly', label: 'Friendly', desc: 'Warm, personable, and community-oriented' },
    { id: 'minimal', label: 'Minimal', desc: 'Ultra-concise for busy mobile readers' },
    { id: 'conversational', label: 'Conversational', desc: 'Natural 1-to-1 dialogue style' },
    { id: 'urgent', label: 'Urgent', desc: 'Time-sensitive without triggering spam traps' },
  ];

  const handleGenerate = async (toneToUse: EmailTone = selectedTone) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/improve-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: originalSubject,
          body: originalBody,
          tone: toneToUse,
        }),
      });

      if (!res.ok) throw new Error('Rewrite request failed');
      const data: ImprovedEmailResult = await res.json();
      setResult(data);
      toast(`Generated ${toneToUse} email rewrite!`, 'success');
    } catch (err) {
      toast('Failed to generate rewrite. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    const fullText = `Subject: ${result.improvedSubject}\n\n${result.improvedBody}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    toast('Improved email copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                AI Email Rewrite Studio
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Enhance conversion, eliminate spam friction, and optimize reading rhythm
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tone Selector Toolbar */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-2 flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Target Tone:
          </span>
          {tones.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setSelectedTone(t.id);
                if (result) handleGenerate(t.id);
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                selectedTone === t.id
                  ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750'
              }`}
            >
              {t.label}
            </button>
          ))}
          <button
            onClick={() => handleGenerate(selectedTone)}
            disabled={isLoading}
            className="ml-auto flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-xs transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Rewriting...' : result ? 'Regenerate' : 'Generate Improved Version'}
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!result && !isLoading && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Sparkles className="w-12 h-12 text-indigo-500 mb-3 animate-pulse" />
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Ready to optimize your email campaign
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mt-1 mb-5">
                Choose a target tone above and click "Generate Improved Version" to remove spam trigger words, polish the CTA, and lift engagement.
              </p>
              <button
                onClick={() => handleGenerate(selectedTone)}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
              >
                Improve Email Now (Tone: {selectedTone})
              </button>
            </div>
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
              <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Rewriting email in {selectedTone} tone...
              </div>
              <p className="text-xs text-slate-400">
                Restructuring paragraphs, removing spam traps, and optimizing CTA clarity
              </p>
            </div>
          )}

          {result && !isLoading && (
            <div className="space-y-6">
              {/* Changes Made Card */}
              <div className="p-4 bg-indigo-50/70 dark:bg-indigo-950/30 rounded-xl border border-indigo-200 dark:border-indigo-900/60">
                <div className="text-xs font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-indigo-500" />
                  Key Optimizations Applied
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300">
                  {result.majorChanges.map((change, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <span className="text-indigo-600 font-bold">✓</span>
                      <span>{change}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-2.5 pt-2 border-t border-indigo-100 dark:border-indigo-900/50 text-[11px] text-slate-600 dark:text-slate-400 italic">
                  Rationale: {result.whyBetter}
                </div>
              </div>

              {/* Side-by-Side Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Original */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <span>Original Version</span>
                    <span className="font-mono text-[11px]">{originalBody.split(/\s+/).length} words</span>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700/80 text-xs leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap max-h-96 overflow-y-auto font-sans">
                    <div className="font-semibold text-slate-900 dark:text-white mb-2 pb-2 border-b border-slate-200 dark:border-slate-700">
                      Subject: {originalSubject}
                    </div>
                    {originalBody}
                  </div>
                </div>

                {/* AI Improved */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> AI Improved ({result.toneUsed})
                    </span>
                    <span className="font-mono text-[11px] text-slate-400">
                      {result.improvedBody.split(/\s+/).length} words
                    </span>
                  </div>
                  <div className="p-4 bg-white dark:bg-slate-850 rounded-xl border border-indigo-300 dark:border-indigo-700 ring-1 ring-indigo-400/20 text-xs leading-relaxed text-slate-900 dark:text-slate-100 whitespace-pre-wrap max-h-96 overflow-y-auto font-sans shadow-xs">
                    <div className="font-semibold text-indigo-950 dark:text-indigo-200 mb-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                      Subject: {result.improvedSubject}
                    </div>
                    {result.improvedBody}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {result && (
          <div className="flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Improved Email'}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onApplyImproved(result.improvedSubject, result.improvedBody);
                  onClose();
                  toast('Applied AI rewrite directly to active campaign!', 'success');
                }}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
              >
                Apply to Campaign <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
