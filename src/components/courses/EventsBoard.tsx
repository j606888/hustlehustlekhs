'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, CalendarDays, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LINKS } from '@/constants/links';
import { getUpcomingEvents, type EnrollEvent } from '@/components/courses/schedule/data';
import { getWorkshopDetail, type WorkshopDetail } from '@/data/workshops';

// 課程資訊頁的「活動」分頁：列出還沒辦完的客座 Workshop，每一場一個完整區塊。
// 場次清單跟報名頁共用 EVENTS（kind: 'workshop'），介紹內容在 src/data/workshops.ts。
//
// 'use client' 的理由跟報名頁 EnrollBoard 一樣：靜態 HTML 是 build 當下產生的，
// 掛載後才用瀏覽器的今天日期把辦完的場次藏起來、判斷早鳥是否結束。
// 預渲染時一律全部印出（now 用 epoch），爬蟲讀得到每一場的文字。
export default function EventsBoard() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => setNow(new Date()), []);

  const workshops = getUpcomingEvents('workshop', now ?? new Date(0));

  return (
    <div className="bg-card">
      <div className="mx-auto flex max-w-2xl flex-col gap-10 px-4 py-8 md:px-6 md:py-12">
        {workshops.length > 0 ? (
          workshops.map((event) => (
            <WorkshopSection key={event.id} event={event} detail={getWorkshopDetail(event.id)} now={now} />
          ))
        ) : (
          <p className="rounded-lg border border-dashed border-ink-200 px-4 py-5 text-sm text-ink-600">
            目前沒有開放報名的活動，追蹤{' '}
            <a
              href={LINKS.INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              className="text-link"
            >
              Instagram
            </a>{' '}
            看最新公告。
          </p>
        )}
      </div>
    </div>
  );
}

function isEarlyBird(detail: WorkshopDetail, now: Date | null): boolean {
  if (!detail.earlyBirdUntil) return false;
  // 預渲染（now 還沒算出來）先當作早鳥期間，掛載後再依今天日期修正
  if (!now) return true;
  const [y, m, d] = detail.earlyBirdUntil.split('-').map(Number);
  const lastDay = new Date(y, m - 1, d + 1); // 最後一天整天都算
  return now < lastDay;
}

function WorkshopSection({
  event,
  detail,
  now,
}: {
  event: EnrollEvent;
  detail?: WorkshopDetail;
  now: Date | null;
}) {
  const early = detail ? isEarlyBird(detail, now) : false;
  const [, earlyMonth, earlyDay] = detail?.earlyBirdUntil?.split('-').map(Number) ?? [];
  const dateText = `${event.year ?? ''}${event.year ? '/' : ''}${event.dateLabel}${
    event.endDateLabel ? ` – ${event.endDateLabel}` : ''
  }`;

  return (
    <section id={event.id} className="scroll-mt-20 flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-event-accent px-3 py-1 text-xs font-bold text-white">
            Workshop
          </span>
          <span className="rounded-full bg-ink-100 px-3 py-1 text-xs font-medium text-ink-700">
            {event.danceStyle}
          </span>
          {early && earlyMonth && (
            <span className="text-sm font-semibold text-event-accent">
              早鳥至 {earlyMonth}/{earlyDay}
            </span>
          )}
        </div>
        <h2 className="text-2xl font-bold text-heading md:text-3xl">{event.title}</h2>
        {detail && <p className="text-base text-ink-700">{detail.subtitle}</p>}
      </div>

      <div className="flex flex-col gap-2 rounded-lg bg-ink-50 px-4 py-4 text-sm text-ink-800 md:text-base">
        <p className="flex items-start gap-2">
          <CalendarDays aria-hidden className="mt-0.5 size-4 shrink-0 text-event-accent" />
          <span>{dateText}</span>
        </p>
        {detail && (
          <p className="flex items-start gap-2">
            <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-event-accent" />
            <span>
              {detail.venueName}
              <br />
              <span className="text-ink-600">{detail.venueAddress}</span>
            </span>
          </p>
        )}
      </div>

      {detail && (
        <>
          <div className="flex flex-col gap-3 text-base leading-relaxed text-ink-700">
            {detail.intro.map((para) => (
              <p key={para}>{para}</p>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-bold text-ink-900">活動內容</h3>
            <ul className="list-disc space-y-1 pl-5 text-base text-ink-700">
              {detail.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-bold text-ink-900">時間表</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {detail.schedule.map((day) => (
                <div key={day.day} className="rounded-lg p-4 ring-1 ring-ink-200">
                  <p className="mb-2 font-bold text-event-accent">{day.day}</p>
                  <ul className="flex flex-col gap-1 text-sm text-ink-800">
                    {day.items.map((item) => (
                      <li key={item.time} className="flex gap-3">
                        <span className="tabular-nums text-ink-600">{item.time}</span>
                        <span>{item.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-bold text-ink-900">
              方案{early && earlyMonth ? `（早鳥價至 ${earlyMonth}/${earlyDay}）` : ''}
            </h3>
            <div className="flex flex-col gap-3">
              {/* 每個方案框一樣的細框線，不特別標出第一個（業主 2026/11/20） */}
              {detail.passes.map((pass) => {
                const price = early ? pass.price : pass.originalPrice ?? pass.price;
                return (
                  <div
                    key={pass.name}
                    className="flex items-center justify-between rounded-lg px-4 py-3.5 ring-1 ring-ink-200"
                  >
                    <div className="flex flex-col">
                      <span className="font-bold text-ink-900">{pass.name}</span>
                      <span className="text-sm text-ink-600">{pass.note}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xl font-bold text-heading">${price}</span>
                      {early && pass.originalPrice && (
                        <span className="text-sm text-ink-500 line-through">${pass.originalPrice}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      <Button asChild size="lg" className="h-12 w-full">
        <a href={event.enrollUrl} target="_blank" rel="noopener noreferrer">
          前往報名
          <ArrowRight className="size-4" />
        </a>
      </Button>
    </section>
  );
}
