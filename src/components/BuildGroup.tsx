import React from 'react';
import { Slot, LanguageMode, Traveler } from '../types';
import { NATIONALITIES, PACKAGES } from '../data';
import { BilingualText } from './BilingualText';
import { 
  Plus, ShieldCheck, Timer, Users, Compass, 
  ArrowLeft, CircleAlert, Globe, HelpCircle, 
  Trash2, UserPlus, FileWarning, Sparkles 
} from 'lucide-react';

interface BuildGroupProps {
  slot: Slot | null;
  languageMode: LanguageMode;
  unassignedTravelers: Traveler[];
  onAddTravelerClick: () => void;
  onAssignTraveler: (travelerId: string, slotId: string) => void;
  onLockGroup: (slotId: string) => void;
  onRemoveTraveler: (travelerId: string, slotId: string) => void;
  onBackToMarketplace: () => void;
  currentTime: Date;
}

export const BuildGroup: React.FC<BuildGroupProps> = ({
  slot,
  languageMode,
  unassignedTravelers,
  onAddTravelerClick,
  onAssignTraveler,
  onLockGroup,
  onRemoveTraveler,
  onBackToMarketplace,
  currentTime,
}) => {
  if (!slot) {
    return (
      <div className="py-16 text-center bg-white border border-slate-200 rounded-2xl max-w-xl mx-auto space-y-6">
        <Users className="w-12 h-12 text-slate-300 mx-auto" />
        <div className="space-y-1.5">
          <BilingualText
            zh="未选择拼团时段"
            en="No Active Slot Selected"
            mode={languageMode}
            primaryClass="text-base font-bold text-slate-800 block"
            secondaryClass="text-xs text-slate-400 block font-normal"
          />
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed px-6">
            {languageMode === 'zh-first'
              ? '请先回到可用时段集市，认领一个时段并点击“拼团详情与录入”来管理组团名单。'
              : 'Please return to the Slot Marketplace to claim an active slot and start gathering/depositing traveler logs.'}
          </p>
        </div>
        <div>
          <button
            onClick={onBackToMarketplace}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-md shadow-indigo-600/10 cursor-pointer transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <BilingualText
              zh="前往时段集市"
              en="Back to Marketplace"
              mode={languageMode}
              primaryClass="font-bold text-white"
              secondaryClass="text-[9px] text-indigo-200 font-normal ml-0.5"
            />
          </button>
        </div>
      </div>
    );
  }

  const count = slot.travelers.length;
  const isSelf = slot.ownerPartnerId === 'partner-self';
  const progressPercent = Math.min(100, (count / 20) * 100);
  const isLocked = slot.status === 'locked';

  // Compute countdown seconds left
  let secondsLeft: number | null = null;
  if (slot.joinedAt && slot.status !== 'locked') {
    const elapsedMs = currentTime.getTime() - new Date(slot.joinedAt).getTime();
    secondsLeft = Math.max(0, 30 * 60 - Math.floor(elapsedMs / 1000));
  }

  const formatTimer = (totalSeconds: number) => {
    const min = Math.floor(totalSeconds / 60);
    const sec = totalSeconds % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  // Dual Status Message Details
  const getStatusMessageAlert = () => {
    if (count < 15) {
      return {
        type: 'danger',
        bg: 'bg-rose-50 border-rose-200 text-rose-800',
        zh: `🚨 还差 ${15 - count} 人达成团线！距离成团底线还存在差距。在拼满15人前，无法进行锁定成团结算。`,
        en: `🚨 Need ${15 - count} more travelers to form group! Lock option disabled until 15 capacity floor is reached.`,
      };
    } else if (count >= 15 && count < 20) {
      return {
        type: 'success',
        bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
        zh: `✨ 已达成团人数底线！目前可直接锁定成团。当前拼团进度 ${count}/20，多余床位还可增录 ${20 - count} 人。`,
        en: `✨ Ready to lock! Successfully passed the 15-passenger minimum target. Open for up to ${20 - count} more travelers.`,
      };
    } else { // 20
      return {
        type: 'full',
        bg: 'bg-purple-100 border-purple-200 text-purple-850',
        zh: `🎉 已拼满 20 人！床位全部封顶。请尽快完成安全审查并点击“锁定成团”锁定出行排期。`,
        en: `🎉 Capacity fully capped at 20! High density roster. Please process passport locks immediately before schedule start.`,
      };
    }
  };

  const statusMessage = getStatusMessageAlert();

  return (
    <div className="space-y-6">
      {/* Back button and breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToMarketplace}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-semibold hover:text-slate-900 transition-all cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <BilingualText
            zh="返回全部时段"
            en="All Slots"
            mode={languageMode}
            primaryClass="font-semibold text-slate-700"
            secondaryClass="text-[10px] text-slate-400 font-normal leading-none"
          />
        </button>

        <div className="text-right">
          <span className="text-[10px] text-slate-400 font-semibold tracking-wider block uppercase">
            {languageMode === 'zh-first' ? '独占锁定期' : 'EXCLUSIVE LOCK TERM'}
          </span>
          <span className="text-xs font-bold text-slate-600">
            {languageMode === 'zh-first' ? '30分钟硬上限计时' : '30-Min Realtime Release Window'}
          </span>
        </div>
      </div>

      {/* Main Grid: Left is slot specs + roster; Right is unassigned travelers & summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Grid: 2 Cols on large screen */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Header Specifications */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm relative overflow-hidden">
            {/* Background absolute brand pattern */}
            <div className="absolute right-0 top-0 opacity-5 pointer-events-none">
              <Compass className="w-48 h-48 text-indigo-600 -mr-12 -mt-12" />
            </div>

            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-100 text-indigo-800 rounded border border-indigo-200 uppercase">
                    {languageMode === 'zh-first' ? '专属路线' : 'Exclusive Route'}
                  </span>
                  <span className="text-xs text-slate-400">/ ID: {slot.id}</span>
                </div>
                <h1 className="text-xl font-bold text-slate-800">
                  外滩历史漫步
                  <span className="text-sm text-slate-400 font-medium ml-1">/ The Bund Heritage Walk</span>
                </h1>
              </div>

              {/* Roster Live Countdown */}
              {secondsLeft !== null && secondsLeft > 0 && (
                <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-lg flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-amber-800">
                    <Timer className="w-4 h-4 text-amber-600 animate-spin" style={{ animationDuration: '4s' }} />
                    <BilingualText
                      zh="⏱ 释放倒计时"
                      en="Time Left"
                      mode={languageMode}
                      primaryClass="text-xs font-bold text-amber-800"
                      secondaryClass="text-[9px] text-amber-600/80 block leading-tight font-normal"
                    />
                  </div>
                  <span className="font-mono text-base font-bold text-amber-800 bg-amber-100/50 px-2 py-0.5 rounded border border-amber-200">
                    {formatTimer(secondsLeft)}
                  </span>
                </div>
              )}
            </div>

            {/* Specifications Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-t border-b border-slate-100 bg-slate-50/50 px-4 -mx-6">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">
                  {languageMode === 'zh-first' ? '选定出发日期' : 'Tour Date'}
                </span>
                <p className="text-sm font-bold text-slate-700 mt-0.5">{slot.date}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">
                  {languageMode === 'zh-first' ? '出发时段班期' : 'Time Window'}
                </span>
                <p className="text-sm font-bold text-slate-700 mt-0.5">{slot.time}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">
                  {languageMode === 'zh-first' ? '向导配备与语言' : 'Assigned Language'}
                </span>
                <p className="text-sm font-bold text-indigo-700 mt-0.5">
                  {languageMode === 'zh-first' ? slot.guideLanguageZh : slot.guideLanguageEn}
                </p>
              </div>
            </div>

            {/* Micro Notch Progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between items-baseline text-xs">
                <BilingualText
                  zh={`成团进度: ${count} / 20人`}
                  en={`Forming Progress: ${count} / 20 Pax`}
                  mode={languageMode}
                  primaryClass="font-bold text-slate-700"
                  secondaryClass="text-[10px] text-slate-400 ml-1 font-normal"
                />
                <span className="text-xs font-bold text-slate-600">
                  {count} <span className="text-[10px] text-slate-400">/ 20</span>
                </span>
              </div>

              <div className="relative pt-4 pb-2">
                <div className="h-2.5 bg-slate-100 rounded-full relative overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isLocked
                        ? 'bg-emerald-600'
                        : count >= 20
                          ? 'bg-purple-600'
                          : count >= 15
                            ? 'bg-emerald-500'
                            : 'bg-indigo-600'
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>

                {/* The Notch */}
                <div className="absolute top-0.5" style={{ left: '75%' }}>
                  <div className="w-0.5 h-5 bg-slate-400 relative">
                    <span className="absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-bold text-slate-500 bg-white border border-slate-200 px-1.5 rounded shadow-sm">
                      {languageMode === 'zh-first' ? '15人 成团最低线' : '15 Passenger Minimum Floor'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Capacity Status Box (Dual state message!) */}
            <div className={`p-4 border rounded-xl text-xs font-medium ${statusMessage.bg} leading-relaxed`}>
              {languageMode === 'zh-first' ? statusMessage.zh : statusMessage.en}
            </div>
          </div>

          {/* Roster list table */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  旅客在册名单
                  <span className="text-xs font-normal text-slate-400">/ Group Roster (This agency exclusive)</span>
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {languageMode === 'zh-first' ? '仅展示由您单独录入的旅客名册。不与外部共享名单隐私。' : 'Direct listing of overseas customers enrolled by Global Travel.'}
                </p>
              </div>

              {/* Add traveler button */}
              {!isLocked && (
                <button
                  disabled={count >= 20}
                  onClick={onAddTravelerClick}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    count >= 20
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/10 cursor-pointer'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <BilingualText
                    zh="上传客人"
                    en="Add Traveler"
                    mode={languageMode}
                    primaryClass={`font-bold ${count >= 20 ? 'text-slate-400' : 'text-white'}`}
                    secondaryClass={`text-[9px] ml-0.5 font-normal ${count >= 20 ? 'text-slate-400' : 'text-indigo-200'}`}
                  />
                </button>
              )}
            </div>

            {/* Table layout */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    <th className="px-5 py-3.5">{languageMode === 'zh-first' ? '旅客姓名 / Name' : 'Full Name'}</th>
                    <th className="px-5 py-3.5">{languageMode === 'zh-first' ? '国籍 / Nationality' : 'Nationality'}</th>
                    <th className="px-5 py-3.5 md:table-cell hidden">{languageMode === 'zh-first' ? '邮箱 / Email' : 'Email Address'}</th>
                    <th className="px-5 py-3.5">{languageMode === 'zh-first' ? '护照号 / Pasport' : 'Passport No.'}</th>
                    <th className="px-5 py-3.5">{languageMode === 'zh-first' ? '升级套餐 / Package' : 'Package'}</th>
                    {!isLocked && <th className="px-5 py-3.5 text-right">{languageMode === 'zh-first' ? '操作' : 'Action'}</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {slot.travelers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-10 text-center text-slate-400">
                        <FileWarning className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                        <BilingualText
                          zh="暂无录入旅客"
                          en="Empty Roster List"
                          mode={languageMode}
                          primaryClass="font-bold text-slate-400 block"
                          secondaryClass="text-[10px] text-slate-400 block font-normal"
                        />
                        <p className="text-[11px] text-slate-500 mt-1">
                          {languageMode === 'zh-first' 
                            ? '点击上方“上传客人”或从右侧“待安排客源池”调配客人加入此时段。' 
                            : 'Add new overseas customers or allocate travelers from the unassigned holding repository.'}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    slot.travelers.map((traveler) => {
                      const nationalityObj = NATIONALITIES.find(n => n.code === traveler.nationality);
                      const matchedPkg = PACKAGES.find(p => p.id === traveler.packageId);
                      
                      return (
                        <tr key={traveler.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-5 py-3 font-semibold text-slate-800">
                            {traveler.name}
                          </td>
                          <td className="px-5 py-3 text-slate-500 font-medium">
                            {languageMode === 'zh-first' && nationalityObj 
                              ? nationalityObj.zh 
                              : (nationalityObj ? nationalityObj.en : traveler.nationality)}
                          </td>
                          <td className="px-5 py-3 text-slate-500 md:table-cell hidden max-w-[150px] truncate" title={traveler.email}>
                            {traveler.email}
                          </td>
                          <td className="px-5 py-3 font-mono text-[11px] text-slate-600 bg-slate-50/50 font-medium">
                            🔐 {traveler.passport.slice(0, 3)}***{traveler.passport.slice(-2)}
                          </td>
                          <td className="px-5 py-3">
                            <span className={`inline-flex flex-col px-2 py-1 rounded text-[11px] font-semibold leading-tight ${
                              traveler.packageId === 'A'
                                ? 'bg-blue-50 text-blue-700 border border-blue-100'
                                : traveler.packageId === 'B'
                                  ? 'bg-purple-50 text-purple-700 border border-purple-100'
                                  : traveler.packageId === 'C'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                    : 'bg-amber-50 text-amber-700 border border-amber-100 animate-pulse'
                            }`}>
                              <span>
                                {traveler.packageId}: ¥{matchedPkg?.price}
                              </span>
                              <span className="text-[9px] text-slate-400 font-normal mt-0.5 leading-none">
                                {languageMode === 'zh-first' ? matchedPkg?.nameZh : matchedPkg?.nameEn}
                              </span>
                            </span>
                          </td>
                          {!isLocked && (
                            <td className="px-5 py-3 text-right">
                              <button
                                onClick={() => onRemoveTraveler(traveler.id, slot.id)}
                                className="p-1 px-2 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-all cursor-pointer"
                                title="Remove traveler"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          )}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Grid Sidebar: Lock Group Options & Unassigned Travelers Pool */}
        <div className="space-y-6">
          
          {/* Lock Action Controls Box */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              {languageMode === 'zh-first' ? '拼团终局安全锁定' : 'ROSTER SECURITY FINALIZATION'}
            </h3>

            {isLocked ? (
              <div className="space-y-3">
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-800 text-xs flex flex-col items-center text-center gap-2">
                  <span className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                    ✓
                  </span>
                  <div>
                    <h4 className="font-bold">
                      {languageMode === 'zh-first' ? '此团旅行已安全锁定成团' : 'Roster Locked & Settled'}
                    </h4>
                    <p className="text-[11px] text-emerald-600 mt-1 font-medium leading-relaxed">
                      {languageMode === 'zh-first'
                        ? '名册已成功写入内网文旅监管部入境系统。佣金结算已就绪并载入历史结算中心中。'
                        : 'Credentials compiled. All slots encrypted and pushed to State Administration of Tourism.'}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-slate-500 leading-relaxed">
                  {languageMode === 'zh-first'
                    ? '当已录人数超过最低底线 (15人)，可以执行一键终局锁定。锁后倒计时解除，名册移入后台结算并进入待履约。'
                    : 'Once 15 or more passengers are in place, locking stops the countdown timer and initiates permanent slot reserve.'}
                </p>

                <button
                  disabled={count < 15}
                  onClick={() => onLockGroup(slot.id)}
                  className={`w-full py-3.5 px-4 rounded-xl text-xs font-bold transition-all font-sans relative overflow-hidden flex flex-col items-center justify-center gap-0.5 ${
                    count < 15
                      ? 'bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/15 cursor-pointer ring-1 ring-emerald-500/20'
                  }`}
                >
                  <BilingualText
                    zh="锁定成团 / 佣金结算"
                    en="Lock Group & Settle Bookings"
                    mode={languageMode}
                    primaryClass={`font-bold text-xs ${count < 15 ? 'text-slate-400' : 'text-white'}`}
                    secondaryClass={`text-[9px] font-normal tracking-wide ${count < 15 ? 'text-slate-400' : 'text-emerald-100'}`}
                  />
                </button>

                {count >= 15 && (
                  <div className="flex justify-center items-center gap-1.5 text-emerald-600 bg-emerald-50/50 py-1.5 px-3 rounded-lg border border-emerald-100 text-[10px]">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-500 animate-bounce" />
                    <span>{languageMode === 'zh-first' ? '成团条件已满足，可随时结算！' : 'Group size requirement unlocked!'}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Page 2 - Unassigned Travelers Pool Section */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-sm">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  待安排旅客池
                  <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full font-bold">
                    {unassignedTravelers.length}
                  </span>
                </h3>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                {languageMode === 'zh-first'
                  ? '⚠️ 旅客由于之前的时段倒计时过期触发了“超时释放”，其数据将暂时在此封存。在此可直接一键重定向调配！'
                  : '⚠️ Due to a previous slot timeout release, guest rosters have been automatically nested here for urgent placement.'}
              </p>
            </div>

            <div className="space-y-3 pt-1">
              {unassignedTravelers.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 border border-dashed rounded-lg border-slate-200">
                  <BilingualText
                    zh="暂无历史滞留旅客"
                    en="No Holding Passengers"
                    mode={languageMode}
                    primaryClass="text-xs font-semibold text-slate-400 block"
                    secondaryClass="text-[10px] text-slate-400 block font-normal"
                  />
                </div>
              ) : (
                unassignedTravelers.map((traveler) => {
                  const matchedPkg = PACKAGES.find(p => p.id === traveler.packageId);
                  
                  return (
                    <div
                      key={traveler.id}
                      className="p-3.5 bg-slate-50 hover:bg-slate-100/50 rounded-xl border border-slate-200 space-y-2.5 transition-all"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <p className="text-xs font-bold text-slate-800">{traveler.name}</p>
                          <p className="text-[10px] text-slate-400 font-medium tracking-tight mt-0.5">
                            {traveler.email} | {traveler.nationality}
                          </p>
                        </div>
                        <span className="text-[9px] bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold px-1.5 py-0.5 rounded">
                          {traveler.packageId}: ¥{matchedPkg?.price}
                        </span>
                      </div>

                      {/* Allocation Button */}
                      {!isLocked && (
                        <button
                          disabled={count >= 20}
                          onClick={() => onAssignTraveler(traveler.id, slot.id)}
                          className={`w-full py-1.5 px-3 rounded-lg text-xs font-bold transition-all border flex items-center justify-center gap-1.5 cursor-pointer ${
                            count >= 20
                              ? 'bg-slate-100 text-slate-400 cursor-not-allowed border-slate-200'
                              : 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-700 shadow-sm'
                          }`}
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <BilingualText
                            zh="分配到当前出发时段"
                            en="Assign Here Now"
                            mode={languageMode}
                            primaryClass="font-bold text-xs text-indigo-700"
                            secondaryClass="text-[9px] text-indigo-500 font-normal"
                          />
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
