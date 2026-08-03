# HustleHustle KHS 官方網站

高雄 Hustle 社交舞教室的官方網站。Next.js App Router 純前端靜態站，部署目標為 Vercel。

## 開始開發

```bash
yarn install
yarn dev      # http://localhost:3000
```

其他指令：

```bash
yarn build    # 產生正式版（TypeScript + ESLint 會一起檢查）
yarn start    # 跑正式版
yarn lint     # 只跑 ESLint
```

Node 版本見 `.nvmrc`（v20.9.0）。

## 我只是想改網站上的文字／課表／價錢

不用讀程式碼，看 **[docs/content-guide.md](./docs/content-guide.md)** 就好，
那份文件列出「要改什麼 → 改哪個檔案」。

## 給工程師

架構說明在 [CLAUDE.md](./CLAUDE.md)。重點只有一句：
**這個站沒有資料庫、沒有 API，所有內容都是 `src/data/` 底下的 TypeScript 檔。**
