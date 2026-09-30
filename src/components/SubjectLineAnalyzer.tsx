import React, { useState } from 'react';
import { SubjectLineAnalysis, SubjectAlternative } from '../types/campaign';
import {
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  Layers,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { useToast } from './Toast';

interface SubjectLineAnalyzerProps {
  analysis: SubjectLineAnalysis;
  onApplySubject?: (subject: string) => void;
}

export const SubjectLineAnalyzer: React.FC<SubjectLineAnalyzerProps> = ({
  analysis,
  onApplySubject,
}) => {
  const { toast } = useToast();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [selectedForCompare, setSelectedForCompare] = useState<SubjectAlternative | null>(
    analysis.suggestions[0] || null
  );

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast('Subject line copied to clipboard!', 'success');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const {
    currentSubject,
    length,
    wordCount,
    clarityScore,
    relevanceScore,
    curiosityScore,
    urgencyScore,
    personalizationScore,
    emotionalAppeal,
    ctaStrength,
    spamRiskRating,
    spamRiskKeywords,
    strengths,
    suggestions,
  } = analysis;

  const getRatingBadge = (rating: string) => {
    if (rating === 'Low') {
      return 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800';
    }
    if (rating === 'Moderate') {
      return 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800';
    }
    return 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800';
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            Subject Line Optimization Studio
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Diagnostic scoring, spam-filter audit, and high-converting AI alternatives
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 dark:text-slate-400">Spam Risk:</span>
          <span className={`px-2 py-0.5 rounded font-semibold border ${getRatingBadge(spamRiskRating)}`}>
            {spamRiskRating} Risk
          </span>
        </div>
      </div>

      {/* Current Subject Box */}
      <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
          <span>Current Subject Line</span>
          <div className="flex items-center gap-2 text-[11px] font-mono tabular-nums">
            <span>{length} characters</span>
            <span>·</span>
            <span>{wordCount} words</span>
            <span>·</span>
            <span className={length <= 50 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}>
              {length <= 50 ? 'Mobile Friendly' : 'May truncate on mobile'}
            </span>
          </div>
        </div>
        <div className="text-base font-semibold text-slate-900 dark:text-white select-all">
          "{currentSubject}"
        </div>
      </div>

      {/* Evaluation Radar / Metric Bars */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200/80 dark:border-slate-700/60">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Clarity</div>
          <div className="text-lg font-bold text-slate-900 dark:text-white tabular-nums mt-0.5">
            {clarityScore}
            <span className="text-xs font-normal text-slate-400">/100</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1 rounded-full mt-2 overflow-hidden">
            <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${clarityScore}%` }} />
          </div>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200/80 dark:border-slate-700/60">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Relevance</div>
          <div className="text-lg font-bold text-slate-900 dark:text-white tabular-nums mt-0.5">
            {relevanceScore}
            <span className="text-xs font-normal text-slate-400">/100</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1 rounded-full mt-2 overflow-hidden">
            <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${relevanceScore}%` }} />
          </div>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200/80 dark:border-slate-700/60">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Curiosity</div>
          <div className="text-lg font-bold text-slate-900 dark:text-white tabular-nums mt-0.5">
            {curiosityScore}
            <span className="text-xs font-normal text-slate-400">/100</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1 rounded-full mt-2 overflow-hidden">
            <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${curiosityScore}%` }} />
          </div>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200/80 dark:border-slate-700/60">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Urgency</div>
          <div className="text-lg font-bold text-slate-900 dark:text-white tabular-nums mt-0.5">
            {urgencyScore}
            <span className="text-xs font-normal text-slate-400">/100</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1 rounded-full mt-2 overflow-hidden">
            <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${urgencyScore}%` }} />
          </div>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200/80 dark:border-slate-700/60 col-span-2 sm:col-span-1">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Personalization</div>
          <div className="text-lg font-bold text-slate-900 dark:text-white tabular-nums mt-0.5">
            {personalizationScore}
            <span className="text-xs font-normal text-slate-400">/100</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1 rounded-full mt-2 overflow-hidden">
            <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${personalizationScore}%` }} />
          </div>
        </div>
      </div>

      {/* Emotional appeal & Spam analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="p-3 bg-white dark:bg-slate-850 rounded-lg border border-slate-200 dark:border-slate-750">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Emotional Hook & CTA: </span>
          <span className="text-slate-600 dark:text-slate-400">{emotionalAppeal}</span>
          <div className="mt-1 text-slate-500 dark:text-slate-400">
            CTA Strength: <span className="font-medium text-slate-800 dark:text-slate-200">{ctaStrength}</span>
          </div>
        </div>

        <div className="p-3 bg-white dark:bg-slate-850 rounded-lg border border-slate-200 dark:border-slate-750">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Spam Guard: </span>
          {spamRiskKeywords && spamRiskKeywords.length > 0 ? (
            <span className="text-rose-600 dark:text-rose-400">
              Trigger keywords detected: {spamRiskKeywords.join(', ')}
            </span>
          ) : (
            <span className="text-emerald-600 dark:text-emerald-400">
              Clean. No obvious spam-trigger phrasing detected.
            </span>
          )}
        </div>
      </div>

      {/* AI Suggestions Section */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            AI Alternative Suggestions (3–5 Generated Variations)
          </h4>
          <span className="text-[11px] text-slate-400">
            Click to compare side-by-side
          </span>
        </div>

        <div className="space-y-2.5">
          {suggestions.map((sug, idx) => {
            const isComparing = selectedForCompare?.subject === sug.subject;
            return (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border transition-all ${
                  isComparing
                    ? 'border-indigo-500 dark:border-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/20 shadow-xs'
                    : 'border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-850 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {sug.angle}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono tabular-nums">
                        {sug.characterCount || sug.subject.length} chars
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white select-all">
                      "{sug.subject}"
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                    <button
                      onClick={() => setSelectedForCompare(sug)}
                      className={`px-2 py-1 text-xs font-medium rounded border transition-colors ${
                        isComparing
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      Compare
                    </button>
                    <button
                      onClick={() => handleCopy(sug.subject, idx)}
                      className="p-1.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Copy subject line"
                      aria-label="Copy subject line"
                    >
                      {copiedIndex === idx ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    {onApplySubject && (
                      <button
                        onClick={() => {
                          onApplySubject(sug.subject);
                          toast('Applied alternative subject line to campaign', 'success');
                        }}
                        className="px-2 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded transition-colors"
                      >
                        Apply
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <div>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Why it works: </span>
                    <span className="text-slate-500 dark:text-slate-400">{sug.whyItWorks}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">What changed: </span>
                    <span className="text-slate-500 dark:text-slate-400">{sug.whatChanged}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Side-by-Side Comparison Modal / Box */}
      {selectedForCompare && (
        <div className="p-4 bg-slate-50/90 dark:bg-slate-800/60 rounded-xl border border-indigo-200 dark:border-indigo-900/60">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-500" />
              Side-by-Side Subject Line Comparison
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              Diff View
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-750">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Current (Control)
              </div>
              <div className="font-medium text-slate-900 dark:text-white mb-2">
                "{currentSubject}"
              </div>
              <div className="text-[11px] text-slate-500 space-y-1">
                <div>Length: {currentSubject.length} chars ({wordCount} words)</div>
                <div>Focus: Primary VIP event announcement</div>
              </div>
            </div>

            <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-indigo-300 dark:border-indigo-700 ring-1 ring-indigo-400/20">
              <div className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
                AI Suggestion ({selectedForCompare.angle})
              </div>
              <div className="font-medium text-slate-900 dark:text-white mb-2">
                "{selectedForCompare.subject}"
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
                <div>Length: {selectedForCompare.subject.length} chars</div>
                <div>Edge: {selectedForCompare.whyItWorks}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
