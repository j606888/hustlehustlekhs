'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LINKS } from '@/constants/links';
import { TRACKS } from '@/components/courses/schedule/data';

const trialPrice = TRACKS[0]?.trial.priceNote ?? '';

// 手機版首頁底部固定的報名列。首頁第一屏沒有按鈕（業主 2026/11/16 要求簡化），
// 這條讓人一打開就看得到報名入口，滑到哪裡都按得到。
//
// 只在頁面的開頭（STEP 1 報名按鈕）和最底部（BottomCta、頁尾）收起來 —— 這兩處標了 data-enroll-cta。
// 中間的「新手班的一堂課長這樣」雖然也有報名按鈕，但刻意不標：
// 橫幅在中段忽隱忽現反而讓人困惑（業主 2026/11/18 回饋），一路保持顯示比較直觀。
// 桌機版不顯示（導覽列已有入口）。
export default function MobileEnrollBar() {
  // 預設收起：伺服器端算不出捲動位置，等 observer 算完再滑出來，避免閃一下。
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const targets = document.querySelectorAll('[data-enroll-cta], footer');
    if (targets.length === 0) {
      setVisible(true);
      return;
    }
    const inView = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) inView.add(e.target);
        else inView.delete(e.target);
      }
      setVisible(inView.size === 0);
    });
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 border-t border-ink-200 bg-background/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-4px_16px_rgba(0,0,0,0.06)] backdrop-blur md:hidden',
        'transition-[transform,visibility] duration-300 motion-reduce:transition-none',
        visible ? 'visible translate-y-0' : 'invisible translate-y-full'
      )}
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
  );
}
