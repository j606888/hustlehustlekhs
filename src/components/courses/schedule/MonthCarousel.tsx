'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import MonthOverview from './MonthOverview';
import { SHOW_MONTH_EVENT, isPast, type MonthConfig, type ShowMonthDetail } from './data';

type Selected = { year: number; month: number; day: number };

/**
 * 某個月預設要展開哪一天：今天之後第一個有常態課（有 trackId）的日子；
 * 整個月都過了就選最後一天有課的日子。now 是 null（還沒掛載）時不選。
 */
function pickDay(config: MonthConfig, now: Date | null): Selected | null {
  if (!now) return null;
  const days = Object.entries(config.highlights)
    .filter(([, hl]) => hl.trackId)
    .map(([day]) => Number(day))
    .sort((a, b) => a - b);
  if (days.length === 0) return null;
  const upcoming = days.find((d) => !isPast(`${config.month}/${d}`, config.year, now));
  return { year: config.year, month: config.month, day: upcoming ?? days[days.length - 1] };
}

/**
 * 月曆輪播：一次看一個月，用上方的月份分頁或手指滑動切換。
 *
 * 兩個月都留在 DOM（不是只 render 當前月份），這樣兩個月的課程資訊都會進
 * SSR 出來的靜態 HTML，搜尋引擎抓得到；切換只是把 scroll 位置移過去。
 * 捲動距離的量測沿用 src/components/home/Testimonials.tsx，
 * 但這裡刻意不做自動輪播 —— 課表要停在使用者正在看的那個月。
 */
