import Image from 'next/image';
import Link from 'next/link';
import SectionHeading from '@/components/SectionHeading';
import { getPublishedTeachers } from '@/data/teachers';

// 第一次來的人最想知道「是誰在教」，所以這段先介紹老師（資料取自 teachers.ts，
// 跟 /teachers 頁同一份），再講我們的故事。學員心得裡常提到又嘉、暘暘，
// 讀到這裡就對得上人。
// 老師卡片後面放一張學員大合照（public/images/about/group.jpg），對應標題的「夥伴」。
const WhoWeAre = () => {
  const teachers = getPublishedTeachers();

  return (
    <section className="bg-section py-8 md:py-16">
      <div className="max-w-5xl px-5 mx-auto">
        <SectionHeading
          eyebrow="關於 HustleHustle KHS"
          title="帶你踏出第一步的老師與夥伴"
          className="mb-6"
        />
        {/* 手機上靠左排（理由同 DanceStyles 的介紹段落），桌機才置中 */}
        <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-ink-700 md:text-center">
          我們是暘暘與又嘉，2020 年在高雄創立 HustleHustle KHS，
          一路帶著零基礎的學員跳 Hustle 與 Zouk，用最好懂的方式陪你自在跳出第一支舞。
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          {teachers.map((teacher) => (
            <Link
              key={teacher.slug}
              // 有影片就直接跳到個人頁的影片區（舞者朋友回饋：想看老師跳舞的樣子）
              href={`/teachers/${teacher.slug}${teacher.videos.length > 0 ? '#videos' : ''}`}
              className="group flex items-start gap-4 rounded-2xl bg-card p-5 ring-1 ring-ink-200 transition hover:ring-brand/40"
            >
              <Avatar src={teacher.imageUrl} alt={teacher.name} focus={teacher.avatarFocus} />
              <div className="flex flex-col gap-1">
                <p className="text-lg font-bold text-ink-900">
                  {teacher.name}
                  {teacher.title && (
                    <span className="ml-2 text-sm font-medium text-ink-600">{teacher.title}</span>
                  )}
                </p>
                <p className="text-sm leading-relaxed text-ink-700">{teacher.description[0]}</p>
                <span className="mt-1 text-sm font-semibold text-brand group-hover:underline">
                  {teacher.videos.length > 0 ? `▶ 看${teacher.name}跳舞` : `認識${teacher.name}`} →
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="relative mt-8 aspect-[3/2] w-full overflow-hidden rounded-2xl bg-ink-100">
          <Image
            src="/images/about/group.jpg"
            alt="HustleHustle KHS 的老師與學員在教室的大合照"
            fill
            // 區塊最寬 max-w-5xl（1024px）扣掉左右留白
            sizes="(min-width: 1024px) 984px, 100vw"
            className="object-cover object-[50%_60%]"
          />
        </div>

        <div className="mx-auto mt-8 max-w-2xl text-center text-base text-ink-700 text-balance">
          <p>
            我們因為被這兩種舞蹈深深打動，才想把這份純粹的感動，分享給高雄的大家 ❤️
          </p>
        </div>
      </div>
    </section>
  );
};

/**
 * 圓形大頭照。老師照片是 2:3 的直式全身照，直接 object-cover 會裁到身體中間，
 * 所以依 focus（臉在照片中的位置）把照片放大、平移，讓臉落在圓框正中央。
 * 照片高 = 寬 × 1.5，所以垂直方向的位移要乘上 1.5。
 */
function Avatar({
  src,
  alt,
  focus = { x: 0.5, y: 0.3, zoom: 1.6 },
}: {
  src: string;
  alt: string;
  focus?: { x: number; y: number; zoom: number };
}) {
  const width = focus.zoom * 100;
  return (
    <div className="relative size-[88px] shrink-0 overflow-hidden rounded-full bg-ink-100">
      <Image
        src={src}
        alt={alt}
        width={400}
        height={600}
        sizes="200px"
        className="absolute max-w-none"
        style={{
          width: `${width}%`,
          height: 'auto',
          left: `${50 - focus.x * width}%`,
          top: `${50 - focus.y * width * 1.5}%`,
        }}
      />
    </div>
  );
}

export default WhoWeAre;
