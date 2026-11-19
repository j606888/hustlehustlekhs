import Image from 'next/image';
import Link from 'next/link';
import SectionHeading from '@/components/SectionHeading';
import { Button } from '@/components/ui/button';
import { LINKS } from '@/constants/links';
import type { Venue } from '@/data/venues';
import type { Track } from '@/components/courses/schedule/data';

// 據點頁的版面。目前兩個據點都在同一頁（/location），每個據點一張卡，
// 卡片本身就是「哪一天、在哪間教室、上什麼、多少錢、怎麼去」的完整答案。
//
// 刻意不放 Google Maps iframe：地圖大圖會把版面推長、拖慢載入，而手機上
// 客人真正會做的動作是「點開 Google Maps 導航」，所以只留一個標明教室名稱的連結。
type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  /** 每個據點 + 它的課程 track（順序就是頁面上的顯示順序） */
  venues: { venue: Venue; tracks: Track[] }[];
  /** 標題下方的一段話，承載該城市的關鍵字。保持精簡。 */
  intro?: string;
  /** 場地照片 */
  photo?: { src: string; alt: string; caption?: React.ReactNode };
  /** 據點卡之前插入的額外內容（例如找路影片、注意事項） */
  children?: React.ReactNode;
  /** 據點卡之後的小須知 */
  notes?: { question: string; answer: React.ReactNode }[];
};

export default function VenueDetail({
  eyebrow,
  title,
  subtitle,
  venues,
  intro,
  photo,
  children,
  notes,
}: Props) {
  return (
    <div className="mx-auto flex flex-col items-center justify-center gap-8 px-3 py-6 md:max-w-4xl md:px-6">
      <SectionHeading
        as="h1"
        size="lg"
        eyebrow={eyebrow}
        title={title}
        subtitle={subtitle}
        className="py-2 md:py-4"
      />

      {intro && (
        <p className="w-full text-base leading-relaxed text-ink-700">{intro}</p>
      )}

      {photo && (
        <div className="flex w-full flex-col gap-3">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg md:aspect-[16/9]">
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              priority
              sizes="(min-width: 768px) 768px, 100vw"
              className="object-cover"
            />
          </div>
          {photo.caption && (
            <p className="text-center text-sm text-ink-600">{photo.caption}</p>
          )}
        </div>
      )}

      {children}

      <section className="flex w-full flex-col gap-6">
        {venues.map(({ venue, tracks }) => (
          <VenueCard key={venue.slug} venue={venue} tracks={tracks} />
        ))}
        <Link
          href="/courses?tab=schedule"
          className="text-link text-sm"
        >
          查看每月課表與上課時間 →
        </Link>
      </section>

      {/* 小須知 */}
      {notes && notes.length > 0 && (
        <section className="flex w-full flex-col gap-4">
          <h2 className="text-xl font-bold md:text-2xl">小須知</h2>
          <dl className="flex flex-col gap-4">
            {notes.map((note) => (
              <div
                key={note.question}
                className="rounded-lg border border-ink-200 px-4 py-4"
              >
                <dt className="font-bold text-ink-900">{note.question}</dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-ink-700 md:text-base">
                  {note.answer}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {/* 報名 CTA */}
      <section className="flex w-full flex-col items-center gap-3 rounded-lg bg-section px-4 py-8 text-center">
        <h2 className="text-xl font-bold md:text-2xl">想來上課？</h2>
        <p className="max-w-md text-sm text-ink-600 md:text-base">
          不需舞伴、零基礎都可以報名。直接報名體驗課，也歡迎{' '}
          <Link
            href={LINKS.INSTAGRAM_DM}
            target="_blank"
            rel="noopener noreferrer"
            className="text-link"
          >
            Instagram 私訊詢問
          </Link>
          。
        </p>
        {/* asChild：讓連結本身長成按鈕，不要 <a><button> 巢狀（鍵盤會停兩次） */}
        <div className="mt-2 flex flex-wrap justify-center gap-4">
          <Button asChild size="lg">
            <Link href={LINKS.TRIAL_SIGNUP}>報名體驗課</Link>
          </Button>
          <Button asChild variant="link">
            <Link href={LINKS.PRICING}>了解費用</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

// 一間教室 = 一張卡：星期 → 教室名 → 地址 → 導航 → 時段 → 費用。
function VenueCard({ venue, tracks }: { venue: Venue; tracks: Track[] }) {
  // 卡片標題用 track 的 cityZh（例如「Hustle・職人棧」），它同時帶了舞種與場地名；
  // 萬一這個據點還沒排課，退回場地暱稱。
  const heading = tracks.map((t) => t.cityZh).join(' / ') || venue.shortName;
  const days = tracks.map((t) => t.dayZh).join('、');

  return (
    <div
      id={venue.slug}
      className="flex scroll-mt-20 flex-col gap-4 rounded-lg border border-ink-200 px-4 py-5"
    >
      <div className="flex flex-col gap-1">
        {days && (
          <p className="text-sm font-bold text-brand">每{days}</p>
        )}
        <h2 className="text-xl font-bold text-ink-900 md:text-2xl">{heading}</h2>
        <address className="not-italic text-sm text-ink-700 md:text-base">
          地址：{venue.addressFull}
        </address>
        {venue.navNote && (
          <p className="text-sm text-ink-600">{venue.navNote}</p>
        )}
        {venue.addressNote && (
          <p className="text-xs text-ink-500">※ {venue.addressNote}</p>
        )}
        <a
          href={venue.mapLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 self-start text-link text-sm"
        >
          {/* 兩個場地，所以連結一定要帶教室名，不然客人不知道自己點的是哪一間。
              用「」包起來，中英文場地名的間距都不會怪。 */}
          用 Google 地圖導航到「{venue.shortName}」→
        </a>
      </div>
      {/* 課程時段與課卡價格已移除（業主 2026/11/16）：這頁只放教室資訊，
          時段看課表月曆、價格看費用頁，不在這裡重複一份容易過期的資料。 */}
    </div>
  );
}
