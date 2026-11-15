import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import SectionHeading from '@/components/SectionHeading';

// 首頁的舞種介紹。除了給第一次來的人看，也是首頁唯一一段自然帶到
// 「高雄／社交舞／雙人舞／舞蹈教室」的內文 —— Google 的 AI 摘要會從這種
// 「X 是什麼」的段落抓句子。
//
// 兩張舞風卡是照片連結：照片上寫舞種名，整張卡點下去到風格介紹頁的對應段落
// （示範影片在那一頁）。上課時間與「適合誰」留在首頁卡片上，不點也看得到。
// 照片放在 public/images/styles/，換照片時檔名不變就好。
const DANCES = [
  {
    id: 'hustle',
    name: 'Hustle',
    prefix: undefined,
    when: '週四 19:30',
    fit: '喜歡節奏明快、聽到流行音樂就想動的人',
    photo: '/images/styles/hustle-hd.jpg',
    photoAlt: '學員在課堂上跳 Hustle',
    // 照片是橫的、卡片是正方形：往右偏一點，兩個人的臉才都在框裡
    photoPosition: '57% center',
    photoZoom: 1,
  },
  {
    id: 'zouk',
    name: 'Zouk',
    prefix: 'Brazilian',
    when: '週五 19:30',
    fit: '喜歡流動、浪漫的感覺，想多感受兩人連結的人',
    // 換照片時請用新檔名：同檔名換圖，瀏覽器和圖片快取可能還在給舊圖（之前就卡過一次灰底）
    photo: '/images/styles/zouk-couple-hd.jpg',
    photoAlt: '學員在課堂上跳 Brazilian Zouk',
    photoPosition: '55% center',
    // 照片高度已經填滿正方形，沒辦法單純往上移；改成以底部為基準放大，把臉往上推。
    // 放太大男生的臉會被切掉，所以只放大 1.15，另外把字放在卡片下半部。
    photoZoom: 1.15,
  },
];

const DanceStyles = () => {
  return (
    <section className="py-8 md:py-16">
      <div className="max-w-5xl px-5 mx-auto">
        <SectionHeading
          eyebrow="高雄社交舞・雙人舞"
          title="社交舞是什麼樣的舞蹈？"
          className="mb-6"
        />
        <p className="mb-8 text-base text-center text-ink-700 text-balance">
          社交舞是兩個人一組、透過引導與回應即興互動的舞蹈，不用背固定套路，換一首歌、換一個舞伴，跳出來就不一樣。
          <br />
          我們是高雄的社交舞・雙人舞教室，專門教 Hustle 與 Brazilian Zouk
          兩種舞蹈，從零基礎開始，不需要舞伴也能來跳舞。
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          {DANCES.map((dance) => (
            <Link
              key={dance.id}
              href={`/courses?tab=introduction#${dance.id}`}
              className="group flex flex-col gap-3 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-ink-100">
                {/* 外層負責「把臉往上推」的固定放大，內層 Image 負責滑鼠移上去的放大效果，
                    兩個 transform 分開才不會互相覆蓋。 */}
                <div
                  className="absolute inset-0"
                  style={{
                    transform: `scale(${dance.photoZoom})`,
                    transformOrigin: `${dance.photoPosition.split(' ')[0]} 100%`,
                  }}
                >
                  <Image
                    src={dance.photo}
                    alt={dance.photoAlt}
                    fill
                    sizes="(min-width: 768px) 576px, 120vw"
                    style={{ objectPosition: dance.photoPosition }}
                    className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
                  />
                </div>
                {/* 只壓一層很淡的暗色（業主要照片透出來），白字靠文字陰影撐住可讀性 */}
                <div className="absolute inset-0 bg-black/15 transition-colors group-hover:bg-black/5" />
                {/* 字放在卡片下半部（不是正中間），才不會蓋到照片裡的臉 */}
                <div
                  className="absolute inset-0 flex flex-col items-center justify-end pb-[24%] text-center leading-none text-white"
                  style={{ textShadow: '0 2px 16px rgba(0, 0, 0, 0.45)' }}
                >
                  {dance.prefix && (
                    <span className="font-display text-2xl tracking-[0.3em] md:text-3xl">
                      {dance.prefix.toUpperCase()}
                    </span>
                  )}
                  {/* 字體與字距呼應 IG 海報上的 HUSTLE／ZOUK */}
                  <span className="font-display text-7xl tracking-[0.04em] md:text-8xl">
                    {dance.name.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1 px-1">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-lg font-bold text-ink-900">
                    {dance.prefix ? `${dance.prefix} ${dance.name}` : dance.name}
                  </h3>
                  <span className="text-sm font-semibold text-ink-700">{dance.when}</span>
                </div>
                <p className="text-sm text-ink-700">
                  <strong className="font-semibold text-brand-strong">適合：</strong>
                  {dance.fit}
                </p>
                <span className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-brand group-hover:underline">
                  看舞風介紹
                  <ArrowRight aria-hidden className="size-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
        {/* 第一次來的人常卡在「該選哪一個」，直接給一個選法 */}
        <p className="mt-8 rounded-xl bg-section px-5 py-4 text-center text-base text-ink-700 text-balance">
          <strong className="font-semibold text-ink-900">不知道選哪個？</strong>
          兩種都從零開始教，選你比較有感覺的音樂就好；兩種都想試，兩堂體驗課都來也可以。
        </p>
      </div>
    </section>
  );
};

export default DanceStyles;
