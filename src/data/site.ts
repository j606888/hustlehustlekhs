// 站台層級的雜項設定。

/**
 * 首頁 Hero 右側的媒體。
 *
 * TODO: 有素材後填其中一個，兩個都留空的話 Hero 會顯示品牌色的佔位區塊。
 *   - 影片：把 mp4 上傳到 Vercel Blob（或任何可直連的 https 網址），填進 videoUrl
 *   - 圖片：把圖放到 public/images/hero.jpg，imageUrl 填 '/images/hero.jpg'
 * 兩個都填時以影片優先。
 */
export const HERO_MEDIA: { videoUrl?: string; imageUrl?: string } = {
  videoUrl: undefined,
  imageUrl: undefined,
};
