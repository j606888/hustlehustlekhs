// 老師資料的單一資料來源。新增/編輯老師只要改 TEACHERS 這個陣列。
//
// 排序由 sortOrder 決定（小的在前）。/teachers 頁會把第一位做成橫幅大卡，
// 其餘排成等寬卡片，所以想主打誰就給誰 sortOrder: 0。
// published: false 的老師不會出現在列表、個人頁與 sitemap。

export interface Teacher {
  slug: string; // 網址用，例如 /teachers/sean
  name: string;
  title?: string; // 職稱小字，例如「創辦人」
  imageUrl: string; // /public 下的路徑或外部 URL
  instagram?: string; // IG 帳號（不含 @）
  skills: string[]; // 專長標籤
  courses: string[]; // 授課項目
  description: string[]; // 多段簡介，第一段會被拿去當卡片摘要與 JSON-LD 的 description
  videos: string[]; // YouTube embed 連結，或影片檔網址
  sortOrder: number; // 列表排序（小的在前，第一位為列表大卡）
  published: boolean;
}

// TODO: 三位助教（小杜、乙杰、丁丁）的照片已經放在 public/teachers/ 底下
//   （xiaodu.jpg、yijie.jpg、dingding.jpg），但目前的資料結構只有「老師」，
//   還沒有「助教」欄位/分區。等要把助教也放上 /teachers 頁時，再回來加。
export const TEACHERS: Teacher[] = [
  {
    slug: 'yangyang',
    name: '暘暘',
    title: '創辦人',
    imageUrl: '/teachers/yangyang.jpg',
    instagram: undefined,
    skills: ['Hustle', 'Brazilian Zouk'],
    courses: ['Hustle', 'Brazilian Zouk'],
    description: [
      '擁有20多年的舞蹈經歷，從民俗舞蹈、爵士舞、街舞一路探索至社交舞，涉獵多元舞蹈風格，並專精於 Hustle 與 Brazilian Zouk。',
      '2020年與又嘉共同於高雄創立 Hustlehustlekhs，累積多年舞蹈教學經驗。教學風格輕鬆且注重理解，擅長將複雜動作拆解成清楚易懂的步驟，並透過明確的動作指引，幫助學員掌握身體運用與舞蹈邏輯，讓學習舞蹈不只輕鬆，更能真正跳得自在。',
    ],
    videos: [],
    sortOrder: 0,
    published: true,
  },
  {
    slug: 'youjia',
    name: '又嘉',
    title: '創辦人',
    imageUrl: '/teachers/youjia.jpg',
    instagram: undefined,
    skills: ['Hustle', 'Brazilian Zouk'],
    courses: ['Hustle', 'Brazilian Zouk'],
    description: [
      '大約10年的舞蹈經歷，從大學學習街舞開始，到畢業後接觸社交舞大約7年，專精於 Hustle 與 Brazilian Zouk。',
      '2020年與暘暘共同於高雄創立 Hustlehustlekhs，教學風格清晰簡單，擅長將雙人舞遊戲化，並透過明確的規則與概念，幫助學員掌握不同舞蹈的身體運用方式，有效避免受傷的同時，讓學習舞蹈的過程輕鬆升級，更能跳得好玩並自在。',
    ],
    videos: [],
    sortOrder: 1,
    published: true,
  },
];

export function getPublishedTeachers(): Teacher[] {
  return TEACHERS.filter((t) => t.published).sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getPublishedTeacherSlugs(): { slug: string }[] {
  return getPublishedTeachers().map((t) => ({ slug: t.slug }));
}

export function getTeacherBySlug(slug: string): Teacher | undefined {
  return TEACHERS.find((t) => t.slug === slug);
}

// 助教：只在 /teachers 列表頁露出照片＋名字，沒有個人頁（沒有簡介/專長等資料）。
// 之後若要幫助教做個人頁，再把這幾位併回 TEACHERS 補齊欄位即可。
export interface Assistant {
  slug: string;
  name: string;
  imageUrl: string;
  sortOrder: number;
  published: boolean;
}

export const ASSISTANTS: Assistant[] = [
  { slug: 'xiaodu', name: '小杜', imageUrl: '/teachers/xiaodu.jpg', sortOrder: 0, published: true },
  { slug: 'yijie', name: '乙杰', imageUrl: '/teachers/yijie.jpg', sortOrder: 1, published: true },
  { slug: 'dingding', name: '丁丁', imageUrl: '/teachers/dingding.png', sortOrder: 2, published: true },
];

export function getPublishedAssistants(): Assistant[] {
  return ASSISTANTS.filter((a) => a.published).sort((a, b) => a.sortOrder - b.sortOrder);
}
