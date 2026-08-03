// 課表與費用的單一資料來源。新增/編輯 track、場次、月曆 highlight、價目
// 只要改這個檔案，/courses 三個 tab 與 /location 的課程摘要都會跟著更新。
//
// 地址不寫在這裡：據點資料集中於 src/data/venues.ts，track 只存 venueSlug。
//
// ⚠️ 目前整份都是佔位資料（標了 TODO 的地方）。實際課表確定後整批替換。

import type { VenueSlug } from '@/data/venues';

/**
 * 每一條固定課程線（track）對應一組顏色。
 * 刻意用中性的 A/B/C 命名而不是綁星期或城市，之後課程改時間才不用連 key 一起改。
 */
export type ThemeKey = 'trackA' | 'trackB' | 'trackC';

export type SessionStatus = 'done' | 'active' | 'upcoming';

export interface TimeSlot {
  time: string; // "19:30–20:30"（注意是 en dash「–」，jsonLd 的營業時間靠它切字串）
  title: string; // "Hustle Lv1"
}

export interface SessionDate {
  label: string; // "8/5"
  note?: string; // "體驗課" / "第一堂"
  upcoming?: boolean; // 下一期（尚未開放/預告）場次，顯示為淡色
}

// 場次是否已結束由「真實日期」決定，不寫死。
// label 只有月/日，年份一律取 MONTH.year（目前課表不跨年）。
export function getSessionStatus(
  date: SessionDate,
  now: Date = new Date()
): SessionStatus {
  if (date.upcoming) return 'upcoming';

  const [month, day] = date.label.split('/').map(Number);
  if (!month || !day) return 'active';

  const sessionDay = new Date(MONTH.year, month - 1, day);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // 當天仍算進行中，隔天才標記為已結束
  return sessionDay < today ? 'done' : 'active';
}

export interface Track {
  id: string; // 錨點 id，例如 'weekly-a'
  theme: ThemeKey;
  cityEn: string; // 'KAOHSIUNG'
  cityZh: string; // '高雄教室'
  sessionLabelEn: string; // 'THURSDAY'（圓章顯示，也是 JSON-LD 營業日的來源，必須是英文星期）
  dayZh: string; // '週四'
  badge?: string; // 'NEW 新開班'
  badgeNote?: string; // '每週四・正式課 X/X 起共五堂'
  slots: TimeSlot[];
  datesTitle: string; // '本期場次' / '場次'
  datesNote: string; // '共 4 堂・每週四'
  dates: SessionDate[];
  venueSlug: VenueSlug; // 對應 src/data/venues.ts 的據點
  pricePlanId: string; // 對應 PRICE_PLANS 的 id
  priceSummary: string; // 課表卡上顯示的一行費用摘要
}

// 每個 theme 對應一組完整字面 Tailwind class（讓 v4 JIT 掃得到），集中於此方便調色。
// 注意：這裡刻意寫死 hex 而不是用 --brand，因為課表需要「幾條線互相區分」的多色系統，
// 跟品牌主色是兩件事。換品牌色時這組不一定要跟著改。
export interface ThemeStyle {
  pageFrom: string; // track 卡背景
  accentText: string; // 時間 / 重點文字色
  accentBg: string; // 圓章 / active chip 底色
  highlightCell: string; // 月曆 highlight 方塊底色
  legendDot: string; // 圖例圓點
  blob: string; // 卡片裝飾色塊
}

// TODO: 這三組色沿用自參考站，可依 HustleHustle KHS 的品牌調性重配。
export const THEMES: Record<ThemeKey, ThemeStyle> = {
  trackA: {
    pageFrom: 'bg-[#f5e7d8]',
    accentText: 'text-[#d4796e]',
    accentBg: 'bg-[#d4796e]',
    highlightCell: 'bg-[#d98b82]',
    legendDot: 'bg-[#d98b82]',
    blob: 'bg-[#c9bfe0]',
  },
  trackB: {
    pageFrom: 'bg-[#cfe0f5]',
    accentText: 'text-[#4d7fc4]',
    accentBg: 'bg-[#5b8dd9]',
    highlightCell: 'bg-[#5b8dd9]',
    legendDot: 'bg-[#5b8dd9]',
    blob: 'bg-[#c7e36a]',
  },
  trackC: {
    pageFrom: 'bg-[#f7ead4]',
    accentText: 'text-[#d28e2a]',
    accentBg: 'bg-[#e0a23c]',
    highlightCell: 'bg-[#e0a23c]',
    legendDot: 'bg-[#e0a23c]',
    blob: 'bg-[#f0c878]',
  },
};

export interface MonthConfig {
  year: number;
  month: number; // 1-12
  titleEn: string;
  titleZh: string;
  // 日 -> { theme（決定顏色）, label（小字）, trackId（錨點目標）}
  highlights: Record<number, { theme: ThemeKey; label: string; trackId: string }>;
  legend: { theme: ThemeKey; title: string; desc: string }[];
  footnote: string;
}

