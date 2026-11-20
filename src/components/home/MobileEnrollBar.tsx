'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LINKS } from '@/constants/links';
import { TRACKS } from '@/components/courses/schedule/data';

const trialPrice = TRACKS[0]?.trial.priceNote ?? '';

// 報名列從全顯示到全透明要捲動的距離（px）。數字越大，淡出越慢、越柔。
const FADE_DISTANCE = 200;

// 手機版首頁底部固定的報名列。首頁第一屏沒有按鈕（業主 2026/11/16 要求簡化），
// 這條讓人一打開就看得到報名入口，滑到哪裡都按得到。
//
// 只在頁面的開頭（STEP 1 報名按鈕）和最底部（BottomCta、頁尾）收起來 —— 這兩處標了 data-enroll-cta。
// 中間的「新手班的一堂課長這樣」雖然也有報名按鈕，但刻意不標：
// 橫幅在中段忽隱忽現反而讓人困惑（業主 2026/11/18 回饋），一路保持顯示比較直觀。
// 桌機版不顯示（導覽列已有入口）。
//
// 透明度跟著捲動位置走（業主 2026/11/20 要求）：那些按鈕/區塊離畫面邊緣還有 FADE_DISTANCE 時開始變淡，
// 碰到畫面邊緣時剛好全透明，所以滑到一半就是半透明，往回滑會再慢慢浮現。
export default function MobileEnrollBar() {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    const targets = Array.from(document.querySelectorAll('[data-enroll-cta], footer'));
    let frame = 0;

    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      // 找出離畫面最近的那個目標；在畫面內距離就是 0。
      let nearest = Infinity;
      for (const t of targets) {
        const r = t.getBoundingClientRect();
        const d = r.bottom <= 0 ? -r.bottom : r.top >= vh ? r.top - vh : 0;
        nearest = Math.min(nearest, d);
      }
      const opacity = Math.min(1, Math.max(0, nearest / FADE_DISTANCE));
      inner.style.opacity = String(opacity);
      inner.style.visibility = opacity === 0 ? 'hidden' : 'visible';
      // 快看不見的時候就不讓它擋住點擊，避免點到底下的內容卻按到半透明的按鈕。
      outer.style.pointerEvents = opacity < 0.5 ? 'none' : 'auto';
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  // iOS Safari 跑版修正：外層 fixed 容器本身不能有 transform / backdrop-filter / opacity 變化。
  // 有的話 iOS 會把它丟到獨立圖層，底部工具列捲動收起時圖層位置不會跟著更新，
  // 報名列就卡在半空中、下面露出內容。所以透明度改在內層 div，外層只負責貼底。
  return (
    <div ref={outerRef} className="pointer-events-none fixed inset-x-0 bottom-0 z-40 md:hidden">
      {/* 預設透明：伺服器端算不出捲動位置，等第一次計算完再顯示，避免閃一下。 */}
      <div
        ref={innerRef}
        className="invisible border-t border-ink-200 bg-background px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] opacity-0 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]"
      >
        <div className="mx-auto flex max-w-md items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-bold text-ink-900">零基礎體驗課</p>
            <p className="truncate text-xs text-ink-600">{trialPrice}</p>
          </div>
          <Button asChild size="lg" className="shrink-0">
            <Link href={LINKS.TRIAL_SIGNUP}>
              報名體驗課
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
