// 課表與費用的單一資料來源。新增/編輯 track、場次、月曆 highlight、價目
// 只要改這個檔案，/courses 三個 tab 與 /location 的課程摘要都會跟著更新。
//
// 地址不寫在這裡：據點資料集中於 src/data/venues.ts，track 只存 venueSlug。
//
// 課表與價目已是實際內容（2026/11–12）；每個月要更新 MONTHS 與各 track 的 dates。

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
  /**
   * 特別場次的說明（"體驗課" / "Lambada"）。有寫就是特別場次：圓點用深色，字寫在圓點下方。
   * 一般常態課不要寫。圓點只有約 48px 寬，請控制在 6 個字左右。
   */
  note?: string;
  /**
   * 圓點下放不下的補充說明（例如「Lambada Fast Track 19:30–22:00，扣兩堂 Zouk 課卡」）。
   * 會列在課表卡的圖例下方，那一天過了就自動不顯示。
   */
  detail?: string;
  off?: boolean; // 這週停課：虛線圓點，note 一律寫「停課」
  upcoming?: boolean; // 下一期（尚未開放/預告）場次，顯示為淡色
}

/** '9/18' → Date（當地時區的當天 0 點）。label 只有月/日，年份要另外給。 */
function toDate(label: string, year: number): Date | null {
  const [month, day] = label.split('/').map(Number);
  if (!month || !day) return null;
  return new Date(year, month - 1, day);
}

/**
 * 那一天是否已經過去。當天仍算進行中，隔天才算過去。
 * 課表的場次與報名頁的體驗課／Workshop 共用這個判斷，不要各寫一份。
 */
export function isPast(label: string, year: number, now: Date): boolean {
  const date = toDate(label, year);
  if (!date) return false;
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return date < today;
}

// 場次是否已結束由「真實日期」決定，不寫死。
// label 只有月/日，年份一律取 MONTH.year（目前課表不跨年）。
export function getSessionStatus(
  date: SessionDate,
  now: Date = new Date()
): SessionStatus {
  if (date.upcoming) return 'upcoming';
  if (!toDate(date.label, MONTH.year)) return 'active';
  return isPast(date.label, MONTH.year, now) ? 'done' : 'active';
}

export interface Track {
  id: string; // 錨點 id，例如 'hustle-thu'
  theme: ThemeKey;
  /** 這條線教的舞種，例如 'Hustle' / 'Brazilian Zouk'。jsonLd 的 Course 名稱用它。 */
  danceStyle: string;
  cityEn: string; // 'KAOHSIUNG'
  cityZh: string; // 'Hustle・職人棧'（舞種＋場地，課表卡與據點頁的標題）
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
  /**
   * 常態課的報名表單（/enroll 的按鈕連過去）。
   * 目前兩條 track 共用同一張 Google 表單，之後要分開收就各自換掉這一行。
   */
  enrollUrl: string;
}

// 每個 theme 對應一組完整字面 Tailwind class（讓 v4 JIT 掃得到），集中於此方便調色。
// 注意：這裡刻意寫死 hex 而不是用 --brand，因為課表需要「幾條線互相區分」的多色系統，
// 跟品牌主色是兩件事。換品牌色時這組不一定要跟著改。
export interface ThemeStyle {
  pageFrom: string; // track 卡背景
  accentText: string; // 時間 / 重點文字色
  accentBg: string; // 圓章 / active chip 底色
  highlightCell: string; // 月曆 highlight 方塊底色
  highlightCellStrong: string; // 同色系但深一階：那天有體驗課／特別場次（跟 dotStrong 同色，月曆與課表卡一致）
  legendDot: string; // 圖例圓點
  blob: string; // 卡片裝飾色塊
  dotSoft: string; // 課表卡場次：常態課圓點（淺底＋主色框）
  dotStrong: string; // 課表卡場次：特別場次圓點（深底白字，要過 4.5:1 對比）
  monthText: string; // 深一階的文字色（過 4.5:1）：課表卡月份標籤、文字連結
}

