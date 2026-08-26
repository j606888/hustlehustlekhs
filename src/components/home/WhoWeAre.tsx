import Image from 'next/image';
import SectionHeading from '@/components/SectionHeading';

// TODO: 照片還是佔位，師生合照放到 public/images/who-we-are.jpg 再改下面的 src。
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
              我們是 HustleHustle KHS，一群在高雄跳 Hustle 跟 Zouk 的人。
            </p>
            <p>
              2018 年初次接觸 Hustle，被「不需言語就能心靈相通」的默契深深打動；2020
              年成立 hustlehustlekhs，正式在高雄推廣 Hustle。
            </p>
            <p>
              2022 年在台北遇到了 Zouk，深深被它變化多端的肢體與流暢的音樂感吸引，決定也把這門美麗的舞蹈帶回高雄。
            </p>
            <p>
              我們不把舞蹈當成商品販售，而是因為自己曾被這兩門舞蹈深深打動，才想把這份純粹的感動，分享給高雄的大家 ❤️
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
