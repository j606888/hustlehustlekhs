'use client'

import React from 'react';

interface DanceTheme {
  pageBg: string;   // 卡片背景
  accentText: string; // 重點文字色（主題色）
  accentBg: string;   // badge / pill 底色
  chipText: string;   // chip 文字色
}

interface DanceStyle {
  id: string;
  nameEn: string;
  nameZh: string;
  origin: string;
  /** YouTube 影片 ID（網址 ?v= 後面那一段）。留空就不顯示影片區塊。 */
  youtubeId?: string;
  tagline: string;
  description: string[];
  traits: string[];
  beginnerFriendly?: boolean;
  theme: DanceTheme;
}

// 沿用課表/費用頁配色，讓整個課程區視覺一致。
// class 都寫成完整字面字串，讓 Tailwind v4 JIT 掃得到。
const THEMES: Record<'coral' | 'gold' | 'blue', DanceTheme> = {
  coral: {
    pageBg: 'bg-[#f5e7d8]',
    accentText: 'text-[#d4796e]',
    accentBg: 'bg-[#d4796e]',
    chipText: 'text-[#d4796e]',
  },
  gold: {
    pageBg: 'bg-[#f7ead4]',
    accentText: 'text-[#d28e2a]',
    accentBg: 'bg-[#e0a23c]',
    chipText: 'text-[#d28e2a]',
  },
  blue: {
    pageBg: 'bg-[#cfe0f5]',
    accentText: 'text-[#4d7fc4]',
    accentBg: 'bg-[#5b8dd9]',
    chipText: 'text-[#4d7fc4]',
  },
};

// TODO: 文案需要 HustleHustle KHS 校對 —— 下面關於 Hustle 的敘述是通用說法，
//       但「我們怎麼教、強調什麼」應該換成你們自己的說法。
//       youtubeId 也待補：填示範影片網址 ?v= 後面那一段，留空則不顯示影片區塊。
//       之後若開第二種舞（例如 Salsa / Zouk），照著複製一個物件、換一組 THEMES 即可。
const DANCE_STYLES: DanceStyle[] = [
  {
    id: 'hustle',
    nameEn: 'HUSTLE',
    nameZh: '哈梭',
    origin: '源自 1970 年代的紐約 disco 舞廳',
    youtubeId: undefined, // TODO: 補上示範影片的 YouTube ID
    tagline: '明快、好玩，跟著 disco 節奏轉起來',
    description: [
      'Hustle 是 1970 年代從紐約 disco 場景長出來的雙人社交舞。節奏明快、旋轉多，配 disco、funk 或現在的流行音樂都很合，是那種一聽到音樂就會想動起來的舞。',
      '它的核心是兩個人之間的牽引與回彈——leader 給訊號、follower 接住再回應。步伐本身不複雜，難的是那份默契，也正因為如此，越跳越有意思。',
    ],
    traits: ['節奏明快', '大量旋轉', '牽引回彈', 'disco / 流行音樂'],
    beginnerFriendly: true,
    theme: THEMES.coral,
  },
];

export default function Introduction() {
  return (
    <div className="bg-white">
      <div className="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-8 md:gap-10 md:px-6 md:py-12">
        <div className="flex flex-col gap-3">
          <h2 className="font-poppins text-2xl font-bold text-[#2d3a5e] md:text-3xl">
            舞蹈風格介紹
          </h2>
          <p className="text-sm text-gray-600 md:text-base">
            先看看 Hustle 是什麼樣的舞，感受一下它在跳什麼，再決定要不要來試一堂。
          </p>
          <div className="flex items-start gap-3 rounded-2xl border border-[#e8c9c3] bg-[#fbeae6] px-4 py-3.5">
            <span className="text-xl leading-none" aria-hidden>✨</span>
            <p className="text-sm text-[#2d3a5e] md:text-base">
              <strong>沒有任何舞蹈經驗？</strong>沒問題——我們的課程從零開始教，不需要舞伴，第一堂課就能跳起來。
            </p>
          </div>
        </div>

        {DANCE_STYLES.map((dance) => (
          <DanceCard key={dance.id} dance={dance} />
        ))}
      </div>
    </div>
  );
}

function DanceCard({ dance }: { dance: DanceStyle }) {
  const { theme } = dance;

  return (
    <section
      id={dance.id}
      className={`scroll-mt-20 overflow-hidden rounded-3xl p-5 shadow-sm md:p-8 ${theme.pageBg}`}
    >
      {/* 標頭 */}
      <div className="flex flex-col leading-none">
        <span
          className={`font-poppins text-4xl font-bold md:text-6xl ${theme.accentText}`}
          style={{ textShadow: '3px 3px 0 rgba(45,58,94,0.18)' }}
        >
          {dance.nameEn}
        </span>
        <span className="mt-2 font-poppins text-xl font-bold text-[#2d3a5e] md:text-2xl">
          {dance.nameZh}
        </span>
        <span className="mt-1 text-sm text-gray-600">{dance.origin}</span>
      </div>

      {/* 新手入門 badge */}
      {dance.beginnerFriendly && (
        <div className="mt-4">
          <span
            className={`inline-block rounded-full px-3 py-1 text-xs font-bold text-white md:text-sm ${theme.accentBg}`}
          >
            ✨ 最適合新手入門
          </span>
        </div>
      )}

      {/* 影片：還沒填 youtubeId 就整塊不渲染，不要留一個空的 iframe */}
      {dance.youtubeId && (
        <div
          className="relative mt-5 w-full overflow-hidden rounded-2xl shadow-sm"
          style={{ paddingBottom: '56.25%' }}
        >
          <iframe
            className="absolute left-0 top-0 h-full w-full"
            src={`https://www.youtube.com/embed/${dance.youtubeId}`}
            title={`${dance.nameEn} demo`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      )}

      {/* tagline + 介紹 */}
      <p className={`mt-5 font-poppins text-lg font-bold md:text-xl ${theme.accentText}`}>
        {dance.tagline}
      </p>
      <div className="mt-3 flex flex-col gap-3">
        {dance.description.map((para, i) => (
          <p key={i} className="text-sm leading-relaxed text-[#2d3a5e] md:text-base">
            {para}
          </p>
        ))}
      </div>

      {/* 風格特色 chips */}
      <div className="mt-5 flex flex-col gap-2">
        <p className="text-xs font-medium text-gray-500">風格特色</p>
        <div className="flex flex-wrap gap-1.5">
          {dance.traits.map((trait) => (
            <span
              key={trait}
              className={`rounded-full border border-current bg-white px-3 py-1 text-xs font-medium md:text-sm ${theme.chipText}`}
            >
              {trait}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
