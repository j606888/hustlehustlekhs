import Link from 'next/link';
import { Check } from 'lucide-react';
import SectionHeading from '@/components/SectionHeading';
import { Button } from '@/components/ui/button';
import { LINKS } from '@/constants/links';

// 「新手預演（First-Visit Guide）」：一個人來、沒跳過舞的人最怕的是未知與尷尬，
// 把當天的流程與環境講得具體、溫柔，徹底消除社恐障礙。
const STEPS = [
  {
    step: 'STEP 01',
    title: '下班輕鬆推開門',
    body: '不用自備舞伴，穿平時好活動的便服與平底球鞋就可以，不需要買專用舞鞋。自己一個人來最自在，想揪團來也沒問題。',
  },
  {
    step: 'STEP 02',
    title: '拆解基本步與輪換舞伴',
    body: '老師從零開始細心拆解動作。課堂中會引導大家每首歌輪流換舞伴練習，每個人都是零基礎新手，完全不會落單，更不用怕尷尬。',
  },
  {
    step: 'STEP 03',
    title: '自由練習',
    body: '下課後是自在的自由練習時光，剛學的動作馬上能輕鬆跳跳、喝水聊天。可以留下來跟同學玩，想準時回家也完全零壓力。',
  },
];

const REASSURANCES = [
  '零基礎友善・90% 學員都是第一次跳舞',
  '一人即可報名・現場輪流換伴不落單',
  '零壓力體驗・單堂彈性參加',
];

const FirstClass = () => {
  return (
    <section className="bg-section py-10 md:py-16">
      <div className="max-w-5xl px-5 mx-auto">
        <SectionHeading
          eyebrow="ONBOARDING GUIDE ・ 新手預演"
          title="第一次來跳舞，當天會發生什麼事？"
          subtitle="從推開門那一刻，我們都為你準備好了"
          className="mb-8 md:mb-12"
        />

        <ol className="grid gap-4 md:grid-cols-3">
          {STEPS.map((item) => (
            <li
              key={item.title}
              className="flex flex-col gap-3 rounded-lg bg-card p-6 ring-1 ring-ink-200 transition hover:ring-brand/30"
            >
              <div>
                <span className="eyebrow text-brand-strong">{item.step}</span>
              </div>
              <h3 className="text-lg font-bold text-ink-900">{item.title}</h3>
              <p className="text-sm leading-relaxed text-ink-700">{item.body}</p>
            </li>
          ))}
        </ol>

        {/* 大品牌風格的安心承諾條（Zero-Fear Reassurance Bar） */}
        <div className="mt-8 rounded-lg bg-ink-50 p-4 md:p-5">
          <ul className="flex flex-col items-center justify-center gap-2.5 text-xs font-medium text-ink-700 md:flex-row md:gap-8 md:text-sm">
            {REASSURANCES.map((text) => (
              <li key={text} className="flex items-center gap-1.5">
                <Check className="size-4 shrink-0 text-brand" />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 體驗課入口 */}
        <div className="mt-10 flex flex-col items-center gap-3 text-center">
          <p className="text-sm text-ink-600">想先試試水溫？從一堂體驗課開始最輕鬆。</p>
          <Button asChild size="lg">
            <Link href={LINKS.TRIAL_SIGNUP}>報名體驗課</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FirstClass;
