import React, { useState, useEffect } from 'react';
import { Slot, LanguageMode } from '../types';
import { BilingualText } from './BilingualText';
import { Calendar, Clock, Globe2, Sparkles, Timer, UserCheck, AlertTriangle } from 'lucide-react';

interface SlotCardProps {
  slot: Slot;
  languageMode: LanguageMode;
  onJoin: (slotId: string) => void;
  onView: (slotId: string) => void;
  currentTime: Date;
  onSimulateTimeout?: (slotId: string) => void;
}

export const SlotCard: React.FC<SlotCardProps> = ({
  slot,
  languageMode,
  onJoin,
  onView,
  currentTime,
  onSimulateTimeout,
}) => {
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  useEffect(() => {
    if (slot.ownerPartnerId === 'partner-self' && slot.joinedAt && slot.status !== 'locked') {
      const calculateSeconds = () => {
        const joinedDate = new Date(slot.joinedAt!);
        const elapsedMs = currentTime.getTime() - joinedDate.getTime();
        const totalDurationSec = 30 * 60; // 30 minutes
        const remainingSec = Math.max(0, totalDurationSec - Math.floor(elapsedMs / 1000));
        setSecondsLeft(remainingSec);
      };

      calculateSeconds();
    } else {
      setSecondsLeft(null);
    }
  }, [slot.joinedAt, slot.ownerPartnerId, slot.status, currentTime]);

  const count = slot.travelers.length;
  const isSelf = slot.ownerPartnerId === 'partner-self';
  const isOther = slot.ownerPartnerId === 'partner-other';
  const isFree = slot.ownerPartnerId === null && slot.status !== 'released';
  const isReleased = slot.status === 'released';

  // Get status details
  const getStatusBadge = () => {
    switch (slot.status) {
      case 'locked':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          zh: '已锁定并成团',
          en: 'Locked & Confirmed',
        };
      case 'full':
        return {
          bg: 'bg-purple-100 text-purple-800 border-purple-200',
          zh: '已满员',
          en: 'Full (20/20)',
        };
      case 'released':
        return {
          bg: 'bg-rose-50 text-rose-600 border-rose-200 line-through',
          zh: '超时已释放',
          en: 'Released (Timeout)',
        };
      case 'taken':
        return {
          bg: 'bg-slate-100 text-slate-500 border-slate-200',
          zh: '已被占用',
          en: 'Occupied by Other Agency',
        };
      default: // recruiting, lockable
        if (count >= 15) {
          return {
            bg: 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse',
            zh: '可锁定成团',
            en: 'Ready to Lock',
          };
        } else if (isSelf) {
          return {
            bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
            zh: '急需拼人中',
            en: 'Recruiting (Self)',
          };
        } else {
          return {
            bg: 'bg-blue-50 text-blue-600 border-blue-200',
            zh: '招募中 (空闲)',
            en: 'Open Marketplace Slot',
          };
        }
    }
  };

  const statusBadge = getStatusBadge();

  // Progress Bar Details
  const progressPercent = Math.min(100, (count / 20) * 100);

  // Remaining timer display
  const formatTimer = (totalSeconds: number) => {
    const min = Math.floor(totalSeconds / 60);
    const sec = totalSeconds % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  // Timer Color Class
  const getTimerColorClass = () => {
    if (secondsLeft === null) return '';
    if (secondsLeft < 3 * 60) return 'text-rose-600 bg-rose-50 border-rose-200 font-bold'; // < 3 mins red
    if (secondsLeft < 10 * 60) return 'text-amber-600 bg-amber-50 border-amber-200 font-medium'; // < 10 mins amber
    return 'text-slate-700 bg-slate-50 border-slate-200';
  };

  return (
    <div
      id={`slot-card-${slot.id}`}
      className={`bg-white rounded-xl border transition-all duration-200 flex flex-col p-5 relative overflow-hidden ${
        isOther 
          ? 'opacity-65 border-slate-200 hover:opacity-80' 
          : isReleased 
            ? 'border-dashed border-slate-200 bg-slate-50/50'
            : isSelf
              ? 'border-indigo-400 bg-indigo-50/10 shadow-sm ring-1 ring-indigo-400/20'
              : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
      }`}
    >
      {/* Exclusive Tag */}
      {isSelf && (
        <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[9px] px-2.5 py-0.5 rounded-bl-lg font-bold tracking-wider uppercase flex items-center gap-1">
          <UserCheck className="w-2.5 h-2.5" />
          <span>{languageMode === 'zh-first' ? '我的独占' : 'OUR OWNED'}</span>
        </div>
      )}

      {/* Basic Meta */}
      <div className="mb-4">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${statusBadge.bg}`}>
          {languageMode === 'zh-first' ? statusBadge.zh : statusBadge.en}
        </span>
      </div>

      {/* Date & Time */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-slate-700">
          <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="text-sm font-semibold tracking-tight">{slot.date}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-700">
          <Clock className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="text-sm font-semibold tracking-tight">{slot.time}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-700">
          <Globe2 className="w-4 h-4 text-slate-400 shrink-0" />
          <div className="text-xs">
            <BilingualText
              zh={`导游语言: ${slot.guideLanguageZh}`}
              en={`Guide: ${slot.guideLanguageEn}`}
              mode={languageMode}
              primaryClass="font-medium text-slate-700"
              secondaryClass="text-slate-400 font-normal ml-1 text-[11px]"
            />
          </div>
        </div>
      </div>

      {/* Occupied label or Timeout Release Pool Warning */}
      {isOther && (
        <div className="my-1.5 p-2 bg-slate-50 rounded border border-slate-200 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-slate-400 rounded-full"></span>
          <BilingualText
            zh="此槽位已被其他代理商锁定认领"
            en="Occupied exclusively by other agency"
            mode={languageMode}
            primaryClass="text-[10px] text-slate-500"
            secondaryClass="text-[9px] text-slate-400 block"
          />
        </div>
      )}

      {isReleased && (
        <div className="my-1.5 p-2 bg-rose-50/50 rounded border border-rose-200/50 flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
          <div>
            <BilingualText
              zh="超时释放！名单已存于待分配池"
              en="Timed out! Guests moved to holding pool"
              mode={languageMode}
              primaryClass="text-[10px] text-rose-700 font-medium"
              secondaryClass="text-[9px] text-rose-500 block leading-tight"
            />
          </div>
        </div>
      )}

      {/* Progress & Fill */}
      {slot.status !== 'released' && !isOther && (
        <div className="mt-auto space-y-2 mb-4">
          <div className="flex justify-between items-baseline text-xs">
            <BilingualText
              zh={`已拼旅客: ${count} / 20人`}
              en={`Joined: ${count} / 20 Pax`}
              mode={languageMode}
              primaryClass="font-semibold text-slate-700"
              secondaryClass="text-[10px] text-slate-400 ml-1 font-normal"
            />
            {count >= 15 ? (
              <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded font-medium">
                {languageMode === 'zh-first' ? '成团线已过' : 'Formed'}
              </span>
            ) : (
              <span className="text-[10px] text-slate-500 font-medium">
                {languageMode === 'zh-first' ? `差 ${15 - count} 人成团` : `Need ${15 - count} more`}
              </span>
            )}
          </div>

          {/* Progress bar with NOTCH at 15 / 20 (75%) */}
          <div className="relative pt-3 pb-1">
            <div className="h-2 bg-slate-100 rounded-full relative overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  count >= 20
                    ? 'bg-purple-600'
                    : count >= 15
                      ? 'bg-emerald-500'
                      : isSelf
                        ? 'bg-indigo-600'
                        : 'bg-blue-500'
                }`}
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>

            {/* Notch indicator at 75% width */}
            <div className="absolute top-0" style={{ left: '75%' }}>
              <div className="w-0.5 h-4 bg-slate-400 relative">
                <span className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-bold text-slate-500 bg-white px-1 border border-slate-200 rounded">
                  {languageMode === 'zh-first' ? '15 成团' : '15 Min'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Live Countdown Timer Area */}
      {secondsLeft !== null && secondsLeft > 0 && (
        <div className={`mt-2 p-2 rounded-lg border flex items-center justify-between text-xs mb-3 ${getTimerColorClass()}`}>
          <div className="flex items-center gap-1.5 font-medium">
            <Timer className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '3s' }} />
            <BilingualText
              zh="⏱ 凑满15人倒计时"
              en="Time to fill (Min 15)"
              mode={languageMode}
              primaryClass="font-semibold text-inherit"
              secondaryClass="text-[9px] text-inherit block leading-tight font-normal opacity-70"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold tracking-wider text-sm bg-black/5 px-1.5 py-0.5 rounded">
              {formatTimer(secondsLeft)}
            </span>
            {onSimulateTimeout && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSimulateTimeout(slot.id);
                }}
                className="text-[9px] bg-slate-800 text-white hover:bg-slate-900 px-1.5 py-0.5 font-bold uppercase tracking-tight rounded-sm"
                title="Immediate timeout simulation for testing"
              >
                {languageMode === 'zh-first' ? '模拟释放' : 'Simulate'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="mt-auto pt-2">
        {isOther ? (
          <div className="w-full text-center py-2 text-slate-400 bg-slate-50 rounded-lg text-xs font-semibold border border-slate-200 cursor-not-allowed">
            {languageMode === 'zh-first' ? '已被占用 / 无法操作' : 'Occupied / Locked Out'}
          </div>
        ) : isReleased ? (
          <button
            onClick={() => onJoin(slot.id)}
            className="w-full text-center py-2 px-4 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-semibold border border-indigo-200 transition-all cursor-pointer"
          >
            <BilingualText
              zh="重新认领并锁定"
              en="Re-Claim & Start Filling"
              mode={languageMode}
              primaryClass="font-semibold"
              secondaryClass="text-[9px] block font-normal text-indigo-500"
            />
          </button>
        ) : isSelf ? (
          <button
            onClick={() => onView(slot.id)}
            className="w-full text-center py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold border border-indigo-500 shadow-md shadow-indigo-600/10 transition-all cursor-pointer"
          >
            <BilingualText
              zh="拼团详情与录入"
              en="Build Group & View Roster"
              mode={languageMode}
              primaryClass="font-semibold text-white"
              secondaryClass="text-[9px] block font-normal text-indigo-100"
            />
          </button>
        ) : (
          <button
            onClick={() => onJoin(slot.id)}
            className="w-full text-center py-2 px-4 bg-white border border-slate-300 hover:border-slate-400 hover:bg-slate-50 rounded-lg text-xs font-semibold transition-all cursor-pointer text-slate-700"
          >
            <BilingualText
              zh="独占并拼团"
              en="Claim Slot & Join Group"
              mode={languageMode}
              primaryClass="font-semibold text-slate-700 block"
              secondaryClass="text-[9px] block font-normal text-slate-400"
            />
          </button>
        )}
      </div>
    </div>
  );
};
