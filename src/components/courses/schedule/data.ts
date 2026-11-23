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
  /**
   * 時段旁的小標籤，給「還沒開始的班」用，例如 '12/3 開課'。
   * 課表卡與據點頁會顯示成一個小 chip；開課後記得把這行刪掉。
   */
  note?: string;
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
  /**
   * 這一天的時段跟 track.slots 不一樣時才寫（體驗課、Lambada、少一堂課的週）。
   * 月曆點了日期後出現的「當天課表」用它，照每月 IG 課表海報填。
   */
  slots?: TimeSlot[];
  /** 這天用課卡上課但有特別規則時，寫在購買課卡按鈕上，例如「Lambada 扣兩堂」。 */
  cardNote?: string;
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
  /**
   * 這條線的體驗課預設資料。dates 裡 note 含「體驗」的場次，會自動用這組資料
   * 產生一筆體驗課（首頁「近期體驗課」、報名頁、課表圓點的報名連結都會出現），
   * 不用再到 EVENTS 手動加一筆。某一場要不一樣（換表單、換價格、換場地），
   * 就在 EVENTS 寫一筆同日期的體驗課，EVENTS 的那筆會優先。
   */
  trial: {
    title: string;
    note?: string;
    startTime: string;
    price: number;
    priceNote: string;
    enrollUrl: string;
  };
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
  // 月曆選中時：實心變成「同色外框」，外框和數字都用這個文字色（框線用 border-current 跟著它）
  highlightCellSelected: string; // 對應 highlightCell
  highlightCellStrongSelected: string; // 對應 highlightCellStrong
  legendDot: string; // 圖例圓點
  blob: string; // 卡片裝飾色塊
  dotSoft: string; // 課表卡場次：常態課圓點（淺底＋主色框）
  dotStrong: string; // 課表卡場次：特別場次圓點（深底白字，要過 4.5:1 對比）
  monthText: string; // 深一階的文字色（過 4.5:1）：課表卡月份標籤、文字連結
}

// 實際色值在 src/app/globals.css 的 --track-a-* / --track-b-* / --track-c-*，
// 要重配色改那裡，這裡只決定「哪個欄位用哪個角色」。
// TODO: 這三組色沿用自參考站，可依 HustleHustle KHS 的品牌調性重配。
export const THEMES: Record<ThemeKey, ThemeStyle> = {
  trackA: {
    pageFrom: 'bg-track-a-page',
    accentText: 'text-track-a-accent-text',
    accentBg: 'bg-track-a-accent',
    highlightCell: 'bg-track-a-cell',
    highlightCellStrong: 'bg-track-a-strong',
    highlightCellSelected: 'text-track-a-cell',
    highlightCellStrongSelected: 'text-track-a-strong',
    legendDot: 'bg-track-a-cell',
    blob: 'bg-track-a-blob',
    dotSoft: 'bg-track-a-soft border-track-a-accent',
    dotStrong: 'bg-track-a-strong',
    monthText: 'text-track-a-strong',
  },
  trackB: {
    pageFrom: 'bg-track-b-page',
    accentText: 'text-track-b-accent-text',
    accentBg: 'bg-track-b-accent',
    highlightCell: 'bg-track-b-cell',
    highlightCellStrong: 'bg-track-b-strong',
    highlightCellSelected: 'text-track-b-cell',
    highlightCellStrongSelected: 'text-track-b-strong',
    legendDot: 'bg-track-b-cell',
    blob: 'bg-track-b-blob',
    dotSoft: 'bg-track-b-soft border-track-b-accent',
    dotStrong: 'bg-track-b-strong',
    monthText: 'text-track-b-strong',
  },
  trackC: {
    pageFrom: 'bg-track-c-page',
    accentText: 'text-track-c-accent-text',
    accentBg: 'bg-track-c-accent',
    highlightCell: 'bg-track-c-cell',
    highlightCellStrong: 'bg-track-c-strong',
    highlightCellSelected: 'text-track-c-cell',
    highlightCellStrongSelected: 'text-track-c-strong',
    legendDot: 'bg-track-c-cell',
    blob: 'bg-track-c-blob',
    dotSoft: 'bg-track-c-soft border-track-c-accent',
    dotStrong: 'bg-track-c-strong',
    monthText: 'text-track-c-strong',
  },
};

