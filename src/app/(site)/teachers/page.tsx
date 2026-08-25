import type { Metadata } from 'next';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getPublishedAssistants, getPublishedTeachers } from '@/data/teachers';
import SectionHeading from '@/components/SectionHeading';

// TODO: 等老師資料填好後改寫這段描述。
const DESCRIPTION =
  '認識 HustleHustle KHS 的舞蹈老師團隊。高雄的 Hustle 教學，陪你從零開始跳。';

export const metadata: Metadata = {
  title: '師資介紹',
  description: DESCRIPTION,
  alternates: { canonical: '/teachers' },
  openGraph: {
    title: '師資介紹 | HustleHustle KHS',
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
          subtitle='陪你從第一步跳到舞池中央' /* TODO: 老師人數確定後可以改成更具體的說法 */
          size='lg'
          className='py-2 md:py-4'
        />

        {/* 兩位老師：等寬並排。用 max-w 限制整排寬度，避免電腦版卡片被拉得太大。 */}
        <div className='w-full max-w-xl mx-auto grid gap-4 grid-cols-2 md:gap-6'>
          {teachers.map((teacher) => (
            <Link
              key={teacher.slug}
              href={`/teachers/${teacher.slug}`}
              className='relative aspect-[2/3] cursor-pointer group'
            >
              <Image
                src={teacher.imageUrl}
                alt={teacher.name}
                fill
                priority
                sizes='(min-width: 768px) 50vw, 50vw'
                className='object-cover rounded-lg'
              />
              <div className='absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 rounded-lg' />
              <div className='absolute bottom-3 left-3 right-3 bg-white/80 rounded-lg p-3 md:p-4'>
                <h3 className='text-xl font-bold mb-1 md:text-2xl'>
                  {teacher.name}
                  {teacher.title && <span className='text-sm text-gray-500'>（{teacher.title}）</span>}
                </h3>
                <div className='flex gap-2 flex-wrap'>
                  {teacher.courses.map((item) => (
                    <div key={item} className='text-xs text-white bg-brand p-2 rounded-md'>{item}</div>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 三位助教：只露出照片＋名字，沒有個人頁可連。 */}
        {assistants.length > 0 && (
          <div className='w-full grid gap-3 grid-cols-3 md:gap-6'>
            {assistants.map((assistant) => (
              <div key={assistant.slug} className='h-[160px] relative md:h-[260px]'>
                <Image
                  src={assistant.imageUrl}
                  alt={assistant.name}
                  fill
                  sizes='(min-width: 768px) 33vw, 33vw'
                  className='object-cover object-top rounded-lg'
                />
                <div className='absolute top-2 left-2 text-xs text-white bg-brand px-2 py-1 rounded-md md:text-sm'>助教</div>
                <div className='absolute bottom-2 left-2 right-2 bg-white/80 rounded-lg py-1 px-2 text-center md:py-2'>
                  <h3 className='text-sm font-bold md:text-lg'>{assistant.name}</h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
