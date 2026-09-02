import type { Metadata } from 'next';
import Hero from '@/components/home/Hero';
import WhoWeAre from '@/components/home/WhoWeAre';
import Testimonials from '@/components/home/Testimonials';
import FAQ from '@/components/home/FAQ';
import JsonLd from '@/components/JsonLd';
import { getPublishedTestimonials } from '@/data/testimonials';
import { getPublishedFaqs } from '@/data/faq';
import { HERO_MEDIA } from '@/data/site';
import { faqPageJsonLd } from '@/lib/jsonLd';

const HOME_DESCRIPTION =
  '高雄唯一同時教 Hustle 與 Brazilian Zouk 的雙人舞教室。週四晚上在左營區、週五晚上在三民區開課，單堂 $450，零基礎歡迎、不需舞伴即可報名。';

// <title> 在中文約 30 全形字就會被 Google 截斷，所以只留搜尋量最高的幾個詞：
// 高雄Hustle / 高雄Zouk / 高雄雙人舞 / 雙人舞教室 / 品牌名。
// IG bio 的完整寫法（含 Kaohsiung Social Dance、Party）放在 og:title 與
// JSON-LD 的 alternateName，一樣被讀到但不佔 title 的字元。
const HOME_TITLE = '高雄 Hustle・Zouk 雙人舞教室｜Hustlehustlekhs';

export const metadata: Metadata = {
  // 用 absolute 避開 layout 的 "%s | HustleHustle KHS" template，否則品牌名會出現兩次
  title: { absolute: HOME_TITLE },
  description: HOME_DESCRIPTION,
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Hustlehustlekhs 高雄舞蹈教室｜Kaohsiung Social Dance、Hustle、Zouk、Party',
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
      <WhoWeAre />
      <Testimonials testimonials={testimonialsData} />
      <FAQ faqs={faqsData} />
    </>
  );
}
