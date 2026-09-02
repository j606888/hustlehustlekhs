'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MonthOverview from './MonthOverview';
import type { MonthConfig } from './data';

/**
 * 月曆輪播：一次看一個月，左右箭頭 / 下方圓點 / 手指滑動切換。
 *
 * 兩個月都留在 DOM（不是只 render 當前月份），這樣兩個月的課程資訊都會進
 * SSR 出來的靜態 HTML，搜尋引擎抓得到；切換只是把 scroll 位置移過去。
 * 捲動、箭頭、圓點的寫法沿用 src/components/home/Testimonials.tsx，
 * 但這裡刻意不做自動輪播 —— 課表要停在使用者正在看的那個月。
 */
export default function MonthCarousel({ months }: { months: MonthConfig[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

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

  const showControls = months.length > 1;

  return (
    <section className="w-full">
      {/* 品牌抬頭固定在輪播外面，不隨月份切換 */}
      <div className="flex items-end justify-between gap-3">
        <div className="flex flex-col">
          <p className="font-poppins text-sm font-bold tracking-[0.2em] text-[#c47b5a] md:text-base">
            HUSTLEHUSTLE KHS
          </p>
          <p className="font-poppins text-xs font-medium tracking-[0.3em] text-gray-500 md:text-sm">
            {months[0]?.year} SCHEDULE
          </p>
        </div>

        {showControls && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => scrollToIndex(activeIndex - 1)}
              disabled={activeIndex === 0}
              aria-label="上一個月"
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-gray-600 ring-1 ring-gray-200 transition hover:bg-gray-50 disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent md:h-10 md:w-10"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={() => scrollToIndex(activeIndex + 1)}
              disabled={activeIndex === months.length - 1}
              aria-label="下一個月"
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-gray-600 ring-1 ring-gray-200 transition hover:bg-gray-50 disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent md:h-10 md:w-10"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      {/* 一頁一個月：原生 scroll-snap，手機用手指滑、桌機用箭頭或觸控板。
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
            <MonthOverview config={month} />
          </div>
        ))}
      </div>

      {showControls && (
        <div className="mt-5 flex justify-center gap-2">
          {months.map((month, index) => (
            <button
              key={`${month.year}-${month.month}`}
              type="button"
              onClick={() => scrollToIndex(index)}
              aria-label={`看${month.titleZh}課表`}
              aria-current={index === activeIndex}
              className={`h-2 cursor-pointer rounded-full transition-all duration-300 ease-in-out ${
                index === activeIndex
                  ? 'w-6 bg-brand'
                  : 'w-2 bg-gray-300 hover:w-4'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
