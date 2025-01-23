# Node.js + TypeORM 訓練

## 功能

- 使用 Node.js 原生 HTTP 模組建立 API 伺服器
- 使用 TypeORM 操作 PostgreSQL 資料庫
- 支援部落格文章的 CRUD 操作

## API

- GET /posts - 取得所有文章
- GET /posts/:id - 取得單一文章
- POST /posts - 新增文章
- PUT /posts/:id - 更新文章
- DELETE /posts/:id - 刪除文章

## 開發指令

- `npm run dev` - 啟動開發伺服器
- `npm run start` - 啟動伺服器與資料庫
- `npm run restart` - 重新啟動伺服器與資料庫
- `npm run stop` - 關閉啟動伺服器與資料庫
- `npm run clean` - 關閉伺服器與資料庫並清除所有資料