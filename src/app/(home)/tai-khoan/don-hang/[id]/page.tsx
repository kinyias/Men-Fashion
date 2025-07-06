'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
  MessageCircle,
  MapPin,
  CreditCard,
  Phone,
  Mail,
  AlertCircle,
  Star,
} from 'lucide-react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getOrderWithOrderItemsById,
  cancelOrder,
  repaymentOrder,
} from '@/lib/api/api-orders';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import toast from 'react-hot-toast';
import type { ApiError, DonHang } from '@/types';
import { formatCurrency } from '@/utils/currency';
import { WriteReviewModal } from '@/components/reviews/WriteReviewModal';
import { formatDate } from '@/utils/formatTime';
import Link from 'next/link';

const statusConfig = {
  da_dat: {
    label: 'Đã đặt',
    color: 'bg-yellow-100 text-yellow-800',
    icon: Clock,
    progress: 25,
  },
  dang_xu_ly: {
    label: 'Đang xử lý',
    color: 'bg-blue-100 text-blue-800',
    icon: RefreshCw,
    progress: 50,
  },
  dang_giao_hang: {
    label: 'Đang giao hàng',
    color: 'bg-blue-100 text-blue-800',
    icon: Truck,
    progress: 75,
  },
  da_giao_hang: {
    label: 'Đã giao hàng',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle,
    progress: 100,
  },
  da_huy: {
    label: 'Đã hủy',
    color: 'bg-red-100 text-red-800',
    icon: XCircle,
    progress: 0,
  },
};

