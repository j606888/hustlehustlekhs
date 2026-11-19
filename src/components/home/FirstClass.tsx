import Link from 'next/link';
import SectionHeading from '@/components/SectionHeading';
import { Button } from '@/components/ui/button';
import { LINKS } from '@/constants/links';

// 「第一堂課會發生什麼」：一個人來、沒跳過舞的人最怕的是未知，
// 把當天的流程講清楚，比再多形容詞都更讓人安心。流程已跟業主確認（2026/11）。
// 第三步刻意不寫課後練習的時間（業主要求），時間看課表就好，這裡不用跟著改。
const STEPS = [
  {
    title: '下班直接來教室',
    body: '不用帶舞伴，穿好活動的衣服和鞋子就可以。',
  },
  {
    title: '老師從基本步開始教',
    body: '一步一步拆解動作，上課中會輪流換舞伴，每個人都會跟不同的人練習，一個人來也不尷尬。',
  },
  {
    title: '下課後留下來練習',
    body: '週四有 Hustle 課後練習，週五有 Zouk 課後練習，剛學的動作馬上就能多練幾次。',
  },
];

const FirstClass = () => {
  return (
    <section className="bg-section py-8 md:py-16">
      <div className="max-w-5xl px-5 mx-auto">
        <SectionHeading
          eyebrow="第一次來也不用擔心"
          title="新手班的一堂課長這樣"
          className="mb-8"
        />
        <ol className="grid gap-4 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <li
              key={step.title}
              className="flex flex-col gap-2 rounded-lg bg-card p-5 ring-1 ring-ink-200"
            >
              <span className="flex size-9 items-center justify-center rounded-full bg-brand text-base font-bold text-white">
                {index + 1}
              </span>
              <h3 className="text-lg font-bold text-ink-900">{step.title}</h3>
              <p className="text-base leading-relaxed text-ink-700">{step.body}</p>
            </li>
          ))}
        </ol>
        {/* 上面講的是每週新手班的流程；體驗課是課後接 Party 的單次活動，
            所以按鈕前先說一句「想先試試看」，避免讀者以為兩者是同一件事。 */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <p className="text-base text-ink-700">想先試試看？從一次體驗課開始。</p>
          <Button asChild size="lg">
            <Link href={LINKS.TRIAL_SIGNUP}>報名體驗課</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FirstClass;
