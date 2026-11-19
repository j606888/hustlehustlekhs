import type { Metadata } from 'next';
import React from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import IGIcon from '@/components/icons/IGIcon';
import JsonLd from '@/components/JsonLd';
import { getPublishedTeacherSlugs, getTeacherBySlug } from '@/data/teachers';
import { breadcrumbJsonLd, teacherJsonLd } from '@/lib/jsonLd';

// 老師資料為靜態，僅預先產生已存在的頁面
export const dynamicParams = false;

// 影片檔（Vercel Blob 等）用 <video> 播放，其餘視為 YouTube embed
const isFileVideo = (url: string) => /\.(mp4|mov|webm|m4v)(\?|$)/i.test(url);

export function generateStaticParams() {
  return getPublishedTeacherSlugs();
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const teacher = getTeacherBySlug(slug);
  if (!teacher) return {};
  const desc = teacher.description[0]?.slice(0, 160) ?? '';
  return {
    title: `${teacher.name}${teacher.title ? `（${teacher.title}）` : ''}`,
    description: desc,
    alternates: { canonical: `/teachers/${slug}` },
    openGraph: {
      title: `${teacher.name} — 師資介紹 | HustleHustle KHS`,
      description: desc,
      url: `/teachers/${slug}`,
    },
  };
}

export default async function TeacherPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const teacher = getTeacherBySlug(slug);

  if (!teacher || !teacher.published) {
    notFound();
  }

  return (
    <div className="mx-auto px-3 py-6 flex flex-col gap-6 justify-center md:max-w-3xl md:gap-9">
      <JsonLd
        data={[
          teacherJsonLd(teacher),
          breadcrumbJsonLd([
            { name: '首頁', path: '/' },
            { name: '師資介紹', path: '/teachers' },
            { name: teacher.name, path: `/teachers/${teacher.slug}` },
          ]),
        ]}
      />
      <Link href="/teachers" className='text-sm text-ink-600 underline flex items-center gap-1'>
        <Image src="/icons/chevron-left.svg" alt="chevron-left" width={16} height={16} />
        返回教師列表
      </Link>
      <div className='flex gap-3 items-center md:m-auto md:flex-col md:gap-6'>
        <div className='relative w-[92px] h-[92px] md:w-[180px] md:h-[180px]'>
          <Image src={teacher.imageUrl} alt={teacher.name} fill className='object-cover rounded-full' />
        </div>
        <div className='flex flex-col gap-1.5 md:items-center'>
          <div className='flex items-baseline gap-1'>
            <h1 className='text-2xl font-bold md:text-4xl'>{teacher.name}</h1>
            {teacher.title && <span className='text-sm text-ink-500 font-bold md:text-xl'>({teacher.title})</span>}
            {/* 只放圖示、不寫帳號（業主 2026/11/19），放在名字旁邊；帳號名改由 aria-label 念給讀屏 */}
            {teacher.instagram && (
              <Link
                href={`https://www.instagram.com/${teacher.instagram}`}
                target='_blank'
                rel='noopener noreferrer'
                aria-label={`${teacher.name}的 Instagram（@${teacher.instagram}）`}
                className='ml-1 self-center p-1 text-ink-600 transition hover:text-brand'
              >
                <IGIcon className='w-5 h-5 md:w-7 md:h-7' />
              </Link>
            )}
          </div>
          <div className='flex flex-wrap gap-2 md:justify-center'>
            {teacher.skills.map((skill) => (
              <div key={skill} className='text-xs text-white bg-brand px-2 py-1 rounded-2xl md:text-base md:px-4 md:py-1 md:rounded-3xl'>{skill}</div>
            ))}
          </div>
        </div>
      </div>
      <div className='w-full max-w-[350px] bg-ink-100 rounded-lg p-3 md:max-w-full md:p-6'>
        <div className='hidden md:block text-xl font-bold mb-3'>
          關於{teacher.name}
        </div>
        {teacher.description.map((desc, index) => (
          <p key={index} className='text-ink-700'>{desc}</p>
        ))}
      </div>
      {/* 舞蹈影片排在簡介正後面（舞者朋友回饋 2026/11/19：想看老師跳舞的樣子），
          首頁老師卡的「看跳舞影片」連到 #videos。影片都是直式，手機上兩支並排剛好。 */}
      {teacher.videos.length > 0 && (
        <section id='videos' className='w-full max-w-[560px] scroll-mt-24 md:mx-auto'>
          <h2 className='text-ink-700 mb-2 text-center font-bold md:text-xl md:mb-3'>看{teacher.name}跳舞</h2>
          <div className='grid grid-cols-2 gap-3'>
            {teacher.videos.map((video) => (
              <figure key={video.src} className='flex flex-col gap-1.5'>
                <div
                  className={`relative w-full bg-black rounded-lg overflow-hidden ${isFileVideo(video.src) ? 'aspect-[9/16]' : 'aspect-square'}`}
                >
                  {isFileVideo(video.src) ? (
                    <video
                      className="absolute top-0 left-0 w-full h-full object-cover"
                      src={video.src}
                      poster={video.poster}
                      controls
                      playsInline
                      preload="none"
                    />
                  ) : (
                    <iframe
                      className="absolute top-0 left-0 w-full h-full"
                      src={video.src}
                      title={video.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    ></iframe>
                  )}
                </div>
                <figcaption className='text-sm text-ink-600 text-center'>{video.title}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}
      <div className='w-full max-w-[350px]'>
        <p className='text-ink-700 mb-2 font-bold'>授課項目</p>
        <div className='flex flex-wrap gap-2'>
          {teacher.courses.map((course) => (
            <div key={course} className='text-xs text-white bg-brand px-3 py-2 rounded-md'>{course}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
