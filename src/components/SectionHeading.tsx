import React from 'react';

// 全站共用的區塊／頁面標題：品牌色小標 → 標題 → 品牌色短線 → 灰色副標。
// size='md' 給首頁區塊，size='lg' 給頁面層級的頁首（如 /teachers）。
// 小標與副標都可以不給（例如 /location 只留標題）。
type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  /** 只要一行的副標用 'nowrap'：禁止斷行，手機上字級跟著螢幕寬度縮小。 */
  subtitleFit?: 'wrap' | 'nowrap';
  size?: 'md' | 'lg';
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
  const titleSize = size === 'lg' ? 'text-3xl md:text-5xl' : 'text-2xl md:text-3xl';
  // nowrap：約 22 個全形字 × 4vw ≈ 88vw，320px 的小手機扣掉左右留白也放得下
  const subtitleClass =
    subtitleFit === 'nowrap'
      ? 'whitespace-nowrap text-[clamp(0.8rem,4vw,1rem)] text-ink-600 md:text-lg'
      : 'max-w-md text-base text-ink-600 md:text-lg';

  return (
    <div className={`flex flex-col items-center text-center gap-2 ${className}`}>
      {eyebrow && (
        <p className="text-sm font-semibold tracking-widest text-brand md:text-base">
          {eyebrow}
        </p>
      )}
      <Tag className={`font-bold text-ink-900 ${titleSize}`}>{title}</Tag>
      <span className="w-12 h-1 rounded-full bg-brand" />
      {subtitle && <p className={subtitleClass}>{subtitle}</p>}
    </div>
  );
};

export default SectionHeading;
