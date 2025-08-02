'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  Package,
  Truck,
  CreditCard,
  MapPin,
  Clock,
  Printer,
  CheckCircle,
  XCircle,
  ArrowRight,
} from 'lucide-react';
import Image from 'next/image';
import { ChiTietDonHang, DonHang } from '@/types';
import { formatCurrency } from '@/utils/currency';
import { cn } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateOrderStatus, cancelOrder } from '@/lib/api/api-orders';
import toast from 'react-hot-toast';
import { ViettelPostBillRequest } from '@/types/viettelpost';
import { createBill } from '@/lib/api';
import { formatDate } from '@/utils/formatTime';

const shippingSteps = [
  {
    value: 'da_dat',
    label: 'Đã Đặt',
    icon: Package,
    description: 'Đơn hàng đã được đặt',
  },
  {
    value: 'dang_xu_ly',
    label: 'Đang Xử Lý',
    icon: Clock,
    description: 'Đang chuẩn bị hàng',
  },
  {
    value: 'dang_giao_hang',
    label: 'Đang Giao Hàng',
    icon: Truck,
    description: 'Đang trên đường giao',
  },
  {
    value: 'da_giao_hang',
    label: 'Đã Giao Hàng',
    icon: CheckCircle,
    description: 'Giao hàng thành công',
  },
];