export interface MonthConfig {
  year: number;
  month: number; // 1-12
  titleEn: string;
  titleZh: string;
  // 日 -> { theme（決定顏色）, label（小字，\n 是刻意指定的斷行位置）, trackId（錨點目標）,
  //          href（不是常態課的日子，例如 Workshop，點下去要去別的地方時用，優先於 trackId）,
  //          emphasis（那天是體驗課／Party／Lambada 等特別場次，方塊用深一階的顏色＋手機上的白點）}
  highlights: Record<
    number,
    { theme: ThemeKey; label: string; trackId?: string; href?: string; emphasis?: boolean }
  >;
  legend: { theme: ThemeKey; title: string; desc: string }[];
  footnote: string;
  /** 這個月的 IG 課表海報（public/images/schedule/），顯示在月曆下方，點了放大。沒有就不顯示。 */
  poster?: { src: string; alt: string; width: number; height: number };
}

// 月曆下方的「時間和地點」與星號備註，每個月都一樣，所以集中寫一份。
// 某個月有特殊狀況時，該月的 legend / footnote 可以改成自己的內容。
const TIME_AND_PLACE: MonthConfig['legend'] = [
  { theme: 'trackA', title: 'Hustle', desc: '19:30–22:00・職人棧' },
  { theme: 'trackB', title: 'Zouk', desc: '19:30–23:00・Social Hub' },
];
const FOOTNOTE = '★ 實際場次以 Instagram 公告為準';

/**
 * 月曆上方的顏色圖例（業主 2026/11/19 指定）：藍＝Zouk、藕＝Hustle、青＝Event（原本是金色，2026/11/20 改成墨青綠）。
 * 每個月都一樣，不跟 MonthConfig.legend 走。colorName 給讀屏軟體念，畫面上只顯示圓點＋label。
 */
