// 站台層級的雜項設定。

/**
 * 首頁 Hero 右側的媒體。
 *
 * TODO: 有素材後填其中一個，兩個都留空的話 Hero 會顯示品牌色的佔位區塊。
 *   - 影片：把 mp4 上傳到 Vercel Blob（或任何可直連的 https 網址），填進 videoUrl
 *   - 圖片：把圖放到 public/images/，imageUrl 填路徑（例如 '/images/hero/hero-couple.jpg'）。
 *     滿版圖請從原檔輸出 3200px 寬，小於 2880px 在桌機高解析螢幕上會糊。
 * 兩個都填時以影片優先。
 */
export const HERO_MEDIA: { videoUrl?: string; imageUrl?: string } = {
  videoUrl: undefined,
  // 滿版首圖要「暗底＋人物在中間偏右」，白字才壓得上去；大合照背景太亮、
  // 人又排滿整張，字會蓋到臉，所以首圖改用這張；大合照移到「關於我們」（images/about/group.jpg）。換照片時記得調 Hero.tsx 的 OBJECT_POSITION。
  // 原檔 素材/網站照片精選/DSC00030-2.JPG（7008px），輸出成 3200px 寬：桌機滿版在 2x 螢幕上
  // 要到 2880px 才清楚，之前的 2000px 版本會被放大而變糊。
  imageUrl: '/images/hero/hero-couple.jpg',
};
