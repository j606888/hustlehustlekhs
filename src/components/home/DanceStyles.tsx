import Link from 'next/link';
import SectionHeading from '@/components/SectionHeading';

// 首頁的舞種介紹。除了給第一次來的人看，也是首頁唯一一段自然帶到
// 「高雄／社交舞／雙人舞／舞蹈教室」的內文 —— Google 的 AI 摘要會從這種
// 「X 是什麼」的段落抓句子。完整介紹與示範影片在 /courses?tab=introduction，
// 兩邊的敘述要保持一致。
const DANCES = [
  {
    name: 'Hustle',
    body: '1970 年代從紐約 disco 場景長出來的雙人社交舞。節奏明快、旋轉多，配 disco、funk 或現在的流行音樂都很合，是一聽到音樂就會想動起來的舞。',
  },
  {
    name: 'Brazilian Zouk',
    body: '源自巴西的雙人社交舞，融合 Lambada 的流動感，發展出獨特的旋轉、波浪與身體延伸。可以很柔和浪漫，也能充滿力量，更重視兩個人之間的連結。',
  },
];

const DanceStyles = () => {
  return (
    <section className="py-8 md:py-16">
      <div className="max-w-5xl px-5 mx-auto">
        <SectionHeading
          eyebrow="高雄社交舞・雙人舞"
          title="Hustle 跟 Zouk 是什麼樣的社交舞？"
          className="mb-6"
        />
        <p className="mb-8 text-base text-center text-gray-700 text-balance">
          社交舞是兩個人一組、透過引導與回應即興互動的舞蹈，不用背固定套路，換一首歌、換一個舞伴，跳出來就不一樣。
          HustleHustle KHS 是高雄的社交舞・雙人舞教室，專門教 Hustle 與 Brazilian Zouk
          兩種舞蹈，從零基礎開始，不需要舞伴也能來跳舞。
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {DANCES.map((dance) => (
            <div key={dance.name} className="p-5 border rounded-[10px] border-gray-200">
              <h3 className="mb-2 text-lg font-bold text-gray-900">{dance.name}</h3>
              <p className="text-base text-gray-700">{dance.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center">
          <Link
            href="/courses?tab=introduction"
            className="font-semibold text-brand hover:underline"
          >
            看示範影片與完整介紹 →
          </Link>
        </p>
      </div>
    </section>
  );
};

export default DanceStyles;
