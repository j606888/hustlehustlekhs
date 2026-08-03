// 上課據點的單一資料來源。
//
// 全站每一個出現地址的地方（Footer、/location、JSON-LD）都從這裡取值。
// 千萬不要把地址寫死在別的檔案 —— Google 的本地搜尋看的是一致的 NAP
// （名稱／地址／電話），站內地址互相衝突會直接扣分。
//
// 目前只有高雄一個據點，但仍保留陣列結構，之後要開第二個據點時
// 只要往 VENUES push 一筆、並在 VenueSlug 加上新的 slug 即可。

export type VenueSlug = 'kaohsiung';

export interface Venue {
  slug: VenueSlug;
  /** 城市，同時作為 PostalAddress.addressRegion */
  city: string; // '高雄市'
  /** 行政區，同時作為 PostalAddress.addressLocality */
  district: string; // '新興區'
  /** 課表卡上的裝飾字 */
  cityEn: string; // 'KAOHSIUNG'
  /** 據點全名，作為 LocalBusiness.name */
  name: string;
  /** 場地暱稱，接在「高雄市新興區」後面顯示 */
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
  /** Google Maps iframe 的 src */
  mapEmbedSrc: string;
  /** 點擊後在 Google Maps 開啟的連結 */
  mapLink: string;
  /** 導航提示，例如「請搜尋 XX 大樓而不是門牌」 */
  navNote?: string;
  /** 這個據點有哪些課程 track（對應 courses/schedule/data.ts 的 Track.id） */
  trackIds: string[];
}

/** 以座標為中心的 Google Maps 內嵌網址，不需 API key，釘選位置精確。 */
function mapEmbed(lat: number, lng: number): string {
  return `https://maps.google.com/maps?q=${lat},${lng}&hl=zh-TW&z=17&output=embed`;
}

function mapLink(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

// TODO: 以下全部是佔位資料，請 HustleHustle KHS 提供實際場地資訊後替換。
//       geo 座標請從 Google 地圖上該場地的位置取（右鍵 → 複製座標），
//       填錯會讓地圖釘子跑掉，不確定就整個 geo 欄位刪掉。
export const VENUES: Venue[] = [
  {
    slug: 'kaohsiung',
    city: '高雄市',
    district: '新興區', // TODO: 換成實際行政區
    cityEn: 'KAOHSIUNG',
    name: 'HustleHustle KHS 高雄教室', // TODO: 換成實際場地全名
    shortName: '待補場地名', // TODO
    streetAddress: '待補門牌地址', // TODO
    postalCode: '800', // TODO: 換成實際郵遞區號
    addressFull: '800 高雄市新興區（地址待補）', // TODO
    addressNote: undefined, // 有樓層／入口說明再填，例如「入口在大樓後方」
    // 座標暫時指向高雄車站附近，僅為讓地圖不空白。
    geo: { lat: 22.639065, lng: 120.302104 }, // TODO: 換成實際場地座標
    mapEmbedSrc: mapEmbed(22.639065, 120.302104), // TODO: 座標換掉後這裡也要一起改
    mapLink: mapLink('高雄市新興區'), // TODO: 改成實際場地名稱或 Google 商家短連結
    navNote: undefined, // 有找路訣竅再填，例如「請搜尋 XX 大樓，教室在 3 樓」
    trackIds: ['weekly-a', 'weekly-b'],
  },
];

/** 全站唯一據點。單據點時期用這個，省得每次都寫 VENUES[0]。 */
export const PRIMARY_VENUE = VENUES[0];

export function getVenue(slug: VenueSlug): Venue {
  const venue = VENUES.find((v) => v.slug === slug);
  if (!venue) throw new Error(`Unknown venue slug: ${slug}`);
  return venue;
}
