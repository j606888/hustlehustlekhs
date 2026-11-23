import Link from 'next/link';
import { ArrowDown, ArrowRight } from 'lucide-react';
import SectionHeading from '@/components/SectionHeading';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LINKS } from '@/constants/links';
import { PRICE_PLANS, TRACKS } from '@/components/courses/schedule/data';

// 「體驗課」和「零基礎新手班」差在哪 —— 第一次看網站的人分不出來（業主朋友實測回饋）。
// 業主確認的建議路線：先來一次體驗課，喜歡再上每週的新手班。
// 首頁（說明＋連結）與 /beginners（可點選切換下方內容）共用這一塊，說法只有一份。價格都從課表資料取。
//
// 這個檔案沒有 'use client'：首頁當 Server Component 用；/beginners 由 BeginnerSwitcher
//（client）帶 selectable 進來，onSelect 只會在 client 端出現。

const trialPrice = TRACKS[0]?.trial.priceNote ?? '';
const cardOptions = PRICE_PLANS[0]?.tiers[0]?.options ?? [];
const cardPrices = cardOptions
  .map((o) => `${o.name.replace('課卡', '').trim()} $${o.price}`)
  .join('・');

export type BeginnerStepKey = 'trial' | 'level1';

/** /beginners 用的錨點：/beginners#trial、/beginners#level1 會預先選好那一張 */
export const BEGINNER_STEP_HASH: Record<BeginnerStepKey, string> = {
  trial: 'trial',
  level1: 'level1',
};

const STEPS: {
  key: BeginnerStepKey;
  step: string;
  title: string;
  price: string;
  points: string[];
  href: string;
  cta: string;
}[] = [
  {
    key: 'trial',
    step: 'STEP 1',
    title: '體驗課',
    price: trialPrice,
    points: ['單堂入門課，課後接 Party'],
    href: LINKS.TRIAL_SIGNUP,
    // 首頁第一屏拿掉按鈕後，這裡是首頁第一個報名入口，所以首頁版的 STEP 1 做成實心主按鈕。
    // 連到 /beginners#trial 的近期體驗課清單，在那裡選日期報名。
    cta: '報名體驗課',
  },
  {
    key: 'level1',
    step: 'STEP 2',
    title: '零基礎新手班',
    price: `課卡 ${cardPrices}`,
    points: ['每週固定一堂，從基本步一步步往上教'],
    href: `${LINKS.BEGINNERS}#${BEGINNER_STEP_HASH.level1}`,
    cta: '看新手班',
  },
];

type Props = {
  /**
   * 可點選模式（/beginners）：兩張卡變成切換按鈕，選中的那張加底色，
   * 下方內容由呼叫端依 selected 切換。不給就是首頁的說明版（卡片內有連結）。
   */
  selectable?: { selected: BeginnerStepKey; onSelect: (key: BeginnerStepKey) => void };
};

export default function BeginnerPath({ selectable }: Props) {
  return (
    <section className={cn(selectable ? 'w-full' : 'bg-section px-5 py-8 md:py-12')}>
      <div className={cn('mx-auto', selectable ? 'max-w-4xl' : 'max-w-5xl')}>
        {!selectable && (
          <SectionHeading
            eyebrow="完全沒跳過舞？"
            title="兩步驟開始跳舞"
            subtitle="先來一次體驗課，喜歡再上每週的新手班"
            className="mb-8"
          />
        )}
        <ol className="grid items-stretch gap-3 md:grid-cols-[1fr_auto_1fr] md:gap-4">
          {STEPS.map((s, i) => {
            // /beginners：選中的那張才加底色。首頁兩張一律同樣的白底灰框（業主 2026/11/19：
            // 體驗課那張的紅底紅框讓左右不一致），建議的第一步改由 STEP 1 的實心按鈕帶出來。
            const highlighted = selectable ? selectable.selected === s.key : false;
            const body = (
              <>
                <span className="eyebrow text-brand-strong">
                  {s.step}
                </span>
                <h3 className="text-xl font-bold text-heading">{s.title}</h3>
                <p className="text-sm font-semibold text-ink-800">{s.price}</p>
                <ul className="flex flex-col gap-1 text-sm leading-relaxed text-ink-700">
                  {s.points.map((p) => (
                    <li key={p}>・{p}</li>
                  ))}
                </ul>
                {selectable ? (
                  <span
                    className={cn(
                      'mt-auto text-sm font-semibold',
                      highlighted ? 'text-brand-strong' : 'text-brand'
                    )}
                  >
                    {highlighted ? '▼ 下方是' + s.title + '資訊' : '點這裡看' + s.title}
                  </span>
                ) : i === 0 ? (
                  <Button asChild size="lg" className="mt-auto w-full md:w-fit" data-enroll-cta>
                    <Link href={s.href}>
                      {s.cta}
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                ) : (
                  <Link
                    href={s.href}
                    className="mt-auto self-start text-link text-sm"
                  >
                    {s.cta}
                    <ArrowRight className="size-4" />
                  </Link>
                )}
              </>
            );
            const cardClass = cn(
              'flex flex-col gap-3 rounded-lg p-5 text-left ring-1 transition',
              highlighted
                ? 'bg-brand-light ring-2 ring-brand shadow-[0_4px_20px_color-mix(in_oklab,var(--brand)_22%,transparent)]'
                : 'bg-card ring-ink-200',
              selectable && !highlighted && 'cursor-pointer hover:ring-brand/50'
            );
            return (
              <li key={s.key} className="contents">
                {i === 1 && (
                  <div aria-hidden className="flex items-center justify-center text-brand">
                    <ArrowDown className="size-6 md:hidden" />
                    <ArrowRight className="hidden size-6 md:block" />
                  </div>
                )}
                {selectable ? (
                  <button
                    type="button"
                    onClick={() => selectable.onSelect(s.key)}
                    aria-pressed={highlighted}
                    className={cardClass}
                  >
                    {body}
                  </button>
                ) : (
                  <div className={cardClass}>{body}</div>
                )}
              </li>
            );
          })}
        </ol>
        {/* 有跳舞經驗的人看到這段會以為網站只收新手（舞者朋友實測回饋 2026/11/19），
            給他們一個直接去課表的出口，看得到中階／進階班。/beginners 不需要。 */}
        {!selectable && (
          <div className="mt-6 flex justify-center">
            <Button asChild variant="link">
              <Link href="/courses?tab=schedule">
                已經會跳了？
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
