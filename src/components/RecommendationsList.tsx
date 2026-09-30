import React from 'react';
import { ActionableRecommendation } from '../types/campaign';
import { Lightbulb, ArrowUpRight, FlaskConical, Target, CheckSquare } from 'lucide-react';

interface RecommendationsListProps {
  recommendations: ActionableRecommendation[];
  onLaunchExperiment?: (rec: ActionableRecommendation) => void;
}

export const RecommendationsList: React.FC<RecommendationsListProps> = ({
  recommendations,
  onLaunchExperiment,
}) => {
  const getPriorityBadge = (priority: ActionableRecommendation['priority']) => {
    switch (priority) {
      case 'High':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300 dark:border-rose-800';
      case 'Medium':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800';
      default:
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-indigo-500" />
            Actionable Recommendations & Experiment Roadmap
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Prioritized tactical steps with clear hypotheses and testing methodologies
          </p>
        </div>
        <span className="text-[11px] text-slate-400">
          Ranked by conversion leverage
        </span>
      </div>

      <div className="space-y-4">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-850 hover:border-slate-300 dark:hover:border-slate-600 transition-all space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getPriorityBadge(rec.priority)}`}>
                  {rec.priority} Priority
                </span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Target className="w-3.5 h-3.5 text-indigo-500" />
                  Target: {rec.expectedAreaOfImprovement}
                </span>
              </div>

              {onLaunchExperiment && (
                <button
                  onClick={() => onLaunchExperiment(rec)}
                  className="self-start sm:self-auto flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded border border-indigo-200 dark:border-indigo-800 transition-colors"
                >
                  <FlaskConical className="w-3.5 h-3.5" />
                  Create A/B Experiment <ArrowUpRight className="w-3 h-3" />
                </button>
              )}
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {rec.recommendation}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                <span className="font-semibold text-slate-800 dark:text-slate-200">Reasoning: </span>
                {rec.reason}
              </p>
            </div>

            {/* Suggested Experiment Box */}
            <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200/80 dark:border-slate-750 text-xs">
              <div className="flex items-center gap-1.5 text-indigo-700 dark:text-indigo-300 font-semibold mb-1">
                <FlaskConical className="w-3.5 h-3.5" />
                <span>Suggested A/B Experiment Protocol:</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                {rec.suggestedExperiment}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
