// 站台層級的識別資訊。metadata、sitemap、robots、JSON-LD 都從這裡取值，
// 避免同一個網址／名稱散落在多處而互相不一致。

// TODO: 換成實際網域。這個值會寫進 sitemap.xml、robots.txt、canonical 連結
//       與所有 JSON-LD 的 @id，填錯 Google 會抓到錯誤的正規網址。
export const SITE_URL = 'https://www.hustlehustlekhs.com';

export const SITE_NAME = 'HustleHustle KHS';

/** 品牌全名／中文說明，供 JSON-LD 的 alternateName 使用。 */
export const SITE_NAME_FULL = 'HustleHustle KHS 高雄 Hustle 舞蹈教室';

/**
 * 全站預設描述（root layout 用）。
 * TODO: 等實際上課時間／課程確定後改寫，把「高雄 Hustle」這組關鍵字帶進去。
 */
export const SITE_DESCRIPTION =
  '高雄的 Hustle 社交舞教室。每週定期開課，零基礎歡迎，不需舞伴即可報名。';

/** 服務範圍，供 Organization 結構化資料的 areaServed 使用。 */
export const SERVICE_AREAS = ['高雄市'] as const;
