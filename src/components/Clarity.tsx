import Script from 'next/script';

// Microsoft Clarity：熱點圖（點哪裡）、捲動圖（滑到哪裡離開）、訪客操作錄影。免費、無流量上限。
// 專案 ID 從 clarity.microsoft.com → 專案 → Settings → Overview 取得，
// 設在 Vercel 的環境變數 NEXT_PUBLIC_CLARITY_ID（Production）。沒設就完全不載入，
// 所以本機開發與 Preview 部署不會把自己的瀏覽混進統計。
// Clarity 預設會遮蔽輸入框內容；隱私權說明見 TODO（尚未有隱私權頁）。
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID;

export default function Clarity() {
  if (!CLARITY_ID || !/^[a-z0-9]+$/i.test(CLARITY_ID)) return null;

  return (
    <Script id="ms-clarity" strategy="afterInteractive">
      {`(function(c,l,a,r,i,t,y){
c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window,document,"clarity","script","${CLARITY_ID}");`}
    </Script>
  );
}
