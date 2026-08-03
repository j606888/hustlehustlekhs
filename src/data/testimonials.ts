// 學員心得的單一資料來源。顯示在首頁的輪播區塊。
//
// title 是一句話的自我描述（例如「和男友一起來上課的女友」），
// 寫得有畫面感比寫職稱好看。content 是多段心得。

export interface Testimonial {
  id: string; // React key 用的穩定字串
  name: string;
  title: string; // 一句話的自我描述
  imageUrl: string;
  danceStyle: string; // 顯示在名字下方的小 chip
  content: string[]; // 多段心得
  sortOrder: number;
  published: boolean;
}

// TODO: 以下兩筆是佔位。實際做法建議直接跟學員要一段話 + 一張照片，
//       照片放到 public/testimonials/ 底下再把 imageUrl 指過去。
//       還沒有心得可以先把兩筆都改成 published: false，首頁區塊就會空著。
export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'placeholder-1',
    name: '學員 A',
    title: '第一次接觸社交舞的上班族',
    imageUrl: '/placeholder.svg',
    danceStyle: 'Hustle',
    content: [
      '這裡放學員的心得。可以寫他為什麼開始跳舞、上課前後的差別、最喜歡課堂的哪一部分。',
      '第二段可以放更個人的感受，段落數量不限。',
    ],
    sortOrder: 0,
    published: true,
  },
  {
    id: 'placeholder-2',
    name: '學員 B',
    title: '被朋友拉來結果自己入坑的人',
    imageUrl: '/placeholder.svg',
    danceStyle: 'Hustle',
    content: ['這裡放另一位學員的心得。'],
    sortOrder: 1,
    published: true,
  },
];

export function getPublishedTestimonials(): Testimonial[] {
  return TESTIMONIALS.filter((t) => t.published).sort(
    (a, b) => a.sortOrder - b.sortOrder
  );
}