export const CALENDAR_LEGEND: { theme: ThemeKey; colorName: string; label: string }[] = [
  { theme: 'trackB', colorName: '藍色', label: 'Zouk' },
  { theme: 'trackA', colorName: '藕色', label: 'Hustle' },
  { theme: 'trackC', colorName: '青色', label: 'Event' },
];

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
      // 11/12 中階班之後接體驗課（海報上整段標色），所以也是特別場次
      12: {
        theme: 'trackA',
        label: '中階\n+體驗課',
        trackId: 'hustle-thu',
        emphasis: true,
      },
      13: {
        theme: 'trackB',
        label: '體驗課\n+Party',
        trackId: 'zouk-fri',
        emphasis: true,
      },
      19: { theme: 'trackA', label: 'Hustle', trackId: 'hustle-thu' },
      26: {
        theme: 'trackA',
        label: '體驗課\n+Party',
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
    poster: {
      src: '/images/schedule/2026-11.webp',
      alt: '11 月課表海報：週四 Hustle 職人棧 11/5 停課，11/12 中階課＋體驗課＋練習，11/19 中階課＋練習，11/26 體驗課＋Social；週五 Zouk Social Hub 11/6、11/20 停課，11/13 Zouk 體驗課＋Zouk x Hustle Party，11/27 Lambada 新手班（Fast Track）＋練習',
      width: 1080,
      height: 1527,
    },
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
      // 12/17 Hustle、12/18 Zouk 停課（12/17 是 2026/11/19 新版海報改的），所以不 highlight。
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
    poster: {
      src: '/images/schedule/2026-12.webp',
      alt: '12 月課表海報：週四 Hustle 職人棧 12/3、12/10 中階班＋新手班＋練習，12/17 停課，12/24 體驗課＋練習；週五 Zouk Social Hub 12/4、12/25 新手班＋進階班＋練習，12/11 體驗課＋Party，12/18 停課',
      width: 1080,
      height: 1440,
    },
  },
  {
    year: 2027,
    month: 1,
    titleEn: 'JANUARY',
    titleZh: '一月',
    // TODO: 一月的常態課日期還沒排，排好後把 Hustle / Zouk 的日子加進 highlights，
    //       並拿掉 footnote 裡「確認後更新」那句。
    // 1/23–24 Olga & Fernando 台南 Zouk Weekender：用 trackC（墨青綠）跟常態課的藍、粉分開，
    // 點下去到「活動」分頁看完整資訊（EVENTS 的 id 要跟這裡的錨點一致）。
    highlights: {
      23: {
        theme: 'trackC',
        label: 'Zouk\nWorkshop',
        href: '/courses?tab=events#zouk-atoms-tainan-0123',
        emphasis: true,
      },
      24: {
        theme: 'trackC',
        label: 'Zouk\nWorkshop',
        href: '/courses?tab=events#zouk-atoms-tainan-0123',
        emphasis: true,
      },
    },
    legend: [
      ...TIME_AND_PLACE,
      { theme: 'trackC', title: 'Workshop', desc: '1/23–24・台南 Zouk Weekender' },
    ],
    footnote: '★ 一月常態課日期確認後更新・實際場次以 Instagram 公告為準',
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
      { time: '19:30–20:30', title: 'Hustle 中階班' },
      // 新手班 12/3 才開，11 月週四只有中階班。開課後把 note 刪掉。
      // 新手班頁的資料在 src/data/beginners.ts，時間要跟這裡一致。
      { time: '20:30–21:30', title: 'Hustle 新手班', note: '12/3 開課' },
      // 課後練習報名頁不列（見 TrackEnrollCard 的 classSlots）。全站統一叫「課後練習」，不寫 Practica，也不加舞種名。
      { time: '21:30–22:00', title: '課後練習' },
    ],
    datesTitle: '場次',
    datesNote: '每週四',
    // 跟 track.slots 不一樣的日子寫 slots（照每月 IG 課表海報）；12 月一般週沒寫 = 用 track.slots。
    dates: [
      {
        label: '11/12',
        slots: [
          { time: '19:30–20:30', title: 'Hustle 中階班' },
          { time: '20:30–21:30', title: 'Hustle 體驗課' },
          { time: '21:30–22:00', title: '課後練習' },
        ],
      },
      {
        label: '11/19',
        slots: [
          { time: '19:30–20:30', title: 'Hustle 中階班' },
          { time: '20:30–22:00', title: '課後練習' },
        ],
      },
      {
        label: '11/26',
        note: '體驗課+Party',
        // 體驗課之後一律叫 Party（業主 2026/11/16：Social／練習新生看不懂）。職人棧最晚到 22:00。
        slots: [
          { time: '19:30–20:30', title: 'Hustle 體驗課' },
          { time: '20:30–22:00', title: 'Party' },
        ],
      },
      { label: '12/3' },
      { label: '12/10' },
      { label: '12/17', off: true, note: '停課' },
      {
        label: '12/24',
        note: '體驗＋Party',
        slots: [
          { time: '19:30–20:30', title: 'Hustle 體驗課' },
          { time: '20:30–22:00', title: 'Party' },
        ],
      },
      { label: '12/31', off: true, note: '停課' },
    ],
    venueSlug: 'zhirenzhan',
    pricePlanId: 'hustle-card',
    priceSummary: '課卡制・單堂 $450・4 堂 $1700・8 堂 $3200',
    enrollUrl: 'https://forms.gle/SYm2SMxnT8PoEjFr5',
    // 體驗課卡片的說明一律寫「{開始時間} 開始・新生兩人同行一人免費」（業主 2026/11/16），
    // 時間要跟 startTime、課表當天 slots 第一堂一致。
    trial: {
      title: 'Hustle 體驗課 ＋ Party',
      note: '19:30 開始・新生兩人同行一人免費',
      startTime: '19:30',
      price: 300,
      priceNote: '早鳥 $300・現場 $400',
      // 沿用 10/22、11/26 Hustle 體驗課同一張報名表
      enrollUrl:
        'https://docs.google.com/forms/d/e/1FAIpQLSexxiaDuhCHwDUUWwoiKAG33ZZmdr8ztHYWVaVTnnSZs32ceA/viewform',
    },
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
      // 11 月沒有 Zouk 正式課，新手班 12/4 開。開課後把 note 刪掉。
      { time: '19:30–20:30', title: 'Zouk 新手班', note: '12/4 開課' },
      { time: '20:45–21:45', title: 'Zouk 進階班' },
      { time: '22:00–23:00', title: '課後練習' },
    ],
    datesTitle: '場次',
    // 不寫「某個月沒課」這類會過期的句子：哪幾週有課看下面的圓點就知道。
    datesNote: '每週五',
    dates: [
      // 十一月沒有 Zouk 正式課，週五只有這兩場。
      {
        label: '11/13',
        note: '體驗＋Party',
        slots: [
          { time: '19:30–20:30', title: 'Zouk 體驗課' },
          { time: '20:30–23:00', title: 'Party' },
        ],
      },
      {
        label: '11/27',
        note: 'Lambada',
        detail: '11/27 Lambada Fast Track 19:30–22:00，扣兩堂 Zouk 課卡',
        slots: [
          { time: '19:30–22:00', title: 'Lambada 新手班（Fast Track）' },
          { time: '22:00–23:00', title: '課後練習' },
        ],
        cardNote: 'Lambada 扣兩堂',
      },
      { label: '12/4' },
      {
        label: '12/11',
        note: '體驗＋Party',
        slots: [
          { time: '19:30–20:30', title: 'Zouk 體驗課' },
          { time: '20:30–23:00', title: 'Party' },
        ],
      },
      { label: '12/18', off: true, note: '停課' },
      { label: '12/25' },
    ],
    venueSlug: 'social-hub',
    pricePlanId: 'zouk-card',
    priceSummary: '課卡制・單堂 $450・4 堂 $1700・8 堂 $3200',
    enrollUrl: 'https://forms.gle/SYm2SMxnT8PoEjFr5',
    trial: {
      title: 'Zouk 體驗課 ＋ Zouk / Hustle Party',
      note: '19:30 開始・新生兩人同行一人免費',
      startTime: '19:30',
      price: 300,
      priceNote: '早鳥 $300・現場 $400',
      // 沿用 10/9、11/13 Zouk 體驗課同一張報名表
      enrollUrl:
        'https://docs.google.com/forms/d/e/1FAIpQLSfz7KIFDnDoKzfAj4qvfd1TgqypqWxiiy_5vIkc5BB2F33dyw/viewform',
    },
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
  /** 舞種色：trackA=Hustle、trackB=Zouk，用在報名頁的舞種 chip。Workshop 的日期章與「Workshop」chip
   *  另外固定用 trackC（墨青綠），跟月曆、活動分頁一致，見 EventCard.tsx。 */
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
    title: 'Hustle 體驗課 ＋ Party',
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
    title: 'Hustle 體驗課 ＋ Party',
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
    note: '19:30 開始・新生兩人同行一人免費',
    dateLabel: '11/26',
    weekdayEn: 'THU',
    startTime: '19:30',
    venueSlug: 'zhirenzhan',
    price: 300,
    // 體驗課價格寫法統一為「早鳥 $300・現場 $400」（業主 2026/11/12 指定）
    priceNote: '早鳥 $300・現場 $400',
    // 同類型的報名表沿用（跟 10/22 Hustle 體驗課同一張）
    enrollUrl:
      'https://docs.google.com/forms/d/e/1FAIpQLSexxiaDuhCHwDUUWwoiKAG33ZZmdr8ztHYWVaVTnnSZs32ceA/viewform',
  },
  {
    // 職人棧最晚到 22:00（業主 2026/11/16），說明寫清楚結束時間
    id: 'hustle-trial-1224',
    kind: 'trial',
    theme: 'trackA',
    danceStyle: 'Hustle',
    title: 'Hustle 體驗課 ＋ Party',
    note: '19:30 開始・新生兩人同行一人免費',
    dateLabel: '12/24',
    weekdayEn: 'THU',
    startTime: '19:30',
    venueSlug: 'zhirenzhan',
    price: 300,
    priceNote: '早鳥 $300・現場 $400',
    enrollUrl:
      'https://docs.google.com/forms/d/e/1FAIpQLSexxiaDuhCHwDUUWwoiKAG33ZZmdr8ztHYWVaVTnnSZs32ceA/viewform',
  },
  {
    id: 'zouk-trial-1113',
    kind: 'trial',
    theme: 'trackB',
    danceStyle: 'Brazilian Zouk',
    title: 'Zouk 體驗課 ＋ Zouk / Hustle Party',
    note: '19:30 開始・新生兩人同行一人免費',
    dateLabel: '11/13',
    weekdayEn: 'FRI',
    startTime: '19:30',
    venueSlug: 'social-hub',
    // 以報名表為準：11/12 23:59 前報名 $300，現場 $400
    price: 300,
    priceNote: '早鳥 $300・現場 $400',
    // 同類型的報名表沿用（跟 10/9 Zouk 體驗課同一張）
    enrollUrl:
      'https://docs.google.com/forms/d/e/1FAIpQLSfz7KIFDnDoKzfAj4qvfd1TgqypqWxiiy_5vIkc5BB2F33dyw/viewform',
  },
  {
    // 課程資訊頁「活動」分頁的完整介紹在 src/data/workshops.ts（用同一個 id 對應）；
    // 一月月曆 1/23、1/24 的格子也連到這個 id。
    id: 'zouk-atoms-tainan-0123',
    kind: 'workshop',
    theme: 'trackB',
    danceStyle: 'Brazilian Zouk',
    title: 'Olga & Fernando Tainan Zouk Weekender',
    note: '外師 Olga & Fernando・兩天工作坊＋晚上派對・台南 Baila\'more 舞蹈教室',
    year: 2027,
    dateLabel: '1/23',
    endDateLabel: '1/24',
    weekdayEn: 'SAT',
    // 場地在台南的合作教室，不是我們的據點，所以不填 venueSlug（也就不輸出 Event 結構化資料，
    // 避免 Google 把台南的地址當成我們的教室）。
    price: 3200,
    // TODO: 12/31 早鳥結束後改成「Full Pass $3600・單日 $2200」（活動分頁的方案卡會自動切換，這行要手動改）
    priceNote: '早鳥 Full Pass $3200・單日 $2000（12/31 前）',
    enrollUrl: 'https://sd-event.vercel.app/e/uwhs0v7w',
  },
];

