# 內容填寫指南

這個網站沒有後台。所有內容都寫在程式碼裡的資料檔，**改一個檔案 → 存檔 → 網站就更新**。

看不懂程式碼也沒關係：下面每一項都告訴你「改哪個檔、改哪一段」。
檔案裡凡是標著 `TODO` 的地方，就是還沒填的東西。

---

## 一、必填（不填的話網站是錯的）

| 想改什麼 | 改這個檔案 | 說明 |
|---|---|---|
| **網址** | `src/constants/site.ts` 的 `SITE_URL` | 這個值會寫進 sitemap、robots.txt 與所有結構化資料。**填錯 Google 會抓到錯的網址**，一定要先確定 |
| **Instagram 帳號** | `src/constants/links.ts` 的 `IG_HANDLE` | 只填帳號本身、不要 `@`。目前填的是 `hustlehustlekh`（推測值），**請務必核對** |
| **LINE 連結** | `src/constants/links.ts` 的 `LINE` | 沒有官方 LINE 就留空字串，Footer 會自動不顯示這一項 |
| **教室地址** | `src/data/venues.ts` | 全站唯一的地址來源。Footer、地點頁、Google 結構化資料都從這裡取，**不要在別的地方另外寫地址** |
| **導航連結** | `src/data/venues.ts` 的 `mapLink` | 點下去會開 Google 地圖的那個連結。頁面上不放地圖大圖，只放這個連結 |
| **地圖座標** | `src/data/venues.ts` 的 `geo` | 選填。在 Google 地圖上對場地按右鍵 → 複製座標，貼進 `lat` / `lng`，Google 就知道教室的精確位置。不確定就整個 `geo` 不要寫，寧可不放也不要放錯位置 |

## 二、課程相關

全部集中在同一個檔案：**`src/components/courses/schedule/data.ts`**

| 想改什麼 | 找檔案裡的這一段 |
|---|---|
| 這個月的月曆（哪幾號有課、什麼顏色） | `MONTH` —— `year` / `month` 換成當月，`highlights` 的 key 是「幾號」 |
| 當月課表圖（IG 發的那張） | `MONTH` 的 `poster` —— 圖存到 `public/images/`，把 `src` 換成新檔名（例如 `/images/schedule-2026-09.png`）。不放圖就把整個 `poster` 刪掉 |
| 每週固定課程的時間與內容 | `TRACKS` —— 每一筆是一條固定課程線，`slots` 是當天的時段 |
| 這一期有哪幾堂課（日期） | `TRACKS` 裡各自的 `dates` |
| 價錢、課卡方案 | `PRICE_PLANS` |
| 課表卡片的顏色 | `THEMES` |

小提醒：
- 每個月要記得更新 `MONTH`，不然月曆會停在舊的月份。
- 已經過去的場次會**自動**變成灰色（程式用今天的日期判斷），不用手動改。
- `TRACKS` 裡的 `sessionLabelEn` 必須是英文星期（`SUNDAY` / `THURSDAY` …），
  Google 靠它判斷你們的上課時間，寫錯會失效。
- 課表卡上的「查看費用」要連得到，`Track.pricePlanId` 要跟 `PRICE_PLANS` 的 `id` 對得起來。

**Hustle 的風格介紹**（課程頁第三個 tab）在另一個檔：
`src/components/courses/Introduction.tsx` 的 `DANCE_STYLES`。
示範影片填 YouTube 網址 `?v=` 後面那一段 ID 就好，留空則不顯示影片。

## 三、人與心得

| 想改什麼 | 改這個檔案 |
|---|---|
| 老師（名字、簡介、專長、照片、影片） | `src/data/teachers.ts` |
| 常見問題 Q&A | `src/data/faq.ts` |
| 學員心得 | `src/data/testimonials.ts` |

共通規則：
- `sortOrder` 數字小的排前面。老師列表的第一位會做成大卡片，想主打誰就給他 `0`。
- `published: false` 可以先把某一筆藏起來，不用整段刪掉。
- 老師的 `slug` 會變成網址（`/teachers/xxx`），**定了以後盡量別改**，改了舊連結會壞掉。

## 四、圖片

圖片放在 `public/` 資料夾底下，程式裡用 `/` 開頭的路徑指過去。

| 圖片 | 放哪裡 | 然後改 |
|---|---|---|
| 老師照片 | `public/teachers/名字.jpg` | `src/data/teachers.ts` 的 `imageUrl` |
| 學員頭像 | `public/testimonials/名字.jpg` | `src/data/testimonials.ts` 的 `imageUrl` |
| 首頁大圖／影片 | `public/images/hero.jpg` | `src/data/site.ts` 的 `HERO_MEDIA` |
| 首頁「我們是誰」合照 | `public/images/who-we-are.jpg` | `src/components/home/WhoWeAre.tsx` 的 `<Image src=...>` |
| 教室場地照 | `public/images/venue.jpg` | `src/app/(site)/location/page.tsx` 裡被註解掉的 `photo={{...}}`，取消註解即可 |
| 分享到 FB／LINE 的預覽圖 | `public/images/og.jpg`（1200×630） | `src/app/layout.tsx` 裡被註解掉的 `images`，取消註解即可 |

還沒有的圖片一律指向 `/placeholder.svg`，畫面上會顯示灰色的「圖片待補」，不會破圖。

## 五、品牌視覺

**換主色**：改 `src/app/globals.css` 裡的 `--brand` 這一行就好，全站顏色會一起變。

但有兩個地方是 SVG 圖檔，讀不到那個設定，要手動把裡面的 `#009689` 換成新的顏色：
- `public/logo.svg`（左上角的 logo）
- `src/app/icon.svg`（瀏覽器分頁的小圖示）

**換 logo**：直接把 `public/logo.svg` 整個檔案換掉即可，Navbar 與 Footer 都會跟著換。

> 註：課表卡與風格介紹卡用的是另一組多色系統（`THEMES`），它們的用途是「讓幾條課程線互相區分」，
> 跟品牌主色是兩件事，換品牌色時不一定要跟著改。

## 六、其他文字

| 想改什麼 | 改這個檔案 |
|---|---|
| 首頁大標語 | `src/components/home/Hero.tsx` |
| 首頁「我們是誰」那段介紹 | `src/components/home/WhoWeAre.tsx` |
| 上方選單的項目 | `src/components/Navbar.tsx` 的 `NAV_LINKS` |
| Footer 的連結與那句定位描述 | `src/components/Footer.tsx` |
| 各頁在 Google 搜尋結果顯示的標題與描述 | 各頁 `page.tsx` 最上面的 `metadata` |

---

## 改完之後

在專案資料夾裡跑：

```bash
yarn dev      # 本機預覽 http://localhost:3000
yarn build    # 確認沒有打壞任何東西
```

`yarn build` 有錯誤就代表某個地方寫壞了（常見原因：少了逗號、引號沒關、
`pricePlanId` 對不到 `PRICE_PLANS` 的 `id`）。錯誤訊息會指出檔名跟行號。
