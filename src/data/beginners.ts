import type { VenueSlug } from '@/data/venues';
import type { ThemeKey } from '@/components/courses/schedule/data';

// 「零基礎新手班」頁（/beginners）的資料。
//
// 每期新手班開課時，在這裡改日期、換海報即可；海報放在 public/images/beginners/。
// 報名（購買課卡）連結與價格不寫在這裡，透過 trackId 取對應常態課 TRACKS 的
// enrollUrl / priceSummary —— 課卡連結只有一個來源，換連結時不會漏改。
//
// 這頁不會自動把已開課的班藏起來（頁面是靜態產生的，用日期判斷會在部署當下就定住），
// 新一期開課時記得把舊的刪掉或改日期。全部刪光時頁面會顯示「下一期籌備中」。

export type BeginnerClass = {
  id: string; // 錨點 id
  danceStyle: string; // 'Hustle'
  level: string; // 'Level 1'
  theme: ThemeKey; // 跟課表同一組舞種色
  trackId: string; // 對應 TRACKS 的 id，用來取課卡連結與價格
  startDateLabel: string; // '12/3'
  weekdayZh: string; // '週四'
  time: string; // '20:30–21:30'
  venueSlug: VenueSlug;
  poster: string; // '/images/beginners/xxx.webp'，直式 1080×1350
  posterAlt: string;
};

export const BEGINNER_CLASSES: BeginnerClass[] = [
  {
    id: 'hustle-level1',
    danceStyle: 'Hustle',
    level: 'Level 1',
    theme: 'trackA',
    trackId: 'hustle-thu',
    startDateLabel: '12/3',
    weekdayZh: '週四',
    time: '20:30–21:30',
    venueSlug: 'zhirenzhan',
    poster: '/images/beginners/hustle-level1.webp',
    posterAlt: 'Hustle Level 1 新手班海報：12/3 開始，每週四 20:30–21:30，地點職人棧',
  },
  {
    id: 'zouk-level1',
    danceStyle: 'Zouk',
    level: 'Level 1',
    theme: 'trackB',
    trackId: 'zouk-fri',
    startDateLabel: '12/4',
    weekdayZh: '週五',
    time: '19:30–20:30',
    venueSlug: 'social-hub',
    poster: '/images/beginners/zouk-level1.webp',
    posterAlt: 'Zouk Level 1 新手班海報：12/4 開始，每週五 19:30–20:30，地點 Social Hub',
  },
];
