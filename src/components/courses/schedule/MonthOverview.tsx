import { cn } from '@/lib/utils';
import DayPanel from './DayPanel';
import { THEMES, TRACKS, isPast, type MonthConfig } from './data';

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

type Props = {
  config: MonthConfig;
  /** 這個月被點選的日子（沒有就是 null） */
  selectedDay: number | null;
  onSelectDay: (day: number) => void;
  now: Date | null;
};

// 品牌抬頭（HUSTLEHUSTLE KHS / 2026 SCHEDULE）不在這裡，
// 它固定在 MonthCarousel 上方、不隨月份切換。
export default function MonthOverview({ config, selectedDay, onSelectDay, now }: Props) {
  const { year, month, titleEn, titleZh, highlights, footnote } = config;

  // 被點選那天對應的課程線與場次（月曆格子的 trackId + 「月/日」對到 track.dates）
  const selectedHl = selectedDay ? highlights[selectedDay] : undefined;
  const selectedTrack = selectedHl?.trackId
    ? TRACKS.find((t) => t.id === selectedHl.trackId)
    : undefined;
  const selectedDate = selectedTrack?.dates.find((d) => d.label === `${month}/${selectedDay}`);

  const firstWeekday = new Date(year, month - 1, 1).getDay(); // 0 = 週日
  const daysInMonth = new Date(year, month, 0).getDate();

  // 前置空白 + 1..daysInMonth
  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <section className="w-full">
      {/* 月份標題：字級、字重、顏色跟全站區塊標題一致。
          以前是 IG 海報風格的超大英文月份加粉紅陰影，跟其他頁看起來像不同網站，已改掉。 */}
      <h2 className="flex items-baseline gap-2 text-heading">
        <span className="text-2xl font-bold md:text-3xl">{titleZh}</span>
        <span className="font-poppins text-sm font-semibold tracking-widest text-ink-500">
          {titleEn} {year}
        </span>
      </h2>

      {/* 月曆 */}
      {/* ring-inset：這張卡在輪播裡的寬度等於捲動容器寬度，
          外擴的 ring 會被 overflow 裁掉（左右兩側的線會不見），所以畫在框內。 */}
      <div className="mt-5 rounded-2xl bg-card p-3 shadow-sm ring-1 ring-inset ring-ink-200 md:p-5">
        <div className="grid grid-cols-7 gap-1 md:gap-2">
          {WEEKDAYS.map((w, i) => (
            <div
              key={w}
              className={`pb-1 text-center text-sm font-semibold md:text-base ${
                i === 0 ? 'text-calendar-sunday' : 'text-ink-400'
              }`}
            >
              {w}
            </div>
          ))}

          {cells.map((day, idx) => {
            if (day === null) return <div key={`b-${idx}`} />;
            const hl = highlights[day];
            if (!hl) {
              return (
                <div
                  key={day}
                  className="flex aspect-square items-center justify-center text-sm text-ink-400 md:text-base"
                >
                  {day}
                </div>
              );
            }
            const theme = THEMES[hl.theme];
            // 有體驗課／Party 的日子用深一階的同色，一眼看得出那天不只有固定課程
            const cellColor = hl.emphasis
              ? theme.highlightCellStrong
              : theme.highlightCell;
            const selected = selectedDay === day;
            // 已經過去的日子調淡，免得看起來還能報名（now 要等掛載後才有，預渲染時一律不調淡）
            const past = now !== null && isPast(`${month}/${day}`, year, now);
            const cellClass = cn(
              'flex aspect-square flex-col items-center justify-center overflow-hidden rounded-xl px-0.5 text-white shadow-sm transition-transform hover:scale-[1.04]',
              cellColor,
              past && !selected && 'opacity-35 shadow-none',
              selected && 'scale-[1.04] ring-[3px] ring-heading ring-offset-2 ring-offset-card'
            );
            // 手機上看不到標籤文字，用 aria-label 讓讀屏軟體還是念得出那天是什麼課
            const ariaLabel = `${month}/${day} ${hl.label.replace(/\n/g, ' ')}`;
            const content = (
              <>
                <span className="text-base font-bold leading-tight md:text-xl">{day}</span>
                {/* 手機的格子只有約 42px 寬，塞文字一定擠（「Lambada」會被拆成兩行），
                    所以手機只顯示日期，靠顏色＋下方圖例說明；有體驗課／Party 的日子
                    多一個小白點，跟深一階的底色一起提示。桌機格子夠大才顯示標籤。
                    whitespace-pre-line：label 裡的換行是刻意指定的斷行位置
                    （中文可以斷在任何字之間，不指定就會出現「Hustle 體驗 / 課」）。 */}
                {hl.emphasis && (
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-card md:hidden" />
                )}
                <span className="hidden w-full whitespace-pre-line break-words text-center text-xs leading-tight md:block">
                  {hl.label}
                </span>
              </>
            );
            // 不是常態課的日子（例如外地 Workshop）點了去別頁看介紹
            if (hl.href) {
              return (
                <a key={day} href={hl.href} aria-label={ariaLabel} className={cellClass}>
                  {content}
                </a>
              );
            }
            // 常態課的日子：點了在月曆下方展開當天課表與報名按鈕
            return (
              <button
                key={day}
                type="button"
                onClick={() => onSelectDay(day)}
                aria-label={`${ariaLabel}，看當天課表`}
                aria-pressed={selected}
                className={cn(cellClass, 'cursor-pointer')}
              >
                {content}
              </button>
            );
          })}
        </div>
      </div>

      {selectedTrack && selectedDate ? (
        <DayPanel track={selectedTrack} date={selectedDate} now={now} />
      ) : (
        <p className="mt-3 text-sm text-ink-500">點月曆上有顏色的日期，看當天課表和報名。</p>
      )}

      {/* 「時間和地點」圖例已移除（業主 2026/11/16）：點日期出現的當天課表已經有時間與地點。 */}
      <p className="mt-4 text-xs text-ink-500 md:text-sm">{footnote}</p>
    </section>
  );
}
