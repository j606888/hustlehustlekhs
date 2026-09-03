// 外部連結的單一來源。Navbar、Footer、Hero、據點頁的 CTA 全部從這裡取值。
//
// TODO: LINE 連結目前是空的，拿到官方 LINE 後填入；沒有的話把 LINE 這一行連同
//       Footer 裡用到 LINKS.LINE 的區塊一起刪掉，不要留一個點了沒反應的連結。

const IG_HANDLE = 'hustlehustlekhs';

export const LINKS = {
  LINE: '', // TODO: 填入官方 LINE 連結，或整個移除
  // 報名 CTA 用，點擊直接開啟 IG 私訊對話
  INSTAGRAM_DM: `https://ig.me/m/${IG_HANDLE}`,
  INSTAGRAM: `https://www.instagram.com/${IG_HANDLE}`,
  THREADS: `https://www.threads.net/@${IG_HANDLE}`,
  BIO_SITE: `https://bio.site/${IG_HANDLE}`,
  COURSES: '/courses',
  PRICING: '/courses?tab=pricing',
  // 報名頁。IG bio 之後就指這裡，取代 bio.site 的連結頁。
  ENROLL: '/enroll',
} as const;

/**
 * 同一個品牌在站外的其他身分，供 JSON-LD 的 sameAs 使用。
 * sameAs 是 Google 用來確認「這個網站 = 這個社群帳號」的方式；IG 帳號已認證
 * 且有數千追蹤，把網站跟它綁在一起有助於建立品牌實體的可信度。
 */
export const SAME_AS: string[] = [LINKS.INSTAGRAM, LINKS.THREADS, LINKS.BIO_SITE];
