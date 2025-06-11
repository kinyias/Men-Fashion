'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { User, Package, Settings, Shield, Star, Menu, X, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigationItems = [
  {
    id: 'profile',
    label: 'Tài khoản',
    icon: User,
    description: 'Thông tin tài khoản',
    href: '/tai-khoan',
  },
  {
    id: 'orders',
    label: 'Lịch sử đơn hàng',
    icon: Package,
    description: 'Theo dõi đơn hàng',
    href: '/tai-khoan/don-hang',
  },
  {
    id: 'coupon',
    label: 'Mã giảm giá',
    icon: Tag,
    description: 'Mã giảm giá',
    href: '/tai-khoan/khuyen-mai',
  },
  {
    id: 'loyalty',
    label: 'Chương trình thành viên',
    icon: Star,
    description: 'Điểm & thưởng',
    href: '/tai-khoan/chuong-trinh-thanh-vien',
  },
  {
    id: 'preferences',
    label: 'Cài đặt',
    icon: Settings,
    description: 'Thông báo & thêm',
    href: '/tai-khoan/cai-dat',
  },
  {
    id: 'security',
    label: 'Bảo mật',
    icon: Shield,
    description: 'Mật khẩu & quyền riêng tư',
    href: '/tai-khoan/bao-mat',
  },
];

export function AccountSidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const SidebarContent = () => (
    <Card className="p-6">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Account Settings</h2>
        <p className="text-sm text-muted-foreground">
          Manage your account and preferences
        </p>
      </div>

      <nav className="mt-6 space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link href={item.href} key={item.id}>
              <Button
                variant={isActive ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start h-auto p-3 text-left',
                  isActive && 'bg-primary/10 text-primary border-primary/20'
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center gap-3 w-full">
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{item.label}</span>
                      
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Button>
            </Link>
          );
        })}
      </nav>
    </Card>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block sticky top-24">
        <SidebarContent />
      </div>

      {/* Mobile Menu Button */}
      <div className="lg:hidden mb-6">
        <Button
          variant="outline"
          onClick={() => setIsMobileMenuOpen(true)}
          className="w-full justify-start"
        >
          <Menu className="h-4 w-4 mr-2" />
          Account Menu
        </Button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="fixed inset-y-0 left-0 w-80 bg-background border-r shadow-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Account Menu</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <SidebarContent />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
