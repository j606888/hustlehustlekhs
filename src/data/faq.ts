import { LINKS } from '@/constants/links';

// 常見問題的單一資料來源。顯示在首頁最下方，同時產生 FAQPage 結構化資料。
//
// answer 是 Markdown：可以用 [文字](/連結) 做站內連結、空一行分段。
// published: false 的問題不會顯示。
// defaultOpen: true 的問題在首頁一打開就是展開的 —— 留給第一次來的人最在意的幾題
// （沒經驗、沒舞伴、下班來、多少錢），不用一題一題點開才看得到。

export interface Faq {
  id: string; // React key 用的穩定字串
  question: string;
  answer: string; // Markdown
  sortOrder: number;
  published: boolean;
  defaultOpen?: boolean;
}

export const FAQS: Faq[] = [
  {
    id: 'no-experience',
    question: '沒有舞蹈經驗可以嗎？',
    answer: '可以！我們的課程從零開始教，不需要任何舞蹈基礎。大部分學員第一次來，也都是完全沒跳過舞。',
    sortOrder: 1,
    published: true,
    defaultOpen: true,
  },
  {
    id: 'no-partner',
    question: '沒有舞伴可以嗎？',
    answer:
      '可以的！上課時老師會帶大家輪流換舞伴，每個人都會跟不同的人練習，不用自己找舞伴，一個人來也不尷尬。',
    sortOrder: 2,
    published: true,
    defaultOpen: true,
  },
  {
    id: 'office-workers',
    question: '上班族只是下班想動一動適合嗎？',
    answer:
      '非常適合！課程都在平日晚上 19:30 開始（週四 Hustle、週五 Zouk），下班直接來就好。很多學員也是從「想動一動」開始，結果一跳就停不下來。',
    sortOrder: 3,
    published: true,
    defaultOpen: true,
  },
  {
    // 價格要跟 schedule/data.ts 的 priceSummary、PRICE_PLANS 一致，改價時兩邊一起改。
    id: 'course-fee',
    question: '課程費用怎麼算？',
    answer: `常態課是課卡制：**單堂 $450、8 堂 $3200**。體驗課的價格依場次而定。完整方案請看[課程費用](${LINKS.PRICING})。`,
    sortOrder: 4,
    published: true,
    defaultOpen: true,
  },
  {
    id: 'vs-ballroom',
    question: '社交舞和國標差在哪？',
    answer:
      '國標多以固定套路和比賽為主；我們教的 Hustle 跟 Zouk 是即興的雙人社交舞，不用背舞碼，學會基本動作就能在舞會上跟不同舞伴自由跳舞。',
    sortOrder: 5,
    published: true,
  },
  {
    id: 'experienced',
    question: '跳過其他社交舞，可以直接上進階班嗎？',
    answer:
      '不行喔，所有人都從初階開始。Zouk 分初階班和進階班，在初階把基礎打好之後再升上進階，練起來會更扎實。',
    sortOrder: 6,
    published: true,
  },
  {
    id: 'practice-party',
    question: '除了上課，有地方練習或跳舞嗎？',
    answer:
      '有！週四有 Hustle 課後練習（20:30–22:00），週五有 Zouk 課後練習（22:00–23:00）。體驗課當天上完課會接著辦 Party，實際場次以 Instagram 公告為準。',
    sortOrder: 7,
    published: true,
  },
  {
    // 兩個舞風各自連到風格介紹頁的對應區塊（Introduction.tsx 的 DANCE_STYLES id）。
    id: 'dance-styles',
    question: '我們有教什麼舞風？',
    answer:
      '我們有教 [Hustle](/courses?tab=introduction#hustle) 跟 [Brazilian Zouk](/courses?tab=introduction#zouk)，想了解更多可以看[課程資訊](/courses?tab=introduction)裡的風格介紹。',
    sortOrder: 8,
    published: true,
  },
  {
    id: 'how-to-join',
    question: '要怎麼報名？',
    answer:
      `到[課程報名](${LINKS.ENROLL})頁面，選你想上的課、填表單就完成報名。因為場地大小有限，每堂課都有名額限制，建議先報名預約。體驗課、常態課卡與客座 Workshop 的報名連結都在那一頁；不確定該選哪一種，也可以直接 [Instagram 私訊我們](${LINKS.INSTAGRAM_DM})。`,
    sortOrder: 9,
    published: true,
  },
];

export function getPublishedFaqs(): Faq[] {
  return FAQS.filter((f) => f.published).sort((a, b) => a.sortOrder - b.sortOrder);
}
