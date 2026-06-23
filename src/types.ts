export type LanguageMode = 'zh-first' | 'en-first';

export interface Package {
  id: 'A' | 'B' | 'C' | 'D';
  nameZh: string;
  nameEn: string;
  price: number;
  descZh: string;
  descEn: string;
}

export interface Traveler {
  id: string;
  name: string;
  nationality: string;
  email: string;
  passport: string;
  packageId: 'A' | 'B' | 'C' | 'D';
  emergencyContact?: string;
  consent: boolean;
}

export type SlotStatus = 'recruiting' | 'lockable' | 'full' | 'locked' | 'taken' | 'released';

export interface Slot {
  id: string;
  date: string;
  time: string;
  guideLanguageZh: string;
  guideLanguageEn: string;
  status: SlotStatus;
  ownerPartnerId: string | null; // "partner-self" or "partner-other" or null
  joinedAt: string | null; // ISO string when first taken
  travelers: Traveler[];
}

export interface MyGroup {
  id: string;
  slotId: string;
  date: string;
  time: string;
  size: number;
  packageMix: { [key in 'A' | 'B' | 'C' | 'D']: number };
  commission: number;
  status: 'building' | 'locked' | 'confirmed' | 'completed';
}
