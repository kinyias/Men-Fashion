import React from 'react';
import Link from 'next/link';
import { XCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function FailedOrder() {
  return (
    <div className="bg-white rounded-lg border shadow-sm p-6 md:p-8 text-center">
      <div className="flex justify-center mb-6">
        <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
          <XCircle className="h-8 w-8 text-destructive" />
        </div>
      </div>
      <h1 className="text-2xl md:text-3xl font-bold mb-2">
        Đặt hàng thất bại!
      </h1>
      <p className="text-muted-foreground mb-6">
        Rất tiếc, đã có lỗi xảy ra trong quá trình đặt hàng. Đơn hàng của bạn
        chưa được ghi nhận.
        <br />
        Vui lòng kiểm tra lại thông tin và thử lại hoặc liên hệ với bộ phận hỗ
        trợ của chúng tôi nếu cần giúp đỡ.
      </p>
      <Separator className="my-6" />
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild>
          <Link href="/">Quay về trang chủ</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/lien-he">
            Liên hệ hỗ trợ <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
