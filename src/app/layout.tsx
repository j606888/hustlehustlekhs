import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Noto_Sans_TC, Poppins } from "next/font/google";
import { Analytics } from '@vercel/analytics/next';
import JsonLd from '@/components/JsonLd';
import { SITE_DESCRIPTION, SITE_NAME, SITE_NAME_SERP, SITE_URL } from '@/constants/site';
import { organizationJsonLd } from '@/lib/jsonLd';
import "./globals.css";

// 中文字體：思源黑體（Noto Sans TC，SIL OFL，可商用）。沒有指定中文字體時，
// 每台裝置會用自己內建的字（蘋方／微軟正黑體…），同一頁在不同手機上長得不一樣。
// 英文與數字由 Poppins 負責（它排在字體清單前面），中文字才落到這裡。
// CJK 字體沒有可預載的 subset，所以 preload: false；Google Fonts 會依頁面用到的字
// 分塊下載，不會整套幾 MB 一次載入。
const notoSansTC = Noto_Sans_TC({
  weight: ['400', '500', '700', '900'],
  subsets: ['latin'],
  variable: '--font-noto-tc',
  display: 'swap',
  preload: false,
});

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
});

// 英文展示字：呼應 IG 海報上 HUSTLE／ZOUK 的瘦長粗體。只用在照片上的大字（.font-display），
// 不要拿來排內文或中文。
const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: '%s | HustleHustle KHS',
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    siteName: SITE_NAME_SERP,
    locale: 'zh_TW',
    type: 'website',
    // TODO: 拍一張 1200x630 的分享圖放到 public/images/og.jpg 後把 images 打開。
    //       目前先不給 og:image，讓 FB/LINE 分享時退回純文字卡片，
    //       比指向一張不存在的圖好。
    // images: [
    //   {
    //     url: '/images/og.jpg',
    //     width: 1200,
    //     height: 630,
    //     alt: 'HustleHustle KHS 的上課情形',
    //   },
    // ],
  },
  twitter: {
    card: 'summary_large_image',
  },
};

// 不鎖縮放：maximumScale/userScalable 會擋掉雙指放大，是無障礙扣分項。
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body className={`${notoSansTC.variable} ${poppins.variable} ${bebasNeue.variable} font-poppins antialiased`}>
        <JsonLd data={organizationJsonLd()} />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
