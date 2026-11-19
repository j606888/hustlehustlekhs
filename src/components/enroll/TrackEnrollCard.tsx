import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getVenue } from '@/data/venues';
import {
  THEMES,
  formatSessionDate,
  getTrackOutlook,
  type Track,
} from '@/components/courses/schedule/data';

// 常態課的報名卡。配色規則同 EventCard：白底，舞種色只在「週X」那顆 chip 上。

export default function TrackEnrollCard({
  track,
  now,
  hidePrice = false,
}: {
  track: Track;
  now: Date | null;
  /** 價格已寫在區塊標題（兩條線同價）時傳 true */
  hidePrice?: boolean;
}) {
  const theme = THEMES[track.theme];
  const venue = getVenue(track.venueSlug);
  // 老手最想知道：下一堂哪天、接下來有沒有停課。日期要等掛載後（now 有值）才算，
  // 預渲染時不顯示，理由同 EnrollBoard。
  const outlook = now ? getTrackOutlook(track, now) : null;
  // 新手班與中階／進階班共用同一張課卡，按鈕上直接寫出來
  const classNames = classSlotsOf(track)
    .map((slot) => slot.title.replace(track.danceStyle.replace('Brazilian ', ''), '').trim())
    .join('・');
  // 只列真正的課（課後練習／Practica／social 不是要報名的對象）
  const classSlots = classSlotsOf(track);

  return (
    <article className="flex flex-col gap-4 rounded-lg bg-card p-4 ring-1 ring-ink-200 sm:p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={cn(
            'rounded-full px-2.5 py-1 text-xs font-bold text-white',
            theme.accentBg
          )}
        >
          {track.dayZh} {track.sessionLabelEn.slice(0, 3)}
        </span>
        <h3 className="text-base font-bold text-heading md:text-lg">
          {track.danceStyle} 常態課
        </h3>
      </div>

      <div className="flex flex-col gap-1">
        {classSlots.map((slot) => (
          <div key={slot.time} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm">
            <span className="font-bold tabular-nums text-heading">
              {slot.time}
            </span>
            <span className="text-ink-600">{slot.title}</span>
            {slot.title.includes('新手') && (
              <span className="rounded-full bg-brand-light px-2 py-0.5 text-xs font-semibold text-brand-strong">
                零基礎可上
              </span>
            )}
            {slot.note && (
              <span className="rounded-full bg-ink-100 px-2 py-0.5 text-xs font-medium text-ink-600">
                {slot.note}
              </span>
            )}
          </div>
        ))}
        {outlook?.next && (
          <p className="mt-1 text-sm text-ink-700">
            下一堂{' '}
            <strong className="font-semibold text-heading">
              {formatSessionDate(outlook.next)}
            </strong>
            {outlook.next.note && `・${outlook.next.note}`}
            {outlook.nextOff && (
              <span className="ml-2 font-semibold text-warning-fg">
                {outlook.nextOff.label} 停課
              </span>
            )}
          </p>
        )}
        <p className="mt-1 text-sm text-ink-600">
          <Link
            href={`/location#${venue.slug}`}
            className="underline-offset-2 hover:underline"
          >
            {venue.shortName}
          </Link>
          {/* 價格：兩條線一樣時已寫在「常態課程」標題下，卡片不重複 */}
          {!hidePrice && (
            <>
              ・
              <Link
                href={`/courses?tab=pricing#${track.pricePlanId}`}
                className="underline-offset-2 hover:underline"
              >
                {track.priceSummary}
              </Link>
            </>
          )}
        </p>
      </div>

      {/* 體驗課才是主要 CTA（filled）；常態課卡是次要選項，用 outlined。 */}
      <Button
        asChild
        variant="outline"
        className="h-11 w-full px-5 sm:w-fit sm:self-start"
      >
        <a href={track.enrollUrl} target="_blank" rel="noopener noreferrer">
          購買 {track.danceStyle.replace('Brazilian ', '')} 課卡（{classNames}共用）
          <ArrowRight className="size-4" />
        </a>
      </Button>
    </article>
  );
}

/** 只列真正的課（課後練習／Practica／social 不是要報名的對象） */
function classSlotsOf(track: Track) {
  return track.slots.filter(
    (slot) => !slot.title.includes('練習') && !slot.title.includes('Practica')
  );
}
