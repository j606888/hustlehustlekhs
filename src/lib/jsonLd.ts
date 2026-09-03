// schema.org 結構化資料的 builder。
//
// 為什麼要有這個：Google 判斷「這間教室在哪個城市」主要靠 LocalBusiness 結構化資料，
// 純文字提到城市名的權重低很多。據點頁 /location 會掛一份。

import {
  DANCE_STYLES,
  SERVICE_AREAS,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_NAME_FULL,
  SITE_URL,
} from '@/constants/site';
import { SAME_AS } from '@/constants/links';
import { getVenue, type Venue } from '@/data/venues';
import type { Faq } from '@/data/faq';
import type { Teacher } from '@/data/teachers';
import {
  PRICE_PLANS,
  getEventYear,
  type EnrollEvent,
  type Track,
} from '@/components/courses/schedule/data';

/** JSON-LD 是自由格式的物件，值可以是巢狀物件／陣列。 */
export type JsonLd = Record<string, unknown>;

const ORGANIZATION_ID = `${SITE_URL}/#organization`;

function absolute(path: string): string {
  return path.startsWith('http') ? path : `${SITE_URL}${path}`;
}

/** 全站共用的品牌實體，掛在 root layout。其他 schema 用 @id 指回這裡。 */
export function organizationJsonLd(): JsonLd {
  return {
    '@context': 'https://schema.org',
    // 同時宣告 EducationalOrganization，讓 Google 知道這是「教學單位」而不只是公司
    '@type': ['Organization', 'EducationalOrganization'],
    '@id': ORGANIZATION_ID,
    name: SITE_NAME,
    alternateName: SITE_NAME_FULL,
    url: SITE_URL,
    logo: absolute('/logo.svg'),
    description: SITE_DESCRIPTION,
    knowsAbout: [...DANCE_STYLES],
    areaServed: SERVICE_AREAS.map((name) => ({
      '@type': 'City',
      name,
    })),
    // sameAs 是 Google 確認「這個網站 = 這個社群帳號」的方式
    sameAs: SAME_AS,
  };
}

/** '19:30–20:30' → { opens: '19:30', closes: '20:30' }。注意是 en dash（–）不是 hyphen。 */
function parseSlotTime(time: string): { opens: string; closes: string } | null {
  const [opens, closes] = time.split(/[–—-]/).map((s) => s.trim());
  if (!opens || !closes) return null;
  return { opens, closes };
}

const DAY_OF_WEEK: Record<string, string> = {
  SUNDAY: 'https://schema.org/Sunday',
  MONDAY: 'https://schema.org/Monday',
  TUESDAY: 'https://schema.org/Tuesday',
  WEDNESDAY: 'https://schema.org/Wednesday',
  THURSDAY: 'https://schema.org/Thursday',
  FRIDAY: 'https://schema.org/Friday',
  SATURDAY: 'https://schema.org/Saturday',
};

/** 由該據點的課程 track 推導營業時間：每個 track 取第一堂開始到最後一堂結束。 */
function openingHours(tracks: Track[]): JsonLd[] {
  return tracks.flatMap((track) => {
    const dayOfWeek = DAY_OF_WEEK[track.sessionLabelEn.toUpperCase()];
    const first = parseSlotTime(track.slots[0]?.time ?? '');
    const last = parseSlotTime(track.slots[track.slots.length - 1]?.time ?? '');
    if (!dayOfWeek || !first || !last) return [];
    return [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek,
        opens: first.opens,
        closes: last.closes,
      },
    ];
  });
}

