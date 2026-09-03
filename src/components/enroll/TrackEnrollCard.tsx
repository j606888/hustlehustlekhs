import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getVenue } from '@/data/venues';
import { THEMES, type Track } from '@/components/courses/schedule/data';

// 常態課的報名卡。配色規則同 EventCard：白底，舞種色只在「週X」那顆 chip 上。

export default function TrackEnrollCard({ track }: { track: Track }) {
  const theme = THEMES[track.theme];
  const venue = getVenue(track.venueSlug);
  // 只列真正的課（課後練習／social 不是要報名的對象）
  const classSlots = track.slots.filter((slot) => slot.title.includes('班'));

  return (
    <article className="flex flex-col gap-4 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-gray-200 sm:p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={cn(
            'rounded-full px-2.5 py-1 font-poppins text-xs font-bold text-white',
            theme.accentBg
          )}
        >
          {track.dayZh} {track.sessionLabelEn.slice(0, 3)}
        </span>
        <h3 className="text-base font-bold text-[#2d3a5e] md:text-lg">
          {track.danceStyle} 常態課
        </h3>
      </div>

      <div className="flex flex-col gap-1">
        {classSlots.map((slot) => (
          <div key={slot.time} className="flex items-baseline gap-3 text-sm">
            <span className="font-poppins font-bold tabular-nums text-[#2d3a5e]">
              {slot.time}
            </span>
            <span className="text-gray-600">{slot.title}</span>
          </div>
        ))}
        <p className="mt-1 text-sm text-gray-600">
          <Link
            href={`/location#${venue.slug}`}
            className="underline-offset-2 hover:underline"
          >
            {venue.shortName}
          </Link>
          ・
          <Link
            href={`/courses?tab=pricing#${track.pricePlanId}`}
            className="underline-offset-2 hover:underline"
          >
            {track.priceSummary}
          </Link>
        </p>
      </div>

      {/* 體驗課才是主要 CTA（filled）；常態課卡是次要選項，用 outlined。 */}
      <Button
        asChild
        variant="outline"
        className="h-11 w-full px-5 sm:w-fit sm:self-start"
      >
        <a href={track.enrollUrl} target="_blank" rel="noopener noreferrer">
          報名 {track.danceStyle} 課卡
          <ArrowRight className="size-4" />
        </a>
      </Button>
    </article>
  );
}
