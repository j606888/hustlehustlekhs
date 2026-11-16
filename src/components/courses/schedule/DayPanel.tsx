import { ArrowRight, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getVenue } from '@/data/venues';
import {
  THEMES,
  formatSessionDate,
  getDayPlan,
  getSessionStatus,
  type SessionDate,
  type Track,
} from './data';

// 月曆點一天 → 這一塊顯示當天的課表與「這天該按哪顆」：
// 體驗課 → 報名那一場；一般上課日、Lambada → 購買課卡；停課 → 只寫停課。
// 不直接讓月曆格子連到 Google 表單：手機格子只有約 42px，容易誤觸，
// 也看不出點下去報的是體驗課還是課卡。先給人看一眼當天內容，再按明確的按鈕。

type Props = {
  track: Track;
  date: SessionDate;
  /** 掛載前是 null：還不知道今天是幾號，就先不判斷「已結束」。 */
  now: Date | null;
};

export default function DayPanel({ track, date, now }: Props) {
  const theme = THEMES[track.theme];
  const venue = getVenue(track.venueSlug);
  const plan = getDayPlan(track, date);
  const isDone = now ? getSessionStatus(date, now) === 'done' : false;
  const style = track.danceStyle.replace('Brazilian ', '');

  return (
    <section
      aria-live="polite"
      className="mt-4 flex flex-col gap-3 rounded-2xl bg-ink-50 p-4 ring-1 ring-inset ring-ink-200"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={cn('rounded-full px-2.5 py-1 text-xs font-bold text-white', theme.accentBg)}
        >
          {style}
        </span>
        <h3 className="text-base font-bold text-heading md:text-lg">
          {formatSessionDate(date)}
          {date.note && !date.off && `・${date.note}`}
        </h3>
      </div>

      {date.off ? (
        <p className="text-base font-bold text-warning-fg">這週停課</p>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {plan.slots.map((slot) => (
            <li key={slot.time} className="flex items-baseline gap-3 text-sm md:text-base">
              <span className="font-poppins font-bold tabular-nums text-heading">{slot.time}</span>
              <span className="text-ink-700">{slot.title}</span>
            </li>
          ))}
        </ul>
      )}

      <p className="flex items-center gap-1 text-sm text-ink-600">
        <MapPin aria-hidden className="size-4 shrink-0 text-brand" />
        {/* 直接開 Google 地圖（業主要求），不先繞到教室資訊頁 */}
        <a
          href={venue.mapLink}
          target="_blank"
          rel="noopener noreferrer"
          className="underline-offset-2 hover:underline"
        >
          {venue.district} {venue.shortName}
        </a>
        {plan.trial?.priceNote && <span>・{plan.trial.priceNote}</span>}
      </p>
      {date.detail && <p className="text-sm text-ink-600">{date.detail}</p>}

      {isDone ? (
        <p className="text-sm text-ink-500">這天已經結束了，點月曆上其他日期看接下來的課。</p>
      ) : (
        plan.cta && (
          <Button
            asChild
            size="lg"
            variant={plan.cta.kind === 'trial' ? 'default' : 'outline'}
            className="h-11 w-full sm:w-fit"
          >
            <a href={plan.cta.href} target="_blank" rel="noopener noreferrer">
              {plan.cta.label}
              <ArrowRight className="size-4" />
            </a>
          </Button>
        )
      )}
    </section>
  );
}
