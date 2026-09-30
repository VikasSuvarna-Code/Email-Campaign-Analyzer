import React from 'react';
import {
  LayoutDashboard,
  FileEdit,
  Mail,
  BarChart3,
  Split,
  Lightbulb,
  FileText,
  UploadCloud,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'analyzer'
  | 'content'
  | 'metrics'
  | 'ab_test'
  | 'recommendations'
  | 'csv'
  | 'reports'
  | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  recommendationsCount: number;
  hasMetrics: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  collapsed,
  onToggleCollapse,
  recommendationsCount,
  hasMetrics,
}) => {
  const navItems: Array<{ id: NavTab; label: string; icon: React.ReactNode; badge?: string | number }> = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'analyzer',
      label: 'Campaign Input',
      icon: <FileEdit className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'content',
      label: 'Email Content',
      icon: <Mail className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'metrics',
      label: 'Campaign Metrics',
      icon: <BarChart3 className="w-4 h-4 shrink-0" />,
      badge: hasMetrics ? undefined : 'No data',
    },
    {
      id: 'ab_test',
      label: 'A/B Testing',
      icon: <Split className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'recommendations',
      label: 'AI Recommendations',
      icon: <Lightbulb className="w-4 h-4 shrink-0" />,
      badge: recommendationsCount,
    },
    {
      id: 'csv',
      label: 'CSV Upload & Multi-Run',
      icon: <UploadCloud className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'reports',
      label: 'Reports & Export',
      icon: <FileText className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-4 h-4 shrink-0" />,
    },
  ];

  return (
    <aside
      className={`relative z-20 flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-200 ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Navigation list */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
              title={collapsed ? item.label : undefined}
            >
              {item.icon}
              {!collapsed && (
                <span className="flex-1 text-left truncate">{item.label}</span>
              )}
              {!collapsed && item.badge !== undefined && (
                <span
                  className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                    typeof item.badge === 'number'
                      ? 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Collapse Toggle Footer */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
        {!collapsed && (
          <div className="text-[11px] text-slate-400 dark:text-slate-500 font-medium truncate">
            v2.4 · Gemini 3.8
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors ml-auto"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
};
