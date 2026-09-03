// 站台層級的識別資訊。metadata、sitemap、robots、JSON-LD 都從這裡取值，
// 避免同一個網址／名稱散落在多處而互相不一致。

// 正式網域（已上線）。刻意帶 www：非 www 會 308 導到 www，正規網址必須是導向後的那個。
// 這個值會寫進 sitemap.xml、robots.txt、canonical 連結與所有 JSON-LD 的 @id，
// 改動時要跟部署設定的網域一起改，不然 Google 會抓到錯誤的正規網址。
export const SITE_URL = 'https://www.hustlehustlekhs.com';

// 品牌名的正式寫法。venues.ts 的據點名稱、logo.svg、Footer 版權都用這個寫法，
// 三者必須一致（Google 的本地搜尋看的是一致的 NAP）。
// IG 帳號的寫法 Hustlehustlekhs 放在下面的 SITE_NAME_FULL / alternateName。
export const SITE_NAME = 'HustleHustle KHS';

/**
 * 品牌全名／中文說明，供 JSON-LD 的 alternateName 使用。
 * 這裡放 IG bio 的完整寫法：Google 讀得到，但不佔用 <title> 有限的字元數
 * （中文 title 約 30 全形字就會被截斷）。
 */
export const SITE_NAME_FULL =
  'Hustlehustlekhs 高雄舞蹈教室｜Hustle・Brazilian Zouk 雙人舞';

/**
 * 全站預設描述（root layout 用），也是 Organization 結構化資料的 description。
 * 刻意同時帶到「雙人舞」與「社交舞」—— 台灣人搜尋打的是前者，但 Google
 * 不會自動把這兩個詞視為同義。
 */
export const SITE_DESCRIPTION =
  '高雄唯一同時教 Hustle 與 Brazilian Zouk 的雙人舞教室。左營區、三民區兩處場地每週定期開課，零基礎歡迎、不需舞伴即可報名。';

/** 我們教的舞種，供 Organization / LocalBusiness 的 knowsAbout 使用。 */
export const DANCE_STYLES = [
  'Hustle',
  'Brazilian Zouk',
  '雙人舞',
  '社交舞',
  'Social Dance',
] as const;

/** 服務範圍，供 Organization 結構化資料的 areaServed 使用。 */
export const SERVICE_AREAS = ['高雄市'] as const;