// TODO: 每個月要更新這一塊 —— year / month / titleEn / titleZh 換成當月，
//       highlights 的 key 是「幾號」，值決定那一格的顏色與點下去跳到哪張課表卡。
export const MONTH: MonthConfig = {
  year: 2026,
  month: 8,
  titleEn: 'AUGUST',
  titleZh: '八月',
  highlights: {
    6: { theme: 'trackA', label: '高雄', trackId: 'weekly-a' },
    9: { theme: 'trackB', label: '高雄', trackId: 'weekly-b' },
    13: { theme: 'trackA', label: '高雄', trackId: 'weekly-a' },
    16: { theme: 'trackB', label: '高雄', trackId: 'weekly-b' },
    20: { theme: 'trackA', label: '高雄', trackId: 'weekly-a' },
    23: { theme: 'trackB', label: '高雄', trackId: 'weekly-b' },
    27: { theme: 'trackA', label: '高雄', trackId: 'weekly-a' },
    30: { theme: 'trackB', label: '高雄', trackId: 'weekly-b' },
  },
  legend: [
    {
      theme: 'trackA',
      title: '週四・高雄教室',
      desc: 'Hustle Lv1 / Lv2 · 19:30–22:00', // TODO
    },
    {
      theme: 'trackB',
      title: '週日・高雄教室',
      desc: 'Hustle 基礎 / Practica · 14:00–17:00', // TODO
    },
  ],
  footnote: '★ 佔位課表，實際場次以 Instagram 公告為準', // TODO
};

// TODO: 以下兩條 track 全部是佔位。實際課程確定後替換；
//       track 數量可以增減，記得同步 venues.ts 的 trackIds 與 MONTH.legend。
//       sessionLabelEn 必須是英文星期（SUNDAY/MONDAY/…），JSON-LD 的營業時間靠它辨識。
export const TRACKS: Track[] = [
  {
    id: 'weekly-a',
    theme: 'trackA',
    cityEn: 'KAOHSIUNG',
    cityZh: '高雄教室',
    sessionLabelEn: 'THURSDAY',
    dayZh: '週四',
    slots: [
      { time: '19:30–20:30', title: 'Hustle Lv1' },
      { time: '20:30–21:30', title: 'Hustle Lv2' },
      { time: '21:30–22:00', title: '課後練習 social' },
    ],
    datesTitle: '本期場次',
    datesNote: '共 4 堂・每週四',
    dates: [
      { label: '8/6' },
      { label: '8/13' },
      { label: '8/20' },
      { label: '8/27' },
    ],
    venueSlug: 'kaohsiung',
    pricePlanId: 'card-plan',
    priceSummary: '課卡制・單堂 $350・6 堂 $2000',
  },
  {
    id: 'weekly-b',
    theme: 'trackB',
    cityEn: 'KAOHSIUNG',
    cityZh: '高雄教室',
    sessionLabelEn: 'SUNDAY',
    dayZh: '週日',
    badge: 'NEW 新開班',
    badgeNote: '每週日下午・零基礎友善',
    slots: [
      { time: '14:00–15:00', title: 'Hustle 基礎' },
      { time: '15:00–16:00', title: 'Body movement' },
      { time: '16:00–17:00', title: 'Practica' },
    ],
    datesTitle: '本期場次',
    datesNote: '共 4 堂・每週日',
    dates: [
      { label: '8/9' },
      { label: '8/16' },
      { label: '8/23' },
      { label: '8/30' },
    ],
    venueSlug: 'kaohsiung',
    pricePlanId: 'card-plan',
    priceSummary: '課卡制・單堂 $350・6 堂 $2000',
  },
];

/** 取得某個據點的所有課程 track（據點頁用來列出該城市的課表）。 */
export function getTracksByVenue(slug: VenueSlug): Track[] {
  return TRACKS.filter((t) => t.venueSlug === slug);
}

// ---- 費用方案（與課表共用顏色，方便客人對應）----

export interface PriceOption {
  name: string; // '單堂體驗' / '整期五堂'
  price: number;
}

export interface PriceCourse {
  name: string; // 'Hustle Lv1'
  theme: ThemeKey; // 該課程所屬 track，決定 chip 顏色
}

export interface PriceTier {
  title: string; // 'Lv1 課程'
  subtitle?: string;
  courses: PriceCourse[]; // 適用課程（chip，依 track 上色）
  options: PriceOption[];
}

export interface PriceChip {
  label: string; // '週四・高雄'
  theme: ThemeKey; // 決定 chip 顏色，與課表一致
}

export interface PricePlan {
  id: string; // 錨點 id，對應 Track.pricePlanId
  name: string; // '課卡方案'
  chips: PriceChip[]; // 適用的「週X・城市」
  tiers: PriceTier[];
  note?: string;
}

// TODO: 價目全部是佔位金額，請換成實際收費。
//       每個 plan 的 id 要跟上面 Track.pricePlanId 對得起來，課表卡才連得過來。
export const PRICE_PLANS: PricePlan[] = [
  {
    id: 'card-plan',
    name: '課卡方案',
    chips: [
      { label: '週四・高雄', theme: 'trackA' },
      { label: '週日・高雄', theme: 'trackB' },
    ],
    tiers: [
      {
        title: '統一課卡',
        subtitle: '單一課卡，適用所有課程',
        courses: [
          { name: 'Hustle Lv1', theme: 'trackA' },
          { name: 'Hustle Lv2', theme: 'trackA' },
          { name: 'Hustle 基礎', theme: 'trackB' },
          { name: 'Body movement', theme: 'trackB' },
        ],
        options: [
          { name: '單堂', price: 350 },
          { name: '6 堂課程', price: 2000 },
        ],
      },
    ],
    note: '*佔位說明：課卡可插班，未使用完畢可用於下一期。實際規則待補。',
  },
];
