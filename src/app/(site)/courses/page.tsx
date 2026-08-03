import type { Metadata } from 'next';
import { Suspense } from 'react';
import CoursesContent from './CoursesContent';

// 課表、費用、風格介紹三個 tab 的資料都在 src/components/courses/schedule/data.ts
// 與 src/components/courses/Introduction.tsx，沒有 DB、沒有 API。

// TODO: 等實際課表確定後改寫這段描述（會出現在 Google 搜尋結果）。
const DESCRIPTION =
  '查看 HustleHustle KHS 的課表、Hustle 風格介紹與課程費用。高雄定期開課，零基礎歡迎、不需舞伴即可報名。';

export const metadata: Metadata = {
  title: '課程資訊・高雄 Hustle 課表',
  description: DESCRIPTION,
  alternates: { canonical: '/courses' },
  openGraph: {
    title: '課程資訊・高雄 Hustle 課表 | HustleHustle KHS',
    description: DESCRIPTION,
    url: '/courses',
  },
};

export default function CoursesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CoursesContent />
    </Suspense>
  );
}
