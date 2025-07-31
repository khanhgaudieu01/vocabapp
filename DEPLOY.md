# Hướng dẫn Deploy ứng dụng VocabApp

## 🚀 Deploy lên Vercel (Khuyến nghị)

### Bước 1: Chuẩn bị Database

1. **Tạo database PostgreSQL trên Vercel:**
   - Đăng nhập vào [Vercel](https://vercel.com)
   - Vào Dashboard → Storage → Create Database
   - Chọn PostgreSQL
   - Đặt tên database (ví dụ: `vocabapp-db`)
   - Chọn region gần nhất
   - Click "Create"

2. **Lấy connection string:**
   - Sau khi tạo xong, copy connection string
   - Format: `postgresql://username:password@host:port/database`

### Bước 2: Deploy ứng dụng

1. **Push code lên GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/vocabapp.git
   git push -u origin main
   ```

2. **Deploy trên Vercel:**
   - Vào [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import repository từ GitHub
   - Chọn repository `vocabapp`
   - Click "Deploy"

3. **Cấu hình Environment Variables:**
   - Trong project settings → Environment Variables
   - Thêm biến `POSTGRES_URL` với connection string từ bước 1
   - Click "Save"

4. **Deploy lại:**
   - Vercel sẽ tự động deploy lại khi có environment variables mới

### Bước 3: Khởi tạo Database

1. **Truy cập Vercel CLI:**
   ```bash
   npm i -g vercel
   vercel login
   ```

2. **Push database schema:**
   ```bash
   vercel env pull .env.local
   npx prisma db push
   ```

3. **Generate Prisma client:**
   ```bash
   npx prisma generate
   ```

## 🔧 Cài đặt Local Development

### Yêu cầu hệ thống
- Node.js 18+ 
- npm hoặc yarn
- Git

### Bước 1: Clone repository
```bash
git clone https://github.com/yourusername/vocabapp.git
cd vocabapp
```

### Bước 2: Cài đặt dependencies
```bash
npm install
```

### Bước 3: Cấu hình database
1. Tạo file `.env.local`:
```env
POSTGRES_URL="your-postgresql-connection-string"
```

2. Khởi tạo database:
```bash
npx prisma db push
npx prisma generate
```

### Bước 4: Chạy ứng dụng
```bash
npm run dev
```

Truy cập: http://localhost:3000

## 📊 Database Schema

Ứng dụng sử dụng 3 bảng chính:

### Vocabulary
- `id`: ID tự động tăng
- `chinese`: Từ tiếng Trung
- `pinyin`: Pinyin
- `vietnamese`: Nghĩa tiếng Việt
- `notes`: Ghi chú
- `example`: Ví dụ câu
- `nextReviewDate`: Ngày ôn tập tiếp theo
- `level`: Cấp độ (1-6)
- `reviewCount`: Số lần ôn tập
- `isActive`: Trạng thái hoạt động

### ReviewHistory
- `id`: ID tự động tăng
- `vocabularyId`: ID từ vựng
- `reviewDate`: Ngày ôn tập
- `result`: Kết quả (true/false)
- `timeSpent`: Thời gian ôn tập (giây)

### StudyStats
- `id`: ID tự động tăng
- `date`: Ngày thống kê
- `totalReviews`: Tổng số từ ôn tập
- `correctReviews`: Số từ đúng
- `newWordsAdded`: Số từ mới thêm
- `studyTime`: Thời gian học (phút)

## 🔄 Cập nhật ứng dụng

### Local Development
```bash
git pull origin main
npm install
npx prisma db push
npm run dev
```

### Production (Vercel)
- Push code lên GitHub
- Vercel sẽ tự động deploy

## 🛠️ Troubleshooting

### Lỗi Database Connection
- Kiểm tra `POSTGRES_URL` trong environment variables
- Đảm bảo database đã được tạo và accessible

### Lỗi Prisma
```bash
npx prisma generate
npx prisma db push
```

### Lỗi Build
- Kiểm tra TypeScript errors
- Đảm bảo tất cả dependencies đã được cài đặt

## 📱 Tính năng chính

✅ **Quản lý từ vựng**
- Thêm, xem, chỉnh sửa từ vựng
- Hỗ trợ chữ Hán, Pinyin, nghĩa tiếng Việt
- Thêm ghi chú và ví dụ câu

✅ **Spaced Repetition**
- 6 cấp độ học tập
- Tự động tính toán lịch ôn tập
- Thuật toán tối ưu cho việc ghi nhớ

✅ **Giao diện ôn tập**
- Giao diện trực quan, dễ sử dụng
- Hiển thị từng từ một
- Đánh giá kết quả đúng/sai

✅ **Thống kê học tập**
- Theo dõi tiến độ
- Phân tích hiệu suất
- Biểu đồ trực quan

## 🎯 Lợi ích

1. **Học hiệu quả**: Sử dụng phương pháp Spaced Repetition đã được khoa học chứng minh
2. **Tiết kiệm thời gian**: Tự động hóa lịch ôn tập
3. **Theo dõi tiến độ**: Thống kê chi tiết giúp điều chỉnh phương pháp học
4. **Giao diện thân thiện**: Dễ sử dụng trên mọi thiết bị
5. **Hoàn toàn online**: Truy cập mọi lúc, mọi nơi 