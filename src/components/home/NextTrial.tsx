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

// 首頁首圖下方的「近期體驗課」。資料跟報名頁共用 ALL_EVENTS：課表（TRACKS.dates）
// 上標了「體驗」的日期會自動出現在這裡，不用另外改首頁。
//
// 頁面是預先產生的靜態 HTML，build 當下的日期會過期，所以掛載後才用瀏覽器的
// 今天日期挑出還沒辦的場次（跟 TrackCard 重算「已結束」是同一個理由）。
// 預渲染時不顯示，避免先閃出一場已經結束的日期。沒有可報名的場次就整塊不顯示。
export default function NextTrial() {
  const [events, setEvents] = useState<EnrollEvent[] | null>(null);
  useEffect(() => setEvents(getUpcomingEvents('trial').slice(0, 4)), []);

  if (!events || events.length === 0) return null;

  return (
    <div className="w-full rounded-xl bg-brand-light px-4 py-3 ring-1 ring-brand/15">
      <p className="text-sm font-bold text-brand-strong">近期體驗課</p>
      {/* 用 grid 排成三欄（日期／舞種／價格），每一列的欄位上下對齊；
          subgrid 讓每個 li 共用外層的欄寬。 */}
      {/* 320px 的小手機上價格會被擠成兩行，所以窄螢幕縮小字級與欄距。 */}
      {/* 日期與星期拆成兩欄：字型的數字不是等寬（「1」比「2」窄），
          寫在同一格的話「（五）」會跟著日期長短左右飄。 */}
      <ul className="mt-1 grid grid-cols-[auto_auto_auto_1fr] gap-x-2 gap-y-1 whitespace-nowrap text-[13px] text-ink-800 min-[360px]:gap-x-3 min-[360px]:text-sm">
        {events.map((event) => (
          <li key={event.id} className="col-span-4 grid grid-cols-subgrid">
            <span className="font-semibold">{event.dateLabel}</span>
            <span className="-ml-2 font-semibold min-[360px]:-ml-3">
              （{WEEKDAY_ZH[event.weekdayEn] ?? event.weekdayEn}）
            </span>
            <span className="font-semibold">{event.danceStyle.replace('Brazilian ', '')}</span>
            <span className="text-ink-600">{event.priceNote}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
