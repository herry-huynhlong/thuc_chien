# Sài Gòn Bistro

Website giới thiệu nhà hàng và nhận đặt bàn trực tuyến, xây dựng bằng **Node.js 20+**, **Express** và **PostgreSQL**. Frontend sử dụng HTML, CSS và JavaScript thuần.

## Chức năng

- Trang chủ và thực đơn hiển thị từ API
- Form đặt bàn: họ tên, email, số điện thoại, số khách, thời gian và ghi chú
- Kiểm tra dữ liệu ở backend; lưu đơn đặt bàn vào PostgreSQL
- `GET /health`: kiểm tra tiến trình web (không phụ thuộc database)
- `GET /ready`: kiểm tra khả năng kết nối database
- `GET /api/menu`: dữ liệu thực đơn
- `POST /api/reservations`: tạo yêu cầu đặt bàn
- Bài test sử dụng trình kiểm thử tích hợp sẵn của Node.js

## Yêu cầu

- Node.js 20 trở lên, npm
- PostgreSQL 14 trở lên

## Chạy local

1. Tạo database và tài khoản PostgreSQL (ví dụ, thực hiện bằng tài khoản quản trị):

   ```sql
   CREATE USER bistro_user WITH PASSWORD 'replace_with_strong_password';
   CREATE DATABASE bistro_db OWNER bistro_user;
   ```

2. Cài thư viện:

   ```bash
   npm install
   ```

3. Sao chép `.env.example` thành `.env` và sửa `DATABASE_URL` cho đúng với PostgreSQL local. Không commit `.env` lên Git.

4. Tạo bảng:

   ```bash
   npm run db:migrate
   ```

5. Chạy website:

   ```bash
   npm start
   ```

6. Mở `http://localhost:3000`.

## Kiểm thử

```bash
npm test
curl http://localhost:3000/health
curl http://localhost:3000/ready
curl http://localhost:3000/api/menu
```

`/health` trả về `200` khi HTTP server hoạt động. `/ready` trả về `503` nếu database không kết nối được. Trang web vẫn tải được trong trường hợp database tạm thời mất kết nối, nhưng thao tác đặt bàn sẽ thất bại.

## Cấu hình

| Biến | Ý nghĩa |
| --- | --- |
| `PORT` | Cổng HTTP; mặc định `3000` |
| `NODE_ENV` | Môi trường; mặc định `development` |
| `DATABASE_URL` | Chuỗi kết nối PostgreSQL; bắt buộc khi khởi động server |
| `DB_SSL` | Đặt `true` nếu kết nối PostgreSQL sử dụng TLS |

Ứng dụng lắng nghe tại `0.0.0.0` để hỗ trợ triển khai trên nhiều môi trường. Không đưa thông tin đăng nhập thực tế lên repository.

## Cấu trúc

```text
public/           Giao diện web
src/app.js        Express routes
src/server.js     Entry point
src/db.js         PostgreSQL connection pool
src/migrate.js    Tạo bảng từ db/schema.sql
src/validation.js Kiểm tra thông tin đặt bàn
db/schema.sql     Database schema
tests/            Unit tests
.env.example      Mẫu biến môi trường
```

## Lưu ý

Đây là website thực hành. Tên nhà hàng, địa chỉ và số điện thoại trên giao diện là dữ liệu minh họa, không phải thông tin liên hệ thực tế. Chức năng đặt bàn lưu yêu cầu vào cơ sở dữ liệu, chưa tích hợp xác nhận qua email hay thanh toán.
