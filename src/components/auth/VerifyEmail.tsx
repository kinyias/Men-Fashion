import React, { useEffect, useState } from 'react';
import {  useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-provider';
import Link from 'next/link';

export default function VerifyEmail() {
    const { verifyEmail } = useAuth();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const verifyToken = async () => {
        if (!token || typeof token !== 'string') return;
  
        try {
          setStatus('loading');
          await verifyEmail(token);
          setStatus('success');
        } catch (error: any) {
          console.error('Lỗi xác thực:', error);
          setStatus('error');
          setError(error.message || 'Xác thực email không thành công.');
        }
      };
  
      if (token) {
        verifyToken();
      }
      console.log('errrrrrrr');
    }, [token, verifyEmail]);
  return (
    <> {status === 'loading' && (
        <div className="flex flex-col items-center justify-center py-6">
          <div className="w-12 h-12 border-4 border-primary-500 rounded-full border-t-transparent animate-spin mb-4"></div>
          <p className="text-gray-700">Đang xác minh email của bạn...</p>
        </div>
      )}

      {status === 'success' && (
        <div className="text-center">
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
            <p>Email của bạn đã được xác minh thành công</p>
          </div>
          <Link href="/login">
            <Button>Đăng nhập</Button>
          </Link>
        </div>
      )}

      {status === 'error' && (
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            <p>{error || 'Failed to verify email. The link may have expired.'}</p>
          </div>
          <Link href="/login">
            <Button>Trở về đăng nhập</Button>
          </Link>
        </div>
      )}</>
  )
}
