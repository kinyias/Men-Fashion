"use client";

import { useAuth } from '@/context/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface AdminRouteProps {
  children: React.ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  useEffect(() => {
      // Only check permissions after loading is complete
      if (!loading) {
      // Now check if user exists and is admin
      if (!user || !isAdmin()) {
        router.push('/');
      }
    }
  }, [user, loading, router, isAdmin]);

  // Show loading state while authentication is in progress
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // After loading is complete, check if user exists and is admin
  if (!user || !isAdmin()) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return <>{children}</>;
}
