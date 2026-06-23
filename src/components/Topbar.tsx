import React from 'react';
import { Languages, HelpCircle, Bell, User, Flame } from 'lucide-react';
import { LanguageMode } from '../types';
import { BilingualText } from './BilingualText';

interface TopbarProps {
  languageMode: LanguageMode;
  setLanguageMode: (mode: LanguageMode) => void;
  activeTab: 'marketplace' | 'build-group' | 'my-groups';
}

export const Topbar: React.FC<TopbarProps> = ({
  languageMode,
  setLanguageMode,
  activeTab,
}) => {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'marketplace':
        return { zh: '浏览可用时段', en: 'Browse Available Slots' };
      case 'build-group':
        return { zh: '拼团详情页', en: 'Build Group Detail' };
      case 'my-groups':
        return { zh: '我的团与结算', en: 'My Groups & Payments' };
    }
  };

  const title = getTabTitle();

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
      {/* Title / Breadcrumb */}
      <div className="flex items-center gap-2">
        <BilingualText
          zh={title.zh}
          en={title.en}
          mode={languageMode}
          primaryClass="text-base font-semibold text-slate-800"
          secondaryClass="text-xs text-slate-500 font-normal ml-2"
        />
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-4">
        {/* Language Emphasis Toggle */}
        <div className="flex items-center bg-slate-100 rounded-full p-0.5 border border-slate-200 shadow-sm">
          <button
            onClick={() => setLanguageMode('zh-first')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              languageMode === 'zh-first'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            中文优先
          </button>
          <button
            onClick={() => setLanguageMode('en-first')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              languageMode === 'en-first'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            EN First
          </button>
        </div>

        <div className="h-4 w-px bg-slate-200"></div>

        {/* Dummy Notifications / Helpful links */}
        <div className="hidden sm:flex items-center gap-1">
          <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-all">
            <HelpCircle className="w-4.5 h-4.5" />
          </button>
          <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-all relative">
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
          </button>
        </div>

        <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>

        {/* Partner Name Indicator */}
        <div className="flex items-center gap-2.5">
          <div className="flex flex-col text-right hidden md:block">
            <span className="text-xs font-semibold text-slate-700 leading-tight">
              {languageMode === 'zh-first' ? '环球旅游 (上海账户)' : 'Global Travel (SH Acc)'}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              ID: SH-GP-88392
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 text-xs font-medium">
            <User className="w-4 h-4" />
          </div>
        </div>
      </div>
    </header>
  );
};
