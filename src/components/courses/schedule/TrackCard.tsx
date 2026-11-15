'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { LINKS } from '@/constants/links';
import { getVenue } from '@/data/venues';
import {
  getDateEnrollUrl,
  getSessionStatus,
  MONTH,
  SHOW_MONTH_EVENT,
  THEMES,
  type SessionStatus,
  type ShowMonthDetail,
  type Track,
} from './data';

export default function TrackCard({ track }: { track: Track }) {
  const theme = THEMES[track.theme];
  const venue = getVenue(track.venueSlug);
  // 頁面是預先產生的靜態 HTML，build 當下的日期會過期；
  // 掛載後再用瀏覽器當下時間重算「已結束」狀態，避免 hydration mismatch。
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => setNow(new Date()), []);

  return (
    <section
      id={track.id}
      className={cn(
        'relative w-full scroll-mt-20 overflow-hidden rounded-3xl p-5 shadow-sm md:p-8',
        theme.pageFrom
      )}
    >
      {/* 裝飾色塊 */}
      <span
        className={cn(
          'pointer-events-none absolute -left-16 top-10 h-48 w-48 rounded-[40%] opacity-30',
          theme.blob
        )}
        aria-hidden
      />

      {/* 標頭：城市 + 圓章 */}
      <div className="relative flex items-start justify-between gap-3">
        <div className="flex flex-col leading-none">
          <span
            className={cn('font-poppins text-4xl font-bold md:text-6xl', theme.accentText)}
            style={{ textShadow: '3px 3px 0 color-mix(in srgb, var(--heading) 18%, transparent)' }}
          >
            {track.cityEn}
          </span>
          <span className="mt-2 font-poppins text-2xl font-bold text-heading md:text-3xl">
            {track.cityZh}
          </span>
        </div>
        <div
          className={cn(
            'flex aspect-square w-20 flex-col items-center justify-center rounded-full text-center text-white md:w-28',
            theme.accentBg
          )}
        >
          <span className="font-poppins text-xs font-bold italic leading-tight md:text-base">
            {track.sessionLabelEn}
          </span>
          <span className="font-poppins text-[10px] font-semibold italic leading-tight opacity-90 md:text-xs">
            SESSIONS
          </span>
        </div>
      </div>

      {/* NEW badge */}
      {track.badge && (
        <div className="relative mt-5 flex flex-wrap items-center gap-2">
          <span
            className={cn(
              'rounded-full px-3 py-1 text-xs font-bold text-white md:text-sm',
              theme.accentBg
            )}
          >
            {track.badge}
          </span>
          {track.badgeNote && (
            <span className="text-xs font-medium text-ink-600 md:text-sm">
              {track.badgeNote}
            </span>
          )}
        </div>
      )}

      {/* 時段 */}
      <div className="relative mt-5 flex flex-col gap-2.5 md:gap-3">
        {track.slots.map((slot) => (
          <div
            key={slot.time}
            className="flex items-center gap-3 rounded-2xl bg-card px-4 py-3.5 shadow-sm md:gap-5 md:px-6 md:py-4"
          >
            <span
              className={cn(
                'font-poppins text-base font-bold tabular-nums md:text-xl',
                theme.accentText
              )}
            >
              {slot.time}
            </span>
            <span className="text-base font-medium text-heading md:text-xl">
              {slot.title}
            </span>
            {/* 還沒開始的班（例如 11 月還沒開的新手班）：時段照列，旁邊標開課日。 */}
            {slot.note && (
              <span
                className={cn(
                  'ml-auto shrink-0 rounded-full px-2.5 py-1 text-xs font-bold text-white md:text-sm',
                  theme.accentBg
                )}
              >
                {slot.note}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* 場次 strip */}
      <div className="relative mt-6">
        <div className="flex items-baseline gap-2">
          <p className="font-bold text-heading">{track.datesTitle}</p>
          <p className="text-xs text-ink-500 md:text-sm">{track.datesNote}</p>
        </div>
        {/* 依月份分列：月份只寫一次，每一堂是一個圓點，只有特別場次／停課在圓點下寫字。
            星期已經寫在上方圓章與 datesNote，這裡不再重複。 */}
        <div className="mt-2 flex flex-col gap-4 rounded-2xl bg-card p-4 shadow-sm">
          {groupByMonth(track.dates).map(({ month, dates }) => (
            <div key={month} className="flex items-start gap-3">
              <span
                className={cn(
                  'w-11 flex-shrink-0 pt-3 text-[13px] font-bold md:text-sm',
                  theme.monthText
                )}
              >
                {month}月
              </span>
              <div className="flex flex-wrap gap-2">
                {dates.map((d) => (
                  <DateDot
                    key={d.label}
                    date={d}
                    status={now ? getSessionStatus(d, now) : d.upcoming ? 'upcoming' : 'active'}
                    dotSoft={theme.dotSoft}
                    dotStrong={theme.dotStrong}
                    labelText={theme.monthText}
                    weekdayZh={track.dayZh}
                    enrollUrl={getDateEnrollUrl(track, d)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        {/* 圖例：只列這張卡實際用到的狀態 */}
        <div className="mt-3 flex flex-wrap gap-x-3.5 gap-y-1.5 text-xs text-ink-600">
          <LegendItem className={cn('border-[1.5px]', theme.dotSoft)} label="常態課" />
          {track.dates.some((d) => d.note && !d.off) && (
            <LegendItem className={theme.dotStrong} label="體驗課／特別場次" />
          )}
          {track.dates.some((d) => d.off) && (
            <LegendItem className="border-[1.5px] border-dashed border-ink-500" label="停課" />
          )}
        </div>
        {/* 圓點下放不下的補充說明（例如 Lambada 扣兩堂），那天過了就不顯示 */}
        {track.dates
          .filter((d) => d.detail && (!now || getSessionStatus(d, now) !== 'done'))
          .map((d) => (
            <p key={d.label} className="mt-2 text-xs text-ink-700 md:text-sm">
              ※ {d.detail}
            </p>
          ))}
      </div>

      {/* 費用摘要 */}
      <div className="relative mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-2xl bg-card/70 px-4 py-3">
        <span className={cn('font-bold', theme.accentText)}>
          💲 {track.priceSummary}
        </span>
        {/* 看完課表想報名時要有路可走，報名連結集中在 /enroll。
            文字連結用深一階的 monthText：accentText 太淡，小字過不了 4.5:1 */}
        <Link
          href={LINKS.ENROLL}
          className={cn(
            'text-sm font-medium underline-offset-2 hover:underline',
            theme.monthText
          )}
        >
          立即報名 →
        </Link>
      </div>

      {/* 地點：連到據點頁該場地的錨點，順便把權重導過去 */}
      <div className="relative mt-4 flex items-start gap-1.5 text-sm text-heading md:text-base">
        <span aria-hidden>📍</span>
        {/* 直接開 Google 地圖（業主要求），不先繞到上課地點頁 */}
        <a
          href={venue.mapLink}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium underline-offset-2 hover:underline"
        >
          {venue.addressFull}（{venue.shortName}）
          <span className={cn('ml-1 whitespace-nowrap', theme.monthText)}>
            看地點 →
          </span>
        </a>
      </div>
    </section>
  );
}

type SessionDate = Track['dates'][number];

/** 依 label 的月份分組，保留原本順序（'11/12' → 11 月）。 */
function groupByMonth(dates: SessionDate[]): { month: number; dates: SessionDate[] }[] {
  const groups: { month: number; dates: SessionDate[] }[] = [];
  for (const d of dates) {
    const month = Number(d.label.split('/')[0]);
    const last = groups[groups.length - 1];
    if (last && last.month === month) last.dates.push(d);
    else groups.push({ month, dates: [d] });
  }
  return groups;
}

function DateDot({
  date,
  status,
  dotSoft,
  dotStrong,
  labelText,
  weekdayZh,
  enrollUrl,
}: {
  date: SessionDate;
  status: SessionStatus;
  dotSoft: string;
  dotStrong: string;
  labelText: string;
  weekdayZh: string;
  enrollUrl: string | null;
}) {
  const [month, day] = date.label.split('/');
  const isDone = status === 'done';
  const isSpecial = !!date.note && !date.off;

  // 已結束的一律灰掉（不管原本是哪一種），其餘依 停課 / 特別場次 / 常態課 上色
  const circle = isDone
    ? 'bg-ink-100 text-ink-400 line-through'
    : date.off
      ? 'border-[1.5px] border-dashed border-ink-500 text-ink-500'
      : isSpecial
        ? cn(dotStrong, 'text-white')
        : cn('border-[1.5px] text-heading', dotSoft);
  const label = isDone ? '' : (date.note ?? '');
  const srText = `${date.label}（${weekdayZh}）${
    isDone ? '已結束' : date.off ? date.note ?? '停課' : date.note ?? '常態課'
  }`;

  const className = cn(
    'group flex w-12 cursor-pointer flex-col items-center gap-1 rounded-xl',
    status === 'upcoming' && 'opacity-60'
  );
  const content = (
    <>
      <span
        aria-hidden
        className={cn(
          'flex h-11 w-11 items-center justify-center rounded-full font-poppins text-base font-bold transition-transform group-hover:scale-105',
          circle
        )}
      >
        {day}
      </span>
      <span
        aria-hidden
        className={cn(
          'min-h-3 text-center text-[10px] leading-tight',
          isSpecial ? labelText : 'text-ink-500'
        )}
      >
        {label}
      </span>
    </>
  );

  // 還沒過、有報名表的場次：點了直接開那一天的報名表（體驗課 → 體驗課表單，一般課 → 課卡表單）。
  if (enrollUrl && !isDone) {
    return (
      <a href={enrollUrl} target="_blank" rel="noopener noreferrer" className={className}>
        {content}
        <span className="sr-only">{srText}，報名（另開新視窗）</span>
      </a>
    );
  }

  // 已結束或停課：沒有東西可報名，點了跳到上方那個月的月曆
  return (
    <button
      type="button"
      onClick={() =>
        window.dispatchEvent(
          new CustomEvent<ShowMonthDetail>(SHOW_MONTH_EVENT, {
            detail: { year: MONTH.year, month: Number(month) },
          })
        )
      }
      className={className}
    >
      {content}
      <span className="sr-only">{srText}，看{Number(month)}月月曆</span>
    </button>
  );
}

function LegendItem({ className, label }: { className: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={cn('h-3 w-3 rounded-full', className)} aria-hidden />
      {label}
    </span>
  );
}
