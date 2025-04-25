'use client';

import { AuthProvider } from '@/context/auth-provider';
import { cn } from '@/lib/utils';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <AuthProvider>
        <main
          className={cn(
            'flex-1 transition-all pt-4'
          )}
        >
            {children}
        </main>
      </AuthProvider>
    </div>
  );
}
