// 客座 Workshop 的完整介紹，顯示在 /courses?tab=events（「活動」分頁）。
//
// 日期、標題、報名連結這些「報名頁也要用」的資料在 schedule/data.ts 的 EVENTS；
// 這裡只放介紹、時間表、方案這些比較長的內容，用 EVENTS 的 id 對應。
// 活動辦完後 EVENTS 會自動把它藏起來，這裡的資料可以留著不用刪。
//
// 注意：地址是合作場地的地址，不是我們的上課據點，所以寫在這裡而不放進 venues.ts
// （venues.ts 是我們自己教室地址的唯一來源，混進別人的地址會讓 Google 搞混）。

export interface WorkshopPass {
  name: string;
  note: string; // 例如「兩天全部課程＋派對」「1/23（六）」
  price: number; // 早鳥價（沒有早鳥就是一般價）
  originalPrice?: number; // 原價：早鳥期間劃掉顯示，早鳥過後自動改顯示這個價格
}

export interface WorkshopDetail {
  eventId: string; // 對應 EVENTS 的 id
  subtitle: string; // 例如外師名字
  intro: string[]; // 多段介紹
  venueName: string;
  venueAddress: string;
  highlights: string[]; // 活動內容重點
  schedule: { day: string; items: { time: string; title: string }[] }[];
  passes: WorkshopPass[];
  /** 早鳥最後一天（含），'YYYY-MM-DD'。過了這天，方案改顯示原價、早鳥字樣自動拿掉。 */
  earlyBirdUntil?: string;
}

export const WORKSHOP_DETAILS: WorkshopDetail[] = [
  {
    eventId: 'zouk-atoms-tainan-0123',
    // 標題（EVENTS.title）已經有外師名字和 Weekender，這行不要再重複。
    subtitle: '台南第一場 Zouk Workshop・兩天課程＋兩場派對',
    intro: [
      '台南的第一場 Zouk Workshop！外師 Olga & Fernando 來到台南，帶你從 Zouk 的基礎延伸出更多變化，接著進入他們研發的 Zouk Atoms 概念，讓你在 Social 時擁有更多流動性與自由度。',
      '跳完舞，順便來探索台南的在地美食吧！',
    ],
    venueName: "Baila'more 舞蹈教室",
    venueAddress: '台南市民族路二段45號2F（入口在巷子，萬昌起義對面）',
    highlights: ['Zouk 基礎與延伸變化', 'Zouk Atoms 概念入門', '2 天工作坊（每天 2.5 小時）＋ 2 場晚上派對'],
    schedule: [
      {
        day: '1/23（六）',
        items: [
          { time: '14:00–15:15', title: 'Workshop 1' },
          { time: '15:45–17:00', title: 'Workshop 2' },
          { time: '19:00–22:00', title: '晚上派對' },
        ],
      },
      {
        day: '1/24（日）',
        items: [
          { time: '14:00–15:15', title: 'Workshop 3' },
          { time: '15:45–17:00', title: 'Workshop 4' },
          { time: '18:00–21:00', title: '晚上派對' },
        ],
      },
    ],
    passes: [
      { name: 'Full Pass', note: '兩天全部課程＋派對', price: 3200, originalPrice: 3600 },
      { name: 'Day 1 Pass', note: '1/23（六）', price: 2000, originalPrice: 2200 },
      { name: 'Day 2 Pass', note: '1/24（日）', price: 2000, originalPrice: 2200 },
    ],
    earlyBirdUntil: '2026-12-31',
  },
];

export function getWorkshopDetail(eventId: string): WorkshopDetail | undefined {
  return WORKSHOP_DETAILS.find((w) => w.eventId === eventId);
}
