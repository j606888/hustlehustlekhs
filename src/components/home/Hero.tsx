import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Tag, Users } from "lucide-react";
import { Button } from "../ui/button";
import { LINKS } from "@/constants/links";
import { getVenue } from "@/data/venues";
import { PRICE_PLANS, TRACKS } from "@/components/courses/schedule/data";
import NextTrial from "./NextTrial";

type Props = {
  /** 首頁右側的媒體，來自 src/data/site.ts 的 HERO_MEDIA。兩個都沒有就顯示佔位區塊。 */
  media?: { videoUrl?: string; imageUrl?: string };
};

const Hero = ({ media }: Props) => {
  return (
    // 桌機：md:items-stretch 讓右邊照片跟左欄一樣高，照片用 absolute 填滿，
    // 所以照片的底邊會跟左欄最後一塊（近期體驗課）的底邊對齊。
    <div className="px-5 py-10 flex flex-col items-center justify-center gap-6 md:flex-row md:items-stretch md:gap-6 md:max-w-7xl md:mx-auto">
      <div className="flex flex-col items-center justify-center gap-4 md:w-[460px] md:items-start md:flex-shrink-0">
        {/* h1 前半句帶「高雄／雙人社交舞」，讓只掃一眼標題的人也知道這是什麼、在哪裡；
            後半句保留原本的情感標語。 */}
        <h1 className="font-poppins text-2xl font-bold mb-1 text-center text-balance md:text-left md:text-4xl md:leading-tight lg:text-[2.5rem]">
          在高雄學雙人社交舞，
          <br />
          第一次跳舞就從這裡開始
        </h1>

        {/* 業主要求剛好一行：nowrap 不讓它斷行，字級跟著螢幕寬度縮放
            （手機 17 個全形字 × 4.6vw ≈ 78vw，扣掉左右 20px 留白還放得下；桌機左欄固定 460px）。 */}
        <p className="whitespace-nowrap text-center text-[clamp(0.95rem,4.6vw,1.25rem)] font-bold text-ink-900 md:text-left md:text-2xl">
          不用舞蹈基礎，會走路就會跳的雙人舞
        </p>
        <div className="flex flex-wrap justify-center gap-4 md:justify-start">
          <Button asChild size="lg">
            <Link href={LINKS.ENROLL}>報名體驗課</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href={LINKS.BEGINNERS}>查看即將開課</Link>
          </Button>
        </div>

        {/* 第一次來的人最想知道的三件事（哪天、在哪、多少錢）直接寫在按鈕下面，
            不用點進課程頁才看得到。時間、場地、價格都從課表資料取，改課表這裡會跟著變。 */}
        <ul className="flex w-full flex-col gap-1.5 text-sm text-ink-700">
          {TRACKS.map((track) => {
            const venue = getVenue(track.venueSlug);
            return (
              <li key={track.id} className="flex items-start gap-2">
                <CalendarDays aria-hidden className="mt-0.5 size-4 shrink-0 text-brand" />
                <span>
                  <strong className="font-semibold text-ink-900">
                    {track.dayZh} {track.slots[0]?.time.split('–')[0]}
                  </strong>{' '}
                  {track.danceStyle.replace('Brazilian ', '')}・{venue.district.replace(/區$/, '')} {venue.shortName}
                </span>
              </li>
            );
          })}
          <li className="flex items-start gap-2">
            <Users aria-hidden className="mt-0.5 size-4 shrink-0 text-brand" />
            <span>不用舞伴，不用舞蹈基礎，自己就能參加</span>
          </li>
          <li className="flex items-start gap-2">
            <Tag aria-hidden className="mt-0.5 size-4 shrink-0 text-brand" />
            {/* 從費用頁的課卡方案組出來（單堂・4 堂・8 堂），改價格只要改 PRICE_PLANS */}
            <span>
              常態課{' '}
              {PRICE_PLANS[0]?.tiers[0]?.options
                .map((o) => `${o.name.replace('課卡', '').trim()} $${o.price}`)
                .join('・')}
            </span>
          </li>
        </ul>
        <NextTrial />
      </div>
      <div className="relative w-full md:min-h-[320px]">
        <HeroMedia media={media} />
      </div>
    </div>
  );
};

function HeroMedia({ media }: Props) {
  if (media?.videoUrl) {
    return (
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="h-full w-full rounded-[10px] object-cover md:absolute md:inset-0"
      >
        <source src={media.videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    );
  }

  if (media?.imageUrl) {
    return (
      <Image
        src={media.imageUrl}
        alt="HustleHustle KHS 的上課情形"
        width={1200}
        height={800}
        // 沒寫 sizes 時，手機也會去抓最大張的版本（3840px），首圖要等很久才出現。
        // 桌機右欄最寬約 800px（左欄固定 460px），手機是滿版。
        sizes="(min-width: 1280px) 800px, (min-width: 768px) 60vw, 100vw"
        priority
        className="h-full w-full rounded-[10px] object-cover md:absolute md:inset-0"
      />
    );
  }

  // 還沒有素材時的佔位。刻意不放破圖／破影片，直接用品牌色的漸層區塊撐版面。
  // 這裡用 brand-pale（業主指定的 #F8B2B2）當底，它太淺不能當文字或按鈕色，
  // 但拿來鋪淺色背景剛好。
  return (
    <div className="flex aspect-[3/2] w-full md:absolute md:inset-0 md:aspect-auto md:h-full items-center justify-center rounded-[10px] bg-gradient-to-br from-brand-pale/50 via-brand-pale/20 to-brand-pale/70">
      <p className="px-6 text-center text-sm text-ink-500">
        這裡放教室的照片或影片
        <br />
        <span className="text-xs">（設定在 src/data/site.ts 的 HERO_MEDIA）</span>
      </p>
    </div>
  );
}

export default Hero;
