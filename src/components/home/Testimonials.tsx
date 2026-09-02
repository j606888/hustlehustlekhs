'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronDown, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import SectionHeading from '@/components/SectionHeading';

// 自動輪播：刻意慢，讓人來得及讀完一行再移動
const AUTO_SPEED = 26; // px / 秒
const END_HOLD = 900; // ms，捲到頭尾停一下再往回
const RESUME_DELAY = 2000; // ms，使用者操作完隔多久才恢復自動

type TestimonialType = {
  id: string;
  name: string;
  title: string;
  image: string;
  content: string[];
  danceStyle: string;
};

const Testimonial = ({ testimonial }: { testimonial: TestimonialType }) => {
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // 只有內文真的被截掉時才顯示「看更多」——像 Nora 那種只有一段的心得不該出現無作用的按鈕。
  // 展開時不量測（此時 scrollHeight === clientHeight），否則按鈕會在展開後消失。
  useEffect(() => {
    if (expanded) return;
    const measure = () => {
      const el = contentRef.current;
      if (!el) return;
      setOverflows(el.scrollHeight > el.clientHeight + 1);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [expanded]);

  return (
    <div className="flex h-full flex-col rounded-2xl bg-brand-light p-6 ring-1 ring-brand/15 transition duration-200 hover:ring-brand/30 md:p-7">
      <div className="flex flex-col items-center text-center">
        <div className="w-24 h-24 relative mb-4">
          <Image
            src={testimonial.image}
            alt={testimonial.name}
            fill
            sizes="96px"
            className="rounded-full object-cover ring-4 ring-white"
          />
        </div>
        <h3 className="text-xl font-bold text-gray-900">{testimonial.name}</h3>
        <p className="text-sm text-gray-500">{testimonial.title}</p>
        <span className="mt-3 rounded-full bg-white px-3 py-1 text-xs font-medium text-brand-strong ring-1 ring-brand/15">{testimonial.danceStyle} 學員</span>
      </div>
      {/* 引號當作心得段落的起點，內文改左對齊以利長段閱讀 */}
      <Quote className="mt-6 mb-3 shrink-0 text-brand/25 fill-brand/25" size={28} />
      <div className="relative">
        <div
          ref={contentRef}
          className={`space-y-3 overflow-hidden text-left text-sm text-gray-700 leading-relaxed transition-[max-height] duration-300 md:text-base ${
            expanded ? 'max-h-[200rem]' : 'max-h-48'
          }`}
        >
          {testimonial.content.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
        {!expanded && overflows && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-brand-light to-transparent" />
        )}
      </div>
      {overflows && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          aria-expanded={expanded}
          className="mt-3 inline-flex cursor-pointer items-center gap-1 self-start text-sm font-medium text-brand hover:underline"
        >
          {expanded ? '收合' : '看更多'}
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          />
        </button>
      )}
    </div>
  );
};

const Testimonials = ({ testimonials }: { testimonials: TestimonialType[] }) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  // 自動輪播的暫停條件：滑鼠移上去、按住、鍵盤 focus 進來、捲出畫面外
  const hoverRef = useRef(false);
  const pressingRef = useRef(false);
  const focusedRef = useRef(false);
  const onScreenRef = useRef(true);
  const resumeAtRef = useRef(0);
  // 自動輪播每一幀都會觸發 scroll，值沒變就不要 setState，否則等於每秒 60 次 re-render
  const lastSyncRef = useRef({ activeIndex: -1, atStart: true, atEnd: false, stops: -1 });
  const [activeIndex, setActiveIndex] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  // 點點的數量 = 實際捲得到的停靠點，不是卡片數。桌機一次露出 2.25 張，
  // 捲到底時後面幾張已經在畫面上了，所以停靠點會比卡片少。
  const [pageCount, setPageCount] = useState(testimonials.length);

  // 一頁的捲動距離 = 卡片寬 + gap，直接從 DOM 量，才不用把斷點寬度重寫一份在 JS 裡
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
    const maxScroll = scroller.scrollWidth - scroller.clientWidth;
    const reachedEnd = scroller.scrollLeft >= maxScroll - 1;
    const stops =
      step > 0 ? Math.min(Math.ceil(maxScroll / step) + 1, testimonials.length) : 1;
    const reachedStart = scroller.scrollLeft <= 1;
    // 捲到底時 scrollLeft 未必等於最後一個停靠點的整數倍，所以直接點亮最後一顆
    const index = reachedEnd
      ? stops - 1
      : step > 0
        ? Math.min(Math.round(scroller.scrollLeft / step), stops - 1)
        : 0;

    const prev = lastSyncRef.current;
    if (prev.atStart !== reachedStart) setAtStart(reachedStart);
    if (prev.atEnd !== reachedEnd) setAtEnd(reachedEnd);
    if (prev.stops !== stops) setPageCount(stops);
    if (prev.activeIndex !== index) setActiveIndex(index);
    lastSyncRef.current = { activeIndex: index, atStart: reachedStart, atEnd: reachedEnd, stops };
  }, [testimonials.length]);

  // 捲動事件用 rAF 節流，避免每一幀都 setState
  const handleScroll = () => {
    if (frameRef.current !== null) return;
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      syncScrollState();
    });
  };

  useEffect(() => {
    syncScrollState();
    window.addEventListener('resize', syncScrollState);
    return () => {
      window.removeEventListener('resize', syncScrollState);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [syncScrollState]);

  // 使用者操作後暫停自動輪播，並把 snap 交還給 class 的 mandatory，
  // 手動捲動 / 箭頭 / 點點才會對齊到卡片起點
  const pauseAuto = useCallback((ms = RESUME_DELAY) => {
    resumeAtRef.current = performance.now() + ms;
    if (scrollerRef.current) scrollerRef.current.style.scrollSnapType = '';
  }, []);

  // 自動輪播：每一幀推進一點點，到頭尾停一下再往回，不做無縫循環
  // （無縫循環要複製一份卡片到 DOM，對讀屏與 SEO 都是重複內容）
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    // 使用者關掉動畫效果就完全不自動捲
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    let last = 0;
    let direction: 1 | -1 = 1;
    let holdUntil = 0;
    let pos = scroller.scrollLeft;

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = last ? Math.min(now - last, 100) : 0;
      last = now;

      const blocked =
        hoverRef.current ||
        pressingRef.current ||
        focusedRef.current ||
        !onScreenRef.current ||
        document.hidden ||
        now < resumeAtRef.current;

      if (blocked || dt === 0) {
        pos = scroller.scrollLeft; // 停著的時候跟著使用者的捲動位置走
        return;
      }
      // mandatory snap 會把每一幀的小位移吸回卡片起點，自動捲期間必須關掉
      if (scroller.style.scrollSnapType !== 'none') {
        scroller.style.scrollSnapType = 'none';
        pos = scroller.scrollLeft;
      }
      if (now < holdUntil) return;

      const max = scroller.scrollWidth - scroller.clientWidth;
      if (max <= 1) return;

      pos += direction * AUTO_SPEED * (dt / 1000);
      if (pos >= max) {
        pos = max;
        direction = -1;
        holdUntil = now + END_HOLD;
      } else if (pos <= 0) {
        pos = 0;
        direction = 1;
        holdUntil = now + END_HOLD;
      }
      scroller.scrollLeft = pos;
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // 捲出畫面外就不用動，省得使用者回來時已經停在最後一張
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        onScreenRef.current = entry.isIntersecting;
      },
      { threshold: 0.2 }
    );
    io.observe(scroller);
    return () => io.disconnect();
  }, []);

  const scrollByPage = (direction: 1 | -1) => {
    pauseAuto();
    scrollerRef.current?.scrollBy({ left: direction * getStep(), behavior: 'smooth' });
  };

  const scrollToIndex = (index: number) => {
    pauseAuto();
    scrollerRef.current?.scrollTo({ left: index * getStep(), behavior: 'smooth' });
  };

  return (
    <section className="py-8 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <SectionHeading
          eyebrow="真實學員回饋"
          title="學生心得"
          subtitle="從不敢下場，到自在享受每一支舞"
          className="mb-8 md:mb-12"
        />
      </div>

      {/* 橫向 carousel：用原生 scroll-snap，手機用手指滑、桌機用觸控板或下方箭頭。
          刻意掛在 section 底下、不放進 max-w-7xl 容器裡，卡片才能左右都延伸到螢幕邊；
          左邊再用 padding 把第一張推回與標題切齊的位置（xl 以上容器被 max-w-7xl 卡住，
          左內距要自己算）。padding 的百分比是對 section 寬度算的，不用 vw，
          所以不會因為捲軸寬度而讓整頁多出水平捲軸。
          scroll-pl 要跟 pl 一致，snap-start 才會對齊到同一條線而不是貼著螢幕左緣。 */}
      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        onMouseEnter={() => {
          hoverRef.current = true;
        }}
        onMouseLeave={() => {
          hoverRef.current = false;
        }}
        onPointerDown={() => {
          pressingRef.current = true;
          pauseAuto(0);
        }}
        onPointerUp={() => {
          pressingRef.current = false;
          pauseAuto();
        }}
        onPointerCancel={() => {
          pressingRef.current = false;
          pauseAuto();
        }}
        onFocus={() => {
          focusedRef.current = true;
        }}
        onBlur={() => {
          focusedRef.current = false;
        }}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-4 pb-2 scroll-pl-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:gap-6 md:px-6 md:scroll-pl-6 lg:px-8 lg:scroll-pl-8 xl:pl-[calc((100%-80rem)/2+2rem)] xl:scroll-pl-[calc((100%-80rem)/2+2rem)]"
      >
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="w-[300px] shrink-0 snap-start md:w-[340px] lg:w-[368px]"
          >
            <Testimonial testimonial={testimonial} />
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => scrollByPage(-1)}
            disabled={atStart}
            aria-label="上一則心得"
            className="hidden h-10 w-10 cursor-pointer items-center justify-center rounded-full text-gray-600 ring-1 ring-gray-200 transition hover:bg-gray-50 disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent md:flex"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex gap-2">
            {Array.from({ length: pageCount }, (_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => scrollToIndex(index)}
                aria-label={`看第 ${index + 1} 則心得`}
                className={`h-2 rounded-full transition-all duration-300 ease-in-out cursor-pointer ${
                  index === activeIndex ? 'bg-brand w-6' : 'bg-gray-300 w-2 hover:w-4'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => scrollByPage(1)}
            disabled={atEnd}
            aria-label="下一則心得"
            className="hidden h-10 w-10 cursor-pointer items-center justify-center rounded-full text-gray-600 ring-1 ring-gray-200 transition hover:bg-gray-50 disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent md:flex"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
