import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Tag, Users } from "lucide-react";
import { Button } from "../ui/button";
import { LINKS } from "@/constants/links";
import { getVenue } from "@/data/venues";
import { TRACKS } from "@/components/courses/schedule/data";
import NextTrial from "./NextTrial";

type Props = {
  /** 首頁右側的媒體，來自 src/data/site.ts 的 HERO_MEDIA。兩個都沒有就顯示佔位區塊。 */
  media?: { videoUrl?: string; imageUrl?: string };
};

const Hero = ({ media }: Props) => {
  return (
    <div className="px-5 py-10 flex flex-col items-center justify-center gap-6 md:flex-row md:gap-6 md:max-w-7xl md:mx-auto">
      <div className="flex flex-col items-center justify-center gap-4 md:w-[460px] md:items-start md:flex-shrink-0">
        {/* h1 前半句帶「高雄／雙人社交舞」，讓只掃一眼標題的人也知道這是什麼、在哪裡；
            後半句保留原本的情感標語。 */}
        <h1 className="font-poppins text-2xl font-bold mb-1 text-center text-balance md:text-left md:text-4xl md:leading-tight lg:text-[2.5rem]">
          在高雄學雙人社交舞，
          <br />
          第一次跳舞就從這裡開始
        </h1>

        {/* 關鍵字（Hustle／Zouk／社交舞／雙人舞）由這句副標帶，讓搜尋引擎和 AI 在頁面最上方就讀到。 */}
        <p className="text-base max-w-2xl text-center md:text-left md:text-md">
          <strong className="font-semibold">
            高雄唯一同時教 Hustle 與 Brazilian Zouk 的社交舞・雙人舞教室。
          </strong>
          <br className="hidden md:block" />
          沒舞伴、沒經驗都沒關係，不用背固定套路，跟著音樂就能自由跳。
        </p>
        <div className="flex flex-wrap justify-center gap-4 md:justify-start">
          <Button asChild size="lg">
            <Link href={LINKS.ENROLL}>報名體驗課</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href={LINKS.COURSES}>看課表與費用</Link>
          </Button>
        </div>

        {/* 第一次來的人最想知道的三件事（哪天、在哪、多少錢）直接寫在按鈕下面，
            不用點進課程頁才看得到。時間、場地、價格都從課表資料取，改課表這裡會跟著變。 */}
        <ul className="flex w-full flex-col gap-1.5 text-sm text-gray-700">
          {TRACKS.map((track) => {
            const venue = getVenue(track.venueSlug);
            return (
              <li key={track.id} className="flex items-start gap-2">
                <CalendarDays aria-hidden className="mt-0.5 size-4 shrink-0 text-brand" />
                <span>
                  <strong className="font-semibold text-gray-900">
                    {track.dayZh} {track.slots[0]?.time.split('–')[0]}
                  </strong>{' '}
                  {track.danceStyle.replace('Brazilian ', '')}・{venue.district.replace(/區$/, '')} {venue.shortName}
                </span>
              </li>
            );
          })}
          <li className="flex items-start gap-2">
            <Users aria-hidden className="mt-0.5 size-4 shrink-0 text-brand" />
            <span>零基礎從頭教・輪換舞伴，一個人來也不尷尬</span>
          </li>
          <li className="flex items-start gap-2">
            <Tag aria-hidden className="mt-0.5 size-4 shrink-0 text-brand" />
            <span>常態課{TRACKS[0]?.priceSummary.replace('課卡制・', ' ')}</span>
          </li>
        </ul>
        <NextTrial />
      </div>
      <div className="w-full h-full">
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
        className="h-full w-full rounded-[10px] object-cover"
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
        className="h-full w-full rounded-[10px] object-cover"
      />
    );
  }

  // 還沒有素材時的佔位。刻意不放破圖／破影片，直接用品牌色的漸層區塊撐版面。
  // 這裡用 brand-pale（業主指定的 #F8B2B2）當底，它太淺不能當文字或按鈕色，
  // 但拿來鋪淺色背景剛好。
  return (
    <div className="flex aspect-[3/2] w-full items-center justify-center rounded-[10px] bg-gradient-to-br from-brand-pale/50 via-brand-pale/20 to-brand-pale/70">
      <p className="px-6 text-center text-sm text-gray-500">
        這裡放教室的照片或影片
        <br />
        <span className="text-xs">（設定在 src/data/site.ts 的 HERO_MEDIA）</span>
      </p>
    </div>
  );
}

export default Hero;
