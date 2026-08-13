import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import VenueDetail from '@/components/location/VenueDetail';
import { getTracksByVenue } from '@/components/courses/schedule/data';
import { VENUES } from '@/data/venues';
import { breadcrumbJsonLd, venueJsonLd } from '@/lib/jsonLd';

// 兩個據點都放在這一頁，各自用 venue.slug 當錨點（/location#zhirenzhan）。
// 據點多到這頁滑不完時，再改成列表 + /location/[slug] 子頁。

const venues = VENUES.map((venue) => ({
  venue,
  tracks: getTracksByVenue(venue.slug),
}));

const DESCRIPTION =
  'HustleHustle KHS 的上課地點：週四 Hustle 在高雄左營區職人棧、週五 Zouk 在三民區 Social Hub。零基礎、沒有舞伴都可以直接報名。';

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
          ...venues.map(({ venue, tracks }) => venueJsonLd(venue, tracks)),
          breadcrumbJsonLd([
            { name: '首頁', path: '/' },
            { name: '上課地點', path: '/location' },
          ]),
        ]}
      />
      <VenueDetail
        venues={venues}
        eyebrow="高雄據點"
        title="上課地點"
        subtitle="HustleHustle KHS 的固定上課場地"
        intro="我們的固定上課場地位在高雄市，每週定期開課。不需要舞伴、零基礎也可以直接報名，歡迎先來體驗看看。"
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