// TODO: 這三組色沿用自參考站，可依 HustleHustle KHS 的品牌調性重配。
export const THEMES: Record<ThemeKey, ThemeStyle> = {
  trackA: {
    pageFrom: 'bg-[#f5e7d8]',
    accentText: 'text-[#d4796e]',
    accentBg: 'bg-[#d4796e]',
    highlightCell: 'bg-[#d98b82]',
    highlightCellStrong: 'bg-[#a8554a]',
    legendDot: 'bg-[#d98b82]',
    blob: 'bg-[#c9bfe0]',
    dotSoft: 'bg-[#fbe9e4] border-[#d4796e]',
    dotStrong: 'bg-[#a8554a]',
    monthText: 'text-[#a8554a]',
  },
  trackB: {
    pageFrom: 'bg-[#cfe0f5]',
    accentText: 'text-[#4d7fc4]',
    accentBg: 'bg-[#5b8dd9]',
    highlightCell: 'bg-[#5b8dd9]',
    highlightCellStrong: 'bg-[#3a68b8]',
    legendDot: 'bg-[#5b8dd9]',
    blob: 'bg-[#c7e36a]',
    dotSoft: 'bg-[#e6eefa] border-[#5b8dd9]',
    dotStrong: 'bg-[#3a68b8]',
    monthText: 'text-[#3a68b8]',
  },
  trackC: {
    pageFrom: 'bg-[#f7ead4]',
    accentText: 'text-[#d28e2a]',
    accentBg: 'bg-[#e0a23c]',
    highlightCell: 'bg-[#e0a23c]',
    highlightCellStrong: 'bg-[#94600f]',
    legendDot: 'bg-[#e0a23c]',
    blob: 'bg-[#f0c878]',
    dotSoft: 'bg-[#fbf0dc] border-[#e0a23c]',
    dotStrong: 'bg-[#94600f]',
    monthText: 'text-[#94600f]',
  },
};

export interface MonthConfig {
  year: number;
  month: number; // 1-12
  titleEn: string;
  titleZh: string;
  // 日 -> { theme（決定顏色）, label（小字，\n 是刻意指定的斷行位置）, trackId（錨點目標）,
  //          emphasis（那天是體驗課／Party／Lambada 等特別場次，方塊用深一階的顏色＋手機上的白點）}
  highlights: Record<
    number,
    { theme: ThemeKey; label: string; trackId: string; emphasis?: boolean }
  >;
  legend: { theme: ThemeKey; title: string; desc: string }[];
  footnote: string;
}

// 月曆下方的「時間和地點」與星號備註，每個月都一樣，所以集中寫一份。
// 某個月有特殊狀況時，該月的 legend / footnote 可以改成自己的內容。
const TIME_AND_PLACE: MonthConfig['legend'] = [
  { theme: 'trackA', title: 'Hustle', desc: '19:30–22:00・職人棧' },
  { theme: 'trackB', title: 'Zouk', desc: '19:30–23:00・Social Hub' },
];
const FOOTNOTE = '★ 實際場次以 Instagram 公告為準';

