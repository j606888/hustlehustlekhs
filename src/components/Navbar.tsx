'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LINKS } from '@/constants/links'
import IGIcon from '@/components/icons/IGIcon';
import Wordmark from '@/components/Wordmark';
import { Button } from './ui/button';

const NAV_LINKS = [
  // /beginners 頂端先講「體驗課 → 新手班」兩步驟，所以叫「新手入門」而不是只寫新手班
  { name: '新手入門', href: LINKS.BEGINNERS },
  { name: '課表選課', href: '/courses' },
  { name: '課程報名', href: LINKS.ENROLL },
  { name: '師資介紹', href: '/teachers' },
  { name: '教室資訊', href: '/location' },
  // 之後要加「活動 / 派對」頁的話，在這裡加一行就會同時出現在桌機與手機選單。
];

/*
 * 版面參考精品官網：
 *   桌機兩列 —— 上列 wordmark 置中、IG 按鈕靠右；下列選單置中，目前頁面底下一條品牌色線。
 *   手機一列 —— 左邊選單鈕、中間 wordmark、右邊 IG 圖示。
 * 高度：手機 64px（h-16）、桌機 80 + 48 = 128px。(site)/layout.tsx 的 main 用 pt-16 md:pt-32
 * 讓出這個高度，改高度要一起改。
 */
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    const handleScroll = () => {
      setIsMenuOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-card border-b border-ink-100 z-50" ref={menuRef}>
      {/* 上列：wordmark 永遠在正中間，左右的按鈕用 absolute 疊上去，不會把它擠歪 */}
      <div className="relative flex h-16 items-center justify-center px-14 md:h-20">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="absolute left-2 inline-flex items-center justify-center rounded-md p-2 hover:bg-ink-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-ring md:hidden"
          aria-expanded={isMenuOpen}
          aria-label="開啟選單"
        >
          <Image src="/menu.svg" alt="" width={24} height={24} />
        </button>

        <Link href="/" aria-label="HustleHustle KHS 首頁" className="text-ink-900">
          {/* 手機 16 個字母加字距，320px 寬的手機也要放得下（左右各留 56px 給按鈕） */}
          <Wordmark className="text-[clamp(0.85rem,4.4vw,1.15rem)] md:text-[1.75rem]" />
        </Link>

        <Link
          href={LINKS.INSTAGRAM_DM}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="IG 私訊詢問"
          className="absolute right-2 inline-flex items-center justify-center rounded-md p-2 text-ink-900 hover:bg-ink-100 md:hidden"
        >
          <IGIcon className="h-6 w-6" />
        </Link>

        <Button asChild variant="outline" className="absolute right-6 hidden md:inline-flex lg:right-10">
          <Link href={LINKS.INSTAGRAM_DM} target="_blank" rel="noopener noreferrer">
            <IGIcon className="h-5 w-5" />
            IG 私訊詢問
          </Link>
        </Button>
      </div>

      {/* 下列（桌機）：選單置中 */}
      <div className="hidden h-12 items-stretch justify-center gap-10 md:flex lg:gap-14">
        {NAV_LINKS.map((link) => {
          const active = isActive(link.href);
          return (
            <Link
              key={link.name}
              href={link.href}
              aria-current={active ? 'page' : undefined}
              className={`relative flex items-center text-[15px] font-medium tracking-[0.12em] transition-colors duration-200 ${
                active ? 'text-ink-900' : 'text-ink-600 hover:text-ink-900'
              }`}
            >
              {link.name}
              <span
                className={`absolute inset-x-0 bottom-0 h-[3px] bg-brand transition-opacity ${
                  active ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </Link>
          );
        })}
      </div>

      {/* 手機展開選單 */}
      <div
        className={`${isMenuOpen
          ? 'max-h-[300px] opacity-100'
          : 'max-h-0 opacity-0'
          } overflow-hidden transition-all duration-300 ease-in md:hidden`}
      >
        <div className="px-4 pt-2 pb-3 space-y-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              aria-current={isActive(link.href) ? 'page' : undefined}
              className={`block px-1 py-2 text-base border-b border-ink-100 ${
                isActive(link.href) ? 'font-bold text-ink-900' : 'text-ink-800'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <Button asChild className="mt-3">
            <Link href={LINKS.INSTAGRAM_DM} target="_blank" rel="noopener noreferrer">
              <IGIcon className="w-6 h-6 text-white" />
              IG 私訊詢問
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
