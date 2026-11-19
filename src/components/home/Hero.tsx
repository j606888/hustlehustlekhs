import Image from "next/image";

type Props = {
  /** 首圖媒體，來自 src/data/site.ts 的 HERO_MEDIA。兩個都沒有就顯示佔位區塊。 */
  media?: { videoUrl?: string; imageUrl?: string };
};

/*
 * 滿版首圖，文字壓在照片下緣（參考精品官網的大圖＋置中標題）。
 *
 * 高度：
 *   手機 4:5 —— 目前只有橫式照片（3:2），裁成全螢幕直式（約 9:19）會只剩一個人；
 *              4:5 剛好還放得下一對舞者，下面也會露出下一段，讓人知道要往下滑。
 *              之後拍了直式照片，可以改成 h-[calc(100svh-4rem)] 做真正的全螢幕。
 *   桌機 —— 一個螢幕高扣掉導覽列（8rem），最高 760px、最低 480px。
 *
 * OBJECT_POSITION 決定裁切時保留哪一塊：照片換掉的話，要依照新照片人物的位置調整。
 */
const OBJECT_POSITION = "object-[62%_30%] md:object-[60%_35%]";

const Hero = ({ media }: Props) => {
  return (
    <section className="relative isolate w-full overflow-hidden bg-ink-900">
      <div className="relative aspect-[4/5] w-full md:aspect-auto md:h-[clamp(480px,calc(100svh-8rem),760px)]">
        <HeroMedia media={media} />

        {/* 由下往上的暗色漸層，讓白字在任何照片上都讀得到 */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/0 md:via-black/20" />

        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 px-5 pb-8 text-center text-white md:gap-4 md:pb-16">
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-white/85 md:text-sm">
            Hustle ・ Brazilian Zouk
          </p>
          {/* h1 前半句帶「高雄／雙人社交舞」，讓只掃一眼標題的人也知道這是什麼、在哪裡；
              後半句保留原本的情感標語。 */}
          <h1 className="text-2xl font-bold leading-snug tracking-[0.06em] text-balance drop-shadow-sm md:text-4xl md:leading-tight lg:text-[2.75rem]">
            在高雄學雙人社交舞，
            <br />
            第一次跳舞就從這裡開始
          </h1>
          {/* 業主要求剛好一行：nowrap 不讓它斷行，字級跟著螢幕寬度縮放
              （手機 17 個全形字 × 4.4vw ≈ 75vw，扣掉左右 20px 留白還放得下）。 */}
          <p className="whitespace-nowrap text-[clamp(0.9rem,4.4vw,1.15rem)] font-medium text-white/90 md:text-xl">
            不用舞蹈基礎，會走路就會跳的雙人舞
          </p>
          {/* 按鈕刻意不放（業主 2026/11/16：首頁太複雜、資訊重複）。
              下一段「兩步驟開始跳舞」就是報名入口。 */}
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
