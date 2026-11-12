import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LINKS } from '@/constants/links';

// 首頁最後一段：看完心得與常見問題、想報名的人，在這裡就有一顆主按鈕可以按，
// 不用捲回最上面或去找頁尾的小字連結。
const BottomCta = () => {
  return (
    <section className="px-5 py-12 md:py-16">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 rounded-2xl bg-brand-light px-6 py-10 text-center ring-1 ring-brand/15">
        <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">準備好下班來動一動了嗎？</h2>
        <p className="max-w-xl text-base text-gray-700 text-balance">
          不用帶舞伴、不用有經驗，選一堂體驗課開始就好。
          因為場地大小有限，每堂課都有名額限制，建議先報名預約。
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-4">
          <Button asChild size="lg">
            <Link href={LINKS.ENROLL}>報名體驗課</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href={LINKS.INSTAGRAM_DM} target="_blank" rel="noopener noreferrer">
              IG 私訊詢問
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BottomCta;