/** 單一據點的 LocalBusiness。這是「高雄 Hustle」這類本地查詢真正吃的訊號。 */
export function venueJsonLd(venue: Venue, tracks: Track[]): JsonLd {
  // 兩個據點共用 /location，靠錨點區分；@id 必須各自唯一，否則 Google 會當成同一間。
  const url = `${SITE_URL}/location#${venue.slug}`;
  const courses = [...new Set(tracks.flatMap((t) => t.slots.map((s) => s.title)))];

  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'SportsActivityLocation'],
    '@id': `${url}-localbusiness`,
    name: venue.name,
    url,
    parentOrganization: { '@id': ORGANIZATION_ID },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'TW',
      addressRegion: venue.city,
      addressLocality: venue.district,
      streetAddress: venue.streetAddress,
      postalCode: venue.postalCode,
    },
    ...(venue.geo && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: venue.geo.lat,
        longitude: venue.geo.lng,
      },
    }),
    description: venueDescription(venue, tracks),
    areaServed: { '@type': 'City', name: venue.city },
    openingHoursSpecification: openingHours(tracks),
    knowsAbout: [...new Set([...tracks.map((t) => t.danceStyle), '雙人舞', '社交舞', ...courses])],
    sameAs: SAME_AS,
    // TODO: 有場地照片後補上 image: absolute('/images/venue.jpg')
    hasMap: venue.mapLink,
  };
}

/** 據點的一句話描述，帶上舞種與行政區，讓 LocalBusiness 自己說得清楚它在哪、教什麼。 */
function venueDescription(venue: Venue, tracks: Track[]): string {
  const lines = tracks.map((track) => {
    const first = parseSlotTime(track.slots[0]?.time ?? '');
    const last = parseSlotTime(track.slots[track.slots.length - 1]?.time ?? '');
    const time = first && last ? `${first.opens}–${last.closes}` : '';
    return `${track.dayZh} ${time} ${track.danceStyle}`.trim();
  });
  return `HustleHustle KHS 在${venue.city}${venue.district}的上課場地（${venue.shortName}），${lines.join('、')}。零基礎與沒有舞伴都可以報名的雙人舞（社交舞）課程。`;
}

/** 某條課程線的單堂價格，取自 PRICE_PLANS；找不到就不輸出 offers。 */
function singleSessionPrice(track: Track): number | undefined {
  const plan = PRICE_PLANS.find((p) => p.id === track.pricePlanId);
  const options = plan?.tiers.flatMap((t) => t.options) ?? [];
  return options.find((o) => o.name.includes('單堂'))?.price;
}

/**
 * 單一課程線的 Course + CourseInstance。
 *
 * 為什麼要有這個：LocalBusiness 告訴 Google「我們在哪」，Course 告訴它
 * 「我們教什麼、什麼時候上、多少錢」。這是「高雄哪裡可以學 Zouk」這類
 * 查詢會用到的訊號，也是 AI 回答課程問題時最容易照抄的一段。
 */
export function courseJsonLd(track: Track): JsonLd {
  const venue = getVenue(track.venueSlug);
  const first = parseSlotTime(track.slots[0]?.time ?? '');
  const last = parseSlotTime(track.slots[track.slots.length - 1]?.time ?? '');
  const byDay = DAY_OF_WEEK[track.sessionLabelEn.toUpperCase()];
  const price = singleSessionPrice(track);
  const slotList = track.slots.map((s) => `${s.time} ${s.title}`).join('、');

  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    '@id': `${SITE_URL}/courses#${track.id}`,
    name: `${track.danceStyle} 雙人舞課程・高雄${venue.district}`,
    description: `在${venue.addressFull}（${venue.shortName}）每${track.dayZh}上課的 ${track.danceStyle} 課程：${slotList}。零基礎歡迎、不需舞伴。`,
    url: `${SITE_URL}/courses#${track.id}`,
    provider: { '@id': ORGANIZATION_ID },
    inLanguage: 'zh-TW',
    teaches: [track.danceStyle, '雙人舞', '社交舞'],
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'Onsite',
      inLanguage: 'zh-TW',
      location: { '@id': `${SITE_URL}/location#${venue.slug}-localbusiness` },
      ...(byDay &&
        first &&
        last && {
          courseSchedule: {
            '@type': 'Schedule',
            byDay,
            repeatFrequency: 'P1W',
            startTime: first.opens,
            endTime: last.closes,
            scheduleTimezone: 'Asia/Taipei',
          },
        }),
    },
    ...(price !== undefined && {
      offers: {
        '@type': 'Offer',
        category: 'Paid',
        price,
        priceCurrency: 'TWD',
        availability: 'https://schema.org/InStock',
        url: `${SITE_URL}/courses?tab=pricing#${track.pricePlanId}`,
      },
    }),
  };
}

