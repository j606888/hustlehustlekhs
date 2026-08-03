import type { Metadata } from 'next';
import React from 'react';
import JsonLd from '@/components/JsonLd';
import VenueDetail from '@/components/location/VenueDetail';
import { getTracksByVenue } from '@/components/courses/schedule/data';
import { PRIMARY_VENUE } from '@/data/venues';
import { breadcrumbJsonLd, venueJsonLd } from '@/lib/jsonLd';

// 目前只有一個據點，所以 /location 直接就是那個據點的詳情頁，沒有 /location/[city]。
// 之後若開第二個據點，這頁改回「據點列表」，再各自加 /location/[slug] 子頁。

const venue = PRIMARY_VENUE;
const tracks = getTracksByVenue(venue.slug);

// TODO: 這段描述會直接出現在 Google 搜尋結果，等實際地址／課程確定後改寫。
const DESCRIPTION =
  'HustleHustle KHS 高雄 Hustle 教室的上課地點、地址與交通方式。零基礎、沒有舞伴都可以直接報名。';

export const metadata: Metadata = {
  title: '上課地點・高雄 Hustle 教室',
  description: DESCRIPTION,
  alternates: { canonical: '/location' },
  openGraph: {
    title: '上課地點・高雄 Hustle 教室 | HustleHustle KHS',
    description: DESCRIPTION,
    url: '/location',
  },
};

export default function LocationPage() {
  return (
    <>
      <JsonLd
        data={[
          venueJsonLd(venue, tracks),
          breadcrumbJsonLd([
            { name: '首頁', path: '/' },
            { name: '上課地點', path: '/location' },
          ]),
        ]}
      />
      <VenueDetail
        venue={venue}
        tracks={tracks}
        eyebrow="高雄據點"
        title="上課地點"
        subtitle="HustleHustle KHS 的固定上課場地"
        // TODO: 換成實際的場地介紹。這段話承載「高雄 Hustle」的關鍵字，保持精簡。
        intro="HustleHustle KHS 的固定上課場地位在高雄市，每週定期開課。不需要舞伴、零基礎也可以直接報名，歡迎先來看看。"
        // TODO: 拍一張場地／入口的照片放到 public/images/venue.jpg，再把下面的 photo 打開。
        // photo={{
        //   src: '/images/venue.jpg',
        //   alt: '教室入口',
        //   caption: '認準這個入口',
        // }}
        notes={[
          {
            // TODO: 換成實際的注意事項（停車、電梯、要不要換鞋等）。
            question: '第一次來要注意什麼？',
            answer: '待補：交通與停車方式、要不要提早到、需不需要自備舞鞋。',
          },
        ]}
      />
    </>
  );
}
