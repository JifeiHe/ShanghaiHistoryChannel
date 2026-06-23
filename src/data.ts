import { Slot, Package, Traveler, MyGroup } from './types';

export const PACKAGES: Package[] = [
  {
    id: 'A',
    nameZh: '纯讲解',
    nameEn: 'Tour only',
    price: 150,
    descZh: '外滩历史故事、老建筑美学探秘与深度导览（不含餐饮）',
    descEn: 'Incisive narration of Bund history & architectural aesthetics (No food/drinks)',
  },
  {
    id: 'B',
    nameZh: '讲解+咖啡与酒',
    nameEn: 'Tour + Café & drinks',
    price: 199,
    descZh: '含上海知名复古咖啡馆特色咖啡1杯，或外滩露台鸡尾酒1杯',
    descEn: 'Includes 1 specialty coffee at a retro café or 1 Bund-terrace cocktail',
  },
  {
    id: 'C',
    nameZh: '全包+文化活动',
    nameEn: 'All-inclusive + cultural activity',
    price: 299,
    descZh: '含上海传统点心套餐，加非遗剪纸或手作香囊体验活动',
    descEn: 'Includes dim sum set, paper-cutting/scented-sachet cultural workshop',
  },
  {
    id: 'D',
    nameZh: '文化活动专享',
    nameEn: 'Cultural activity only',
    price: 129,
    descZh: '单独体验海派非遗剪纸或复古手作香囊下午茶沙龙',
    descEn: 'Admission only to Shanghai heritage paper-cutting or sachet afternoon tea salon',
  },
];

export const NATIONALITIES = [
  { code: 'US', zh: '美国 / United States', en: 'United States' },
  { code: 'JP', zh: '日本 / Japan', en: 'Japan' },
  { code: 'DE', zh: '德国 / Germany', en: 'Germany' },
  { code: 'FR', zh: '法国 / France', en: 'France' },
  { code: 'GB', zh: '英国 / United Kingdom', en: 'United Kingdom' },
  { code: 'CA', zh: '加拿大 / Canada', en: 'Canada' },
  { code: 'AU', zh: '澳大利亚 / Australia', en: 'Australia' },
  { code: 'KR', zh: '韩国 / South Korea', en: 'South Korea' },
];

export const DUMMY_TRAVELERS_TEMPLATES: Omit<Traveler, 'id'>[] = [
  { name: 'David Miller', nationality: 'US', email: 'd.miller@agency.com', passport: 'US9827361', packageId: 'A', consent: true },
  { name: 'Yuki Tanaka', nationality: 'JP', email: 'tanaka.yuki@japan-travel.jp', passport: 'JP5412984', packageId: 'B', consent: true },
  { name: 'Hans Schmidt', nationality: 'DE', email: 'hans.schmidt@berlin.de', passport: 'DE2239458', packageId: 'C', consent: true },
  { name: 'Sophie Laurent', nationality: 'FR', email: 's.laurent@paris-globe.fr', passport: 'FR8472935', packageId: 'D', consent: true },
  { name: 'Robert Johnson', nationality: 'US', email: 'robert.j@us-tours.com', passport: 'US1234567', packageId: 'C', consent: true },
  { name: 'Emily Davis', nationality: 'US', email: 'emily.d@us-tours.com', passport: 'US7654321', packageId: 'A', consent: true },
  { name: 'Ichiro Sato', nationality: 'JP', email: 'i.sato@asia-gate.com', passport: 'JP9988776', packageId: 'B', consent: true },
  { name: 'Michael Brown', nationality: 'GB', email: 'm.brown@london-trip.co.uk', passport: 'GB5544332', packageId: 'C', consent: true },
  { name: 'Sarah Wilson', nationality: 'GB', email: 's.wilson@london-trip.co.uk', passport: 'GB1122334', packageId: 'D', consent: true },
  { name: 'Oliver Wagner', nationality: 'DE', email: 'o.wagner@deutschland.de', passport: 'DE8877665', packageId: 'A', consent: true },
  { name: 'Chloe Dubois', nationality: 'FR', email: 'c.dubois@voyage-france.fr', passport: 'FR4455667', packageId: 'B', consent: true },
  { name: 'Alex Thompson', nationality: 'CA', email: 'alex.t@canada-explore.ca', passport: 'CA7788990', packageId: 'C', consent: true },
  { name: 'Jessica Taylor', nationality: 'AU', email: 'jess.t@oz-ventures.com', passport: 'AU1122998', packageId: 'D', consent: true },
  { name: 'Min-jun Kim', nationality: 'KR', email: 'mj.kim@seoul-explore.co.kr', passport: 'KR3344556', packageId: 'B', consent: true },
  { name: 'Emma Watson', nationality: 'GB', email: 'emma.w@oxford.travel', passport: 'GB0099887', packageId: 'C', consent: true },
  { name: 'Daniel Martinez', nationality: 'US', email: 'd.martinez@latin-tours.com', passport: 'US6655443', packageId: 'A', consent: true },
];

