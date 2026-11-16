'use client';

import { useEffect, useState } from 'react';
import BeginnerPath, { BEGINNER_STEP_HASH, type BeginnerStepKey } from '@/components/BeginnerPath';
import EventCard from '@/components/enroll/EventCard';
import { LINKS } from '@/constants/links';
import {
  TRACKS,
  getCommonEventInfo,
  getUpcomingEvents,
} from '@/components/courses/schedule/data';

// /beginners 的主體：上面兩張步驟卡當切換鈕，下面依選擇顯示
//「體驗課」→ 近期體驗課場次（跟報名頁同一份資料）、「零基礎新手班」→ 新手班海報卡。
// 跟課表月曆「點不同天出現不同內容」是同一種操作。
//
// 兩塊內容都會渲染、非選中的用 hidden 藏起來（同 courses/CoursesContent.tsx 的做法），
// 靜態 HTML 裡兩邊的文字都在，搜尋引擎讀得到。
// 網址帶 #trial／#level1 時預先選好那一塊（首頁的「看近期體驗課」「看新手班」就是這樣連過來）。

type Props = {
  /** 新手班卡片（server 端渲染好傳進來，裡面有 next/image 海報） */
  level1Panel: React.ReactNode;
};

const DEFAULT_STEP: BeginnerStepKey = 'trial';

export default function BeginnerSwitcher({ level1Panel }: Props) {
  const [selected, setSelected] = useState<BeginnerStepKey>(DEFAULT_STEP);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const keyFromHash = () => {
      const hash = window.location.hash.slice(1);
      return (Object.keys(BEGINNER_STEP_HASH) as BeginnerStepKey[]).find(
        (k) => BEGINNER_STEP_HASH[k] === hash
      );
    };
    // 從別頁連進來：只選好那一塊，不捲動（讓人先看到上面兩張步驟卡）
    const initial = keyFromHash();
    if (initial) setSelected(initial);
    // 頁內連結（新手班卡片的「先上一次體驗課」）：切過去並捲到那一塊
    const onHashChange = () => {
      const key = keyFromHash();
      if (!key) return;
      setSelected(key);
      requestAnimationFrame(() =>
        document
          .getElementById(`panel-${key}`)
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      );
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const select = (key: BeginnerStepKey) => {
    setSelected(key);
    // 換網址但不跳動畫面，方便分享「直接打開體驗課／新手班」的連結
    window.history.replaceState(null, '', `#${BEGINNER_STEP_HASH[key]}`);
  };

  // 預渲染時（now 還沒算出來）用 epoch，等於全部場次都列出；掛載後才濾掉已辦完的（理由同 EnrollBoard）
  const trials = getUpcomingEvents('trial', now ?? new Date(0));
  const common = getCommonEventInfo(trials);
  // STEP 1 卡顯示的是 TRACKS[0].trial.priceNote；每場都是這個價才把卡片上的價格省略
  const priceShownAbove = common.priceNote !== null && common.priceNote === TRACKS[0]?.trial.priceNote;

  return (
    <div className="flex flex-col gap-8">
      <BeginnerPath selectable={{ selected, onSelect: select }} />

      <div
        id="panel-trial"
        className={selected === 'trial' ? 'flex scroll-mt-20 flex-col gap-3' : 'hidden'}
      >
        <h2 className="font-poppins text-xl font-bold text-heading md:text-2xl">近期體驗課</h2>
        {/* 價格上方 STEP 1 卡已經寫了；開始時間寫在每張卡的說明裡。
            卡片內容跟報名頁的體驗課卡一模一樣（同一個 EventCard、同樣的 hide 設定）。 */}
        <p className="-mt-1 text-sm text-ink-600">零基礎、不用舞伴，只來一次也可以，課後接 Party。</p>
        {trials.length > 0 ? (
          trials.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              hideStartTime
              hidePrice={priceShownAbove}
            />
          ))
        ) : (
          <p className="rounded-2xl border border-dashed border-ink-200 px-4 py-5 text-sm text-ink-500">
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
          </p>
        )}
      </div>

      <div
        id="panel-level1"
        className={selected === 'level1' ? 'flex scroll-mt-20 flex-col gap-3' : 'hidden'}
      >
        <h2 className="font-poppins text-xl font-bold text-heading md:text-2xl">零基礎新手班</h2>
        {level1Panel}
      </div>
    </div>
  );
}
