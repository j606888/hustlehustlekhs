import MonthCarousel from './MonthCarousel';
import { MONTHS } from './data';

// 課表 tab：月曆（點日期看當天課表與報名）＋當月 IG 海報。
// 原本的文字版課表卡（TrackCard）已移除（業主 2026/11/16）：它只列每週固定時段，
// 對不上停課與體驗課那幾天的實際時段，當天課表看月曆就好。
// 搜尋引擎仍讀得到課程資訊：courses/page.tsx 的 Course 結構化資料來自 TRACKS。
export default function ScheduleBoard() {
  return (
    <div className="bg-card">
      <div className="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-8 md:gap-10 md:px-6 md:py-12">
        <MonthCarousel months={MONTHS} />
      </div>
    </div>
  );
}
