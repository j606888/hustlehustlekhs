import type { Metadata } from 'next';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { getPublishedAssistants, getPublishedTeachers } from '@/data/teachers';
import SectionHeading from '@/components/SectionHeading';

const DESCRIPTION =
  '認識 HustleHustle KHS 的老師團隊：暘暘與又嘉，2020 年起在高雄推廣 Hustle，2022 年把 Brazilian Zouk 帶回高雄。零基礎的雙人舞教學，陪你從第一步開始跳。';

export const metadata: Metadata = {
  title: '師資介紹・高雄 Hustle / Zouk 老師',
  description: DESCRIPTION,
  alternates: { canonical: '/teachers' },
  openGraph: {
    title: '師資介紹・高雄 Hustle / Zouk 老師 | HustleHustle KHS',
    description: DESCRIPTION,
    url: '/teachers',
  },
};

export default function TeachersPage() {
  const teachers = getPublishedTeachers();
  const assistants = getPublishedAssistants();

  return (
    <>
      <div className="max-w-6xl mx-auto px-3 py-6 flex flex-col gap-8 items-center justify-center md:px-6 md:gap-10">
        <SectionHeading
          as='h1'
          eyebrow='認識我們團隊'
          title='師資介紹'
          subtitle='高雄 Hustle 與 Brazilian Zouk 的教學團隊，陪你從第一步跳到舞池中央'
          size='lg'
          className='py-2 md:py-4'
        />

        {/* 兩位老師：等寬並排。照片是直式的，所以手機用 3/4、電腦用 2/3，都是直的，
            避免橫向裁切把人切掉。照片在上、資訊在下，資訊區帶「查看介紹」的箭頭表示可以點進去。 */}
        <div className='w-full max-w-xl mx-auto grid gap-3 grid-cols-2 md:gap-6'>
          {teachers.map((teacher) => (
            <Link
              key={teacher.slug}
              href={`/teachers/${teacher.slug}`}
              className='group flex flex-col overflow-hidden rounded-lg bg-white ring-1 ring-black/5 shadow-sm transition-shadow hover:shadow-md'
            >
              <div className='relative aspect-[3/4] overflow-hidden md:aspect-[2/3]'>
                <Image
                  src={teacher.imageUrl}
                  alt={teacher.name}
                  fill
                  priority
                  sizes='(min-width: 768px) 288px, 50vw'
                  className='object-cover object-top transition-transform duration-300 group-hover:scale-105'
                />
              </div>
              <div className='flex flex-1 flex-col p-3 md:p-4'>
                <h3 className='text-base font-bold leading-tight md:text-xl'>{teacher.name}</h3>
                {teacher.title && (
                  <p className='mt-0.5 text-xs text-gray-500 md:text-sm'>{teacher.title}</p>
                )}
                <div className='mt-2 flex flex-wrap gap-1.5'>
                  {teacher.courses.map((item) => (
                    <span
                      key={item}
                      className='text-[11px] text-white bg-brand px-2 py-0.5 rounded md:text-xs md:px-2.5 md:py-1'
                    >
                      {item}
                    </span>
                  ))}
                </div>
                <span className='mt-3 inline-flex items-center gap-0.5 text-xs font-medium text-brand md:mt-4 md:text-sm'>
                  查看介紹
                  <ChevronRight className='size-3.5 transition-transform group-hover:translate-x-0.5 md:size-4' />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* 三位助教：只露出照片＋名字，沒有個人頁可連。
            名字放在照片下方（不疊在照片上），保持乾淨；「助教」用小字灰色註記就好。 */}
        {assistants.length > 0 && (
          <div className='w-full grid gap-3 grid-cols-3 md:gap-6'>
            {assistants.map((assistant) => (
              <div key={assistant.slug}>
                <div className='relative h-[160px] overflow-hidden rounded-lg md:h-[260px]'>
                  <Image
                    src={assistant.imageUrl}
                    alt={assistant.name}
                    fill
                    sizes='(min-width: 768px) 33vw, 33vw'
                    className='object-cover object-top'
                  />
                </div>
                <div className='mt-2 text-center'>
                  <h3 className='text-sm font-bold md:text-base'>{assistant.name}</h3>
                  <p className='text-xs text-gray-500'>助教</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
