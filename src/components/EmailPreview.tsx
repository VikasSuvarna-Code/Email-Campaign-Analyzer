import React, { useState } from 'react';
import { FullCampaignAnalysis } from '../types/campaign';
import {
  Monitor,
  Smartphone,
  Sparkles,
  Mail,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface EmailPreviewProps {
  campaign: FullCampaignAnalysis;
  improvedSubject?: string;
  improvedBody?: string;
}

export const EmailPreview: React.FC<EmailPreviewProps> = ({
  campaign,
  improvedSubject,
  improvedBody,
}) => {
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [version, setVersion] = useState<'original' | 'improved'>('original');

  const activeSubject = version === 'improved' && improvedSubject ? improvedSubject : campaign.subject;
  const activeBody = version === 'improved' && improvedBody ? improvedBody : campaign.body;

  // Extract primary CTA button text if found in email body (e.g., [Click Here] or similar)
  const ctaMatch = activeBody.match(/\[(.*?)\]/);
  const ctaText = ctaMatch ? ctaMatch[1] : 'Explore Exclusive Access →';

  // Format body by stripping markdown style button tags for visual preview button
  const cleanBodyText = activeBody.replace(/\[(.*?)\]/g, '').trim();

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-5">
      {/* Header with Device & Version Switchers */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Mail className="w-4 h-4 text-indigo-500" />
            Realistic Inbox Preview
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Rendered client environment for desktop and mobile viewport verification
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Version Switcher */}
          {improvedBody && (
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
              <button
                onClick={() => setVersion('original')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  version === 'original'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Original
              </button>
              <button
                onClick={() => setVersion('improved')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded font-medium transition-colors ${
                  version === 'improved'
                    ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Sparkles className="w-3 h-3" /> Improved
              </button>
            </div>
          )}

          {/* Device Switcher */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
            <button
              onClick={() => setDevice('desktop')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded font-medium transition-colors ${
                device === 'desktop'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
              title="Desktop viewport preview"
            >
              <Monitor className="w-3.5 h-3.5" /> Desktop
            </button>
            <button
              onClick={() => setDevice('mobile')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded font-medium transition-colors ${
                device === 'mobile'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
              title="Mobile viewport preview"
            >
              <Smartphone className="w-3.5 h-3.5" /> Mobile
            </button>
          </div>
        </div>
      </div>

      {/* Preview Container */}
      <div className="flex justify-center p-4 bg-slate-100 dark:bg-slate-950 rounded-xl overflow-x-auto min-h-[460px]">
        <div
          className={`bg-white dark:bg-slate-900 rounded-xl border border-slate-300 dark:border-slate-800 shadow-md transition-all duration-300 ${
            device === 'mobile' ? 'w-[375px]' : 'w-full max-w-2xl'
          }`}
        >
          {/* Simulated Email Client Top Bar */}
          <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-850/80 rounded-t-xl text-xs space-y-2">
            {/* Subject */}
            <div className="font-bold text-sm text-slate-900 dark:text-white">
              {activeSubject}
            </div>

            {/* Sender lockup */}
            <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                  {campaign.senderName?.charAt(0) || 'L'}
                </div>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {campaign.senderName || 'Elena Vance'}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    &lt;{campaign.senderEmail || 'elena@luminagear.com'}&gt;
                  </div>
                </div>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                Today, 8:15 AM
              </div>
            </div>

            {/* Preheader Preview */}
            {campaign.previewText && (
              <div className="text-[11px] text-slate-500 dark:text-slate-400 italic pt-1 border-t border-slate-200/60 dark:border-slate-750">
                <span className="font-medium text-slate-600 dark:text-slate-300 not-italic">Preheader: </span>
                {campaign.previewText}
              </div>
            )}
          </div>

          {/* Email Body Content */}
          <div className="p-5 md:p-6 space-y-5 text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
            <div className="whitespace-pre-wrap">
              {cleanBodyText}
            </div>

            {/* Rendered Action Button */}
            <div className="py-2 text-center">
              <a
                href="#preview-action"
                onClick={(e) => e.preventDefault()}
                className="inline-flex items-center justify-center px-6 py-3 font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-transform active:scale-98"
              >
                {ctaText}
              </a>
            </div>

            {/* Email Footer */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 dark:text-slate-500 text-center space-y-1">
              <div>You received this email because you are registered for VIP Early Access.</div>
              <div className="flex items-center justify-center gap-2">
                <a href="#manage" onClick={(e) => e.preventDefault()} className="hover:underline">
                  Preferences
                </a>
                <span>·</span>
                <a href="#unsub" onClick={(e) => e.preventDefault()} className="hover:underline">
                  Unsubscribe
                </a>
                <span>·</span>
                <span>Lumina Gear Inc, 100 Market St, SF CA</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
