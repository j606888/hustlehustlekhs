'use client';

import { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { LINKS } from '@/constants/links';
import {
  TRACKS,
  getUpcomingEvents,
  type EnrollEvent,
  type EventKind,
} from '@/components/courses/schedule/data';
import EventCard from './EventCard';
import TrackEnrollCard from './TrackEnrollCard';

// 這個元件是 'use client' 唯一的理由：頁面是預先產生的靜態 HTML，build 當下的
// 日期會過期，所以掛載後才用瀏覽器當下時間把辦完的場次藏起來（跟 TrackCard
// 的做法一致，避免 hydration mismatch）。
//
// SSR 時一律印出全部場次，靜態 HTML 因此是完整的 —— 不跑 JS 的爬蟲讀得到
// 每一場活動的文字。也因此這裡不能用 useSearchParams（會讓整頁放棄預渲染，
// 原因見 courses/CoursesContent.tsx 的註解）。

/** now 還沒算出來（SSR / 首次渲染）時用 epoch，等於「什麼都還沒過期」。 */
function useUpcoming(kind: EventKind, now: Date | null): EnrollEvent[] {
  return getUpcomingEvents(kind, now ?? new Date(0));
}

export default function EnrollBoard() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => setNow(new Date()), []);

  const trials = useUpcoming('trial', now);
  const workshops = useUpcoming('workshop', now);

  return (
    <div className="bg-white">
      <div className="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-8 md:gap-10 md:px-6 md:py-12">
        <p className="text-base text-gray-600 md:text-lg">
          第一次來就從體驗課開始，想固定上課再選常態課卡。
        </p>

        {/* 1. 體驗課：新朋友的入口，放最上面 */}
        <Section title="體驗課" hint="零基礎、不用舞伴、單堂就能來">
          {trials.length > 0 ? (
            trials.map((event) => <EventCard key={event.id} event={event} />)
          ) : (
            <EmptyNote>
              下一期體驗課還在安排，追蹤{' '}
              <a
                href={LINKS.INSTAGRAM}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-brand underline-offset-2 hover:underline"
              >
                Instagram
              </a>{' '}
              看最新公告。
            </EmptyNote>
          )}
        </Section>

        {/* 2. 常態課程：永遠顯示 */}
        <Section title="常態課程" hint="課卡制・隨時可插班">
          {TRACKS.map((track) => (
            <TrackEnrollCard key={track.id} track={track} />
          ))}
        </Section>

        {/* 3. 客座 Workshop：沒有排定的場次就整區不出現 */}
        {workshops.length > 0 && (
          <Section title="客座 Workshop">
            {workshops.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </Section>
        )}

        <div className="flex items-start gap-2.5 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-4">
          <MessageCircle className="mt-0.5 size-5 flex-shrink-0 text-brand" />
          <p className="text-sm leading-relaxed text-gray-600">
            表單送出後會收到 Google 表單的回覆信。
            有任何問題（要不要帶舞伴、穿什麼鞋、課卡怎麼算）直接{' '}
            <a
              href={LINKS.INSTAGRAM_DM}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-brand underline-offset-2 hover:underline"
            >
              IG 私訊我們
            </a>
            。
          </p>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  /** 一句話說明。沒有要補充的就不要硬寫（例如客座 Workshop）。 */
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <h2 className="font-poppins text-xl font-bold text-[#2d3a5e] md:text-2xl">
          {title}
        </h2>
        {hint && <p className="text-sm text-gray-500">{hint}</p>}
      </div>
      {children}
    </section>
  );
}

function EmptyNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-2xl border border-dashed border-gray-200 px-4 py-5 text-sm text-gray-500">
      {children}
    </p>
  );
}
