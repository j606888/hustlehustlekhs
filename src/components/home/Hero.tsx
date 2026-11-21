import Image from "next/image";

type Props = {
  /** 首圖媒體，來自 src/data/site.ts 的 HERO_MEDIA。兩個都沒有就顯示佔位區塊。 */
  media?: { videoUrl?: string; imageUrl?: string };
};

/*
 * 滿版首圖，雜誌感排版：文字靠左、人物偏右，營造高質感生活風格封面視覺。
 *
 * 高度：
 *   手機 4:5 —— 保留舞者動態，底部露出下一段，引導往下探索。
 *   桌機 —— 一個螢幕高扣掉導覽列（8rem），最高 760px、最低 480px。
 *
 * OBJECT_POSITION：將人物維持在畫面右半部，左側留給標題與文案。
 */
const OBJECT_POSITION = "object-[72%_30%] md:object-[76%_35%]";

const Hero = ({ media }: Props) => {
  return (
    <section className="relative isolate w-full overflow-hidden bg-ink-900">
      <div className="relative aspect-[4/5] w-full md:aspect-auto md:h-[clamp(480px,calc(100svh-8rem),760px)]">
        <HeroMedia media={media} />

        {/* 雜誌感非對稱漸層：桌機左向右暗（護字）、右側通透（留給人物）；手機由左下往右上延伸 */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent md:bg-gradient-to-r md:from-black/80 md:via-black/45 md:to-transparent" />

        {/* 雜誌感排版：文字靠左對齊，桌機垂直置中、手機靠左下 */}
        <div className="absolute inset-0 flex flex-col justify-end px-6 pb-10 text-left text-white md:justify-center md:pb-0 md:px-12 lg:px-16">
          <div className="flex max-w-xl flex-col items-start gap-3 md:gap-4">
            <div className="flex items-center gap-2.5">
              <span className="h-px w-6 bg-brand-pale/90" aria-hidden />
              <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-white/90 md:text-sm">
                Hustle ・ Brazilian Zouk
              </p>
            </div>
            {/* h1 標題靠左排版，字距微調更具設計感 */}
            <h1 className="text-2xl font-bold leading-snug tracking-[0.06em] text-balance drop-shadow-sm md:text-4xl md:leading-tight lg:text-[2.85rem]">
              在高雄學雙人社交舞，
              <br />
              第一次跳舞就從這裡開始
            </h1>
            <p className="text-[clamp(0.9rem,4vw,1.15rem)] font-medium text-white/90 md:text-xl">
              不用舞蹈基礎，會走路就會跳的雙人舞
            </p>
          </div>
        </div>
      </div>
    </section>
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
        className={`absolute inset-0 h-full w-full object-cover ${OBJECT_POSITION}`}
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
        alt="學員在 HustleHustle KHS 教室跳雙人舞"
        fill
        // 手機與桌機都是滿版，所以就是 100vw；沒寫 sizes 的話手機會去抓 3840px 的版本。
        sizes="100vw"
        // 預設壓縮品質 75 在滿版大圖上看得出糊，首圖拉高一點
        quality={85}
        priority
        className={`object-cover ${OBJECT_POSITION}`}
      />
    );
  }

  // 還沒有素材時的佔位。刻意不放破圖／破影片，用深色漸層撐版面，白字照樣讀得到。
  return (
    <div className="absolute inset-0 flex items-start justify-center bg-gradient-to-br from-ink-700 via-ink-800 to-ink-900 pt-10">
      <p className="px-6 text-center text-sm text-ink-300">
        這裡放教室的照片或影片
        <br />
        <span className="text-xs">（設定在 src/data/site.ts 的 HERO_MEDIA）</span>
      </p>
    </div>
  );
}

export default Hero;
