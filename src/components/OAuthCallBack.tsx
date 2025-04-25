"use client";
import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { setAuthTokens } from '@/lib/axios-client';

export default function OAuthCallBack() {
  const router = useRouter();
   const searchParams = useSearchParams(); // Use useSearchParams to access query parameters
 
   useEffect(() => {
     // Wait for searchParams to be ready
     if (searchParams) {
       // Extract query parameters
       const token = searchParams.get('token');
       const refreshToken = searchParams.get('refreshToken');
       const error = searchParams.get('error');
 
       if (token && refreshToken) {
         // Save tokens
         setAuthTokens({ accessToken: token, refreshToken });
 
         // Redirect to dashboard
         setTimeout(() => {
           router.push('/dashboard');
         }, 1000);
       } else if (error) {
         // If there was an error, redirect to login with error
         router.push(`/auth/login?error=${error}`);
       } else {
         // If no tokens or error, redirect to login
         router.push('/auth/login');
       }
     }
   }, [searchParams, router]);
   return (
    <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-md">
    <div className="flex flex-col items-center justify-center text-center">
      <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Đang tiến hành đăng nhập</h2>
      <div className="mt-8">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
      <p className="mt-4 text-sm text-gray-600">
        Đợi một chút quá trình đăng nhập sẽ hoàn thành trong giây lát...
      </p>
    </div>
  </div>
   )
}