// TODO: 每個月要更新這一塊 —— 新的月份 push 到 MONTHS 後面（或替換掉過期的），
//       highlights 的 key 是「幾號」，值決定那一格的顏色與點下去跳到哪張課表卡。
// 陣列順序就是月曆在 /courses 課表 tab 的顯示順序（由近到遠）。
export const MONTHS: MonthConfig[] = [
  {
    year: 2026,
    month: 11,
    titleEn: 'NOVEMBER',
    titleZh: '十一月',
    // 十一月週五沒有 Zouk 正式課：週五只剩 11/13 體驗課＋Party 與 11/27 Lambada，
    // 兩場都掛在 Zouk 那張課表卡（zouk-fri）上。
    highlights: {
      12: { theme: 'trackA', label: 'Hustle', trackId: 'hustle-thu' },
      13: {
        theme: 'trackB',
        label: '體驗課\n+Party',
        trackId: 'zouk-fri',
        emphasis: true,
      },
      19: { theme: 'trackA', label: 'Hustle', trackId: 'hustle-thu' },
      26: {
        theme: 'trackA',
        label: 'Hustle\n體驗課',
        trackId: 'hustle-thu',
        emphasis: true,
      },
      // Lambada 是特別場次（不是一般 Zouk 課），所以也用深色＋白點
      27: {
        theme: 'trackB',
        label: 'Lambada',
        trackId: 'zouk-fri',
        emphasis: true,
      },
      // 11/5、11/6、11/20 沒課，所以不 highlight。
    },
    legend: TIME_AND_PLACE,
    footnote: FOOTNOTE,
  },
  {
    year: 2026,
    month: 12,
    titleEn: 'DECEMBER',
    titleZh: '十二月',
    highlights: {
      3: { theme: 'trackA', label: 'Hustle', trackId: 'hustle-thu' },
      4: { theme: 'trackB', label: 'Zouk', trackId: 'zouk-fri' },
      10: { theme: 'trackA', label: 'Hustle', trackId: 'hustle-thu' },
      11: {
        theme: 'trackB',
        label: '體驗課\n+Party',
        trackId: 'zouk-fri',
        emphasis: true,
      },
      17: { theme: 'trackA', label: 'Hustle', trackId: 'hustle-thu' },
      // 12/18 Zouk 停課，所以不 highlight。
      24: {
        theme: 'trackA',
        label: '體驗課\n+Party',
        trackId: 'hustle-thu',
        emphasis: true,
      },
      25: { theme: 'trackB', label: 'Zouk', trackId: 'zouk-fri' },
      // 12/31 Hustle 停課，所以不 highlight。
    },
    legend: TIME_AND_PLACE,
    footnote: FOOTNOTE,
  },
];

/**
 * 課表卡的場次圓點點下去 → 月曆切到那個月並捲回月曆。
 * 不用瀏覽器原生的 #錨點：目標在橫向輪播裡，原生跳轉的落點不穩（會被導覽列蓋住、有時不捲），
 * 所以圓點發這個事件，由 MonthCarousel 自己切月份、捲動。
 */
export const SHOW_MONTH_EVENT = 'schedule:show-month';
export type ShowMonthDetail = { year: number; month: number };

/** 目前月份（getSessionStatus 用它補上場次 label 缺少的年份）。 */
export const MONTH: MonthConfig = MONTHS[0];

// 兩條固定課程線：週四 Hustle（職人棧）、週五 Zouk（Social Hub）。
// track 數量可以增減，記得同步 venues.ts 的 trackIds 與 MONTH.legend。
// sessionLabelEn 必須是英文星期（SUNDAY/MONDAY/…），JSON-LD 的營業時間靠它辨識。
export const TRACKS: Track[] = [
  {
    id: 'hustle-thu',
    theme: 'trackA',
    danceStyle: 'Hustle',
    cityEn: 'KAOHSIUNG',
    cityZh: 'Hustle・職人棧',
    sessionLabelEn: 'THURSDAY',
    dayZh: '週四',
    slots: [
      { time: '19:30–20:30', title: 'Hustle 初中階課' },
      // Practica＝課後練習，報名頁不列（見 TrackEnrollCard 的 classSlots）
      { time: '20:30–22:00', title: 'Hustle Practica' },
    ],
    datesTitle: '場次',
    datesNote: '每週四',
    dates: [
      { label: '11/12' },
      { label: '11/19' },
      { label: '11/26', note: '體驗課' },
      { label: '12/3' },
      { label: '12/10' },
      { label: '12/17' },
      { label: '12/24', note: '體驗＋Party' },
      { label: '12/31', off: true, note: '停課' },
    ],
    venueSlug: 'zhirenzhan',
    pricePlanId: 'hustle-card',
    priceSummary: '課卡制・單堂 $450・8 堂 $3200',
    enrollUrl: 'https://forms.gle/SYm2SMxnT8PoEjFr5',
  },
  {
    id: 'zouk-fri',
    theme: 'trackB',
    danceStyle: 'Brazilian Zouk',
    cityEn: 'KAOHSIUNG',
    cityZh: 'Zouk・Social Hub',
    sessionLabelEn: 'FRIDAY',
    dayZh: '週五',
    slots: [
      { time: '19:30–20:30', title: 'Zouk 初階班' },
      { time: '20:45–21:45', title: 'Zouk 進階班' },
      { time: '22:00–23:00', title: '課後練習' },
    ],
    datesTitle: '場次',
    // 不寫「某個月沒課」這類會過期的句子：哪幾週有課看下面的圓點就知道。
    datesNote: '每週五',
    dates: [
      // 十一月沒有 Zouk 正式課，週五只有這兩場。
      { label: '11/13', note: '體驗＋Party' },
      {
        label: '11/27',
        note: 'Lambada',
        detail: '11/27 Lambada Fast Track 19:30–22:00，扣兩堂 Zouk 課卡',
      },
      { label: '12/4' },
      { label: '12/11', note: '體驗＋Party' },
      { label: '12/18', off: true, note: '停課' },
      { label: '12/25' },
    ],
    venueSlug: 'social-hub',
    pricePlanId: 'zouk-card',
    priceSummary: '課卡制・單堂 $450・8 堂 $3200',
    enrollUrl: 'https://forms.gle/SYm2SMxnT8PoEjFr5',
  },
];

