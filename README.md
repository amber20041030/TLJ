# 領隊／導遊帶團專區

Vue 3 + Vite 製作的 Mobile First 前端 Demo，所有會員、行程與聊天資料皆儲存在瀏覽器 `localStorage`，不會連線到 API、資料庫或真實金流。

## 啟動

```bash
npm install
npm run dev
```

正式建置：

```bash
npm run build
```

## 已完成模組

- 個人簡介：公開預覽、基本資料、專長與語言、經歷、相簿、隱私設定
- 徵才啟事：搜尋篩選、收藏、詳情、應徵表單、應徵紀錄及旅行社聊天
- 交流討論：分類搜尋、發文草稿、留言回覆、收藏按讚、通知中心及我的文章
- 額外收入：方案搜尋篩選、收藏、加入申請、進度紀錄與收益摘要

以上功能均使用前端 Mock Data；文字狀態儲存在 `localStorage`，個人簡介圖片經壓縮後儲存在 `IndexedDB`。

## 主要結構

- `src/views/`：登入、付款、首頁、聊天室及四大功能頁面
- `src/components/`：Banner、表單、月曆、抽屜、聊天及四大功能共用元件
- `src/store.js`：集中 Mock Data 與 localStorage 保存
- `src/stores/features.js`：四大功能 Pinia 狀態與本機持久化操作
- `src/mockFeatures.js`：四大功能集中 Mock Data
- `src/utils/imageDb.js`：圖片壓縮與 IndexedDB 儲存
- `imgs/`：首頁四個圓形功能入口圖片；替換同名檔案即可更新
- `src/styles.css`：全站 Liquid Glass、Mobile First 與安全區樣式

Demo 信用卡可使用 `4242424242424242`、`12/30`、`123`。
