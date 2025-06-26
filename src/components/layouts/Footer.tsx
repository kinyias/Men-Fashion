import { Facebook, Github, Instagram, Linkedin, Youtube } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-bold text-xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-shopping-bag h-5 w-5"
              >
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <span>TKHANG</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Trang phục nam cao cấp dành cho quý ông hiện đại.
            </p>
            <div className="flex gap-4">
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                <Instagram/>
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="https://www.linkedin.com/in/tin-khang"
                className="text-muted-foreground hover:text-foreground"
              >
                <Linkedin/>
                <span className="sr-only">Linkedin</span>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                <Facebook/>
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                <Youtube/>
                <span className="sr-only">YouTube</span>
              </Link>
              <Link
                href="https://github.com/kinyias"
                className="text-muted-foreground hover:text-foreground"
              >
                <Github/>
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Cửa hàng</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link
                  href="/tin-tuc"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Tin tức
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Hỗ trợ</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/lien-he"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link
                  href="/faqs"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  href="/size-guide"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Hướng dẫn chọn size
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Thông tin</h3>
            <ul className="space-y-2 text-sm">
              <li>Địa chỉ: 180 Cao Lỗ, Phường 4, Quận 8, TP Hồ Chí Minh</li>
              <li>Email: DH52102716@student.stu.edu.vn</li>
              <li>Điện thoại: (028) 38 505 520</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 border-t pt-8">
          <p className="text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()} Bản quyền thuộc về TKHANG. Được phát triển bởi{' Thái Tín Khang '}
          </p>
        </div>
      </div>
    </footer>
  );
}
