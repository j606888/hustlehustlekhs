import Link from 'next/link';
import SectionHeading from '@/components/SectionHeading';
import { DANCE_VIDEO_IDS } from '@/data/danceVideos';

// 首頁的舞種介紹。除了給第一次來的人看，也是首頁唯一一段自然帶到
// 「高雄／社交舞／雙人舞／舞蹈教室」的內文 —— Google 的 AI 摘要會從這種
// 「X 是什麼」的段落抓句子。完整介紹在 /courses?tab=introduction。
// 卡片裡直接放示範影片：沒看過這兩種舞的人，不用離開首頁就看得到長什麼樣子。
const DANCES = [
  {
    name: 'Hustle',
    when: '週四 19:30・左營',
    youtubeId: DANCE_VIDEO_IDS.hustle,
    fit: '喜歡節奏明快、聽到流行音樂就想動的人',
  },
  {
    name: 'Brazilian Zouk',
    when: '週五 19:30・三民',
    youtubeId: DANCE_VIDEO_IDS.zouk,
    fit: '喜歡流動、浪漫的感覺，想多感受兩人連結的人',
  },
];

const DanceStyles = () => {
  return (
    <section className="py-8 md:py-16">
      <div className="max-w-5xl px-5 mx-auto">
        <SectionHeading
          eyebrow="高雄社交舞・雙人舞"
          title="Hustle 跟 Brazilian Zouk 是什麼樣的舞蹈？"
          className="mb-6"
        />
        <p className="mb-8 text-base text-center text-gray-700 text-balance">
          社交舞是兩個人一組、透過引導與回應即興互動的舞蹈，不用背固定套路，換一首歌、換一個舞伴，跳出來就不一樣。
          <br />
          我們是高雄的社交舞・雙人舞教室，專門教 Hustle 與 Brazilian Zouk
          兩種舞蹈，從零基礎開始，不需要舞伴也能來跳舞。
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {DANCES.map((dance) => (
            <div key={dance.name} className="flex flex-col p-5 border rounded-[10px] border-gray-200">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <h3 className="text-lg font-bold text-gray-900">{dance.name}</h3>
                <span className="text-sm font-medium text-gray-600">{dance.when}</span>
              </div>
              <p className="mt-1 mb-3 text-sm text-gray-700">
                <strong className="font-semibold text-brand-strong">適合：</strong>
                {dance.fit}
              </p>
              {/* 跟風格介紹頁同一支影片；loading="lazy" 讓首頁一打開不用先載 YouTube */}
              <div className="relative w-full overflow-hidden rounded-lg bg-gray-100 aspect-video">
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src={`https://www.youtube-nocookie.com/embed/${dance.youtubeId}`}
                  title={`${dance.name} 示範影片`}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </div>
          ))}
        </div>
        {/* 第一次來的人常卡在「該選哪一個」，直接給一個選法 */}
        <p className="mt-6 rounded-xl bg-slate-50 px-5 py-4 text-center text-base text-gray-700 text-balance">
          <strong className="font-semibold text-gray-900">不知道選哪個？</strong>
          兩種都從零開始教，選你比較有感覺的音樂就好；兩種都想試，兩堂體驗課都來也可以。
        </p>
        <p className="mt-6 text-center">
          <Link
            href="/courses?tab=introduction"
            className="font-semibold text-brand hover:underline"
          >
            看完整介紹 →
          </Link>
        </p>
      </div>
    </section>
  );
};

export default DanceStyles;