/** 取得某個據點的所有課程 track（據點頁用來列出該城市的課表）。 */
export function getTracksByVenue(slug: VenueSlug): Track[] {
  return TRACKS.filter((t) => t.venueSlug === slug);
}

// ---- 報名用的單場活動（體驗課 / 客座 Workshop）----
//
// 報名頁 /enroll 的資料來源。跟月曆放同一個檔案是刻意的：MONTHS 的 highlights
// 已經標了哪幾天有體驗課／Workshop，日期改了兩邊要一起改，分開放遲早會對不起來。
//
// 常態課不在這裡（它們是 TRACKS，報名連結存在 Track.enrollUrl）。

export type EventKind = 'trial' | 'workshop';

export interface EnrollEvent {
  id: string; // 錨點與 JSON-LD 的 @id，例如 'zouk-trial-0918'
  kind: EventKind;
  /** 舞種色。報名頁刻意只用兩色：trackA=Hustle、trackB=Zouk（Workshop 也照舞種上色）。 */
  theme: 'trackA' | 'trackB';
  danceStyle: string; // 'Brazilian Zouk'，JSON-LD 用
  title: string;
  note?: string; // 卡片第二行的說明
  /** 預設取 MONTH.year；活動跨到下一年時要明寫。 */
  year?: number;
  dateLabel: string; // '9/18'
  endDateLabel?: string; // '9/28'，多天活動才填
  weekdayEn: string; // 'FRI'（日期章上的字）
  startTime?: string; // '19:30'，JSON-LD 的 startDate 用
  /** 客座 Workshop 場地未定時留空；留空就不會輸出 Event 結構化資料。 */
  venueSlug?: VenueSlug;
  /**
   * 這一場臨時換到平常不上課的場地（例如週四 Hustle 借用 Social Hub）。
   * true 時報名卡會多一個「場地異動」標記，避免熟客照舊跑到原場地。
   * venueSlug 一律填「實際上課的場地」，這裡只負責提醒。
   */
  venueChanged?: boolean;
  price?: number; // 有數字才輸出 JSON-LD 的 offers
  priceNote?: string; // 畫面顯示用，例如 '單堂 $450'
  /**
   * 報名表單。留空字串＝報名還沒開放，這一場就整張卡不顯示
   * （日期先寫在這裡沒關係，表單網址填進來的那一刻才會出現在報名頁）。
   */
  enrollUrl: string;
}

