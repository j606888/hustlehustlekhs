'use client';

import { useEffect, useState } from 'react';
import { getUpcomingEvents, type EnrollEvent } from '@/components/courses/schedule/data';

const WEEKDAY_ZH: Record<string, string> = {
  MON: '一',
  TUE: '二',
  WED: '三',
  THU: '四',
  FRI: '五',
  SAT: '六',
  SUN: '日',
};

// 首頁首圖下方的「下一場體驗課」。資料跟報名頁共用 EVENTS，所以只要在
// schedule/data.ts 加一筆體驗課，這裡就會自動出現，不用另外改首頁。
//
// 頁面是預先產生的靜態 HTML，build 當下的日期會過期，所以掛載後才用瀏覽器的
// 今天日期挑出還沒辦的場次（跟 TrackCard 重算「已結束」是同一個理由）。
// 預渲染時不顯示，避免先閃出一場已經結束的日期。沒有可報名的場次就整塊不顯示。
export default function NextTrial() {
  const [events, setEvents] = useState<EnrollEvent[] | null>(null);
  useEffect(() => setEvents(getUpcomingEvents('trial').slice(0, 2)), []);

  if (!events || events.length === 0) return null;

  return (
    <div className="w-full rounded-xl bg-brand-light px-4 py-3 ring-1 ring-brand/15">
      <p className="text-sm font-bold text-brand-strong">近期體驗課</p>
      <ul className="mt-1 flex flex-col gap-1">
        {events.map((event) => (
          <li key={event.id} className="text-sm text-gray-800">
            <span className="font-semibold">
              {event.dateLabel}（{WEEKDAY_ZH[event.weekdayEn] ?? event.weekdayEn}）
              {event.danceStyle.replace('Brazilian ', '')}
            </span>
            {event.priceNote && <span className="text-gray-600">・{event.priceNote}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
