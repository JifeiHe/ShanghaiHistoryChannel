import React, { useMemo } from 'react';
import { MyGroup, LanguageMode } from '../types';
import { PACKAGES } from '../data';
import { BilingualText } from './BilingualText';
import { Landmark, Users2, BadgePercent, CheckCircle2, DollarSign, Calendar } from 'lucide-react';

interface MyGroupsProps {
  groups: MyGroup[];
  languageMode: LanguageMode;
  onSelectGroupSlot?: (slotId: string) => void;
  setActiveTab?: (tab: 'marketplace' | 'build-group' | 'my-groups') => void;
}

export const MyGroups: React.FC<MyGroupsProps> = ({
  groups,
  languageMode,
  onSelectGroupSlot,
  setActiveTab,
}) => {
  // Calculate dynamic dashboard stats
  const summary = useMemo(() => {
    const totalGroupsThisMonth = groups.filter(g => g.status !== 'building').length;
    
    const totalTravelers = groups.reduce((acc, g) => acc + g.size, 0);
    
    const estCommission = groups.reduce((acc, g) => acc + g.commission, 0);
    
    return {
      totalGroupsThisMonth,
      totalTravelers,
      estCommission,
    };
  }, [groups]);

  const getStatusBadge = (status: MyGroup['status']) => {
    switch (status) {
      case 'building':
        return {
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
          zh: '拼团中 / Building',
          en: 'Building Group',
        };
      case 'locked':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          zh: '已录满锁定 / Locked',
          en: 'Locked & Fixed',
        };
      case 'confirmed':
        return {
          bg: 'bg-indigo-50 text-indigo-700 border-indigo-200 animate-pulse',
          zh: '已成团 / Confirmed',
          en: 'Municipal Confirmed',
        };
      case 'completed':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          zh: '已履约 / Finished',
          en: 'Completed',
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top metrics card row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Metric 1 */}
        <div id="metric-monthly-groups" className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
            <CheckCircle2 className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              {languageMode === 'zh-first' ? '本月已锁定成团' : 'Groups Settled This Month'}
            </span>
            <p className="text-2xl font-bold tracking-tight text-slate-800 mt-0.5">
              {summary.totalGroupsThisMonth} <span className="text-xs text-slate-400 font-normal">/{groups.length} 团</span>
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
              {languageMode === 'zh-first' 
                ? '不含未锁定的实时拼团' 
                : 'Excluding draft building rosters'}
            </p>
          </div>
        </div>

        {/* Metric 2 */}
        <div id="metric-monthly-travelers" className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <Users2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              {languageMode === 'zh-first' ? '累计旅客报送数' : 'Total Embedded Passengers'}
            </span>
            <p className="text-2xl font-bold tracking-tight text-slate-800 mt-0.5">
              {summary.totalTravelers} <span className="text-xs text-slate-400 font-normal">位 / Passengers</span>
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
              {languageMode === 'zh-first' 
                ? '上海各时段入库有效客源' 
                : 'Accumulated secure filings synced'}
            </p>
          </div>
        </div>

        {/* Metric 3 */}
        <div id="metric-monthly-commission" className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <BadgePercent className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              {languageMode === 'zh-first' ? '渠道预计应结佣金' : 'Est. Commission Settle-Out'}
            </span>
            <p className="text-2xl font-bold tracking-tight text-emerald-600 mt-0.5">
              ¥ {summary.estCommission.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
              {languageMode === 'zh-first' 
                ? '基于每笔订单 15% - 20% 多重套餐契约结算' 
                : 'Calculated dynamically of package totals'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Historical Table Card */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-800">
              商务结算与名册归档
              <span className="text-xs text-slate-400 font-normal ml-2">/ Settlement & Historical Archive</span>
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {languageMode === 'zh-first'
                ? '此表展示当前协议分配机构下属所有的团队销售佣金清单与旅安备案状态。'
                : 'Official auditing record of complete rosters and scheduled tour settlements.'}
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 border border-slate-200 rounded-lg text-[10px] text-slate-600">
            <Landmark className="w-3.5 h-3.5 text-indigo-600" />
            <span className="font-medium">
              {languageMode === 'zh-first' ? '结算本位币: 人民币 (CNY)' : 'Account Base: CNY (¥)'}
            </span>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                <th className="px-5 py-3.5">{languageMode === 'zh-first' ? '备案团号 / Group ID' : 'Group ID'}</th>
                <th className="px-5 py-3.5">{languageMode === 'zh-first' ? '出发日期及时间 / Timeline' : 'Departure'}</th>
                <th className="px-5 py-3.5 text-center">{languageMode === 'zh-first' ? '组团规模 / Size' : 'Pax'}</th>
                <th className="px-5 py-3.5">{languageMode === 'zh-first' ? '套餐选材配比 / Package Mix' : 'Package Mix'}</th>
                <th className="px-5 py-3.5 text-right">{languageMode === 'zh-first' ? '协议佣金 / Commission' : 'Settle Accrual'}</th>
                <th className="px-5 py-3.5 text-right">{languageMode === 'zh-first' ? '状态 / Status' : 'Approval'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {groups.map((group) => {
                const badge = getStatusBadge(group.status);
                
                return (
                  <tr key={group.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* ID */}
                    <td className="px-5 py-4">
                      <div className="font-bold text-slate-800">{group.id}</div>
                      {group.status === 'building' && onSelectGroupSlot && setActiveTab && (
                        <button
                          onClick={() => {
                            onSelectGroupSlot(group.slotId);
                            setActiveTab('build-group');
                          }}
                          className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold underline cursor-pointer mt-1 block"
                        >
                          {languageMode === 'zh-first' ? '进入录入面板 →' : 'Enter Panel →'}
                        </button>
                      )}
                    </td>

                    {/* Timeline */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{group.date}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 font-normal">
                        {group.time}
                      </div>
                    </td>

                    {/* Passenger count */}
                    <td className="px-5 py-4 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className="font-bold text-slate-800">{group.size} 人</span>
                        <div className="w-12 bg-slate-100 h-1 rounded-full overflow-hidden mt-1">
                          <div
                            className={`h-full ${group.size >= 15 ? 'bg-emerald-500' : 'bg-indigo-600'}`}
                            style={{ width: `${(group.size / 20) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>

                    {/* Package Mix badges */}
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1.5 max-w-sm">
                        {(Object.keys(group.packageMix) as ('A' | 'B' | 'C' | 'D')[]).map((pkgKey) => {
                          const countVal = group.packageMix[pkgKey];
                          if (!countVal) return null;
                          return (
                            <span
                              key={pkgKey}
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                pkgKey === 'A'
                                  ? 'bg-blue-50 text-blue-700'
                                  : pkgKey === 'B'
                                    ? 'bg-purple-50 text-purple-700'
                                    : pkgKey === 'C'
                                      ? 'bg-emerald-50 text-emerald-700'
                                      : 'bg-amber-50 text-amber-700'
                              }`}
                            >
                              {pkgKey}: {countVal}人
                            </span>
                          );
                        })}
                      </div>
                    </td>

                    {/* Settle Commission */}
                    <td className="px-5 py-4 text-right">
                      <div className="font-mono font-bold text-slate-800">
                        ¥ {group.commission.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <div className="text-[9px] text-slate-400 leading-none mt-1">
                        {languageMode === 'zh-first' ? '15% 的总客费结算' : 'Contracted payout @ 15%'}
                      </div>
                    </td>

                    {/* Badges */}
                    <td className="px-5 py-4 text-right">
                      <span className={`inline-block px-2.5 py-1 border text-[10px] font-bold rounded-full ${badge.bg}`}>
                        {languageMode === 'zh-first' ? badge.zh : badge.en}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