export const INITIAL_UNASSIGNED_TRAVELERS: Traveler[] = [
  {
    id: 'unassigned-1',
    name: 'Liam Neeson',
    nationality: 'GB',
    email: 'liam.neeson@action-tours.co.uk',
    passport: 'GB0072341',
    packageId: 'C',
    emergencyContact: 'Helen Neeson +44 20 7946 0192',
    consent: true,
  },
  {
    id: 'unassigned-2',
    name: 'Akiko Watanabe',
    nationality: 'JP',
    email: 'w.akiko@tokyo-agent.jp',
    passport: 'JP3344661',
    packageId: 'B',
    emergencyContact: 'Taro Watanabe +81 3 5555 1234',
    consent: true,
  },
];

// Helper to generate a prefilled traveler list
export function getPrefilledTravelers(count: number): Traveler[] {
  const result: Traveler[] = [];
  for (let i = 0; i < count; i++) {
    const template = DUMMY_TRAVELERS_TEMPLATES[i % DUMMY_TRAVELERS_TEMPLATES.length];
    result.push({
      ...template,
      id: `trav-${i + 1}-${Math.floor(Math.random() * 10000)}`,
    });
  }
  return result;
}

// Generates initial slots
// Note: We need some with 8/20, some with 16/20 (lockable), some with 20/20 (full), some taken, some locked etc.
// One active slot counting down which has 6:30 left (meaning its joinedAt is 23:30 ago: 23*60 + 30 = 1410 seconds ago).
export function getInitialSlots(): Slot[] {
  // Let's anchor relative to current date (2026-06-22)
  const now = new Date('2026-06-22T11:05:52-07:00');

  // Let's craft joinedAt for the first-party active countdown slot
  // We want it to be 23 mins 30s ago in MS
  const elapsedSeconds = 23 * 60 + 30; // 1410s
  const activeJoinedAt = new Date(now.getTime() - elapsedSeconds * 1000).toISOString();

  return [
    {
      id: 'slot-1',
      date: '2026-07-15',
      time: '09:00 - 11:30',
      guideLanguageZh: '英语',
      guideLanguageEn: 'English',
      status: 'recruiting',
      ownerPartnerId: 'partner-self',
      joinedAt: activeJoinedAt,
      travelers: getPrefilledTravelers(12), // 12 in slot, 12/20 recruiting, counting down with 6m30s
    },
    {
      id: 'slot-2',
      date: '2026-07-15',
      time: '14:00 - 16:30',
      guideLanguageZh: '日语',
      guideLanguageEn: 'Japanese',
      status: 'lockable',
      ownerPartnerId: 'partner-self',
      joinedAt: new Date(now.getTime() - 15 * 60 * 1000).toISOString(), // 15 mins ago, has 15 mins left
      travelers: getPrefilledTravelers(16), // 16/20, lockable
    },
    {
      id: 'slot-3',
      date: '2026-07-16',
      time: '09:00 - 11:30',
      guideLanguageZh: '中文',
      guideLanguageEn: 'Chinese',
      status: 'full',
      ownerPartnerId: 'partner-self',
      joinedAt: new Date(now.getTime() - 10 * 60 * 1000).toISOString(),
      travelers: getPrefilledTravelers(20), // 20/20, full
    },
    {
      id: 'slot-4',
      date: '2026-07-16',
      time: '14:00 - 16:30',
      guideLanguageZh: '英语',
      guideLanguageEn: 'English',
      status: 'locked',
      ownerPartnerId: 'partner-self',
      joinedAt: null,
      travelers: getPrefilledTravelers(18), // 18/20, already locked
    },
    {
      id: 'slot-5',
      date: '2026-07-17',
      time: '09:00 - 11:30',
      guideLanguageZh: '英语',
      guideLanguageEn: 'English',
      status: 'taken',
      ownerPartnerId: 'partner-other', // Taken by competitor
      joinedAt: null,
      travelers: getPrefilledTravelers(14),
    },
    {
      id: 'slot-6',
      date: '2026-07-17',
      time: '14:00 - 16:30',
      guideLanguageZh: '日语',
      guideLanguageEn: 'Japanese',
      status: 'recruiting',
      ownerPartnerId: null, // Free slot
      joinedAt: null,
      travelers: [],
    },
    {
      id: 'slot-7',
      date: '2026-07-18',
      time: '09:00 - 11:30',
      guideLanguageZh: '中文',
      guideLanguageEn: 'Chinese',
      status: 'recruiting',
      ownerPartnerId: null, // Free slot
      joinedAt: null,
      travelers: [],
    },
    // some more slots to complete around ~12 slots
    {
      id: 'slot-8',
      date: '2026-07-18',
      time: '14:00 - 16:30',
      guideLanguageZh: '英语',
      guideLanguageEn: 'English',
      status: 'recruiting',
      ownerPartnerId: null,
      joinedAt: null,
      travelers: getPrefilledTravelers(8), // wait, if owner is null, travelers should be 0 because each slot has exclusive ownership and travellers are only filled by the occupying partner!
      // But we can model slots that are 'recruiting' but owned by competitor i.e. status was taken!
      // Yes, a slot that is 'taken' can have Recruiting (<15) status but taken by others.
    },
    {
      id: 'slot-9',
      date: '2026-07-19',
      time: '09:00 - 11:30',
      guideLanguageZh: '日语',
      guideLanguageEn: 'Japanese',
      status: 'taken',
      ownerPartnerId: 'partner-other',
      joinedAt: null,
      travelers: getPrefilledTravelers(17), // lockable by others, shown as Taken
    },
    {
      id: 'slot-10',
      date: '2026-07-19',
      time: '14:00 - 16:30',
      guideLanguageZh: '中文',
      guideLanguageEn: 'Chinese',
      status: 'released', // just-released due to timeout!
      ownerPartnerId: null,
      joinedAt: null,
      travelers: [],
    },
    {
      id: 'slot-11',
      date: '2026-07-20',
      time: '09:00 - 11:30',
      guideLanguageZh: '英语',
      guideLanguageEn: 'English',
      status: 'recruiting',
      ownerPartnerId: null,
      joinedAt: null,
      travelers: [],
    },
    {
      id: 'slot-12',
      date: '2026-07-20',
      time: '14:00 - 16:30',
      guideLanguageZh: '中文',
      guideLanguageEn: 'Chinese',
      status: 'recruiting',
      ownerPartnerId: null,
      joinedAt: null,
      travelers: [],
    }
  ];
}