const WEEKDAY_EN_SHORT: Record<string, string> = {
  SUNDAY: 'SUN',
  MONDAY: 'MON',
  TUESDAY: 'TUE',
  WEDNESDAY: 'WED',
  THURSDAY: 'THU',
  FRIDAY: 'FRI',
  SATURDAY: 'SAT',
};

function isTrialDate(date: SessionDate): boolean {
  return !date.off && !!date.note?.includes('體驗');
}

/** 某條線某一天的體驗課：EVENTS 有手寫的那筆就用它，沒有就用 Track.trial 自動產生。 */
function trialFor(track: Track, date: SessionDate): EnrollEvent {
  const manual = EVENTS.find(
    (e) => e.kind === 'trial' && e.theme === track.theme && e.dateLabel === date.label
  );
  if (manual) return manual;
  const [month, day] = date.label.split('/');
  return {
    id: `${track.id}-trial-${month}${day?.padStart(2, '0')}`,
    kind: 'trial',
    theme: track.theme === 'trackB' ? 'trackB' : 'trackA',
    danceStyle: track.danceStyle,
    title: track.trial.title,
    note: track.trial.note,
    dateLabel: date.label,
    weekdayEn: WEEKDAY_EN_SHORT[track.sessionLabelEn] ?? track.sessionLabelEn.slice(0, 3),
    startTime: track.trial.startTime,
    venueSlug: track.venueSlug,
    price: track.trial.price,
    priceNote: track.trial.priceNote,
    enrollUrl: track.trial.enrollUrl,
  };
}

