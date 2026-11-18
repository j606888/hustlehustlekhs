'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { LINKS } from '@/constants/links';
import {
  PRICE_PLANS,
  TRACKS,
  getCommonEventInfo,
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

// 常態課卡價格：兩條線一樣時，在「常態課程」標題下寫一次
const samePrice = TRACKS.every((t) => t.priceSummary === TRACKS[0]?.priceSummary);
const cardPrices = (PRICE_PLANS[0]?.tiers[0]?.options ?? [])
  .map((o) => `${o.name.replace('課卡', '').trim()} $${o.price}`)
  .join('・');

/** now 還沒算出來（SSR / 首次渲染）時用 epoch，等於「什麼都還沒過期」。 */
function useUpcoming(kind: EventKind, now: Date | null): EnrollEvent[] {
  return getUpcomingEvents(kind, now ?? new Date(0));
}

export default function EnrollBoard() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => setNow(new Date()), []);

  const trials = useUpcoming('trial', now);
  const workshops = useUpcoming('workshop', now);
  const trialCommon = getCommonEventInfo(trials);

  return (
    <div className="bg-card">
      <div className="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-8 md:gap-10 md:px-6 md:py-12">
        {/* 兩種人來這頁：第一次來的新手、已經在上課要買課卡的老手。
            頂端兩顆跳轉，老手不用每次滑過體驗課才找到課卡。 */}
        <div className="grid grid-cols-2 gap-3">
          <JumpLink href="#trial" title="第一次來" desc="從體驗課開始" />
          <JumpLink href="#regular" title="已經在上課" desc="購買課卡" />
        </div>

        {/* 1. 體驗課：新朋友的入口，放最上面 */}
        <Section id="trial" title="體驗課" hint="零基礎、不用舞伴、只來一次也可以">
          {/* 每場都一樣的開始時間／價格寫在這裡一次，卡片不再重複（業主 2026/11/16）。
              某一場不一樣時 getCommonEventInfo 對應欄位是 null，那一項就回到每張卡各自顯示。 */}
          {/* 開始時間寫在每張卡的說明（業主指定），這裡只放共同價格 */}
          {trialCommon.priceNote && (
            <p className="-mt-1 text-sm font-semibold text-ink-800">{trialCommon.priceNote}</p>
          )}
          <p className="-mt-1 text-sm text-ink-600">
            體驗完想每週固定上課？選下面
            <a href="#regular" className="font-medium text-brand underline-offset-2 hover:underline">
              常態課程
            </a>
            的課卡，從新手班開始。
          </p>
          {trials.length > 0 ? (
            trials.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                // 卡片說明已含「19:30 開始」，跟新手入門頁的體驗課卡一模一樣
                hideStartTime
                hidePrice={!!trialCommon.priceNote}
              />
            ))
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
        <Section id="regular" title="常態課程" hint="新手班・中階／進階班，課卡制・隨時可插班">
          {/* 兩條線課卡價格相同時只在這裡寫一次；不同就各卡自己顯示 */}
          {samePrice && (
            <p className="-mt-1 text-sm font-semibold text-ink-800">
              課卡 {cardPrices}（Hustle、Zouk 各自一張）
            </p>
          )}
          {TRACKS.map((track) => (
            <TrackEnrollCard key={track.id} track={track} now={now} hidePrice={samePrice} />
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

        <div className="flex items-start gap-2.5 rounded-2xl border border-ink-100 bg-ink-50 px-4 py-4">
          <MessageCircle className="mt-0.5 size-5 flex-shrink-0 text-brand" />
          <p className="text-sm leading-relaxed text-ink-600">
            表單送出後會收到 Google 表單的回覆信。
            有任何問題（要不要帶舞伴、穿什麼鞋、課卡怎麼算）先看{' '}
            <Link
              href={LINKS.FAQ}
              className="font-medium text-brand underline-offset-2 hover:underline"
            >
              Q&amp;A
            </Link>
            。想查剩餘堂數或補課，請{' '}
            <a
              href={LINKS.INSTAGRAM_DM}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-brand underline-offset-2 hover:underline"
            >
              IG 私訊
            </a>
            。
          </p>
        </div>
      </div>
    </div>
  );
}

function JumpLink({ href, title, desc }: { href: string; title: string; desc: string }) {
  return (
    <a
      href={href}
      className="flex flex-col gap-0.5 rounded-2xl bg-card px-4 py-3 shadow-sm ring-1 ring-ink-200 transition hover:ring-brand"
    >
      <span className="text-base font-bold text-heading">{title}</span>
      <span className="text-sm text-ink-600">{desc} ↓</span>
    </a>
  );
}

function Section({
  id,
  title,
  hint,
  children,
}: {
  /** 錨點（/enroll#trial、#regular）。站內的「報名體驗課」按鈕統一連到 LINKS.TRIAL_SIGNUP，不是這裡。 */
  id?: string;
  title: string;
  /** 一句話說明。沒有要補充的就不要硬寫（例如客座 Workshop）。 */
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="flex scroll-mt-20 flex-col gap-3">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <h2 className="font-poppins text-xl font-bold text-heading md:text-2xl">
          {title}
        </h2>
        {hint && <p className="text-sm text-ink-500">{hint}</p>}
      </div>
      {children}
    </section>
  );
}

function EmptyNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-2xl border border-dashed border-ink-200 px-4 py-5 text-sm text-ink-500">
      {children}
    </p>
  );
}
