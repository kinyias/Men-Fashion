import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import QueryProvider from '@/context/query-provider';
import { ThemeProvider } from '@/context/theme-provider';
import { Toaster } from 'react-hot-toast';
const beVietnamPro = localFont({
  src: [
    {
      path: './fonts/BeVietnamPro-Bold.ttf',
      weight: '700',
    },
    {
      path: './fonts/BeVietnamPro-Medium.ttf',
      weight: '500',
    },
    {
      path: './fonts/BeVietnamPro-Regular.ttf',
      weight: '400',
    },
  ],
});
export const metadata: Metadata = {
  title: 'TKhang | Thời Trang Nam Lịch Lãm & Phong Cách',
  description:
    'Khám phá TKhang – thương hiệu thời trang nam hiện đại, lịch lãm và cá tính. Cung cấp áo sơ mi, áo thun, quần jean và phụ kiện dành riêng cho phái mạnh. Giao hàng toàn quốc.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${beVietnamPro.className} antialiased`}>
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
