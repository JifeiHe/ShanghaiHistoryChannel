import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { Marketplace } from './components/Marketplace';
import { BuildGroup } from './components/BuildGroup';
import { MyGroups } from './components/MyGroups';
import { AddTravelerForm } from './components/AddTravelerForm';
import { LanguageMode, Slot, Traveler, MyGroup } from './types';
import { getInitialSlots, INITIAL_UNASSIGNED_TRAVELERS, DUMMY_MY_GROUPS, PACKAGES } from './data';
import { motion, AnimatePresence } from 'motion/react';
import { Landmark, Sparkles, BellOff, BellRing, Info, ShieldAlert, ArrowRight, HelpCircle } from 'lucide-react';
import { BilingualText } from './components/BilingualText';

export default function App() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [unassignedTravelers, setUnassignedTravelers] = useState<Traveler[]>([]);
  const [myGroups, setMyGroups] = useState<MyGroup[]>([]);
  const [languageMode, setLanguageMode] = useState<LanguageMode>('zh-first');
  const [activeTab, setActiveTab] = useState<'marketplace' | 'build-group' | 'my-groups'>('marketplace');
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>('slot-1'); // default to slot-1 for display
  const [isAddTravelerOpen, setIsAddTravelerOpen] = useState(false);
  
  // Real-time tick state to drive countdown timers
  const [currentTime, setCurrentTime] = useState<Date>(new Date('2026-06-22T11:05:52-07:00'));

  // Notification banners (simulating B2B system warnings)
  const [toast, setToast] = useState<{
    id: string;
    type: 'success' | 'warn' | 'info';
    zh: string;
    en: string;
  } | null>(null);

  // Initialize data
  useEffect(() => {
    setSlots(getInitialSlots());
    setUnassignedTravelers(INITIAL_UNASSIGNED_TRAVELERS);
    setMyGroups(DUMMY_MY_GROUPS);
  }, []);

  // Set up real time dynamic interval to decrease active countdowns
  useEffect(() => {
    const timer = setInterval(() => {
      // Advance our mockup clock by 1 second
      setCurrentTime((prev) => new Date(prev.getTime() + 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Monitor slots for automatic timeout release (30-minute limit)
  useEffect(() => {
    let stateChanged = false;
    const updatedSlots = slots.map((slot) => {
      if (
        slot.ownerPartnerId === 'partner-self' &&
        slot.joinedAt &&
        slot.status !== 'locked'
      ) {
        const elapsedSeconds = Math.floor(
          (currentTime.getTime() - new Date(slot.joinedAt).getTime()) / 1000
        );
        const limitSeconds = 30 * 60; // 30 minutes

        if (elapsedSeconds >= limitSeconds) {
          stateChanged = true;
          
          // 1. Move its travelers to holding queue
          if (slot.travelers.length > 0) {
            setUnassignedTravelers((prev) => {
              // Avoid duplicates
              const currentIds = new Set(prev.map((t) => t.id));
              const extras = slot.travelers.filter((t) => !currentIds.has(t.id));
              return [...prev, ...extras];
            });
          }

          // Trigger browser-safe toast
          setToast({
            id: `release-${slot.id}-${Date.now()}`,
            type: 'warn',
            zh: `⚠️ 时段班期 [${slot.date} ${slot.time}] 由于30分钟未拼满15人已强制超时释放，名册已自动保全至“待安排旅客池”。`,
            en: `⚠️ Slot [${slot.date} ${slot.time}] has timed out and has been released. Guests secured in unassigned holding pool.`,
          });

          // 2. Clear out slot
          return {
            ...slot,
            status: 'released' as const,
            ownerPartnerId: null,
            joinedAt: null,
            travelers: [],
          };
        }
      }
      return slot;
    });

    if (stateChanged) {
      setSlots(updatedSlots);
    }
  }, [currentTime, slots]);

  // Handle slot reservation
  const handleJoinSlot = (slotId: string) => {
    setSlots((prevSlots) =>
      prevSlots.map((slot) => {
        if (slot.id === slotId) {
          return {
            ...slot,
            status: 'recruiting' as const,
            ownerPartnerId: 'partner-self',
            joinedAt: currentTime.toISOString(), // Start 30-minute hard countdown
            travelers: [], // Start fresh
          };
        }
        return slot;
      })
    );

    setSelectedSlotId(slotId);
    
    setToast({
      id: `claim-${slotId}`,
      type: 'success',
      zh: `✅ 独占认领成功！该时段现已锁定为您专属。30分钟拼人倒计时启动，请尽快录入或调配旅客信息。`,
      en: `✅ Slot Claimed Successfully! 30-minute countdown initiated. Please populate passenger documentation.`,
    });

    // Automatically transition to roster builder
    setActiveTab('build-group');
  };

  // Simulate fast-forwarding timeout for testing/demonstration
  const handleSimulateTimeout = (slotId: string) => {
    setSlots((prevSlots) =>
      prevSlots.map((slot) => {
        if (slot.id === slotId) {
          // Force slot into a state of 31 minutes elapsed
          const elapsed = 31 * 60 * 1000;
          return {
            ...slot,
            joinedAt: new Date(currentTime.getTime() - elapsed).toISOString(),
          };
        }
        return slot;
      })
    );
  };

  // Reset database state to refresh demonstration
  const handleResetDatabase = () => {
    setSlots(getInitialSlots());
    setUnassignedTravelers(INITIAL_UNASSIGNED_TRAVELERS);
    setMyGroups(DUMMY_MY_GROUPS);
    setSelectedSlotId('slot-1');
    setActiveTab('marketplace');
    setToast({
      id: 'reset',
      type: 'info',
      zh: '🔄 系统演示数据库已完全重载，恢复至默认排期时钟数据。',
      en: '🔄 Demo data stack reset to default schedule timers.',
    });
  };

  // Assign traveler from the unassigned holding pool to the slot
  const handleAssignTraveler = (travelerId: string, slotId: string) => {
    const targetSlot = slots.find((s) => s.id === slotId);
    if (!targetSlot) return;

    if (targetSlot.travelers.length >= 20) {
      setToast({
        id: 'full-err',
        type: 'warn',
        zh: '❌ 分配失败！该出发时段最多只能客纳 20 人。目前床位已完全封顶。',
        en: `❌ Allocation failed! Capped at 20 maximum seats. Capacity reached.`,
      });
      return;
    }

    const travelerToMove = unassignedTravelers.find((t) => t.id === travelerId);
    if (!travelerToMove) return;

    // Remove from unassigned
    setUnassignedTravelers((prev) => prev.filter((t) => t.id !== travelerId));

    // Append to slot
    setSlots((prevSlots) =>
      prevSlots.map((slot) => {
        if (slot.id === slotId) {
          const updatedTravelers = [...slot.travelers, travelerToMove];
          let updatedStatus = slot.status;
          if (updatedTravelers.length >= 20) {
            updatedStatus = 'full';
          } else if (updatedTravelers.length >= 15) {
            updatedStatus = 'lockable';
          } else {
            updatedStatus = 'recruiting';
          }

          return {
            ...slot,
            travelers: updatedTravelers,
            status: updatedStatus,
          };
        }
        return slot;
      })
    );

    setToast({
      id: `assign-${travelerId}`,
      type: 'success',
      zh: `👤 已成功分配旅客 ${travelerToMove.name} 加入此次出行排班中。`,
      en: `👤 Successfully deployed traveler ${travelerToMove.name} to active roster.`,
    });
  };

  // Remove traveler from active slot list back to unassigned holds
  const handleRemoveTraveler = (travelerId: string, slotId: string) => {
    let travelerName = '';
    let foundTraveler: Traveler | null = null;

    setSlots((prevSlots) =>
      prevSlots.map((slot) => {
        if (slot.id === slotId) {
          const tar = slot.travelers.find((t) => t.id === travelerId);
          if (tar) {
            travelerName = tar.name;
            foundTraveler = tar;
          }
          const updatedTravelers = slot.travelers.filter((t) => t.id !== travelerId);
          let updatedStatus = slot.status;
          if (updatedTravelers.length >= 20) {
            updatedStatus = 'full';
          } else if (updatedTravelers.length >= 15) {
            updatedStatus = 'lockable';
          } else {
            updatedStatus = 'recruiting';
          }

          return {
            ...slot,
            travelers: updatedTravelers,
            status: updatedStatus,
          };
        }
        return slot;
      })
    );

    // Keep client records - we can either throw them back to unassigned holding pool, or delete entirely.
    // Let's delete entirely to keep list management clean (since they have a delete button, the unassigned pool handles timed-out releases).
    setToast({
      id: `remove-${travelerId}`,
      type: 'info',
      zh: `🗑️ 旅客 ${travelerName || 'unknown'} 已从拼团名单中注销。`,
      en: `🗑️ Traveler ${travelerName || 'unknown'} has been retracted from the roster.`,
    });
  };

  // Save brand new traveler uploaded via Page 3 panel
  const handleSaveTraveler = (newTravelerData: Omit<Traveler, 'id'>) => {
    if (!selectedSlotId) return;

    const currentSlot = slots.find((s) => s.id === selectedSlotId);
    if (!currentSlot) return;

    if (currentSlot.travelers.length >= 20) {
      setToast({
        id: 'full-err',
        type: 'warn',
        zh: '❌ 无法添加！该班次客纳量已封顶 (20/20)。',
        en: '❌ Capped! This slot has reached peak capacity (20/20).',
      });
      return;
    }

    const newTraveler: Traveler = {
      ...newTravelerData,
      id: `trav-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`,
    };

    setSlots((prevSlots) =>
      prevSlots.map((slot) => {
        if (slot.id === selectedSlotId) {
          const updatedTravelers = [...slot.travelers, newTraveler];
          let updatedStatus = slot.status;
          if (updatedTravelers.length >= 20) {
            updatedStatus = 'full';
          } else if (updatedTravelers.length >= 15) {
            updatedStatus = 'lockable';
          } else {
            updatedStatus = 'recruiting';
          }

          return {
            ...slot,
            travelers: updatedTravelers,
            status: updatedStatus,
          };
        }
        return slot;
      })
    );

    setIsAddTravelerOpen(false);

    setToast({
      id: `add-new-${newTraveler.id}`,
      type: 'success',
      zh: `✨ 成功录入旅客资料 ${newTraveler.name}，护照加密验证通过。`,
      en: `✨ Securely uploaded traveler profile ${newTraveler.name}. Passport cryptography hashed.`,
    });
  };

  // Lock Group (Page 2) -> sets slot to locked, calculates package details and pushes record to My Groups list
  const handleLockGroup = (slotId: string) => {
    const slot = slots.find((s) => s.id === slotId);
    if (!slot) return;

    if (slot.travelers.length < 15) {
      setToast({
        id: 'lock-err',
        type: 'warn',
        zh: '❌ 锁班失败！客人数未达 15 名最低成团要求，请继续拼装。',
        en: '❌ Failed to lock! You must secure 15 passengers minimum first.',
      });
      return;
    }

    // Change slot status in App state
    setSlots((prevSlots) =>
      prevSlots.map((s) => {
        if (s.id === slotId) {
          return {
            ...s,
            status: 'locked' as const,
          };
        }
        return s;
      })
    );

    // Compute package mix
    const mix = { A: 0, B: 0, C: 0, D: 0 };
    let totalCost = 0;
    slot.travelers.forEach((t) => {
      mix[t.packageId] = (mix[t.packageId] || 0) + 1;
      const pkg = PACKAGES.find((p) => p.id === t.packageId);
      if (pkg) {
        totalCost += pkg.price;
      }
    });

    // 15% - 20% protocol commission
    const commissionVal = Number((totalCost * 0.15).toFixed(2));

    // Generate My Group object
    const newGroupId = `GRP-${new Date().getFullYear()}-${Math.floor(Math.random() * 800) + 200}`;
    const newGroupRecord: MyGroup = {
      id: newGroupId,
      slotId: slot.id,
      date: slot.date,
      time: slot.time,
      size: slot.travelers.length,
      packageMix: mix,
      commission: commissionVal,
      status: 'locked',
    };

    // Append to My Groups List
    setMyGroups((prev) => [newGroupRecord, ...prev]);

    setToast({
      id: `lock-success-${slotId}`,
      type: 'success',
      zh: `🏛️ 锁班成团完毕！专属归档团号: ${newGroupId}。定时器解除。佣金报收 ¥${commissionVal} 已记录在册。`,
      en: `🏛️ Booking locked & verified! Archive ID: ${newGroupId}. 30-min hold timer disengaged. Commission generated.`,
    });
  };

  const currentSlotObj = slots.find((s) => s.id === selectedSlotId) || null;
  const activeBuildingCount = slots.filter(s => s.ownerPartnerId === 'partner-self' && s.status !== 'locked').length;

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 antialiased overflow-hidden font-sans">
      {/* 1. Left sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        languageMode={languageMode}
        unassignedCount={unassignedTravelers.length}
        activeBuildingCount={activeBuildingCount}
      />

      {/* Main container area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* 2. Top navigation bar */}
        <Topbar
          languageMode={languageMode}
          setLanguageMode={setLanguageMode}
          activeTab={activeTab}
        />

        {/* 3. Toast alerts area (bypassing window.alert) */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-6 shrink-0 pt-4"
            >
              <div className={`p-4 rounded-xl border flex items-start justify-between gap-4 ${
                toast.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : toast.type === 'warn'
                    ? 'bg-rose-50 border-rose-200 text-rose-800'
                    : 'bg-indigo-50 border-indigo-200 text-indigo-800'
              }`}>
                <div className="flex gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center font-bold shrink-0 self-start text-xs shadow-sm shadow-black/5 mt-0.5">
                    {toast.type === 'success' ? '✓' : toast.type === 'warn' ? '!' : 'i'}
                  </div>
                  <div>
                    <BilingualText
                      zh={toast.zh}
                      en={toast.en}
                      mode={languageMode}
                      primaryClass={`text-xs font-bold leading-relaxed ${
                        toast.type === 'success' ? 'text-emerald-800' : toast.type === 'warn' ? 'text-rose-800' : 'text-indigo-800'
                      }`}
                      secondaryClass="text-[10px] text-slate-500 font-normal leading-normal block mt-0.5"
                    />
                  </div>
                </div>
                <button
                  onClick={() => setToast(null)}
                  className="text-xs font-bold hover:opacity-85 text-slate-400 shrink-0 uppercase cursor-pointer"
                >
                  [ {languageMode === 'zh-first' ? '关闭' : 'Dismiss'} ]
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 4. Active tab container scrolls */}
        <main className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              {activeTab === 'marketplace' && (
                <Marketplace
                  slots={slots}
                  languageMode={languageMode}
                  onJoin={handleJoinSlot}
                  onView={(slotId) => {
                    setSelectedSlotId(slotId);
                    setActiveTab('build-group');
                  }}
                  currentTime={currentTime}
                  onSimulateTimeout={handleSimulateTimeout}
                  onResetDatabase={handleResetDatabase}
                />
              )}

              {activeTab === 'build-group' && (
                <BuildGroup
                  slot={currentSlotObj}
                  languageMode={languageMode}
                  unassignedTravelers={unassignedTravelers}
                  onAddTravelerClick={() => setIsAddTravelerOpen(true)}
                  onAssignTraveler={handleAssignTraveler}
                  onLockGroup={handleLockGroup}
                  onRemoveTraveler={handleRemoveTraveler}
                  onBackToMarketplace={() => setActiveTab('marketplace')}
                  currentTime={currentTime}
                />
              )}

              {activeTab === 'my-groups' && (
                <MyGroups
                  groups={myGroups}
                  languageMode={languageMode}
                  onSelectGroupSlot={(slotId) => setSelectedSlotId(slotId)}
                  setActiveTab={setActiveTab}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* 5. Bilingual Traveler Slide Panel Modal */}
      <AddTravelerForm
        isOpen={isAddTravelerOpen}
        onClose={() => setIsAddTravelerOpen(false)}
        onSave={handleSaveTraveler}
        languageMode={languageMode}
      />
    </div>
  );
}
