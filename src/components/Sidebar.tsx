import React from 'react';
import { LayoutDashboard, Users, CreditCard, Landmark, Globe, ShieldCheck } from 'lucide-react';
import { LanguageMode } from '../types';
import { BilingualText } from './BilingualText';

interface SidebarProps {
  activeTab: 'marketplace' | 'build-group' | 'my-groups';
  setActiveTab: (tab: 'marketplace' | 'build-group' | 'my-groups') => void;
  languageMode: LanguageMode;
  unassignedCount: number;
  activeBuildingCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  languageMode,
  unassignedCount,
  activeBuildingCount,
}) => {
  const menuItems = [
    {
      id: 'marketplace' as const,
      icon: LayoutDashboard,
      zh: '浏览可用时段',
      en: 'Browse Time Slots',
    },
    {
      id: 'build-group' as const,
      icon: Users,
      zh: '拼团详情页',
      en: 'Build Group Detail',
      badge: activeBuildingCount > 0 ? activeBuildingCount : undefined,
    },
    {
      id: 'my-groups' as const,
      icon: CreditCard,
      zh: '我的团与结算',
      en: 'My Groups & Payments',
    },
  ];

  return (
    <aside className="w-68 bg-slate-900 text-slate-300 flex flex-col h-screen border-r border-slate-800 shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold tracking-tight text-sm shadow-md shadow-indigo-600/20">
            SH
          </div>
          <div>
            <h1 className="text-sm font-semibold text-white leading-tight">
              {languageMode === 'zh-first' ? '渠道伙伴控制台' : 'Channel Partner Console'}
            </h1>
            <p className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">
              {languageMode === 'zh-first' ? '外滩历史漫步' : 'The Bund Heritage Walk'}
            </p>
          </div>
        </div>
      </div>

      {/* Target Route Notice - One Route Only */}
      <div className="mx-4 mt-4 p-3 bg-indigo-950/40 rounded-lg border border-indigo-900/30">
        <div className="flex gap-2">
          <Globe className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <BilingualText
              zh="专属运营航线"
              en="Exclusive Route"
              mode={languageMode}
              primaryClass="text-[11px] font-semibold text-indigo-300"
              secondaryClass="text-[9px] text-indigo-400/80 block"
            />
            <p className="text-xs font-semibold text-white mt-1 leading-snug">
              外滩历史漫步
              <span className="text-[10px] text-indigo-200 block font-normal font-sans">
                The Bund Heritage Walk
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-3.5 rounded-lg text-left transition-all ${
                isActive
                  ? 'bg-indigo-600/90 text-white shadow-sm shadow-indigo-600/10 font-medium'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <div className="flex-1 min-w-0">
                <BilingualText
                  zh={item.zh}
                  en={item.en}
                  mode={languageMode}
                  primaryClass={`text-xs block ${isActive ? 'text-white font-medium' : 'text-slate-300'}`}
                  secondaryClass={`text-[10px] block font-normal ${isActive ? 'text-indigo-200' : 'text-slate-500'}`}
                />
              </div>
              {item.badge !== undefined && (
                <span className="text-[10px] font-bold bg-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/20">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Unassigned Pool Quick View */}
      {unassignedCount > 0 && (
        <div className="mx-4 mb-4 p-3 bg-amber-950/20 rounded-lg border border-amber-900/40">
          <div className="flex gap-2">
            <span className="relative flex h-2 w-2 mt-1 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <div className="space-y-0.5">
              <BilingualText
                zh="待安排客源池"
                en="Unassigned Pool"
                mode={languageMode}
                primaryClass="text-xs font-semibold text-amber-300"
                secondaryClass="text-[10px] text-amber-500/80 block"
              />
              <p className="text-xs text-amber-200 font-medium mt-1">
                {languageMode === 'zh-first' 
                  ? `有 ${unassignedCount} 位未分配旅客` 
                  : `${unassignedCount} travelers waiting`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Partner Identity */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40 mt-auto">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-indigo-900/80 border border-indigo-700/50 flex items-center justify-center text-slate-300 shrink-0 font-semibold text-xs">
            GT
          </div>
          <div className="overflow-hidden">
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <p className="text-xs font-medium text-slate-200 truncate">
                {languageMode === 'zh-first' ? '环球旅游有限公司' : 'Global Travel Co., Ltd.'}
              </p>
            </div>
            <p className="text-[10px] text-slate-500 truncate mt-0.5">
              {languageMode === 'zh-first' ? 'B2B 协议伙伴 (海外)' : 'B2B Partner (Overseas)'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
