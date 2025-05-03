'use client';

import DashboardSideBar from '@/components/layouts/DashboardSideBar';
import HeaderDashboard from '@/components/layouts/HeaderDashboard';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AuthProvider } from '@/context/auth-provider';
import { cn } from '@/lib/utils';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <AuthProvider>
      <SidebarProvider>
      <DashboardSideBar />
      <SidebarInset>
        <main
          className={cn(
            'flex min-h-screen flex-col'
          )}
        >
          <HeaderDashboard />
            {children}
        </main>
        </SidebarInset>
        </SidebarProvider>
      </AuthProvider>
    </div>
  );
}