export default function OrderDetailPage() {
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [repaymentDialogOpen, setRepaymentDialogOpen] = useState(false);
  const params = useParams<{ id: string }>();
  const orderId = params?.id;
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showWriteReview, setShowWriteReview] = useState(false);
  const {
    data: order,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => getOrderWithOrderItemsById(orderId),
  });

  const cancelOrderMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      cancelOrder(id, reason),
    onSuccess: () => {
      queryClient.setQueryData(['order', orderId], (oldData: DonHang) => ({
        ...oldData,
        trangthai: 'da_huy',
        ngayhuy: new Date().toISOString(),
      }));

      queryClient.invalidateQueries({ queryKey: ['orders'] });

      toast.success('Đơn hàng đã được hủy thành công');
      setCancelDialogOpen(false);
      setCancelReason('');
    },
    onError: (error: ApiError) => {
      console.error('Error cancelling order:', error);
      toast.error(error.response?.data?.message || 'Không thể hủy đơn hàng');
    },
  });

  const repaymentMutation = useMutation({
    mutationFn: ({
      id,
      phuongthuc,
    }: {
      id: string;
      phuongthuc: 'momo' | 'vnpay';
    }) => repaymentOrder(id, phuongthuc),
    onSuccess: (data) => {
      // Redirect to payment URL
      window.location.href = data.paymentUrl;
      setRepaymentDialogOpen(false);
    },
    onError: (error: ApiError) => {
      console.error('Error repaying order:', error);
      toast.error(
        error.response?.data?.message || 'Không thể thanh toán lại đơn hàng'
      );
    },
  });

  const handleCancelOrder = () => {
    cancelOrderMutation.mutate({
      id: orderId,
      reason: cancelReason,
    });
  };

  const handleRepayment = (phuongthuc: 'momo' | 'vnpay') => {
    repaymentMutation.mutate({
      id: orderId,
      phuongthuc,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">
                Không tìm thấy đơn hàng
              </h1>
              <p className="text-muted-foreground mb-6">
                Đơn hàng không tồn tại hoặc bạn không có quyền xem.
              </p>
              <Button onClick={() => router.push('/tai-khoan/don-hang')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại danh sách đơn hàng
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const statusInfo = statusConfig[order.trangthai];
  const StatusIcon = statusInfo.icon;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Đơn hàng #{order.ma}</h1>
            <p className="text-muted-foreground">
              Đặt ngày {formatDate(order.ngaydat)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <StatusIcon className="h-5 w-5" />
                    Trạng thái đơn hàng
                  </CardTitle>
                  <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Tiến độ đơn hàng</span>
                      <span>{statusInfo.progress}%</span>
                    </div>
                    <Progress value={statusInfo.progress} className="h-2" />
                  </div>

                  {order.mavandon && (
                    <div className="text-sm">
                      <span className="font-medium">Mã vận đơn: </span>
                      <span>{order.mavandon}</span>
                    </div>
                  )}
                  {order.ngaygiao && (
                    <div className="text-sm">
                      <span className="font-medium">
                        Ngày giao hàng dự kiến:{' '}
                      </span>
                      <span>{formatDate(order.ngaygiao)}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Sản phẩm ({order.chiTietDonHangs.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.chiTietDonHangs.map((item) => (
                    <div key={item.ma} className="flex flex-col">
                      <div className="flex flex-wrap items-center gap-4 p-4 border rounded-lg">
                        <Image
                          src={item.sanPham.hinhanh}
                          alt={item.sanPham.ten}
                          width={80}
                          height={80}
                          className="rounded-md object-cover"
                        />

                        <div className="flex-1">
                          <Link href={`/san-pham/${item.sanPham.ma}`}>
                            <h4 className="font-medium hover:text-primary transition-colors duration-300">
                              {item.sanPham.ten}
                            </h4>
                          </Link>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span>Màu: {item.bienThe.mauSac.ten}</span>
                            <span>Size: {item.bienThe.kichCo.ten}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Số lượng: {item.soluong}
                          </p>
                        </div>

                        <div className="text-right w-full">
                          <p className="font-medium">
                            {formatCurrency(item.dongia)}
                          </p>
                        </div>
                      </div>
                      {order.trangthai === 'da_giao_hang' && (
                        <Button
                          onClick={() => setShowWriteReview(true)}
                          className="w-full"
                          variant="default"
                        >
                          <Star className="h-4 w-4 mr-2" />
                          Đánh giá sản phẩm
                        </Button>
                      )}
                      {/* Write Review Modal */}
                      {showWriteReview && (
                        <WriteReviewModal
                          productId={item.sanPham.ma}
                          onClose={() => setShowWriteReview(false)}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Tổng quan đơn hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Tạm tính</span>
                  <span>
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    }).format(order.tamtinh)}
                  </span>
                </div>
                {order.giamgia && order.giamgia > 0 && (
                  <div className="flex justify-between">
                    <span>Giảm giá</span>
                    <span className="text-red-500">
                      -{formatCurrency(order.giamgia)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Phí vận chuyển</span>
                  <span>{formatCurrency(order.phigiaohang)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Tổng cộng</span>
                  <span>{formatCurrency(order.tonggia)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Địa chỉ giao hàng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 text-sm">
                  <p className="font-medium">{order.ten}</p>
                  <p>{order.diachi}</p>
                  <p>
                    {order.phuong}, {order.quan}, {order.thanhpho}
                  </p>
                  <p className="flex items-center gap-1 mt-2">
                    <Phone className="h-3 w-3" />
                    {order.sdt}
                  </p>
                  {order.email && (
                    <p className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {order.email}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Thông tin thanh toán
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Phương thức</span>
                    <span>
                      {order.thanhToans?.phuongthuc || 'Chưa thanh toán'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Trạng thái</span>
                    <Badge
                      variant="secondary"
                      className={
                        order.thanhToans?.trangthai
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }
                    >
                      {order.trangthai == 'da_huy' &&
                      order.thanhToans.phuongthuc != 'cod'
                        ? 'Đã hoàn tiền'
                        : order.thanhToans?.trangthai
                        ? 'Đã thanh toán'
                        : 'Chưa thanh toán'}
                    </Badge>
                  </div>
                  {/* Add Repayment Button */}
                  {order.thanhToans &&
                    order.thanhToans.phuongthuc !== 'cod' &&
                    !order.thanhToans.trangthai &&
                    order.trangthai !== 'da_huy' && (
                      <Button
                        className="w-full mt-2"
                        onClick={() => setRepaymentDialogOpen(true)}
                        disabled={repaymentMutation.isPending}
                      >
                        {repaymentMutation.isPending ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        ) : (
                          <RefreshCw className="h-4 w-4 mr-2" />
                        )}
                        Thanh toán lại
                      </Button>
                    )}
                </div>
              </CardContent>
            </Card>

            {/* Order Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Thao tác</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {order.trangthai === 'da_dat' && (
                  <Button
                    className="w-full"
                    variant="destructive"
                    onClick={() => setCancelDialogOpen(true)}
                    disabled={cancelOrderMutation.isPending}
                  >
                    {cancelOrderMutation.isPending ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <XCircle className="h-4 w-4 mr-2" />
                    )}
                    Hủy đơn hàng
                  </Button>
                )}
                <Link href="/lien-he">
                  <Button className="w-full" variant="outline">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Liên hệ hỗ trợ
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Need Help */}
            <Card>
              <CardHeader>
                <CardTitle>Bạn cần giúp đỡ?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>Gọi cho chúng tôi: 1800-XXX-XXX</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>Email: support@menfashion.com</span>
                </div>
                <p className="text-muted-foreground">
                  Đội ngũ hỗ trợ khách hàng của chúng tôi luôn sẵn sàng giúp đỡ
                  bạn 24/7.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Add the cancel dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Xác nhận hủy đơn hàng
            </DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn hủy đơn hàng này? Hành động này không thể
              hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="cancelReason" className="text-sm font-medium">
                Lý do hủy đơn (không bắt buộc)
              </label>
              <Textarea
                id="cancelReason"
                placeholder="Nhập lý do hủy đơn hàng..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCancelDialogOpen(false);
                setCancelReason('');
              }}
            >
              Hủy bỏ
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelOrder}
              disabled={cancelOrderMutation.isPending}
            >
              {cancelOrderMutation.isPending ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <XCircle className="h-4 w-4 mr-2" />
              )}
              Xác nhận hủy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add the repayment dialog */}
      <Dialog open={repaymentDialogOpen} onOpenChange={setRepaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chọn phương thức thanh toán</DialogTitle>
            <DialogDescription>
              Vui lòng chọn phương thức thanh toán bạn muốn sử dụng.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <Button
              onClick={() => handleRepayment('momo')}
              className="w-full"
              disabled={repaymentMutation.isPending}
            >
              <Image
                src="/assets/momo.svg"
                alt="MoMo"
                width={24}
                height={24}
                className="mr-2"
              />
              Thanh toán qua MoMo
            </Button>
            <Button
              onClick={() => handleRepayment('vnpay')}
              className="w-full"
              disabled={repaymentMutation.isPending}
            >
              <Image
                src="/assets/vnpay.svg"
                alt="VNPay"
                width={24}
                height={24}
                className="mr-2"
              />
              Thanh toán qua VNPay
            </Button>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRepaymentDialogOpen(false)}
              disabled={repaymentMutation.isPending}
            >
              Hủy bỏ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
