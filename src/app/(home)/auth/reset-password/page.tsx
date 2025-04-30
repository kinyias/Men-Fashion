'use client';

import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Suspense } from 'react';

export default function ResetPasswordPage() {
   

  return (
    <>
 
        <div className="py-20 flex items-center justify-center ">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                Đặt lại mật khẩu mới
              </CardTitle>
              <CardDescription className="text-center">
                Mật khẩu của bạn phải khác mật khẩu cũ
              </CardDescription>
            </CardHeader>
            <CardContent>
            <Suspense fallback={<div>Đang tải...</div>}>
            <ResetPasswordForm />
            </Suspense>
            </CardContent>
          </Card>
        </div>
      
    </>
  );
}
