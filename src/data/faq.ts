// 常見問題的單一資料來源。顯示在首頁最下方，同時產生 FAQPage 結構化資料。
//
// answer 是 Markdown：可以用 [文字](/連結) 做站內連結、空一行分段。
// published: false 的問題不會顯示。

export interface Faq {
  id: string; // React key 用的穩定字串
  question: string;
  answer: string; // Markdown
  sortOrder: number;
  published: boolean;
}

// TODO: 以下是通用佔位問答，請依 HustleHustle KHS 實際情況改寫。
//       這一區直接影響「要不要來上課」的決策，值得花時間寫。
export const FAQS: Faq[] = [
  {
    id: 'no-experience',
    question: '沒有舞蹈經驗可以嗎？',
    answer: '可以！我們的課程從零開始教，不需要任何舞蹈基礎。',
    sortOrder: 1,
    published: true,
  },
  {
    id: 'no-partner',
    question: '沒有舞伴可以嗎？',
    answer: '可以的！上課過程中舞伴會不斷輪替，不用擔心沒有人可以練習。',
    sortOrder: 2,
    published: true,
  },
  {
    id: 'what-is-hustle',
    question: 'Hustle 是什麼樣的舞？',
    answer:
      'Hustle 是一種雙人社交舞，配 disco、funk 或流行音樂都很合，節奏明快、旋轉多。\n\n想了解更多可以看[課程資訊](/courses)裡的風格介紹。',
    sortOrder: 3,
    published: true,
  },
  {
    id: 'course-fee',
    question: '課程費用怎麼算？',
    answer: '費用與課卡方案請參考[課程資訊](/courses?tab=pricing)。',
    sortOrder: 4,
    published: true,
  },
  {
    id: 'how-to-join',
    question: '要怎麼報名？',
    answer:
      '直接 Instagram 私訊我們就可以了，告訴我們你想上哪一堂課，我們會回覆你細節。',
    sortOrder: 5,
    published: true,
  },
];

export function getPublishedFaqs(): Faq[] {
  return FAQS.filter((f) => f.published).sort((a, b) => a.sortOrder - b.sortOrder);
}
