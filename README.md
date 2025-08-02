# 👔 TKhang - Website Thời Trang Nam

Website thương mại điện tử chuyên bán thời trang nam được xây dựng bằng Next.js, cung cấp trải nghiệm mua sắm hiện đại và thân thiện với người dùng.

## 🌟 Tính năng chính

### 🛍️ Tính năng người dùng

- **Danh mục sản phẩm đa dạng**: Áo sơ mi, quần tây, áo polo, phụ kiện nam
- **Tìm kiếm và lọc thông minh**: Theo giá, size, màu sắc, thương hiệu
- **Giỏ hàng và thanh toán**: Tích hợp nhiều phương thức thanh toán
- **Tài khoản cá nhân**: Quản lý đơn hàng, địa chỉ, thông tin cá nhân
- **Đánh giá sản phẩm**: Hệ thống review và rating
- **Responsive design**: Tối ưu cho mọi thiết bị

### 🎨 Giao diện

- **UI/UX hiện đại**: Thiết kế clean, tối giản phù hợp thời trang nam
- **Animation mượt mà**: Micro-interactions tăng trải nghiệm
- **Loading skeleton**: Hiển thị placeholder khi tải dữ liệu

### ⚡ Hiệu năng

- **SSR/SSG**: Server-side rendering và Static site generation
- **Image optimization**: Tối ưu hình ảnh với Next.js Image
- **Code splitting**: Tách code tự động cho tốc độ tải nhanh
- **PWA ready**: Hỗ trợ Progressive Web App

## 🛠️ Công nghệ sử dụng

### Frontend

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS / Styled Components
- **State Management**: Zustand
- **UI Library**: Shadcn/ui
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios / Fetch API

### Authentication & Payments

- **Auth**: Google
- **Payments**: COD/ Vnpay / MoMo
- **Database**: PostgreSQL

### Tools & Libraries

- **Icons**: Lucide React / React Icons
- **Charts**: Recharts (cho admin dashboard)
- **Date**: date-fns
- **Linting**: ESLint + Prettier

## 🚀 Cài đặt và chạy dự án

### Yêu cầu hệ thống

- Node.js 22+
- npm/yarn/pnpm
- Git

### Cài đặt

1. **Clone repository**

```bash
git clone https://github.com/kinyias/Men-Fashion
cd Men-Fashion
```

2. **Cài đặt dependencies**

```bash
npm install
# hoặc
yarn install
# hoặc
pnpm install
```

3. **Cấu hình environment variables**

```bash
cp .env.example .env.local
```

Cập nhật các biến môi trường trong `.env.local`:

```env
# Database
DATABASE_URL="your-database-url"


# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Payment
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="your-stripe-public-key"

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

4. **Chạy development server**

```bash
npm run dev
# hoặc
yarn dev
# hoặc
pnpm dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem website.

## 📝 Scripts có sẵn

```bash
npm run dev          # Chạy development server
npm run build        # Build production
npm run start        # Chạy production server
```

## 🔧 Customization

### Thay đổi theme colors

Chỉnh sửa file `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
      },
    },
  },
};
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push code lên GitHub
2. Import project trong Vercel
3. Cấu hình environment variables
4. Deploy tự động

### Các platform khác

- **Netlify**: Hỗ trợ Next.js với Netlify Edge Functions
- **Railway**: Deploy với database tích hợp
- **DigitalOcean App Platform**: Container-based deployment

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests với Playwright
npm run test:e2e

# Coverage report
npm run test:coverage
```

## 🔒 Security

- **HTTPS** bắt buộc trong production
- **CSP Headers** để ngăn XSS attacks
- **Rate limiting** cho API endpoints
- **Input validation** với Zod
- **Secure authentication** với NextAuth.js

## 🤝 Đóng góp

1. Fork repository
2. Tạo feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Mở Pull Request

## 📄 License

Dự án này được cấp phép dưới [MIT License](LICENSE).

## 👥 Team

- **Frontend Developer**: [Tên của bạn]
- **UI/UX Designer**: [Tên designer]
- **Backend Developer**: [Tên backend dev]

## 📞 Liên hệ

- **Email**: kinyiasdev@gmail.com
- **Website**: https://tkhang-fashion.vercel.app
- **GitHub**: https://github.com/kinyias/Men-Fashion

---
