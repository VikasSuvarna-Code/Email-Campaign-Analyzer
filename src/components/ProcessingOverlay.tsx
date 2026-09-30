import React, { useEffect, useState } from 'react';
import { Sparkles, CheckCircle2, CircleDashed } from 'lucide-react';

interface ProcessingOverlayProps {
  isOpen: boolean;
  onComplete: () => void;
}

export const ProcessingOverlay: React.FC<ProcessingOverlayProps> = ({
  isOpen,
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { title: 'Reading campaign structure & tokens', sub: 'Extracting subject, preview headers, and body elements' },
    { title: 'Analyzing subject line & spam filters', sub: 'Scanning character length, curiosity gaps, and heuristic risk' },
    { title: 'Evaluating content & reading friction', sub: 'Assessing Flesch-Kincaid index, CTA anchor verbs, and mobile scanability' },
    { title: 'Processing performance metrics', sub: 'Computing open rate, CTR, and delivery benchmarks' },
    { title: 'Synthesizing AI recommendations', sub: 'Prioritizing high-impact A/B experiments and copy improvements' },
  ];

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 450);
          return prev;
        }
      });
    }, 450);

    return () => clearInterval(interval);
  }, [isOpen, onComplete, steps.length]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-600 text-white shadow-sm">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              MailLens AI Analyzing
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Executing multi-stage linguistic & metric diagnostic
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-indigo-600 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Steps List */}
        <div className="space-y-3">
          {steps.map((step, idx) => {
            const isCompleted = idx < currentStep;
            const isCurrent = idx === currentStep;

            return (
              <div
                key={idx}
                className={`flex items-start gap-3 p-2 rounded-lg transition-all ${
                  isCurrent
                    ? 'bg-indigo-50/70 dark:bg-indigo-950/40 text-slate-900 dark:text-white font-semibold'
                    : isCompleted
                    ? 'text-slate-700 dark:text-slate-300'
                    : 'text-slate-400 dark:text-slate-600 opacity-60'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : isCurrent ? (
                    <CircleDashed className="w-4 h-4 text-indigo-600 dark:text-indigo-400 animate-spin" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-700" />
                  )}
                </div>

                <div className="text-xs">
                  <div className={isCurrent ? 'font-bold' : 'font-medium'}>
                    {step.title}
                  </div>
                  {isCurrent && (
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-normal mt-0.5">
                      {step.sub}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