// TODO: 每次有新的體驗課／Workshop 就往這裡加一筆；辦完的不用手動刪，
//       程式會用今天的日期自動隱藏（見 getUpcomingEvents）。
export const EVENTS: EnrollEvent[] = [
  {
    id: 'zouk-trial-0918',
    kind: 'trial',
    theme: 'trackB',
    danceStyle: 'Brazilian Zouk',
    title: 'Zouk 體驗課 ＋ Zouk / Hustle Party',
    note: '課後直接接派對，可以留下來看大家跳，也可以自己下場',
    dateLabel: '9/18',
    weekdayEn: 'FRI',
    startTime: '19:30',
    venueSlug: 'social-hub',
    price: 450,
    priceNote: '單堂 $450',
    enrollUrl: 'https://forms.gle/TwnBuWRz1f7bH1vJ6',
  },
  {
    id: 'hustle-trial-0924',
    kind: 'trial',
    theme: 'trackA',
    danceStyle: 'Hustle',
    title: 'Hustle 體驗課 ＋ social',
    note: '課後留下來練習，老師會在旁邊帶',
    dateLabel: '9/24',
    weekdayEn: 'THU',
    startTime: '19:30',
    venueSlug: 'zhirenzhan',
    price: 450,
    priceNote: '單堂 $450',
    enrollUrl: 'https://forms.gle/DcYhJ7u6fH1FtzB8A',
  },
  {
    id: 'iago-workshop',
    kind: 'workshop',
    theme: 'trackB',
    danceStyle: 'Brazilian Zouk',
    title: 'Iago Zouk Weekender',
    note: '兩天課程＋派對',
    dateLabel: '9/27',
    endDateLabel: '9/28',
    weekdayEn: 'SAT',
    // TODO: 補上這場 workshop 的場地與價格（場地留空時不會輸出結構化資料）
    enrollUrl: 'https://forms.gle/s7qoX8pvpbeBKeHQ8',
  },
  {
    id: 'zouk-trial-1009',
    kind: 'trial',
    theme: 'trackB',
    danceStyle: 'Brazilian Zouk',
    title: 'Zouk 體驗課 ＋ Zouk / Hustle Party',
    note: '課後直接接派對',
    dateLabel: '10/9',
    weekdayEn: 'FRI',
    startTime: '19:30',
    venueSlug: 'social-hub',
    price: 450,
    priceNote: '單堂 $450',
    enrollUrl:
      'https://docs.google.com/forms/d/e/1FAIpQLSfz7KIFDnDoKzfAj4qvfd1TgqypqWxiiy_5vIkc5BB2F33dyw/viewform',
  },
  {
    id: 'hustle-trial-1022',
    kind: 'trial',
    theme: 'trackA',
    danceStyle: 'Hustle',
    title: 'Hustle 體驗課 ＋ social',
    note: '這一場不在職人棧，改到 Social Hub',
    dateLabel: '10/22',
    weekdayEn: 'THU',
    startTime: '19:30',
    venueSlug: 'social-hub',
    venueChanged: true,
    price: 450,
    priceNote: '單堂 $450',
    enrollUrl:
      'https://docs.google.com/forms/d/e/1FAIpQLSexxiaDuhCHwDUUWwoiKAG33ZZmdr8ztHYWVaVTnnSZs32ceA/viewform',
  },
  {
    id: 'matheus-cozyyi-workshop',
    kind: 'workshop',
    theme: 'trackB',
    danceStyle: 'Brazilian Zouk',
    title: 'Matheus & Cozyyi Zouk Weekender',
    note: '兩天課程＋派對',
    dateLabel: '10/24',
    endDateLabel: '10/25',
    weekdayEn: 'SAT',
    // TODO: 補上這場 workshop 的場地與價格
    enrollUrl: 'https://forms.gle/9Mjrqxydhpu2emFs8',
  },
  {
    id: 'hustle-trial-1126',
    kind: 'trial',
    theme: 'trackA',
    danceStyle: 'Hustle',
    title: 'Hustle 體驗課 ＋ Party',
    note: '19:30 體驗課，20:30 接 Party 到 22:30・兩人同行一人免費（限新生）',
    dateLabel: '11/26',
    weekdayEn: 'THU',
    startTime: '19:30',
    venueSlug: 'zhirenzhan',
    price: 300,
    priceNote: '單堂 $300',
    // 同類型的報名表沿用（跟 10/22 Hustle 體驗課同一張）
    enrollUrl:
      'https://docs.google.com/forms/d/e/1FAIpQLSexxiaDuhCHwDUUWwoiKAG33ZZmdr8ztHYWVaVTnnSZs32ceA/viewform',
  },
  {
    id: 'zouk-trial-1113',
    kind: 'trial',
    theme: 'trackB',
    danceStyle: 'Brazilian Zouk',
    title: 'Zouk 體驗課 ＋ Zouk / Hustle Party',
    note: '19:30 體驗課，20:30 接 Party 到 23:00・兩人同行一人免費（限新生）',
    dateLabel: '11/13',
    weekdayEn: 'FRI',
    startTime: '19:30',
    venueSlug: 'social-hub',
    // 以報名表為準：11/12 23:59 前報名 $300，現場 $400
    price: 300,
    priceNote: '預約 $300（11/12 前）・現場 $400',
    // 同類型的報名表沿用（跟 10/9 Zouk 體驗課同一張）
    enrollUrl:
      'https://docs.google.com/forms/d/e/1FAIpQLSfz7KIFDnDoKzfAj4qvfd1TgqypqWxiiy_5vIkc5BB2F33dyw/viewform',
  },
];

