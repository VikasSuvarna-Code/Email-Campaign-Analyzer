import React, { useState } from 'react';
import { EmailContentAnalysis, ContentAnnotation } from '../types/campaign';
import {
  FileText,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Smartphone,
  Eye,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

interface EmailContentAnalyzerProps {
  contentAnalysis: EmailContentAnalysis;
  emailBody: string;
  onApplyAnnotationReplacement?: (original: string, replacement: string) => void;
}

export const EmailContentAnalyzer: React.FC<EmailContentAnalyzerProps> = ({
  contentAnalysis,
  emailBody,
  onApplyAnnotationReplacement,
}) => {
  const [selectedAnnotationId, setSelectedAnnotationId] = useState<string | null>(
    contentAnalysis.annotations[0]?.id || null
  );
  const [viewMode, setViewMode] = useState<'annotated' | 'raw'>('annotated');

  const {
    readabilityGradeLevel,
    readingTimeSeconds,
    wordCount,
    sentenceCount,
    avgSentenceLength,
    paragraphCount,
    tone,
    personalizationDepth,
    valuePropositionClarity,
    ctaClarity,
    contentStructureGrade,
    mobileReadabilityAssessment,
    jargonIdentified,
    potentialSpamPhrases,
    missingInformation,
    annotations,
  } = contentAnalysis;

  const getSeverityStyle = (severity: ContentAnnotation['severity']) => {
    switch (severity) {
      case 'critical':
        return {
          badge: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300 dark:border-rose-800',
          highlight: 'bg-rose-100 dark:bg-rose-950/50 text-rose-900 dark:text-rose-200 border-b-2 border-rose-500',
          icon: <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />,
        };
      case 'warning':
        return {
          badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800',
          highlight: 'bg-amber-100 dark:bg-amber-950/50 text-amber-900 dark:text-amber-200 border-b-2 border-amber-500',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />,
        };
      case 'positive':
        return {
          badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
          highlight: 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 border-b-2 border-emerald-500',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />,
        };
      default:
        return {
          badge: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800',
          highlight: 'bg-indigo-100 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-200 border-b-2 border-indigo-500',
          icon: <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" />,
        };
    }
  };

  const selectedAnnotation = annotations.find((a) => a.id === selectedAnnotationId);

  // Render annotated text by splitting occurrences of quoted phrases
  const renderAnnotatedBody = () => {
    if (viewMode === 'raw' || !annotations || annotations.length === 0) {
      return (
        <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-slate-700 dark:text-slate-300">
          {emailBody}
        </pre>
      );
    }

    // Sort annotations by appearance in body
    let segments: Array<{ text: string; annotation?: ContentAnnotation }> = [
      { text: emailBody },
    ];

    annotations.forEach((ann) => {
      const newSegments: Array<{ text: string; annotation?: ContentAnnotation }> = [];
      segments.forEach((seg) => {
        if (seg.annotation) {
          newSegments.push(seg);
          return;
        }

        const idx = seg.text.indexOf(ann.quote);
        if (idx !== -1) {
          const before = seg.text.substring(0, idx);
          const match = seg.text.substring(idx, idx + ann.quote.length);
          const after = seg.text.substring(idx + ann.quote.length);

          if (before) newSegments.push({ text: before });
          newSegments.push({ text: match, annotation: ann });
          if (after) newSegments.push({ text: after });
        } else {
          newSegments.push(seg);
        }
      });
      segments = newSegments;
    });

    return (
      <div className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-slate-700 dark:text-slate-300">
        {segments.map((seg, i) => {
          if (!seg.annotation) {
            return <span key={i}>{seg.text}</span>;
          }

          const style = getSeverityStyle(seg.annotation.severity);
          const isSelected = selectedAnnotationId === seg.annotation.id;

          return (
            <button
              key={i}
              onClick={() => setSelectedAnnotationId(seg.annotation!.id)}
              className={`cursor-pointer px-1 py-0.5 rounded transition-all inline text-left font-medium ${style.highlight} ${
                isSelected ? 'ring-2 ring-indigo-500 font-semibold' : 'hover:opacity-80'
              }`}
              title={`Click to inspect: ${seg.annotation.label}`}
            >
              {seg.text}
              <span className="ml-1 text-[10px] font-mono text-slate-500 dark:text-slate-400">
                [{seg.annotation.label}]
              </span>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-500" />
            Email Content Health Breakdown
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Inline linguistic analysis, readability grade, and conversion friction markers
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
          <button
            onClick={() => setViewMode('annotated')}
            className={`px-3 py-1 font-medium rounded-md transition-colors ${
              viewMode === 'annotated'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Annotated View
          </button>
          <button
            onClick={() => setViewMode('raw')}
            className={`px-3 py-1 font-medium rounded-md transition-colors ${
              viewMode === 'raw'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Plain Text
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200/80 dark:border-slate-700/60">
          <div className="text-[11px] text-slate-400 font-medium">Readability</div>
          <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1 truncate">
            {readabilityGradeLevel}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Optimal for email</div>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200/80 dark:border-slate-700/60">
          <div className="text-[11px] text-slate-400 font-medium">Reading Time</div>
          <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1 tabular-nums">
            ~{readingTimeSeconds} seconds
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Based on 200 WPM</div>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200/80 dark:border-slate-700/60">
          <div className="text-[11px] text-slate-400 font-medium">Length & Rhythm</div>
          <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1 tabular-nums">
            {wordCount} words · {paragraphCount} paras
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">{avgSentenceLength} words/sentence</div>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200/80 dark:border-slate-700/60">
          <div className="text-[11px] text-slate-400 font-medium">Detected Tone</div>
          <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1 truncate">
            {tone}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Brand perception</div>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200/80 dark:border-slate-700/60">
          <div className="text-[11px] text-slate-400 font-medium">Mobile Scanability</div>
          <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
            <Smartphone className="w-3.5 h-3.5" />
            High
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Single-column rhythm</div>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200/80 dark:border-slate-700/60">
          <div className="text-[11px] text-slate-400 font-medium">Structure Grade</div>
          <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-1 tabular-nums">
            {contentStructureGrade}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Logical progression</div>
        </div>
      </div>

      {/* Main Body + Annotation Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Annotated Email Body */}
        <div className="lg:col-span-7 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 max-h-[500px] overflow-y-auto">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-between">
            <span>Body Content Canvas</span>
            <span className="text-[10px] font-normal">
              {viewMode === 'annotated' ? 'Click highlighted sections for diagnostic' : 'Raw format'}
            </span>
          </div>
          {renderAnnotatedBody()}
        </div>

        {/* Right: Inline Annotations Inspector */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Inline Annotations ({annotations.length})</span>
            <span className="text-[10px] font-normal text-slate-400">Click to select</span>
          </div>

          <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
            {annotations.map((ann) => {
              const isSelected = selectedAnnotationId === ann.id;
              const style = getSeverityStyle(ann.severity);

              return (
                <div
                  key={ann.id}
                  onClick={() => setSelectedAnnotationId(ann.id)}
                  className={`cursor-pointer p-3 rounded-xl border transition-all text-xs ${
                    isSelected
                      ? 'border-indigo-500 dark:border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20 shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white">
                      {style.icon}
                      <span>{ann.label}</span>
                    </div>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border capitalize ${style.badge}`}>
                      {ann.severity}
                    </span>
                  </div>

                  <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded font-mono text-[11px] text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-700/60 mb-2 italic">
                    "{ann.quote}"
                  </div>

                  <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                    {ann.explanation}
                  </p>

                  {ann.suggestedReplacement && (
                    <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block mb-1">
                        Suggested Replacement
                      </span>
                      <div className="p-2 bg-indigo-50/60 dark:bg-indigo-950/40 text-slate-800 dark:text-slate-200 rounded text-[11px] whitespace-pre-wrap font-sans border border-indigo-100 dark:border-indigo-900/60">
                        {ann.suggestedReplacement}
                      </div>
                      {onApplyAnnotationReplacement && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onApplyAnnotationReplacement(ann.quote, ann.suggestedReplacement!);
                          }}
                          className="mt-1.5 text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                        >
                          Apply this fix to email body <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Jargon & Missing Information warning bar */}
      {(jargonIdentified?.length > 0 || missingInformation?.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
          {jargonIdentified && jargonIdentified.length > 0 && (
            <div className="p-3 bg-amber-50/70 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800/60">
              <span className="font-semibold text-amber-900 dark:text-amber-300">
                Industry Jargon Detected:
              </span>{' '}
              <span className="text-amber-800 dark:text-amber-400">
                {jargonIdentified.join(', ')} (verify clarity for non-technical recipients)
              </span>
            </div>
          )}

          {missingInformation && missingInformation.length > 0 && (
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Recommended Additions:
              </span>{' '}
              <span className="text-slate-500 dark:text-slate-400">
                {missingInformation.join(' · ')}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
