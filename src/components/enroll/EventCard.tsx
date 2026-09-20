import { Fragment } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getVenue } from '@/data/venues';
import { THEMES, type EnrollEvent } from '@/components/courses/schedule/data';

// 報名頁的配色規則（跟課表卡刻意不同）：卡片一律白底，舞種色只出現在
// 日期章的頂條與舞種 chip 這種小面積，CTA 全站統一用品牌色。
// 不要在這裡用 THEMES 的 pageFrom / accentText —— 前者是大色塊，
// 後者（如 #d4796e）壓白底只有約 3.3:1，小字看不清楚。

const KIND_LABEL = {
  trial: '體驗課',
  workshop: 'Workshop',
} as const;

export default function EventCard({ event }: { event: EnrollEvent }) {
  const theme = THEMES[event.theme];
  const venue = event.venueSlug ? getVenue(event.venueSlug) : null;

  const meta: React.ReactNode[] = [];
  if (venue) {
    // 臨時換場地的場次，場地名加粗 —— 熟客掃過這行時最容易漏掉的就是它。
    meta.push(
      <Link
        href={`/location#${venue.slug}`}
        className={cn(
          'underline-offset-2 hover:underline',
          event.venueChanged && 'font-bold text-[#2d3a5e] underline'
        )}
      >
        {venue.shortName}
      </Link>
    );
  }
  if (event.startTime) meta.push(`${event.startTime} 開始`);
  if (event.priceNote) meta.push(event.priceNote);

  return (
    <article
      id={event.id}
      className="flex scroll-mt-20 flex-col gap-4 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-gray-200 sm:flex-row sm:items-center sm:gap-5 sm:p-5"
    >
      {/* 手機：日期章與文字並排，按鈕自己一列（sm:contents 讓這層在桌機消失，
          日期章與文字就直接變成外層 flex-row 的子元素）。 */}
      <div className="flex items-start gap-4 sm:contents">
        {/* 日期章：唯一帶舞種色的區塊 */}
        <div className="flex w-16 flex-shrink-0 flex-col overflow-hidden rounded-xl text-center shadow-sm ring-1 ring-gray-100">
          <div
            className={cn(
              'py-0.5 font-poppins text-[10px] font-bold tracking-widest text-white',
              theme.accentBg
            )}
          >
            {event.weekdayEn}
          </div>
          <div className="bg-gray-50 px-1 py-1.5">
            <div className="font-poppins text-lg font-bold leading-tight text-[#2d3a5e]">
              {event.dateLabel}
            </div>
            {event.endDateLabel && (
              <div className="font-poppins text-xs font-bold leading-tight text-gray-500">
                –{event.endDateLabel}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-grow flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
              {KIND_LABEL[event.kind]}
            </span>
            <span
              className={cn(
                'rounded-full px-2.5 py-1 text-xs font-bold text-white',
                theme.accentBg
              )}
            >
              {event.danceStyle}
            </span>
            {/* 場地異動刻意不用品牌色也不用舞種色：那兩色在這頁各有職責
                （CTA、舞種），警示要跳出來就得是第三種顏色。 */}
            {event.venueChanged && (
              <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-900">
                場地異動
              </span>
            )}
          </div>
          <h3 className="text-base font-bold text-[#2d3a5e] md:text-lg">
            {event.title}
          </h3>
          {/* 地點、時間、價格哪一項有就顯示哪一項；三項都還沒定（客座 workshop 常
              這樣）就整行不出現，不要留「待公布」之類的佔位字。 */}
          {meta.length > 0 && (
            <p className="text-sm text-gray-600">
              {meta.map((node, index) => (
                <Fragment key={index}>
                  {index > 0 && '・'}
                  {node}
                </Fragment>
              ))}
            </p>
          )}
          {event.note && <p className="text-sm text-gray-500">{event.note}</p>}
        </div>
      </div>

      {/* 還沒開放報名的場次不會走到這裡 —— getUpcomingEvents 已經先濾掉了。
          體驗課是這頁最想推的入口，用 filled；workshop 是次要選項，用 outlined。 */}
      <Button
        asChild
        variant={event.kind === 'trial' ? 'default' : 'outline'}
        className="h-11 w-full flex-shrink-0 px-5 sm:w-auto"
      >
        <a href={event.enrollUrl} target="_blank" rel="noopener noreferrer">
          報名
          <ArrowRight className="size-4" />
        </a>
      </Button>
    </article>
  );
}
