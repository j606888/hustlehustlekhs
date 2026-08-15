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

// 以下都是學員本人提供的心得，請勿自行改寫內容。
// 照片放在 public/testimonials/ 底下，imageUrl 指過去即可。
export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'julie',
    name: 'Julie',
    title: '跳過 Salsa、Bachata、Swing、Tango 的社交舞老手',
    imageUrl: '/testimonials/julie.jpg',
    danceStyle: 'Zouk',
    content: [
      '接觸過 Salsa、Bachata、Swing 和 Tango，當初因為喜歡 Zouk 的流動感，加上現在 Bachata 也融入了許多 Zouk 元素，沒想到一踏入就深深愛上了。',
      '十分享受跳 Zouk 的當下，感覺整個人都沉浸在音樂流動與連結的小宇宙裡。',
      'Zouk 非常講究細節。在老師細心的指導下，修正了許多跳舞的習慣，從身體控制、重心轉移到 Connection 都變得更加精準。',
      '最棒的福利是，因為 Zouk 對細緻度的要求很高，所以學到的技巧不只適用於 Zouk，連帶讓我跳其他社交舞時，也變得更加流暢與自在。',
    ],
    sortOrder: 0,
    published: true,
  },
  {
    id: 'yucheng',
    name: '育誠',
    title: '下班想動一動，結果一跳就是三年',
    imageUrl: '/testimonials/yucheng.jpg',
    danceStyle: 'Zouk',
    content: [
      '一開始，我也只是抱著下班想動一動、打發時間的心情參加了第一場舞會、上了第一堂體驗課。沒想到這一跳，就跳了三年。',
      '這三年來，除了學會舞蹈，我發現自己變得更有自信，與人相處時更加自然真誠，也更能感受當下的情緒、欣賞生活中的美。很難用三言兩語完整表達這段歷程對我的影響，只能說：很後悔沒有更早一點認識跳舞！',
      '如果你已經有學習其他舞種的經驗，我非常推薦你來認識 Zouk。Zouk 的基礎雖然只有十多招，要跳得專精、展現出質感卻大有學問。在學習過程中，我改善了許多舞蹈的基礎觀念與細節。Zouk 是一種極具流動感的舞蹈，它能展現高張力，也能歸於沉靜，甚至帶來飛翔般的體感；它更強調雙人之間的對話與連結。當你進入某種狀態時，會覺得世界瞬間安靜了下來、時間被拉長，整個人專注於當下，體驗到前所未有的自由與神奇。',
      '最後，真的很感謝我的老師暘暘與又嘉。他們對舞蹈充滿熱情、理解深刻，而且極其大方地分享所學。教學時總是給人溫暖、專業又安心的感覺，能遇到他們真的很幸運！',
    ],
    sortOrder: 3,
    published: true,
  },
  {
    id: 'chemistry',
    name: '化學',
    // TODO: 本人還沒提供照片，拿到後放進 public/testimonials/ 並改掉 imageUrl。
    title: '大學國標社出身，多年後重新跳舞',
    imageUrl: '/placeholder.svg',
    danceStyle: 'Hustle',
    content: [
      '大學曾是國標社，但好多年沒跳舞，好不容易身體健康，剛好聽到有人要學跳舞，就跟去了～～',
      '跳舞很開心，同學們也很 Nice 就一路停不下來。透過上課、練習會，每週都能感覺自己逐漸進步，對這種正向的感覺深深沈迷。',
      'Hustle 的優美，想動作的燒腦，做出漂亮動作成就感，音樂的沈浸，互動的各種趣事，令人享受。',
      '謝謝又嘉跟暘暘很用心的帶領，不斷調整上課內容與流程，一面優化內容一面量身定做，還花費心力辦 party、找 artist 開 workshop。',
      '感謝各位同學與學長姐一路的一起扶持成長，大家跳舞不斷進步，也分享生活的點點滴滴，最愛大家了！！！',
    ],
    sortOrder: 2,
    published: true,
  },
  {
    id: 'nora',
    name: 'Nora',
    title: '從 Bachata 踏進 Zouk 世界的學員',
    imageUrl: '/testimonials/nora.jpg',
    danceStyle: 'Zouk',
    content: [
      '從 Bachata 踏入 Zouk 的世界，直接轉換成最喜歡的雙人舞 😝 好喜歡音樂間跟舞伴流動不停的感覺，也太謝謝又嘉跟暘超清楚的教學方式，讓我們更清楚腳步可以在 social 中跳出優美的舞步，在這邊真的可以很有成就感 😍 拜託一定要來！',
    ],
    sortOrder: 1,
    published: true,
  },
];

export function getPublishedTestimonials(): Testimonial[] {
  return TESTIMONIALS.filter((t) => t.published).sort(
    (a, b) => a.sortOrder - b.sortOrder
  );
}
