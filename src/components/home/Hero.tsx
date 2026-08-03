import Image from "next/image";
import Link from "next/link";
import IGIcon from "@/components/icons/IGIcon";
import { Button } from "../ui/button";
import { LINKS } from "@/constants/links";

type Props = {
  /** 首頁右側的媒體，來自 src/data/site.ts 的 HERO_MEDIA。兩個都沒有就顯示佔位區塊。 */
  media?: { videoUrl?: string; imageUrl?: string };
};

const Hero = ({ media }: Props) => {
  return (
    <div className="px-5 py-10 flex flex-col items-center justify-center gap-6 md:flex-row md:gap-6 md:max-w-7xl md:mx-auto">
      <div className="flex flex-col items-center justify-center gap-4 md:w-[420px] md:items-start md:flex-shrink-0">
        {/* TODO: 換成 HustleHustle KHS 自己的標語 */}
        <h1 className="font-poppins text-2xl font-bold mb-1 md:text-5xl">
          第一次跳舞，
          <br className="hidden md:block" />
          就從這裡開始
        </h1>

        <p className="text-base max-w-2xl text-center md:text-left md:text-md">
          沒舞伴、沒經驗都沒關係，
          <br className="md:hidden" />
          來試一次 Hustle。
        </p>
        <div className="flex flex-wrap gap-4">
          <Link href={LINKS.INSTAGRAM_DM} target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="hover:cursor-pointer">
              <IGIcon className="w-6 h-6" color="#ffffff" />
              IG 私訊報名
            </Button>
          </Link>
          <Link href={LINKS.PRICING}>
            <Button className="hover:cursor-pointer" size="lg" variant="outline">
              了解費用
            </Button>
          </Link>
        </div>
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
        priority
        className="h-full w-full rounded-[10px] object-cover"
      />
    );
  }

  // 還沒有素材時的佔位。刻意不放破圖／破影片，直接用品牌色的漸層區塊撐版面。
  return (
    <div className="flex aspect-[3/2] w-full items-center justify-center rounded-[10px] bg-gradient-to-br from-brand/15 via-brand/5 to-brand/20">
      <p className="px-6 text-center text-sm text-gray-500">
        這裡放教室的照片或影片
        <br />
        <span className="text-xs">（設定在 src/data/site.ts 的 HERO_MEDIA）</span>
      </p>
    </div>
  );
}

export default Hero;
