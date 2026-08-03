import type { Metadata, Viewport } from "next";
import { Roboto, Poppins } from "next/font/google";
import { Analytics } from '@vercel/analytics/next';
import JsonLd from '@/components/JsonLd';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/constants/site';
import { organizationJsonLd } from '@/lib/jsonLd';
import "./globals.css";

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap',
});

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
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
    siteName: SITE_NAME,
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
      <body className={`${roboto.variable} ${poppins.variable} font-poppins antialiased`}>
        <JsonLd data={organizationJsonLd()} />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