export function OrderDetails({ order }: { order: DonHang }) {
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [status, setStatus] = useState<string>(order.trangthai);
  const queryClient = useQueryClient();

  // Update order status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      if (status === 'dang_giao_hang') {
        const billRequest: ViettelPostBillRequest = {
          ORDER_NUMBER: '12',
          GROUPADDRESS_ID: 5818802,
          CUS_ID: 722,
          DELIVERY_DATE: '11/10/2018 15:09:52',
          SENDER_FULLNAME: 'Yanme Shop',
          SENDER_ADDRESS: 'Số 5A ngách 22 ngõ 282',
          SENDER_EMAIL: 'titiyoutu@gmail.com',
          SENDER_WARD: 827,
          SENDER_DISTRICT: 47,
          SENDER_PROVINCE: 2,
          RECEIVER_FULLNAME: order.ten,
          RECEIVER_ADDRESS:
            order.diachi +
            ', ' +
            order.phuong +
            ', ' +
            order.quan +
            ', ' +
            order.thanhpho,
          RECEIVER_PHONE: order.sdt,
          RECEIVER_EMAIL: order.email || '',
          PRODUCT_TYPE: 'HH',
          ORDER_PAYMENT: 3,
          ORDER_SERVICE: order.phuongthucgiaohang,
          ORDER_SERVICE_ADD: '',
          ORDER_VOUCHER: '',
          ORDER_NOTE: 'Cho phép xem hàng',
          MONEY_COLLECTION: order.tonggia,
          MONEY_TOTALFEE: 0,
          MONEY_FEECOD: 0,
          MONEY_FEEVAS: 0,
          MONEY_FEEINSURRANCE: 0,
          MONEY_FEE: 0,
          MONEY_FEEOTHER: 0,
          MONEY_TOTALVAT: 0,
          MONEY_TOTAL: 0,
          LIST_ITEM: order.chiTietDonHangs.map((item: ChiTietDonHang) => ({
            PRODUCT_NAME: item.bienThe.sanPham.ten,
            PRODUCT_PRICE: item.dongia,
            PRODUCT_WEIGHT: 200,
            PRODUCT_QUANTITY: item.soluong,
          })),
        };
        const billResponse = await createBill(billRequest);
        return updateOrderStatus(
          id,
          status,
          billResponse.data.data.ORDER_NUMBER
        );
      }
      return updateOrderStatus(id, status);
    },
    onSuccess: (data) => {
      // Update local state
      setStatus(data.trangthai);
      setCancelDialogOpen(false);
      setCancelReason('');
      // Invalidate and refetch order data
      queryClient.invalidateQueries({ queryKey: ['order', order.ma] });
      toast.success('Trạng thái đơn hàng đã được cập nhật');
    },
    onError: (error) => {
      toast.error('Không thể cập nhật trạng thái đơn hàng');
      console.error('Error updating order status:', error);
    },
  });

  // Cancel order mutation
  const cancelOrderMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => {
      return cancelOrder(id, reason);
    },
    onSuccess: (data) => {
      // Update local state
      setStatus(data.donHang.trangthai);
      setCancelDialogOpen(false);
      setCancelReason('');
      // Invalidate and refetch order data
      queryClient.invalidateQueries({ queryKey: ['order', order.ma] });
      toast.success('Đơn hàng đã được hủy');
    },
    onError: (error) => {
      toast.error('Không thể hủy đơn hàng');
      console.error('Error cancelling order:', error);
    },
  });

  const getCurrentStepIndex = () => {
    if (status === 'da_huy') return -1;
    return shippingSteps.findIndex((step) => step.value === status);
  };

  const currentStepIndex = getCurrentStepIndex();
  const isCancelled = status === 'da_huy';

  const handleNextStep = () => {
    if (isCancelled) return;

    const nextIndex = currentStepIndex + 1;
    if (nextIndex < shippingSteps.length) {
      const nextStatus = shippingSteps[nextIndex].value;
      updateStatusMutation.mutate({ id: order.ma, status: nextStatus });
    }
  };

  const canAdvance =
    !isCancelled && currentStepIndex < shippingSteps.length - 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Đơn Hàng #{order.ma}</CardTitle>
        <CardDescription>
          Đặt vào ngày {formatDate(order.ngaydat)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Sản Phẩm Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Sản Phẩm</h2>
          <div className="space-y-4">
            {order.chiTietDonHangs.map((item: ChiTietDonHang) => (
              <div key={item.ma} className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-md overflow-hidden flex-shrink-0">
                  <Image
                    src={item.bienThe.sanPham.hinhanh || '/placeholder.svg'}
                    alt={item.bienThe.sanPham.ten}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{item.bienThe.sanPham.ten}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.bienThe?.mauSac?.ten} / {item.bienThe?.kichCo?.ten}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(item.dongia)} × {item.soluong}
                  </p>
                </div>
                <div className="text-right">
                  {formatCurrency(item.dongia * item.soluong)}
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="space-y-1.5">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tạm tính</span>
              <span>{formatCurrency(order.tamtinh)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Phí giao hàng</span>
              <span>{formatCurrency(order.phigiaohang)}</span>
            </div>
            {order.giamgia && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Giảm giá</span>
                <span>{formatCurrency(order.giamgia)}</span>
              </div>
            )}
            <div className="flex justify-between font-medium">
              <span>Tổng cộng</span>
              <span>{formatCurrency(order.tonggia)}</span>
            </div>
          </div>
        </div>

        <Separator />
        {/* Thanh Toán Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Thanh Toán</h2>
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Phương Thức Thanh Toán
              </h3>
              <p className="text-sm">
                {order.thanhToans.phuongthuc === 'cod'
                  ? 'Thanh toán khi nhận hàng (COD)'
                  : order.thanhToans.phuongthuc === 'momo' ? 'Thanh toán qua MoMo' : 'Thanh toán qua VNpay'}
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Thông Tin Thanh Toán
              </h3>
              <div className="text-sm">
                <p>
                  Trạng thái:{' '}
                  {order.thanhToans.trangthai
                    ? 'Đã thanh toán'
                    : 'Chưa thanh toán'}
                </p>
                {order.thanhToans.ngaythanhtoan &&
                  order.thanhToans.trangthai && (
                    <p>
                      Ngày thanh toán:{' '}
                      {formatDate(order.thanhToans.ngaythanhtoan)}
                    </p>
                  )}
                {order.thanhToans.transId && order.thanhToans.trangthai && (
                  <p>Mã giao dịch: {order.thanhToans.transId}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <Separator />
        {/* Vận Chuyển Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Vận Chuyển</h2>
          <div className="text-sm">
            <p>
              Phương thức giao hàng:{' '}
              {order.phuongthucgiaohang == 'STK'
                ? 'Tiết kiệm'
                : order.phuongthucgiaohang == 'SCN'
                ? 'Nhanh'
                : 'Hỏa tốc'}
            </p>
          </div>
          {order.mavandon && (
            <div className="text-sm pb-3">
              <p>Đơn vị vận chuyển: Viettel Post</p>
              <p>Mã vận đơn: {order.mavandon}</p>
            </div>
          )}
          <div className="space-y-6 p-6 bg-white rounded-lg border">
            <div className="space-y-2">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <Truck className="h-4 w-4" />
                Trạng Thái Vận Chuyển
              </h3>
            </div>

            {/* Normal shipping steps */}
            {!isCancelled && (
              <div className="space-y-4">
                {shippingSteps.map((step, index) => {
                  const Icon = step.icon;
                  const isCompleted = index < currentStepIndex;
                  const isCurrent = index === currentStepIndex;
                  const isUpcoming = index > currentStepIndex;

                  return (
                    <div key={step.value} className="relative">
                      {/* Connecting line */}
                      {index < shippingSteps.length - 1 && (
                        <div
                          className={cn(
                            'absolute left-6 top-12 w-0.5 h-8 transition-colors',
                            isCompleted ? 'bg-green-500' : 'bg-gray-200'
                          )}
                        />
                      )}

                      <Button
                        variant={
                          isCurrent
                            ? 'secondary'
                            : isCompleted
                            ? 'secondary'
                            : 'outline'
                        }
                        className={cn(
                          'w-full justify-start h-auto p-4 transition-all cursor-default',
                          isCurrent && 'ring-2 ring-blue-500 ring-offset-2',
                          isCompleted && 'bg-green-50 border-green-200',
                          isUpcoming && 'opacity-60'
                        )}
                        asChild
                      >
                        <div>
                          <div className="flex items-center gap-4 w-full">
                            <div
                              className={cn(
                                'flex items-center justify-center w-12 h-12 rounded-full transition-colors',
                                isCurrent && 'bg-blue-500 text-white',
                                isCompleted && 'bg-green-500 text-white',
                                isUpcoming && 'bg-gray-200 text-gray-500'
                              )}
                            >
                              <Icon className="h-5 w-5" />
                            </div>
                            <div className="flex-1 text-left">
                              <div
                                className={cn(
                                  'font-medium',
                                  isCurrent && 'text-blue-700',
                                  isCompleted && 'text-green-700'
                                )}
                              >
                                {step.label}
                              </div>
                              <div className="text-sm text-gray-500 mt-1">
                                {step.description}
                              </div>
                            </div>
                            {isCompleted && (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            )}
                          </div>
                        </div>
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Cancelled status */}
            {isCancelled && (
              <div className="space-y-4">
                <Button
                  variant="destructive"
                  className="w-full justify-start h-auto p-4 cursor-not-allowed"
                  disabled
                >
                  <div className="flex items-center gap-4 w-full">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500 text-white">
                      <XCircle className="h-5 w-5" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-white">Đã hủy</div>
                      <div className="text-sm text-red-100 mt-1">
                        Đơn hàng đã hủy
                      </div>
                    </div>
                  </div>
                </Button>
              </div>
            )}

            {/* Cancel/Restore buttons */}
            <div className="flex gap-2 pt-4 border-t">
              {!isCancelled && (
                <>
                  {canAdvance && (
                    <Button
                      onClick={handleNextStep}
                      className="flex-1"
                      disabled={updateStatusMutation.isPending}
                    >
                      {updateStatusMutation.isPending ? (
                        'Đang cập nhật...'
                      ) : (
                        <>
                          <ArrowRight className="h-4 w-4 mr-2" />
                          Bước Tiếp Theo
                        </>
                      )}
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setCancelDialogOpen(true)}
                    className={canAdvance ? 'flex-1' : 'w-full'}
                    disabled={
                      cancelOrderMutation.isPending ||
                      currentStepIndex === shippingSteps.length - 1
                    }
                  >
                    {cancelOrderMutation.isPending ? (
                      'Đang hủy...'
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 mr-2" />
                        Hủy Đơn Hàng
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>

            {/* Current status display */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-gray-600">Trạng thái hiện tại:</div>
              <div className="font-medium">
                {isCancelled
                  ? 'Đã hủy'
                  : shippingSteps.find((step) => step.value === status)?.label}
                {isCancelled && order.lydo && (
                  <div className="text-sm text-red-600 mt-1">
                    Lý do: {order.lydo || 'Không có lý do'}
                  </div>
                )}
              </div>
              {!isCancelled && canAdvance && (
                <div className="text-sm text-blue-600 mt-1">
                  Bước tiếp theo: {shippingSteps[currentStepIndex + 1]?.label}
                </div>
              )}
              {!isCancelled &&
                !canAdvance &&
                currentStepIndex === shippingSteps.length - 1 && (
                  <div className="text-sm text-green-600 mt-1">
                    Đơn hàng đã hoàn thành
                  </div>
                )}
            </div>
          </div>
        </div>

        <Separator />
        {/* Ghi Chú Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Ghi Chú</h2>
          <div className="space-y-2">
            <p>{order.ghichu || 'Không có ghi chú'}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <Button variant="outline" onClick={() => window.print()}>
          <Printer className="mr-2 h-4 w-4" />
          In Đơn Hàng
        </Button>
        {/* <Button>Gửi Email Cho Khách Hàng</Button> */}
      </CardFooter>
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-destructive" />
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
              onClick={() => {
                cancelOrderMutation.mutate({
                  id: order.ma,
                  reason: cancelReason,
                });
              }}
              disabled={cancelOrderMutation.isPending}
            >
              {cancelOrderMutation.isPending ? (
                'Đang hủy...'
              ) : (
                <>
                  <XCircle className="h-4 w-4 mr-2" />
                  Xác nhận hủy
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