/** 活動的年份：沒寫就用目前月份的年份。 */
export function getEventYear(event: EnrollEvent): number {
  return event.year ?? MONTH.year;
}

/**
 * 可以報名的活動，依日期由近到遠排序。
 *
 * 兩種情況會被濾掉：已經辦完的（多天活動要等最後一天過了才算結束，
 * 週末 workshop 的第一天過了還是要看得到），以及還沒開放報名的
 * （enrollUrl 是空字串）—— 一張點不下去的卡片對客人沒有意義。
 */
export function getUpcomingEvents(
  kind: EventKind,
  now: Date = new Date()
): EnrollEvent[] {
  return EVENTS.filter((event) => {
    if (event.kind !== kind) return false;
    if (!event.enrollUrl) return false;
    const lastDay = event.endDateLabel ?? event.dateLabel;
    return !isPast(lastDay, getEventYear(event), now);
  }).sort((a, b) => sortKey(a) - sortKey(b));
}

/** 排序用：把 '9/18' + 年份壓成可比較的數字，資料寫的順序就不重要了。 */
function sortKey(event: EnrollEvent): number {
  const [month, day] = event.dateLabel.split('/').map(Number);
  return getEventYear(event) * 10000 + (month ?? 0) * 100 + (day ?? 0);
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

// Hustle 與 Zouk 是兩張獨立課卡（各自只適用自己的課程），所以拆成兩個 plan。
// 每個 plan 的 id 要跟上面 Track.pricePlanId 對得起來，課表卡才連得過來。
export const PRICE_PLANS: PricePlan[] = [
  {
    id: 'hustle-card',
    // 兩張課卡適用的課程不同，名字要能一眼分開，不然費用頁會出現兩個同名區塊。
    name: 'Hustle 課卡方案',
    chips: [{ label: '週四・職人棧', theme: 'trackA' }],
    tiers: [
      {
        title: 'Hustle 課卡',
        subtitle: '適用週四職人棧的 Hustle 課程',
        courses: [
          { name: 'Hustle 初中階課', theme: 'trackA' },
        ],
        options: [
          { name: '單堂', price: 450 },
          { name: '8 堂課卡', price: 3200 },
        ],
      },
    ],
    // TODO: 補上課卡的使用規則（有效期限、可否插班、能不能跟別人共用）。
  },
  {
    id: 'zouk-card',
    name: 'Zouk 課卡方案',
    chips: [{ label: '週五・Social Hub', theme: 'trackB' }],
    tiers: [
      {
        title: 'Zouk 課卡',
        subtitle: '適用週五 Social Hub 的 Zouk 課程',
        courses: [
          { name: 'Zouk 初階班', theme: 'trackB' },
          { name: 'Zouk 進階班', theme: 'trackB' },
        ],
        options: [
          { name: '單堂', price: 450 },
          { name: '8 堂課卡', price: 3200 },
        ],
      },
    ],
    // TODO: 補上課卡的使用規則（有效期限、可否插班、能不能跟別人共用）。
  },
];
