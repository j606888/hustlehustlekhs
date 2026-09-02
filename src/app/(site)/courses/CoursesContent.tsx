'use client'

import React, { useState, useEffect, useCallback } from 'react';
import Introduction from '@/components/courses/Introduction';
import ScheduleBoard from '@/components/courses/schedule/ScheduleBoard';
import PricingBoard from '@/components/courses/schedule/PricingBoard';
import SectionHeading from '@/components/SectionHeading';

const TABS = [
  { label: '課表', query: 'schedule' },
  { label: '費用', query: 'pricing' },
  { label: '風格介紹', query: 'introduction' },
]

const DEFAULT_TAB = TABS[0].query;

// 這兩個 tab 的內容有帶 id 的錨點區塊（價目方案、舞風介紹），網址帶 hash 進來要能捲過去。
const HASH_TABS = ['pricing', 'introduction'];

function tabFromSearch(search: string): string {
  const tab = new URLSearchParams(search).get('tab');
  return TABS.some((t) => t.query === tab) ? (tab as string) : DEFAULT_TAB;
}

// 刻意不用 next/navigation 的 useSearchParams：它會讓這個元件在靜態產生時
// 跳過預渲染，產出的 HTML 只剩 Suspense fallback，三個 tab 的文字（尤其是
// Introduction 裡唯一一份 Brazilian Zouk 介紹）就完全不會進 HTML。
// 改成自己讀 window.location.search：整頁能靜態預渲染，JS 載入後才切 tab。
export default function CoursesContent() {
  const [activeTab, setActiveTab] = useState(DEFAULT_TAB);

  // 首次掛載時對齊網址，並監聽上一頁／下一頁。
  // 網址沒帶 tab 就維持預設，不主動改寫網址 —— canonical 宣告的是 /courses，
  // 一載入就 push 成 /courses?tab=schedule 會讓 Google 收到互相矛盾的訊號。
  useEffect(() => {
    const sync = () => setActiveTab(tabFromSearch(window.location.search));
    sync();
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, []);

  // 帶 hash 進來時（課表卡的「查看費用 →」/courses?tab=pricing#plan-id，
  // 或首頁 Q&A 連到 /courses?tab=introduction#hustle），切好 tab 後把該區塊捲入畫面。
  useEffect(() => {
    if (!HASH_TABS.includes(activeTab)) return;
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const timer = setTimeout(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const handleTabClick = useCallback((tab: string) => {
    setActiveTab(tab);
    // pushState 而不是 router.push：三個 tab 的內容都已經在 DOM 裡，不需要
    // 走 Next 的導航流程，只要讓網址可分享、上一頁可退回。
    window.history.pushState(null, '', `/courses?tab=${tab}`);
  }, []);

  return (
    <>
      <div className="w-full px-4 py-10 flex flex-col items-center justify-center md:px-6">
        <SectionHeading
          as="h1"
          size="lg"
          eyebrow="課表・費用・風格"
          title="高雄 Hustle / Zouk 課程資訊"
          subtitle="高雄唯一同時教 Hustle 與 Brazilian Zouk 兩種雙人舞的教室，課表、費用與舞風介紹都在這裡"
        />
      </div>
      <div className="flex justify-center px-3 border-b border-[#E3E3E3] md:px-6">
        {TABS.map(tab => (
          <div
            key={tab.query}
            className={`px-4 py-4 relative hover:cursor-pointer ${tab.query === activeTab ? 'after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-brand' : ''}`}
            onClick={() => handleTabClick(tab.query)}
          >
            <div className={`text-sm md:text-base ${tab.query === activeTab ? 'text-brand font-bold' : 'text-gray-600'}`}>{tab.label}</div>
          </div>
        ))}
      </div>
      {/* 三個 tab 一律渲染、非 active 的用 hidden 藏起來（而不是條件渲染），
          讓課表／價格／舞風介紹的文字全部進入靜態 HTML。 */}
      <div className={activeTab === 'schedule' ? undefined : 'hidden'}>
        <ScheduleBoard />
      </div>
      <div className={activeTab === 'pricing' ? undefined : 'hidden'}>
        <PricingBoard />
      </div>
      <div className={activeTab === 'introduction' ? undefined : 'hidden'}>
        <Introduction />
      </div>
    </>
  );
}
