'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import type { CheckoutFormValues } from '@/lib/validations/checkout.validator';
import { useCartStore } from '@/lib/store/cart-store';
import { createOrder, getAddresses, getCartProducts } from '@/lib/api';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ApiError, KhuyenMai } from '@/types';
import toast from 'react-hot-toast';
import { CartItem } from '@/lib/store/cart-store';

export default function CheckoutPage() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<KhuyenMai | null>(null);
  const [shippingMethod, setShippingMethod] = useState<'SCN' | 'SHT' | 'STK'>(
    'STK'
  );
  const [shippingPrices, setShippingPrices] = useState<{
    [key: string]: {
      price: number;
      time: number;
    };
  }>({});
  const [updatedCartItems, setUpdatedCartItems] = useState<CartItem[]>([]);
  const { items: cartItems, clearCart } = useCartStore();

  // Fetch addresses
  const { data: userAddresses, isLoading: isLoadingAddresses } = useQuery({
    queryKey: ['addresses'],
    queryFn: () => getAddresses({ macdinh: true, page: 1, limit: 1 }),
  });

  // Fetch latest product data for cart items
  const { data: cartProductsData, isLoading: isLoadingProducts } = useQuery({
    queryKey: [
      'cartProducts',
      cartItems.map(
        (item) =>
          `${item.ma}-${item.bienThe.mauSac.ma}-${item.bienThe.kichCo.ma}`
      ),
    ],
    queryFn: () =>
      getCartProducts(
        cartItems.map((item) => ({
          ma: item.ma,
          bienThe: {
            mamausac: item.bienThe.mauSac.ma,
            makichco: item.bienThe.kichCo.ma,
          },
        }))
      ),
    enabled: cartItems.length > 0,
  });

  // Update cart items with latest data from server
  useEffect(() => {
    if (cartProductsData?.data && cartItems.length > 0) {
      const updatedItems = cartItems.map((cartItem) => {
        const product = cartProductsData.data.find((p) => p.ma === cartItem.ma);
        if (!product) {
          toast.error(`Sản phẩm "${cartItem.ten}" đã ngừng kinh doanh`);
          cartItem.soLuong = 0;
          return cartItem;
        }

        const variant = product.bienThes.find(
          (v) =>
            v.mauSac.ma === cartItem.bienThe.mauSac.ma &&
            v.kichCo.ma === cartItem.bienThe.kichCo.ma
        );
        if (!variant) return cartItem;

        // Check for price changes
        if (variant.gia !== cartItem.gia) {
          toast.error(
            `Giá sản phẩm "${cartItem.ten}" đã thay đổi, vui lòng kiểm tra lại`
          );
        }

        // Check for stock issues
        if (variant.soluong < cartItem.soLuong) {
          toast.error(
            `Sản phẩm "${cartItem.ten}" chỉ còn ${variant.soluong} trong kho`
          );
        }

        return {
          ...cartItem,
          gia: variant.gia,
          bienThe: {
            ...cartItem.bienThe,
            soluong: variant.soluong,
          },
        };
      });

      setUpdatedCartItems(updatedItems);
    }
  }, [cartProductsData, cartItems]);

  // Calculate order totals using updated cart items
  const subtotal = (
    updatedCartItems.length > 0 ? updatedCartItems : cartItems
  ).reduce((sum, item) => sum + item.gia * item.soLuong, 0);

  const shipping =
    shippingMethod === 'STK'
      ? shippingPrices['STK']?.price
      : shippingMethod === 'SCN'
      ? shippingPrices['SCN']?.price
      : shippingPrices['SHT']?.price;

  const getDiscount = (coupon: KhuyenMai) => {
    if (!coupon) return 0;
    if (coupon.loaikhuyenmai === 'phan_tram') {
      const discount = (coupon.giatrigiam / 100) * subtotal;
      return Math.min(discount, coupon.giamtoida);
    } else if (coupon.loaikhuyenmai === 'tien_mat') {
      return coupon.giatrigiam;
    }
    return 0;
  };

  const total = subtotal + (shipping || 0) - getDiscount(appliedCoupon!);

  const createOrderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: (data) => {
      clearCart();
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        router.push(`/thanh-toan/xac-nhan/${data.ma}`);
      }
      setIsProcessing(true);
    },
    onError: (error: ApiError) => {
      toast.error(
        `Đặt hàng thất bại. Vui lòng thử lại! ${error.response?.data?.message}`
      );
      console.log(error);
      setIsProcessing(false);
    },
    retry: false,
  });

  const handleSubmitOrder = (data: CheckoutFormValues) => {
    setIsProcessing(true);
    const orderData = {
      ...data.shipping,
      tonggia: total,
      tamtinh: subtotal,
      giamgia: getDiscount(appliedCoupon!),
      maKhuyenMai: appliedCoupon?.ma || undefined,
      phigiaohang: shipping || 0,
      chiTietDonHangs: (updatedCartItems.length > 0
        ? updatedCartItems
        : cartItems
      ).map((item) => ({
        soluong: item.soLuong,
        dongia: item.gia,
        mabienthe: item.bienThe.ma,
      })),
      thanhToan: {
        phuongthuc: data.payment.phuongthuc,
      },
    };
    createOrderMutation.mutate(orderData);
  };

  if (isLoadingAddresses || isLoadingProducts) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg font-medium">Đang tải dữ liệu...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/"
          className="flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Tiếp tục mua sắm
        </Link>
      </div>

      <h1 className="text-3xl font-bold tracking-tight mb-8">Thanh toán</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <CheckoutForm
            userAddresses={userAddresses?.data[0] || undefined}
            onSubmit={handleSubmitOrder}
            total={total}
            isProcessing={isProcessing}
            onSetShippingMethod={setShippingMethod}
            shippingPrices={shippingPrices}
            onSetShippingPrices={setShippingPrices}
          />
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <OrderSummary
              cartItems={
                updatedCartItems.length > 0 ? updatedCartItems : cartItems
              }
              appliedCoupon={appliedCoupon}
              onSetAppliedCoupon={setAppliedCoupon}
              subtotal={subtotal}
              shipping={shipping || 0}
              total={total}
              isLoading={isLoadingProducts}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
