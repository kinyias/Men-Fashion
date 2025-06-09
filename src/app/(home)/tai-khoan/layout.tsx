'use client'
import { AccountSidebar } from '@/components/account/AccountSidebar';
import { AccountHeader } from '@/components/account/AccountHeader';
import React from 'react';

export default function TaiKhoanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <AccountHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <AccountSidebar
              activeSection="profile" // or whichever section is currently active
              onSectionChange={(section) => {
                // Handle the section change, e.g., update state or navigate
                console.log(section)
              }}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">{children}</div>
        </div>
      </div>
    </div>
  );
}