/** '9/18' + 2026 + '19:30' → '2026-09-18T19:30:00+08:00'（沒有時間就只到日期）。 */
function isoDate(label: string, year: number, time?: string): string | null {
  const [month, day] = label.split('/').map(Number);
  if (!month || !day) return null;
  const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  return time ? `${date}T${time}:00+08:00` : date;
}

/**
 * 單場活動（體驗課 / 客座 Workshop）的 Event。
 *
 * 為什麼要有這個：這些是有明確日期、地點、報名連結的活動，正是 Google 的
 * 活動搜尋結果會吃的資料，也是 AI 回答「最近有沒有體驗課」時最容易照抄的一段。
 *
 * 兩種情況回傳 null 不輸出：
 * 1. 場地未定（沒有 venueSlug）—— Event 需要 location，硬填一個猜的地址比不放
 *    更糟（會跟 LocalBusiness 的 NAP 打架）。
 * 2. 還沒開放報名（enrollUrl 是空的）—— 那一場在頁面上也不會顯示，
 *    只有結構化資料宣告了看不到的活動反而是錯誤訊號。
 */
export function eventJsonLd(event: EnrollEvent): JsonLd | null {
  if (!event.venueSlug || !event.enrollUrl) return null;

  const venue = getVenue(event.venueSlug);
  const year = getEventYear(event);
  const startDate = isoDate(event.dateLabel, year, event.startTime);
  if (!startDate) return null;

  const endDate = event.endDateLabel
    ? isoDate(event.endDateLabel, year)
    : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': ['Event', 'EducationEvent'],
    '@id': `${SITE_URL}/enroll#${event.id}`,
    name: `${event.title}・高雄${venue.district}`,
    description: `${event.danceStyle} 課程活動，在${venue.addressFull}（${venue.shortName}）舉行。零基礎歡迎、不需舞伴。`,
    url: `${SITE_URL}/enroll#${event.id}`,
    startDate,
    ...(endDate && { endDate }),
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    inLanguage: 'zh-TW',
    // 據點的 LocalBusiness 已經在 /location 宣告過，這裡用 @id 指回去就好
    location: { '@id': `${SITE_URL}/location#${venue.slug}-localbusiness` },
    organizer: { '@id': ORGANIZATION_ID },
    about: [event.danceStyle, '雙人舞', '社交舞'],
    ...(event.price !== undefined && {
      offers: {
        '@type': 'Offer',
        category: 'Paid',
        price: event.price,
        priceCurrency: 'TWD',
        availability: 'https://schema.org/InStock',
        url: event.enrollUrl || `${SITE_URL}/enroll`,
      },
    }),
  };
}

/**
 * 常見問題。
 * 註：Google 自 2023 起把 FAQ 複合式搜尋結果限縮到政府／醫療網站，
 * 這段不會長出摺疊式問答，但仍有助於理解頁面主題，成本也低。
 */
export function faqPageJsonLd(faqs: Faq[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        // answer 是 Markdown，剝掉連結語法只留文字
        text: faq.answer.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'),
      },
    })),
  };
}

export function teacherJsonLd(teacher: Teacher): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: teacher.name,
    url: `${SITE_URL}/teachers/${teacher.slug}`,
    image: absolute(teacher.imageUrl),
    jobTitle: teacher.title ?? 'Hustle / Brazilian Zouk 老師',
    description: teacher.description[0],
    knowsAbout: teacher.skills,
    worksFor: { '@id': ORGANIZATION_ID },
    ...(teacher.instagram && {
      sameAs: [`https://www.instagram.com/${teacher.instagram}`],
    }),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absolute(item.path),
    })),
  };
}
