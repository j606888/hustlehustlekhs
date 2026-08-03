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

// TODO: 這段描述會直接出現在 Google 搜尋結果，等實際上課時間確定後改寫。
const HOME_DESCRIPTION =
  '高雄的 Hustle 社交舞教室。每週定期開課，零基礎歡迎、不需舞伴即可報名。';

export const metadata: Metadata = {
  // 用 absolute 避開 layout 的 "%s | HustleHustle KHS" template，否則品牌名會出現兩次
  title: { absolute: 'HustleHustle KHS｜高雄 Hustle 社交舞教室' },
  description: HOME_DESCRIPTION,
  alternates: { canonical: '/' },
  openGraph: {
    title: 'HustleHustle KHS｜高雄 Hustle 社交舞教室',
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
