import type { Metadata } from 'next';
import Link from 'next/link';
import JsonLd from '@/components/JsonLd';
import SectionHeading from '@/components/SectionHeading';
import BeginnerClassCard from '@/components/beginners/BeginnerClassCard';
import BeginnerSwitcher from '@/components/beginners/BeginnerSwitcher';
import { Button } from '@/components/ui/button';
import { BEGINNER_CLASSES } from '@/data/beginners';
import { LINKS } from '@/constants/links';
import { breadcrumbJsonLd } from '@/lib/jsonLd';

// 零基礎新手班。首頁 Hero 的「查看即將開課」與導覽列都指向這裡，
// 也適合直接貼在 IG 限動／廣告。資料在 src/data/beginners.ts。

const DESCRIPTION =
  '高雄 Hustle 與 Brazilian Zouk 零基礎新手班（Level 1）：Hustle 12/3 起每週四在左營職人棧、Zouk 12/4 起每週五在三民 Social Hub。沒經驗、沒舞伴都可以，線上購買課卡即可上課。';

export const metadata: Metadata = {
  title: '零基礎新手班・高雄 Hustle / Zouk Level 1',
  description: DESCRIPTION,
  alternates: { canonical: '/beginners' },
  openGraph: {
    title: '零基礎新手班・高雄 Hustle / Zouk Level 1 | Hustlehustlekhs',
    description: DESCRIPTION,
    url: '/beginners',
  },
};

export default function BeginnersPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: '首頁', path: '/' },
          { name: '新手入門', path: '/beginners' },
        ])}
      />
      <div className="w-full px-4 py-10 flex flex-col items-center md:px-6">
        <SectionHeading
          as="h1"
          size="lg"
          eyebrow="新手入門"
          title="體驗課與零基礎新手班"
          subtitle="沒跳過舞、沒有舞伴都可以。先來一次體驗課，喜歡再上每週的新手班。"
        />
      </div>

      <section className="mx-auto w-full max-w-4xl px-4 pb-16 md:px-6">
        {/* 上面兩張步驟卡可以點：體驗課 → 近期場次；新手班 → 海報卡 */}
        <BeginnerSwitcher
          level1Panel={
            BEGINNER_CLASSES.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {BEGINNER_CLASSES.map((item) => (
                  <BeginnerClassCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <p className="text-center text-ink-600">
                下一期新手班籌備中，想第一時間知道開課日期，歡迎私訊我們。
              </p>
            )
          }
        />

        <div className="mt-10 flex flex-col items-center gap-3 rounded-lg bg-ink-50 px-5 py-6 text-center">
          <p className="text-sm text-ink-700">
            還有疑問？要穿什麼、要不要帶舞伴，先看{' '}
            <Link href={LINKS.FAQ} className="text-link">
              常見問題
            </Link>
            ，或直接問我們。
          </p>
          <Button asChild variant="link">
            <a href={LINKS.INSTAGRAM_DM} target="_blank" rel="noopener noreferrer">
              IG 私訊詢問
            </a>
          </Button>
        </div>
      </section>
    </>
  );
}
