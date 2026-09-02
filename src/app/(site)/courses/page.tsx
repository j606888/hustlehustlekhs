import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import CoursesContent from './CoursesContent';
import { TRACKS } from '@/components/courses/schedule/data';
import { breadcrumbJsonLd, courseJsonLd } from '@/lib/jsonLd';

// 課表、費用、風格介紹三個 tab 的資料都在 src/components/courses/schedule/data.ts
// 與 src/components/courses/Introduction.tsx，沒有 DB、沒有 API。
//
// 這裡刻意「不」用 <Suspense> 包 CoursesContent：包了的話 Next.js 靜態產生時
// 會在邊界放棄預渲染，產出的 HTML 只剩 fallback，課表／價格／舞風介紹全部
// 看不到（AI 搜尋的爬蟲多半不跑 JS，等於整頁是空的）。
// CoursesContent 也因此不能用 useSearchParams —— 詳見該檔案的註解。

const DESCRIPTION =
  '高雄唯一同時教 Hustle 與 Brazilian Zouk 的雙人舞課程：週四晚上在左營區職人棧上 Hustle、週五晚上在三民區 Social Hub 上 Zouk。單堂 $450、8 堂課卡 $3200，零基礎歡迎、不需舞伴。';

export const metadata: Metadata = {
  title: '課程資訊・高雄 Hustle / Zouk 雙人舞課表',
  description: DESCRIPTION,
  alternates: { canonical: '/courses' },
  openGraph: {
    title: '課程資訊・高雄 Hustle / Zouk 雙人舞課表 | Hustlehustlekhs',
    description: DESCRIPTION,
    url: '/courses',
  },
};

export default function CoursesPage() {
  return (
    <>
      <JsonLd
        data={[
          ...TRACKS.map(courseJsonLd),
          breadcrumbJsonLd([
            { name: '首頁', path: '/' },
            { name: '課程資訊', path: '/courses' },
          ]),
        ]}
      />
      <CoursesContent />
    </>
  );
}
