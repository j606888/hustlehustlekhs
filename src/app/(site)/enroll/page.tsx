import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import SectionHeading from '@/components/SectionHeading';
import EnrollBoard from '@/components/enroll/EnrollBoard';
import { EVENTS } from '@/components/courses/schedule/data';
import { breadcrumbJsonLd, eventJsonLd, type JsonLd as JsonLdData } from '@/lib/jsonLd';

// 報名頁。這一頁取代原本的 bio.site 連結頁，IG bio 指向這裡。
//
// 資料全部來自 src/components/courses/schedule/data.ts：
// 體驗課與 Workshop 是 EVENTS，常態課是 TRACKS（報名連結存在 Track.enrollUrl）。
// 這頁刻意「只做報名」—— 課表、費用、風格介紹留在 /courses，不要在這裡重複。

const DESCRIPTION =
  '高雄 Hustle 與 Brazilian Zouk 課程報名：週四 Hustle、週五 Zouk 常態課（單堂 $450、8 堂課卡 $3200），另有不定期體驗課與國際老師客座 Workshop。零基礎歡迎、不需舞伴，線上填表即可報名。';

export const metadata: Metadata = {
  title: '課程報名・高雄 Hustle / Zouk 體驗課與課卡',
  description: DESCRIPTION,
  alternates: { canonical: '/enroll' },
  openGraph: {
    title: '課程報名・高雄 Hustle / Zouk 體驗課與課卡 | Hustlehustlekhs',
    description: DESCRIPTION,
    url: '/enroll',
  },
};

export default function EnrollPage() {
  // 場地未定的活動不會產生 Event 結構化資料（eventJsonLd 回傳 null）
  const events = EVENTS.map(eventJsonLd).filter(
    (data): data is JsonLdData => data !== null
  );

  return (
    <>
      <JsonLd
        data={[
          ...events,
          breadcrumbJsonLd([
            { name: '首頁', path: '/' },
            { name: '課程報名', path: '/enroll' },
          ]),
        ]}
      />
      <div className="w-full px-4 py-10 flex flex-col items-center justify-center md:px-6">
        <SectionHeading
          as="h1"
          size="lg"
          eyebrow="體驗課・課卡・Workshop"
          title="課程報名"
        />
      </div>
      <EnrollBoard />
    </>
  );
}
