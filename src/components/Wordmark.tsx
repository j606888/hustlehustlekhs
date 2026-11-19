import { cn } from '@/lib/utils';

/**
 * 文字版品牌字「HUSTLEHUSTLE KHS」：全大寫、單一字型（Montserrat）、單色、加寬字距。
 * 導覽列和頁尾共用這一個元件，字級與顏色由呼叫端用 className 給。
 *
 * 用文字而不是 SVG：字型由 next/font 載入，每台裝置長得一樣，顏色也能直接吃 text-* class
 * （舊的 public/logo.svg 要手動同步品牌色，頁尾還得用 invert 濾鏡反白）。
 * 之後有正式 logo 檔的話，換掉這個元件的內容即可。
 */
export default function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'font-wordmark font-semibold uppercase leading-none tracking-[0.16em] whitespace-nowrap',
        className,
      )}
    >
      HustleHustle KHS
    </span>
  );
}
