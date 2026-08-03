import Image from 'next/image';
import SectionHeading from '@/components/SectionHeading';

// TODO: 整段文案與照片都是佔位。
//   - 文案：寫「我們是誰、為什麼跳 Hustle、想找什麼樣的人一起跳」
//   - 照片：師生合照放到 public/images/who-we-are.jpg 再改下面的 src
const WhoWeAre = () => {
  return (
    <section className="py-8 bg-slate-50 md:py-16 ">
      <div className="md:flex md:flex-row-reverse md:max-w-7xl md:mx-auto">
        <div className="mx-auto px-5 mb-4 md:flex md:flex-col md:justify-center">
          <SectionHeading
            eyebrow="關於 HustleHustle KHS"
            title="我們是誰"
            className="mb-4"
          />
          <div className="space-y-4 text-base text-gray-700">
            <p>
              我們是 HustleHustle KHS，一群在高雄跳 Hustle 的人。
            </p>
            <p>
              這裡放團隊的故事：怎麼開始的、為什麼想把 Hustle
              推廣出去、希望這個社群變成什麼樣子。
            </p>
            <p>
              不用擔心有沒有舞伴、有沒有經驗，只要你願意踏出第一步，我們就一起從音樂開始搖擺！
            </p>
          </div>
        </div>
        <div className="mx-auto px-5 md:px-6 lg:px-8 ">
          <Image
            src="/placeholder.svg"
            alt="HustleHustle KHS 師生合照"
            width={800}
            height={533}
            className="w-full h-auto rounded-lg"
          />
        </div>
      </div>
    </section>
  );
};

export default WhoWeAre;
