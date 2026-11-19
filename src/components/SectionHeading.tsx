import React from 'react';

// 全站共用的區塊／頁面標題：小標（.eyebrow，跟首圖同一種寬字距小字）→ 標題 → 1px 品牌色細線 → 灰色副標。
// 以前是粗體品牌色小標＋4px 粉色圓角短線，跟首圖的精品風格不搭，改成細字細線。
// size='md' 給首頁區塊，size='lg' 給頁面層級的頁首（如 /teachers）。
// 小標與副標都可以不給（例如 /location 只留標題）。
type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  /** 只要一行的副標用 'nowrap'：禁止斷行，手機上字級跟著螢幕寬度縮小。 */
  subtitleFit?: 'wrap' | 'nowrap';
  /** 'page-compact'：桌機跟 lg 一樣大，手機縮小成一行（給課表頁這種要把空間留給內容的頁首）。 */
  size?: 'md' | 'lg' | 'page-compact';
  /** 頁面層級的頁首用 'h1'，首頁區塊用預設的 'h2'。 */
  as?: 'h1' | 'h2';
  className?: string;
};

const SectionHeading = ({
  eyebrow,
  title,
  subtitle,
  subtitleFit = 'wrap',
  size = 'md',
  as: Tag = 'h2',
  className = '',
}: Props) => {
  const titleSize =
    size === 'lg'
      ? 'text-3xl md:text-5xl'
      : size === 'page-compact'
        ? // 手機要一行放完（例如「高雄 Hustle / Zouk 課表選課」），加字距會擠成兩行，所以字距只在桌機加
          'text-2xl md:text-5xl md:tracking-[0.06em]'
        : 'text-2xl md:text-3xl';
  // 標題字距跟首圖 h1 一樣（0.06em）
  const titleTracking = size === 'page-compact' ? '' : 'tracking-[0.06em]';
  // nowrap：約 22 個全形字 × 4vw ≈ 88vw，320px 的小手機扣掉左右留白也放得下
  const subtitleClass =
    subtitleFit === 'nowrap'
      ? 'whitespace-nowrap text-[clamp(0.8rem,4vw,1rem)] text-ink-600 md:text-lg'
      : 'max-w-md text-base text-ink-600 md:text-lg';

  return (
    <div className={`flex flex-col items-center text-center gap-3 ${className}`}>
      {eyebrow && (
        <p className="eyebrow text-brand-strong">
          {eyebrow}
        </p>
      )}
      {/* text-balance：標題換行時讓每行一樣長，不會剩兩個字孤零零在第二行（例如「…課表 / 選課」） */}
      <Tag className={`font-bold text-heading text-balance ${titleTracking} ${titleSize}`}>{title}</Tag>
      <span aria-hidden className="h-px w-10 bg-brand" />
      {subtitle && <p className={subtitleClass}>{subtitle}</p>}
    </div>
  );
};

export default SectionHeading;
