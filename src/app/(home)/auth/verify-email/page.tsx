'use client';
import VerifyEmail from '@/components/auth/VerifyEmail';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Suspense } from 'react';

export default function ConfirmAccount() {
    

  return (
    <div className="py-20 flex items-center justify-center ">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Xác minh tài khoản
          </CardTitle>
          <CardDescription className="text-center">
            Xác minh tài khoản của bạn để bắt đầu sử dụng dịch vụ của chúng tôi.
          </CardDescription>
        </CardHeader>
        <CardContent>
        <Suspense fallback={<div>Đang tải...</div>}>
        <VerifyEmail/>
        </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
