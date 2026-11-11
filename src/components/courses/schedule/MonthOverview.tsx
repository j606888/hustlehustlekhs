import { THEMES, type MonthConfig } from './data';

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

// 品牌抬頭（HUSTLEHUSTLE KHS / 2026 SCHEDULE）不在這裡，
// 它固定在 MonthCarousel 上方、不隨月份切換。
export default function MonthOverview({ config }: { config: MonthConfig }) {
  const { year, month, titleEn, titleZh, highlights, legend, footnote } = config;

  const firstWeekday = new Date(year, month - 1, 1).getDay(); // 0 = 週日
  const daysInMonth = new Date(year, month, 0).getDate();

  // 前置空白 + 1..daysInMonth
  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <section className="w-full">
      {/* 頁首 */}
      <h2 className="flex items-end gap-2 font-poppins font-bold leading-none text-[#2d3a5e]">
        <span
          className="text-[clamp(2.25rem,11.5vw,3.75rem)] md:text-7xl"
          style={{ textShadow: '3px 3px 0 rgba(212,121,110,0.45)' }}
        >
          {titleEn}
        </span>
        <span className="pb-1 text-2xl md:text-3xl">{titleZh}</span>
      </h2>

      {/* 月曆 */}
      {/* ring-inset：這張卡在輪播裡的寬度等於捲動容器寬度，
          外擴的 ring 會被 overflow 裁掉（左右兩側的線會不見），所以畫在框內。 */}
      <div className="mt-5 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-inset ring-gray-200 md:p-5">
        <div className="grid grid-cols-7 gap-1 md:gap-2">
          {WEEKDAYS.map((w, i) => (
            <div
              key={w}
              className={`pb-1 text-center text-sm font-semibold md:text-base ${
                i === 0 ? 'text-[#d4796e]' : 'text-gray-400'
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
                  className="flex aspect-square items-center justify-center text-sm text-gray-400 md:text-base"
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
            return (
              <a
                key={day}
                href={`#${hl.trackId}`}
                // 手機上看不到標籤文字，用 aria-label 讓讀屏軟體還是念得出那天是什麼課
                aria-label={`${month}/${day} ${hl.label.replace(/\n/g, ' ')}`}
                className={`flex aspect-square flex-col items-center justify-center overflow-hidden rounded-xl px-0.5 text-white shadow-sm transition-transform hover:scale-[1.04] ${cellColor}`}
              >
                <span className="text-base font-bold leading-tight md:text-xl">
                  {day}
                </span>
                {/* 手機的格子只有約 42px 寬，塞文字一定擠（「Lambada」會被拆成兩行），
                    所以手機只顯示日期，靠顏色＋下方圖例說明；有體驗課／Party 的日子
                    多一個小白點，跟深一階的底色一起提示。桌機格子夠大才顯示標籤。
                    whitespace-pre-line：label 裡的換行是刻意指定的斷行位置
                    （中文可以斷在任何字之間，不指定就會出現「Hustle 體驗 / 課」）。 */}
                {hl.emphasis && (
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-white md:hidden" />
                )}
                <span className="hidden w-full whitespace-pre-line break-words text-center text-xs leading-tight md:block">
                  {hl.label}
                </span>
              </a>
            );
          })}
        </div>
      </div>

      {/* 圖例 */}
      <div className="mt-5 flex flex-col gap-2.5">
        <h3 className="text-sm font-bold text-gray-800 md:text-base">時間和地點</h3>
        {legend.map((item) => {
          const theme = THEMES[item.theme];
          return (
            <div key={item.title} className="flex items-center gap-2.5">
              <span
                className={`h-3.5 w-3.5 flex-shrink-0 rounded-full ${theme.legendDot}`}
              />
              <p className="text-sm md:text-base">
                <span className="font-bold text-gray-800">{item.title}</span>
                <span className="ml-2 text-gray-500">{item.desc}</span>
              </p>
            </div>
          );
        })}
        {/* 手機的月曆格子不顯示文字，只靠深色＋白點標出特別場次，所以要說明白點的意思；
            桌機格子裡直接寫著是什麼課，不需要這行。 */}
        {Object.values(highlights).some((hl) => hl.emphasis) && (
          <div className="flex items-center gap-2.5 md:hidden">
            <span
              aria-hidden
              className="flex h-3.5 w-3.5 flex-shrink-0 items-center justify-center rounded-full bg-gray-700"
            >
              <span className="h-1 w-1 rounded-full bg-white" />
            </span>
            <p className="text-sm text-gray-600">深色＋白點＝體驗課／特別場次</p>
          </div>
        )}
        <p className="mt-1 text-xs text-gray-500 md:text-sm">{footnote}</p>
      </div>
    </section>
  );
}
