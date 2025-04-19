import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import QueryProvider from '@/context/query-provider';
import { ThemeProvider } from '@/context/theme-provider';
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
  title:
    'ĐI LÀ SỬA - Sửa Chữa Máy Tính Tận Nơi Tại Nhà | Nhanh Chóng - Uy Tín Tại TP.HCM',
  description:
    'Dịch vụ sửa chữa máy tính tận nơi - tận nhà tại TP.HCM. Kỹ thuật viên đến tận nơi, sửa nhanh - chuyên nghiệp - giá rẻ. Phục vụ 24/7 khắp các quận.',
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
        </ThemeProvider>
        </QueryProvider>
        </body>
    </html>
  );
}