export default function MonthCarousel({ months }: { months: MonthConfig[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  // 月曆被點選的日子（展開當天課表）。日期判斷要等掛載後才有 now，理由同下面「預設停在今天所在的月」。
  const [now, setNow] = useState<Date | null>(null);
  const [selected, setSelected] = useState<Selected | null>(null);
  useEffect(() => setNow(new Date()), []);

  // 換到另一個月時，如果目前點選的日子不在這個月，就自動選這個月接下來的第一堂
  useEffect(() => {
    const config = months[activeIndex];
    if (!config || !now) return;
    setSelected((prev) =>
      prev && prev.year === config.year && prev.month === config.month
        ? prev
        : pickDay(config, now)
    );
  }, [activeIndex, months, now]);

  // 一頁的捲動距離直接從 DOM 量（第二頁的左緣減第一頁的左緣），
  // 不假設它等於 clientWidth，之後 track 若加上內距也不會算錯。
  const getStep = () => {
    const scroller = scrollerRef.current;
    const first = scroller?.firstElementChild as HTMLElement | null;
    if (!scroller || !first) return 0;
    const second = first.nextElementSibling as HTMLElement | null;
    return second ? second.offsetLeft - first.offsetLeft : first.offsetWidth;
  };

  const syncScrollState = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const step = getStep();
    if (step <= 0) return;
    const index = Math.min(
      Math.round(scroller.scrollLeft / step),
      months.length - 1
    );
    setActiveIndex((prev) => (prev === index ? prev : index));
  }, [months.length]);

  // 捲動事件用 rAF 節流，避免每一幀都 setState
  const handleScroll = () => {
    if (frameRef.current !== null) return;
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      syncScrollState();
    });
  };

  useEffect(() => {
    window.addEventListener('resize', syncScrollState);
    return () => {
      window.removeEventListener('resize', syncScrollState);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [syncScrollState]);

  // 預設停在「今天所在的那個月」。
  // 預渲染的 HTML 一律從第一個月開始（build 當下的日期會過期，不能寫進 HTML，
  // 跟 TrackCard 用 useEffect 重算「已結束」場次是同一個理由），
  // 掛載後才用瀏覽器當下日期跳過去；找不到當月就維持第一個月。
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const now = new Date();
    const index = months.findIndex(
      (m) => m.year === now.getFullYear() && m.month === now.getMonth() + 1
    );
    if (index <= 0) return;
    scroller.scrollTo({ left: index * getStep(), behavior: 'instant' });
    setActiveIndex(index);
  }, [months]);

  const scrollToIndex = (index: number) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollTo({ left: index * getStep(), behavior: 'smooth' });
  };

  // 課表卡的場次圓點被點時：切到那個月，再把月曆捲進畫面（scroll-mt 留出導覽列的高度）
  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const onShowMonth = (e: Event) => {
      const { year, month } = (e as CustomEvent<ShowMonthDetail>).detail;
      const index = months.findIndex((m) => m.year === year && m.month === month);
      if (index < 0) return;
      scrollerRef.current?.scrollTo({ left: index * getStep(), behavior: 'smooth' });
      sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    window.addEventListener(SHOW_MONTH_EVENT, onShowMonth);
    return () => window.removeEventListener(SHOW_MONTH_EVENT, onShowMonth);
  }, [months]);

  const showControls = months.length > 1;
  const activePoster = months[activeIndex]?.poster;

  return (
    <section ref={sectionRef} className="w-full scroll-mt-24">
      {/* 品牌抬頭固定在輪播外面，不隨月份切換 */}
      <div className="flex flex-col">
        <p className="font-poppins text-sm font-bold tracking-[0.2em] text-eyebrow md:text-base">
          HUSTLEHUSTLE KHS
        </p>
        <p className="font-poppins text-xs font-medium tracking-[0.3em] text-ink-500 md:text-sm">
          {/* 月份跨年（例如 11 月到隔年 1 月）就寫成 2026–2027 */}
          {[...new Set(months.map((m) => m.year))].join('–')} SCHEDULE
        </p>
      </div>

      {/* 月份分頁：把有哪幾個月直接攤開來，不用點也知道還有下個月可以看
          （之前只有兩顆箭頭，掃過去看不出來那是切換月份用的）。
          月份多到四、五個時這一列會塞不下，那時要改成可橫捲的月份列。 */}
      {showControls && (
        <div className="mt-4 flex w-fit gap-1 rounded-full bg-ink-100 p-1">
          {months.map((month, index) => {
            const active = index === activeIndex;
            return (
              <button
                key={`${month.year}-${month.month}`}
                type="button"
                onClick={() => scrollToIndex(index)}
                aria-label={`看${month.titleZh}課表`}
                aria-current={active}
                className={`cursor-pointer rounded-full px-5 py-2 text-sm transition ${
                  active
                    ? 'bg-heading font-semibold text-white'
                    : 'font-medium text-ink-500 hover:text-ink-700'
                }`}
              >
                {month.titleZh}
              </button>
            );
          })}
        </div>
      )}

      {/* 一頁一個月：原生 scroll-snap，手機用手指滑、桌機用月份分頁或觸控板。
          slide 寬度剛好等於捲動容器寬度，所以畫在元素框「外面」的外框會被 overflow 裁掉 ——
          月曆卡片因此用 ring-inset（見 MonthOverview），把外框畫進框內。
          這裡不留左右內距，否則內距那一段會透出隔壁月份的內容。 */}
      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        className="mt-4 flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {months.map((month) => (
          <div
            key={`${month.year}-${month.month}`}
            className="w-full shrink-0 snap-start"
          >
            <MonthOverview
              config={month}
              now={now}
              selectedDay={
                selected && selected.year === month.year && selected.month === month.month
                  ? selected.day
                  : null
              }
              onSelectDay={(day) => setSelected({ year: month.year, month: month.month, day })}
            />
          </div>
        ))}
      </div>

      {/* 目前這個月的 IG 課表海報，縮成一列小卡：海報自己的配色（米底、橘紅字）跟官網不同，
          整張攤開會搶走月曆的主角位置；縮圖＋官網樣式的卡片框，想看的人點開看大圖。
          放在輪播外面：放進每一頁的話，有海報的月份會把整個輪播撐高。 */}
      {activePoster && (
        <a
          href={activePoster.src}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 flex items-center gap-4 rounded-2xl bg-card p-3 shadow-sm ring-1 ring-ink-200 transition hover:ring-brand"
        >
          <Image
            src={activePoster.src}
            alt={activePoster.alt}
            width={activePoster.width}
            height={activePoster.height}
            sizes="72px"
            className="h-24 w-[72px] flex-shrink-0 rounded-lg object-cover ring-1 ring-ink-100"
          />
          <span className="flex flex-col gap-0.5">
            <span className="text-base font-bold text-heading">
              {months[activeIndex]?.titleZh} IG 課表海報
            </span>
            <span className="text-sm text-ink-600">點開看大圖，存下來或分享給朋友 →</span>
          </span>
        </a>
      )}
    </section>
  );
}
