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

// TODO: 以下兩筆全部是佔位資料。
//   1. 照片放到 public/teachers/ 底下，再把 imageUrl 指過去
//      （沒有照片就維持 /placeholder.svg，不會破圖）
//   2. slug 換成老師的英文名（會變成網址 /teachers/xxx，之後最好別再改，
//      改了舊連結會 404）
//   3. videos 留空陣列即可，個人頁的影片區塊會自動不顯示
export const TEACHERS: Teacher[] = [
  {
    slug: 'teacher-1',
    name: '老師一',
    title: '創辦人',
    imageUrl: '/placeholder.svg',
    instagram: undefined,
    skills: ['Hustle'],
    courses: ['Hustle Lv1', 'Hustle Lv2'],
    description: [
      '這裡放老師的簡介第一段：跳舞資歷、教學風格、擅長什麼。這一段也會被拿去當列表卡片的摘要與搜尋結果的描述，所以寫得具體一點比較好。',
      '第二段可以寫教學理念，或是想跟學生說的話。段落數量不限，照需要增減。',
    ],
    videos: [],
    sortOrder: 0,
    published: true,
  },
  {
    slug: 'teacher-2',
    name: '老師二',
    imageUrl: '/placeholder.svg',
    instagram: undefined,
    skills: ['Hustle'],
    courses: ['Hustle 基礎'],
    description: ['這裡放老師的簡介。'],
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