/**
 * EVENTS ＋ 課表上標了「體驗」但 EVENTS 沒寫的場次。
 * 首頁、報名頁、結構化資料都讀這個，課表加一個體驗課日期，其他地方就自動同步。
 */
export const ALL_EVENTS: EnrollEvent[] = [
  ...EVENTS,
  ...TRACKS.flatMap((track) =>
    track.dates
      .filter(isTrialDate)
      .map((date) => trialFor(track, date))
      .filter((event) => !EVENTS.includes(event))
  ),
];

/**
 * 課表卡的日期圓點點下去要去的報名表：體驗課那天 → 體驗課表單，
 * 一般上課日 → 常態課卡表單，停課 → 沒有連結。
 */
export function getDateEnrollUrl(track: Track, date: SessionDate): string | null {
  if (date.off) return null;
  if (isTrialDate(date)) return trialFor(track, date).enrollUrl || null;
  return track.enrollUrl || null;
}

/**
 * 月曆點某一天 → 「當天課表」要顯示的內容：時段、要按哪顆按鈕。
 * 體驗課 → 報名那一場體驗課；一般上課日、Lambada → 購買該舞種課卡；停課 → 沒有按鈕。
 */
export function getDayPlan(
  track: Track,
  date: SessionDate
): {
  slots: TimeSlot[];
  trial: EnrollEvent | null;
  cta: { label: string; href: string; kind: 'trial' | 'card' } | null;
} {
  if (date.off) return { slots: [], trial: null, cta: null };
  const style = track.danceStyle.replace('Brazilian ', '');
  if (isTrialDate(date)) {
    const trial = trialFor(track, date);
    return {
      slots: date.slots ?? [],
      trial,
      cta: trial.enrollUrl
        ? { label: `報名 ${date.label} ${style} 體驗課`, href: trial.enrollUrl, kind: 'trial' }
        : null,
    };
  }
  const slots = date.slots ?? track.slots;
  return {
    slots,
    trial: null,
    cta: track.enrollUrl
      ? {
          label: `購買 ${style} 課卡${date.cardNote ? `（${date.cardNote}）` : ''}`,
          href: track.enrollUrl,
          kind: 'card',
        }
      : null,
  };
}

