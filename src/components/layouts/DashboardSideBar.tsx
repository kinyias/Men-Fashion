'use client';

import { Award, CirclePercent, Star, Tags } from 'lucide-react';
import {
    ChevronDown,
    Home,
    Package,
    ShoppingCart,
    Tag,
    Users,
  } from "lucide-react"
  import Link from "next/link"
  import { usePathname } from "next/navigation"
  
  import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  submenu?: { title: string; href: string }[];
}

export const navItems: NavItem[] = [
  {
    title: 'Tổng quan',
    href: '/admin',
    icon: Home,
  },
  {
    title: 'Đơn hàng',
    href: '/admin/orders',
    icon: ShoppingCart,
  },
  {
    title: 'Danh mục',
    href: '/admin/categories',
    icon: Tag,
    submenu: [
      { title: 'Danh sách danh mục', href: '/admin/categories' },
      { title: 'Thêm danh mục', href: '/admin/categories/create' },
    ],
  },
  {
    title: 'Loại sản phẩm',
    href: '/admin/sub-category',
    icon: Tags,
    submenu: [
      { title: 'Danh sách loại sản phẩm', href: '/admin/sub-category' },
      { title: 'Thêm loại sản phẩm', href: '/admin/sub-category/create' },
    ],
  },
  {
    title: 'Thương hiệu',
    href: '/admin/brands',
    icon: Award,
    submenu: [
      { title: 'Danh sách thương hiệu', href: '/admin/brands' },
      { title: 'Thêm loại thương hiệu', href: '/admin/brands/create' },
    ],
  },
  {
    title: 'Sản phẩm',
    href: '/admin/products',
    icon: Package,
    submenu: [
      { title: 'Danh sách sản phẩm', href: '/admin/products' },
      { title: 'Thêm sản phẩm', href: '/admin/products/create' },
    ],
  },
  {
    title: 'Khuyến mãi',
    href: '/admin/coupons',
    icon: CirclePercent,
  },
  {
    title: 'Đánh giá',
    href: '/admin/reviews',
    icon: Star,
  },
  {
    title: 'Khách hàng',
    href: '/admin/customers',
    icon: Users,
  }
];
export default function DashboardSideBar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="h-screen">
      <SidebarHeader>
        <SidebarGroup>
          <SidebarGroupLabel>Trang quản trị</SidebarGroupLabel>
        </SidebarGroup>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname?.startsWith(item.href + '/');

                if (item.submenu) {
                  return (
                    <Collapsible
                      key={item.title}
                      defaultOpen={pathname?.startsWith(item.href)}
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton isActive={isActive}>
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                            <ChevronDown className="ml-auto h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.submenu.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={pathname === subItem.href}
                                >
                                  <Link href={subItem.href}>
                                    {subItem.title}
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {/* <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === '/dashboard/profile'}
            >
              <Link href="/dashboard/profile">
                <CircleUser className="h-4 w-4" />
                <span>Profile</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === '/dashboard/settings'}
            >
              <Link href="/dashboard/settings">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter> */}
    </Sidebar>
  );
}
