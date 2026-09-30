import React, { useState } from 'react';
import { CSVRow } from '../types/campaign';
import { SAMPLE_CSV_RAW } from '../data/sampleCsvData';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Search,
  ArrowRight,
  TrendingUp,
  Download,
} from 'lucide-react';
import { useToast } from './Toast';

interface CsvUploaderProps {
  onSelectCampaignForAnalysis?: (campaignData: Partial<CSVRow>) => void;
}

export const CsvUploader: React.FC<CsvUploaderProps> = ({
  onSelectCampaignForAnalysis,
}) => {
  const { toast } = useToast();
  const [csvText, setCsvText] = useState<string>('');
  const [parsedRows, setParsedRows] = useState<CSVRow[]>([]);
  const [detectedColumns, setDetectedColumns] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeMetricChart, setActiveMetricChart] = useState<'openRate' | 'ctr' | 'conversionRate'>('openRate');

  // Parse CSV string into rows with calculated metrics
  const parseCSVContent = (content: string) => {
    try {
      const lines = content.trim().split(/\r?\n/).filter(line => line.trim().length > 0);
      if (lines.length < 2) {
        setErrorMsg('CSV must contain at least a header row and one data row.');
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      setDetectedColumns(lines[0].split(',').map(h => h.trim()));

      // Column index finder
      const findCol = (nameAliases: string[]) => {
        return headers.findIndex(h => nameAliases.some(alias => h.includes(alias)));
      };

      const cIdx = findCol(['campaign', 'name', 'title']);
      const sentIdx = findCol(['sent', 'send', 'volume']);
      const delIdx = findCol(['delivered', 'delivery']);
      const opensIdx = findCol(['opens', 'opened', 'unique opens']);
      const clicksIdx = findCol(['clicks', 'clicked', 'unique clicks']);
      const convIdx = findCol(['conversions', 'converted', 'orders']);
      const unsubIdx = findCol(['unsubscribes', 'unsubs', 'opt-out']);
      const bounceIdx = findCol(['bounces', 'bounced']);

      const rows: CSVRow[] = [];

      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',').map(p => p.trim());
        if (parts.length < 2) continue;

        const campaign = cIdx !== -1 && parts[cIdx] ? parts[cIdx] : `Campaign #${i}`;
        const sent = sentIdx !== -1 ? Math.max(0, parseInt(parts[sentIdx], 10) || 0) : 0;
        const delivered = delIdx !== -1 ? Math.max(0, parseInt(parts[delIdx], 10) || 0) : sent;
        const opens = opensIdx !== -1 ? Math.max(0, parseInt(parts[opensIdx], 10) || 0) : 0;
        const clicks = clicksIdx !== -1 ? Math.max(0, parseInt(parts[clicksIdx], 10) || 0) : 0;
        const conversions = convIdx !== -1 ? Math.max(0, parseInt(parts[convIdx], 10) || 0) : 0;
        const unsubscribes = unsubIdx !== -1 ? Math.max(0, parseInt(parts[unsubIdx], 10) || 0) : 0;
        const bounces = bounceIdx !== -1 ? Math.max(0, parseInt(parts[bounceIdx], 10) || 0) : (sent >= delivered ? sent - delivered : 0);

        const openRate = delivered > 0 ? Number(((opens / delivered) * 100).toFixed(2)) : 0;
        const ctr = delivered > 0 ? Number(((clicks / delivered) * 100).toFixed(2)) : 0;
        const ctor = opens > 0 ? Number(((clicks / opens) * 100).toFixed(2)) : 0;
        const conversionRate = delivered > 0 ? Number(((conversions / delivered) * 100).toFixed(2)) : 0;
        const bounceRate = sent > 0 ? Number(((bounces / sent) * 100).toFixed(2)) : 0;
        const unsubscribeRate = delivered > 0 ? Number(((unsubscribes / delivered) * 100).toFixed(2)) : 0;

        rows.push({
          campaign,
          sent,
          delivered,
          opens,
          clicks,
          conversions,
          unsubscribes,
          bounces,
          openRate,
          ctr,
          ctor,
          conversionRate,
          bounceRate,
          unsubscribeRate,
        });
      }

      setParsedRows(rows);
      setErrorMsg(null);
      toast(`Successfully imported ${rows.length} campaigns!`, 'success');
    } catch (err: any) {
      setErrorMsg(`Failed to parse CSV: ${err.message || 'Check delimiter formatting'}`);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setCsvText(content);
      parseCSVContent(content);
    };
    reader.readAsText(file);
  };

  const handleLoadSample = () => {
    setCsvText(SAMPLE_CSV_RAW);
    parseCSVContent(SAMPLE_CSV_RAW);
  };

  const filteredRows = parsedRows.filter((r) =>
    r.campaign.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-indigo-500" />
            CSV Campaign Performance Batch Analyzer
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Upload multi-campaign history to benchmark open rates, CTR, and conversion trajectories
          </p>
        </div>
        <button
          onClick={handleLoadSample}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 rounded-lg border border-indigo-200 dark:border-indigo-800 transition-colors"
        >
          Load Sample Multi-Campaign CSV
        </button>
      </div>

      {/* Upload Dropzone */}
      {parsedRows.length === 0 ? (
        <div className="p-8 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center text-center space-y-3 bg-slate-50/50 dark:bg-slate-800/20">
          <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Drop your campaign performance CSV here
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
              Expected columns: Campaign, Sent, Delivered, Opens, Clicks, Conversions, Unsubscribes, Bounces
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <label className="cursor-pointer px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors">
              Browse CSV File
              <input
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            <span className="text-xs text-slate-400">or</span>
            <button
              onClick={handleLoadSample}
              className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Load Demo CSV
            </button>
          </div>

          {errorMsg && (
            <div className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 p-2 rounded-lg border border-rose-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Detected Summary */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span className="font-semibold text-slate-900 dark:text-white">
                {parsedRows.length} Campaigns Loaded
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-500 dark:text-slate-400">
                Detected columns: {detectedColumns.join(', ')}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <label className="cursor-pointer px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                Replace CSV
                <input
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Interactive Chart Section */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-indigo-500" />
                Cross-Campaign Metric Distribution
              </div>
              <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
                <button
                  onClick={() => setActiveMetricChart('openRate')}
                  className={`px-2.5 py-1 rounded font-medium transition-colors ${
                    activeMetricChart === 'openRate'
                      ? 'bg-indigo-600 text-white font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Open Rate (%)
                </button>
                <button
                  onClick={() => setActiveMetricChart('ctr')}
                  className={`px-2.5 py-1 rounded font-medium transition-colors ${
                    activeMetricChart === 'ctr'
                      ? 'bg-indigo-600 text-white font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  CTR (%)
                </button>
                <button
                  onClick={() => setActiveMetricChart('conversionRate')}
                  className={`px-2.5 py-1 rounded font-medium transition-colors ${
                    activeMetricChart === 'conversionRate'
                      ? 'bg-indigo-600 text-white font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Conversion Rate (%)
                </button>
              </div>
            </div>

            {/* Visual Bars for all campaigns */}
            <div className="space-y-2.5 pt-2">
              {parsedRows.map((r, i) => {
                const metricVal = r[activeMetricChart];
                const maxVal = Math.max(...parsedRows.map(row => row[activeMetricChart]), 10);
                const widthPct = Math.max(3, Math.min(100, (metricVal / maxVal) * 100));

                return (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-xs">
                        {r.campaign}
                      </span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                        {metricVal.toFixed(2)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${widthPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Search + Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="relative flex-1 max-w-xs">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter campaigns..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <span className="text-[11px] text-slate-400">
                Showing {filteredRows.length} of {parsedRows.length} campaigns
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-4 py-2.5">Campaign Name</th>
                    <th className="px-3 py-2.5 text-right">Sent</th>
                    <th className="px-3 py-2.5 text-right">Opens</th>
                    <th className="px-3 py-2.5 text-right">Open Rate</th>
                    <th className="px-3 py-2.5 text-right">Clicks</th>
                    <th className="px-3 py-2.5 text-right">CTR</th>
                    <th className="px-3 py-2.5 text-right">CTOR</th>
                    <th className="px-3 py-2.5 text-right">Conv. Rate</th>
                    <th className="px-4 py-2.5 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredRows.map((row, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white max-w-xs truncate">
                        {row.campaign}
                      </td>
                      <td className="px-3 py-3 text-right font-mono tabular-nums text-slate-600 dark:text-slate-300">
                        {row.sent.toLocaleString()}
                      </td>
                      <td className="px-3 py-3 text-right font-mono tabular-nums text-slate-600 dark:text-slate-300">
                        {row.opens.toLocaleString()}
                      </td>
                      <td className="px-3 py-3 text-right font-mono font-bold tabular-nums text-indigo-600 dark:text-indigo-400">
                        {row.openRate.toFixed(2)}%
                      </td>
                      <td className="px-3 py-3 text-right font-mono tabular-nums text-slate-600 dark:text-slate-300">
                        {row.clicks.toLocaleString()}
                      </td>
                      <td className="px-3 py-3 text-right font-mono font-bold tabular-nums text-indigo-600 dark:text-indigo-400">
                        {row.ctr.toFixed(2)}%
                      </td>
                      <td className="px-3 py-3 text-right font-mono tabular-nums text-slate-600 dark:text-slate-300">
                        {row.ctor.toFixed(2)}%
                      </td>
                      <td className="px-3 py-3 text-right font-mono font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                        {row.conversionRate.toFixed(2)}%
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => {
                            if (onSelectCampaignForAnalysis) {
                              onSelectCampaignForAnalysis(row);
                              toast(`Loaded "${row.campaign}" into Campaign Analyzer`, 'success');
                            }
                          }}
                          className="px-2.5 py-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded border border-indigo-200 dark:border-indigo-800 transition-colors"
                        >
                          Analyze
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