const WEEKDAY_ZH = ['日', '一', '二', '三', '四', '五', '六'];

/** '12/3' → '12/3（四）'。報名頁的「下一堂」用。 */
export function formatSessionDate(date: SessionDate): string {
  const d = toDate(date.label, MONTH.year);
  return d ? `${date.label}（${WEEKDAY_ZH[d.getDay()]}）` : date.label;
}

/**
 * 老手報名課卡時最想知道的兩件事：下一堂是哪天、接下來有沒有停課。
 * now 由呼叫端給（掛載後才算），理由同 getUpcomingEvents。
 */
export function getTrackOutlook(
  track: Track,
  now: Date
): { next: SessionDate | null; nextOff: SessionDate | null } {
  const ahead = track.dates.filter((d) => getSessionStatus(d, now) !== 'done');
  return {
    next: ahead.find((d) => !d.off && !d.upcoming) ?? null,
    nextOff: ahead.find((d) => d.off) ?? null,
  };
}

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
  return ALL_EVENTS.filter((event) => {
    if (event.kind !== kind) return false;
    if (!event.enrollUrl) return false;
    const lastDay = event.endDateLabel ?? event.dateLabel;
    return !isPast(lastDay, getEventYear(event), now);
  }).sort((a, b) => sortKey(a) - sortKey(b));
}

/**
 * 一串活動共同的開始時間與價格（每一場都一樣才算）。
 * 報名頁、新手入門頁用它把「19:30 開始・早鳥 $300」寫在區塊標題一次，卡片不再每張重複；
 * 某一場不一樣時對應欄位回傳 null，那就照舊每張卡各自顯示。
 */
export function getCommonEventInfo(events: EnrollEvent[]): {
  startTime: string | null;
  priceNote: string | null;
} {
  const same = (pick: (e: EnrollEvent) => string | undefined) => {
    const first = events[0] ? pick(events[0]) : undefined;
    return first && events.every((e) => pick(e) === first) ? first : null;
  };
  return { startTime: same((e) => e.startTime), priceNote: same((e) => e.priceNote) };
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
  badge?: string; // 方案特色標籤，例如 '★ 最受新手歡迎'
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
          { name: 'Hustle 中階班', theme: 'trackA' },
          { name: 'Hustle 新手班', theme: 'trackA' },
        ],
        options: [
          { name: '單堂', price: 450 },
          { name: '4 堂課卡', price: 1700, badge: '★ 最受新手歡迎' },
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
          { name: 'Zouk 新手班', theme: 'trackB' },
          { name: 'Zouk 進階班', theme: 'trackB' },
        ],
        options: [
          { name: '單堂', price: 450 },
          { name: '4 堂課卡', price: 1700, badge: '★ 最受新手歡迎' },
          { name: '8 堂課卡', price: 3200 },
        ],
      },
    ],
    // TODO: 補上課卡的使用規則（有效期限、可否插班、能不能跟別人共用）。
  },
];
