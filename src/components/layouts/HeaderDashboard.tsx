'use client';
import React from 'react';
import { SidebarTrigger } from '../ui/sidebar';
import { usePathname } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { navItems } from './DashboardSideBar';
function findBreadcrumb(pathname: string) {
  for (const item of navItems) {
    if (item.href === pathname) {
      return [item]; // direct match
    }
    if (item.submenu) {
      const subItem = item.submenu.find(sub => sub.href === pathname);
      if (subItem) {
        return [item, subItem]; // parent + child
      }
    }
  }
  return [];
}
export default function HeaderDashboard() {
  const pathname = usePathname();
  const breadcrumbTitles = findBreadcrumb(pathname);
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <SidebarTrigger className="mr-2" />
        <div className="flex items-center gap-2 font-semibold">
        <Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
    </BreadcrumbItem>
    {breadcrumbTitles.map((item, index) => (
      <React.Fragment key={index}>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
        <BreadcrumbLink href={item.href}>{item.title}</BreadcrumbLink>
        </BreadcrumbItem>
      </React.Fragment>
    ))}
  </BreadcrumbList>
</Breadcrumb>
        </div>
        <div className="ml-auto flex items-center space-x-4">
            Admin
        </div>
      </div>
    </div>
  );
}
