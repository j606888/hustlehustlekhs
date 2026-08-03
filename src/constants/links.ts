// 外部連結的單一來源。Navbar、Footer、Hero、據點頁的 CTA 全部從這裡取值。
//
// TODO: 以下的 IG 帳號是從其他專案的社群清單推測出來的（Hustlehustle Kaohsiung
//       = hustlehustlekh，注意結尾沒有 s），請跟他們核對正確帳號後替換。
//       LINE 連結目前是空的，拿到官方 LINE 後填入；沒有的話把 LINE 這一行連同
//       Footer 裡用到 LINKS.LINE 的區塊一起刪掉，不要留一個點了沒反應的連結。

const IG_HANDLE = 'hustlehustlekh'; // TODO: 向 HustleHustle KHS 核對

export const LINKS = {
  LINE: '', // TODO: 填入官方 LINE 連結，或整個移除
  // 報名 CTA 用，點擊直接開啟 IG 私訊對話
  INSTAGRAM_DM: `https://ig.me/m/${IG_HANDLE}`,
  INSTAGRAM: `https://www.instagram.com/${IG_HANDLE}`,
  COURSES: '/courses',
  PRICING: '/courses?tab=pricing',
} as const;
