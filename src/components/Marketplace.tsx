import React, { useState, useMemo } from 'react';
import { Slot, LanguageMode } from '../types';
import { SlotCard } from './SlotCard';
import { BilingualText } from './BilingualText';
import { Filter, Search, RefreshCw, CalendarRange, Languages, Compass, AlertCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MarketplaceProps {
  slots: Slot[];
  languageMode: LanguageMode;
  onJoin: (slotId: string) => void;
  onView: (slotId: string) => void;
  currentTime: Date;
  onSimulateTimeout: (slotId: string) => void;
  onResetDatabase: () => void;
}

export const Marketplace: React.FC<MarketplaceProps> = ({
  slots,
  languageMode,
  onJoin,
  onView,
  currentTime,
  onSimulateTimeout,
  onResetDatabase,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>('all');

  // Compute unique languages & dates for filters
  const dateOptions = useMemo(() => {
    const dates = slots.map((s) => s.date);
    return Array.from(new Set(dates)).sort();
  }, [slots]);

  const filteredSlots = useMemo(() => {
    return slots.filter((slot) => {
      const matchLang =
        selectedLanguage === 'all' ||
        slot.guideLanguageZh === selectedLanguage ||
        slot.guideLanguageEn.toLowerCase() === selectedLanguage.toLowerCase();
      
      const matchDate = selectedDate === 'all' || slot.date === selectedDate;
      
      return matchLang && matchDate;
    });
  }, [slots, selectedLanguage, selectedDate]);

  // Compute summary stats for the top bar of the marketplace
  const stats = useMemo(() => {
    const total = slots.length;
    const available = slots.filter((s) => s.ownerPartnerId === null && s.status !== 'released').length;
    const selfOwned = slots.filter((s) => s.ownerPartnerId === 'partner-self').length;
    const released = slots.filter((s) => s.status === 'released').length;
    return { total, available, selfOwned, released };
  }, [slots]);

  return (
    <div className="space-y-6">
      {/* Target Route Context Box */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 bg-white border border-slate-200 shadow-sm rounded-lg flex items-center justify-center text-slate-700 shrink-0">
            <Compass className="w-5 h-5 text-indigo-600 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                {languageMode === 'zh-first' ? '当前航线 (系统唯 一)' : 'Active Route (Sole Route)'}
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-1.5 mt-1">
              外滩历史漫步
              <span className="text-xs text-slate-400 font-normal">/ The Bund Heritage Walk</span>
            </h2>
            <p className="text-xs text-slate-500 max-w-2xl mt-1 leading-snug">
              {languageMode === 'zh-first'
                ? '探寻上海开埠历史，全长2.5公里。本渠道终端仅承载此一条经典上海文化徒步路线的排期计划与独占拼团售卖。'
                : 'Explore the 150-year-old Bund colonial architecture. This console is exclusively dedicated to this singular high-end cultural tour.'}
            </p>
          </div>
        </div>

        {/* Reset / Sync button */}
        <button
          onClick={onResetDatabase}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 transition-all cursor-pointer self-start md:self-auto shrink-0 shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <BilingualText
            zh="重置演示数据"
            en="Reset Demo Data"
            mode={languageMode}
            primaryClass="font-semibold text-slate-600"
            secondaryClass="text-[10px] font-normal block leading-tight text-slate-400"
          />
        </button>
      </div>

      {/* KPI Stats Panel */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            titleZh: '总班次',
            titleEn: 'Total Slots Released',
            val: stats.total,
            color: 'border-slate-100 bg-slate-50/50',
            text: 'text-slate-800',
          },
          {
            titleZh: '当前可认领',
            titleEn: 'Available Claimable',
            val: stats.available,
            color: 'border-blue-100 bg-blue-50/30',
            text: 'text-blue-700',
          },
          {
            titleZh: '我方占用中',
            titleEn: 'Our Active Groups',
            val: stats.selfOwned,
            color: 'border-indigo-100 bg-indigo-50/30',
            text: 'text-indigo-700',
          },
          {
            titleZh: '超时已释放',
            titleEn: 'Released Slots',
            val: stats.released,
            color: 'border-rose-100 bg-rose-50/30',
            text: 'text-rose-600',
          },
        ].map((item, idx) => (
          <div key={idx} className={`p-4 rounded-xl border ${item.color}`}>
            <p className="text-[10px] text-slate-400 uppercase font-medium tracking-wider">
              {languageMode === 'zh-first' ? item.titleZh : item.titleEn}
            </p>
            <p className={`text-2xl font-bold tracking-tight mt-1 ${item.text}`}>
              {item.val}
            </p>
          </div>
        ))}
      </div>

      {/* Filters Area */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Guide Lang Pill filter */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Languages className="w-3.5 h-3.5" />
              <BilingualText
                zh="导游语言"
                en="Guide Language"
                mode={languageMode}
                primaryClass="text-xs font-semibold text-slate-500"
                secondaryClass="text-[10px] text-slate-400 block"
              />
            </div>
            <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              {[
                { id: 'all', zh: '全部 / All', en: 'All' },
                { id: '英语', zh: '英语', en: 'English' },
                { id: '汉语', zh: '中文', en: 'Chinese' },
                { id: '日语', zh: '日语', en: 'Japanese' },
              ].map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => setSelectedLanguage(lang.id === '汉语' ? '中文' : lang.id)}
                  className={`px-3 py-1 text-xs rounded-md transition-all font-medium cursor-pointer ${
                    selectedLanguage === (lang.id === '汉语' ? '中文' : lang.id)
                      ? 'bg-white text-slate-800 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {languageMode === 'zh-first' ? lang.zh : lang.en}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden md:block h-8 w-px bg-slate-200 align-self-end mt-4"></div>

          {/* Date pill filter */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-slate-400">
              <CalendarRange className="w-3.5 h-3.5" />
              <BilingualText
                zh="日期筛选"
                en="Date Filter"
                mode={languageMode}
                primaryClass="text-xs font-semibold text-slate-500"
                secondaryClass="text-[10px] text-slate-400 block"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedDate('all')}
                className={`px-3 py-1 text-xs rounded-md border font-medium cursor-pointer transition-all ${
                  selectedDate === 'all'
                    ? 'bg-slate-800 border-slate-800 text-white'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {languageMode === 'zh-first' ? '全部日期' : 'All Dates'}
              </button>
              {dateOptions.map((date) => (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`px-3 py-1 text-xs rounded-md border font-medium cursor-pointer transition-all ${
                    selectedDate === date
                      ? 'bg-slate-800 border-slate-800 text-white'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {date}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Counter of matches */}
        <div className="text-right shrink-0">
          <p className="text-xs text-slate-400 font-medium">
            {languageMode === 'zh-first' ? '筛选匹配班次' : 'Filtered slot count'}
          </p>
          <p className="text-sm font-bold text-slate-700">
            {filteredSlots.length} <span className="text-xs font-normal text-slate-400">/ 12</span>
          </p>
        </div>
      </div>

      {/* Grid container with motion */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredSlots.map((slot) => (
            <motion.div
              key={slot.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <SlotCard
                slot={slot}
                languageMode={languageMode}
                onJoin={onJoin}
                onView={onView}
                currentTime={currentTime}
                onSimulateTimeout={onSimulateTimeout}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredSlots.length === 0 && (
        <div className="py-16 text-center bg-slate-50 border border-slate-200 border-dashed rounded-2xl max-w-md mx-auto">
          <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-700">
            {languageMode === 'zh-first' ? '无匹配的时段' : 'No Matching Slots'}
          </h3>
          <p className="text-xs text-slate-400 mt-1 px-4">
            {languageMode === 'zh-first'
              ? '建议更换导游语言或日期范围，或重置演示数据。'
              : 'Try clearing the filters or reset the database to view default schedule.'}
          </p>
        </div>
      )}
    </div>
  );
};
