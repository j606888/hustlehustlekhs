import type { Metadata } from 'next';
import Hero from '@/components/home/Hero';
import DanceStyles from '@/components/home/DanceStyles';
import WhoWeAre from '@/components/home/WhoWeAre';
import Testimonials from '@/components/home/Testimonials';
import FAQ from '@/components/home/FAQ';
import JsonLd from '@/components/JsonLd';
import { getPublishedTestimonials } from '@/data/testimonials';
import { getPublishedFaqs } from '@/data/faq';
import { HERO_MEDIA } from '@/data/site';
import { faqPageJsonLd } from '@/lib/jsonLd';

const HOME_DESCRIPTION =
  '高雄唯一同時教 Hustle 與 Brazilian Zouk 的社交舞・雙人舞教室。週四晚上在左營區、週五晚上在三民區開課，單堂 $450，零基礎歡迎、不需舞伴即可報名。';

// <title> 在中文約 30 全形字就會被 Google 截斷，所以只留搜尋量最高的幾個詞：
// 高雄社交舞 / 高雄雙人舞 / 舞蹈教室 / Hustle / Zouk / 品牌名。
// 「社交舞」與「雙人舞」Google 不會當成同義詞，兩個都要出現在 title 才搜得到。
// og:title 用同一句，避免分享卡片與搜尋結果顯示不同標題。
const HOME_TITLE = '高雄社交舞・雙人舞教室｜Hustle・Zouk｜Hustlehustlekhs';

export const metadata: Metadata = {
  // 用 absolute 避開 layout 的 "%s | HustleHustle KHS" template，否則品牌名會出現兩次
  title: { absolute: HOME_TITLE },
  description: HOME_DESCRIPTION,
  alternates: { canonical: '/' },
  openGraph: {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    url: '/',
  },
};

export default function Home() {
  const testimonialsData = getPublishedTestimonials().map((t) => ({
    id: t.id,
    name: t.name,
    title: t.title,
    image: t.imageUrl,
    content: t.content,
    danceStyle: t.danceStyle,
  }));

  const faqs = getPublishedFaqs();
  const faqsData = faqs.map((f) => ({
    id: f.id,
    question: f.question,
    answer: f.answer,
  }));

  return (
    <>
      <JsonLd data={faqPageJsonLd(faqs)} />
      <Hero media={HERO_MEDIA} />
      <DanceStyles />
      <WhoWeAre />
      <Testimonials testimonials={testimonialsData} />
      <FAQ faqs={faqsData} />
    </>
  );
}
