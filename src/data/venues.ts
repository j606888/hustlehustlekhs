// 上課據點的單一資料來源。
//
// 全站每一個出現地址的地方（Footer、/location、JSON-LD）都從這裡取值。
// 千萬不要把地址寫死在別的檔案 —— Google 的本地搜尋看的是一致的 NAP
// （名稱／地址／電話），站內地址互相衝突會直接扣分。
//
// 目前兩個據點都在高雄，共用同一頁 /location（以 slug 作為錨點）。
// 要新增據點時：往 VENUES push 一筆、在 VenueSlug 加上新的 slug，
// 並在 courses/schedule/data.ts 讓對應的 track 指向它。

export type VenueSlug = 'zhirenzhan' | 'social-hub';

export interface Venue {
  slug: VenueSlug;
  /** 城市，同時作為 PostalAddress.addressRegion */
  city: string; // '高雄市'
  /** 行政區，同時作為 PostalAddress.addressLocality */
  district: string; // '左營區'
  /** 課表卡上的裝飾字 */
  cityEn: string; // 'KAOHSIUNG'
  /** 據點全名，作為 LocalBusiness.name */
  name: string;
  /** 場地暱稱，接在「高雄市左營區」後面顯示 */
  shortName: string;
  /** 門牌，作為 PostalAddress.streetAddress */
  streetAddress: string;
  postalCode: string;
  /** 顯示用完整地址（頁面上直接印出來的那一行） */
  addressFull: string;
  /** 地址下方的補充說明（例如樓層、入口在後門等） */
  addressNote?: string;
  /** 已知的座標；不確定時留空，寧可不填也不要填錯（會讓地圖釘錯位置） */
  geo?: { lat: number; lng: number };
  /** 點擊後在 Google Maps 開啟的連結 */
  mapLink: string;
  /** 導航提示，例如「請搜尋 XX 大樓而不是門牌」 */
  navNote?: string;
  /** 這個據點有哪些課程 track（對應 courses/schedule/data.ts 的 Track.id） */
  trackIds: string[];
}

function mapLink(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

// TODO: geo 座標尚未填。要填的話請從 Google 地圖上該場地的位置取
//       （右鍵 → 複製座標），填錯會讓結構化資料指錯位置，不確定就整個 geo 欄位不要加。
export const VENUES: Venue[] = [
  {
    slug: 'zhirenzhan',
    city: '高雄市',
    district: '左營區',
    cityEn: 'KAOHSIUNG',
    name: 'HustleHustle KHS・職人棧',
    shortName: '職人棧',
    streetAddress: '至聖路171號2樓',
    postalCode: '813',
    addressFull: '高雄市左營區至聖路171號2樓',
    mapLink: mapLink('高雄市左營區至聖路171號'),
    trackIds: ['hustle-thu'],
  },
  {
    slug: 'social-hub',
    city: '高雄市',
    district: '三民區',
    cityEn: 'KAOHSIUNG',
    name: 'HustleHustle KHS・Social Hub',
    shortName: 'Social Hub',
    streetAddress: '大昌二路67號3樓之2',
    postalCode: '807',
    addressFull: '高雄市三民區大昌二路67號3樓之2',
    mapLink: mapLink('高雄市三民區大昌二路67號'),
    trackIds: ['zouk-fri'],
  },
];

export function getVenue(slug: VenueSlug): Venue {
  const venue = VENUES.find((v) => v.slug === slug);
  if (!venue) throw new Error(`Unknown venue slug: ${slug}`);
  return venue;
}