// Generates dummy groups for My Groups
export const DUMMY_MY_GROUPS: MyGroup[] = [
  {
    id: 'GRP-2026-001',
    slotId: 'slot-4',
    date: '2026-07-16',
    time: '14:00 - 16:30',
    size: 18,
    packageMix: { A: 4, B: 6, C: 6, D: 2 },
    commission: 531.0, // calculated from packages
    status: 'locked',
  },
  {
    id: 'GRP-2026-002',
    slotId: 'slot-2',
    date: '2026-07-15',
    time: '14:00 - 16:30',
    size: 16,
    packageMix: { A: 2, B: 5, C: 6, D: 3 },
    commission: 476.5,
    status: 'building',
  },
  {
    id: 'GRP-2026-003',
    slotId: 'slot-1',
    date: '2026-07-15',
    time: '09:00 - 11:30',
    size: 12,
    packageMix: { A: 3, B: 4, C: 3, D: 2 },
    commission: 349.5,
    status: 'building',
  },
  {
    id: 'GRP-2026-004',
    slotId: 'slot-3',
    date: '2026-07-16',
    time: '09:00 - 11:30',
    size: 20,
    packageMix: { A: 5, B: 5, C: 5, D: 5 },
    commission: 582.0,
    status: 'building',
  },
  {
    id: 'GRP-2025-098',
    slotId: 'slot-old-1',
    date: '2026-06-10',
    time: '09:00 - 11:30',
    size: 17,
    packageMix: { A: 3, B: 4, C: 8, D: 2 },
    commission: 598.2,
    status: 'confirmed',
  },
  {
    id: 'GRP-2025-095',
    slotId: 'slot-old-2',
    date: '2026-06-05',
    time: '14:00 - 16:30',
    size: 19,
    packageMix: { A: 4, B: 5, C: 7, D: 3 },
    commission: 611.8,
    status: 'completed',
  },
];
