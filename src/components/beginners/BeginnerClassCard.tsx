import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CalendarDays, Clock, MapPin, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getVenue } from '@/data/venues';
import { THEMES, TRACKS } from '@/components/courses/schedule/data';
import type { BeginnerClass } from '@/data/beginners';

// 新手班卡片：上面是海報，下面是開課日／時間／地點／價格，最下面一顆購買課卡。
// 配色規則同報名頁：白底，舞種色只在 chip，CTA 用品牌色。

export default function BeginnerClassCard({ item }: { item: BeginnerClass }) {
  const theme = THEMES[item.theme];
  const venue = getVenue(item.venueSlug);
  const track = TRACKS.find((t) => t.id === item.trackId);

  return (
    <article
      id={item.id}
      className="flex scroll-mt-20 flex-col overflow-hidden rounded-3xl bg-card shadow-sm ring-1 ring-ink-200"
    >
      <Image
        src={item.poster}
        alt={item.posterAlt}
        width={1080}
        height={1350}
        sizes="(min-width: 768px) 420px, 100vw"
        className="aspect-[4/5] w-full object-cover"
      />

      <div className="flex flex-grow flex-col gap-4 p-5">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className={cn(
                'rounded-full px-2.5 py-1 text-xs font-bold text-white',
                theme.accentBg
              )}
            >
              {item.danceStyle}
            </span>
            <span className="rounded-full bg-ink-100 px-2.5 py-1 text-xs font-medium text-ink-600">
              {item.level}・零基礎
            </span>
          </div>
          <h2 className="text-xl font-bold text-heading">
            {item.danceStyle} {item.level} 新手班
          </h2>
        </div>

        <ul className="flex flex-col gap-2 text-sm text-ink-700">
          <li className="flex items-start gap-2">
            <CalendarDays aria-hidden className="mt-0.5 size-4 shrink-0 text-brand" />
            <span>
              <strong className="font-semibold text-heading">{item.startDateLabel}</strong>{' '}
              開始
            </span>
          </li>
          <li className="flex items-start gap-2">
            <Clock aria-hidden className="mt-0.5 size-4 shrink-0 text-brand" />
            <span>
              每{item.weekdayZh} <span className="tabular-nums">{item.time}</span>
            </span>
          </li>
          <li className="flex items-start gap-2">
            <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-brand" />
            <Link
              href={`/location#${venue.slug}`}
              className="underline-offset-2 hover:underline"
            >
              {venue.district} {venue.shortName}
            </Link>
          </li>
          {track && (
            <li className="flex items-start gap-2">
              <Tag aria-hidden className="mt-0.5 size-4 shrink-0 text-brand" />
              <Link
                href={`/courses?tab=pricing#${track.pricePlanId}`}
                className="underline-offset-2 hover:underline"
              >
                {track.priceSummary}
              </Link>
            </li>
          )}
        </ul>

        {track?.enrollUrl && (
          <Button asChild size="lg" className="mt-auto h-12 w-full">
            <a href={track.enrollUrl} target="_blank" rel="noopener noreferrer">
              購買 {item.danceStyle} 課卡
              <ArrowRight className="size-4" />
            </a>
          </Button>
        )}
      </div>
    </article>
  );
}
