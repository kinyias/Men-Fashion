"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Package, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { checkoutSchema, type CheckoutFormValues } from "@/lib/validations/checkout.validator"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { useEffect, useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { calculatePrice, getDistricts, getProvinces, getWards } from "@/lib/api"
import toast from "react-hot-toast"
import { ViettelPostPrice, ViettelPostPriceRequest } from "@/types/viettelpost"
import { formatCurrency } from "@/utils/currency"
import { formatHoursToDays } from "@/utils/formatTime"
import Image from "next/image"

interface CheckoutFormProps {
  onSubmit: (data: CheckoutFormValues) => void
  isProcessing: boolean,
  shippingPrices: {[key: string]: {
    price: number,
    time: number,
  }},
  onSetShippingMethod: (method: "nhanh" | "tietkiem" | "hoatoc") => void,
  onSetShippingPrices: (prices: {[key: string]: {
    price: number,
    time: number,
  }}) => void,
}

export function CheckoutForm({ onSubmit, isProcessing, shippingPrices, onSetShippingMethod, onSetShippingPrices }: CheckoutFormProps) {
    const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      shipping: {
        ho: "",
        ten: "",
        email: "",
        sdt: "",
        diachi: "",
        thanhpho: "",
        quan: "",
        phuong: "",
        ghichu: "",
        phuongthucgiaohang: "tietkiem",
      },
      payment: {
        phuongthuc: "cod",
      },
    },
    mode: "onChange",
  })

  const handleSubmit = (data: CheckoutFormValues) => {
    
    // Get the province name from the selected province ID
    const selectedProvinceName = provincesData?.data.find(
      province => province.PROVINCE_ID.toString() === data.shipping.thanhpho
    )?.PROVINCE_NAME || '';

    // Get the district name from the selected district ID
    const selectedDistrictName = districtsData?.data.find(
      district => district.DISTRICT_ID.toString() === data.shipping.quan
    )?.DISTRICT_NAME || '';

    // Get the ward name from the selected ward ID
    const selectedWardName = wardsData?.data.find(
      ward => ward.WARDS_ID.toString() === data.shipping.phuong
    )?.WARDS_NAME || '';
    // Create modified data with names instead of IDs
    const modifiedData = {
      ...data,
      shipping: {
        ...data.shipping,
        thanhpho: selectedProvinceName,
        quan: selectedDistrictName,
        phuong: selectedWardName,
      }
    };
      
    onSubmit(modifiedData);
  }

  // Mutation để tính phí vận chuyển
  const calculatePriceMutation = useMutation({
    mutationFn: (data: ViettelPostPriceRequest) => calculatePrice(data),
    onSuccess: (data) => {
      const prices = data.data.reduce((acc: {[key: string]: {
        price: number,
        time: number,
      }}, item: ViettelPostPrice) => {
        acc[item.service] = {
          price: item.MONEY_TOTAL,
          time: item.KPI_HT
        };
        return acc;
      }, {});
      onSetShippingPrices(prices);
    },
    onError: () => {
      toast.error("Không thể tính phí vận chuyển. Vui lòng thử lại!");
    }
  });

  // Fetch provinces
  const { data: provincesData } = useQuery({
    queryKey: ['provinces'],
    queryFn: () => getProvinces(),
  });

  // Fetch districts based on selected province
  const { data: districtsData } = useQuery({
    queryKey: ['districts', selectedProvince],
    queryFn: () => getDistricts({ provinceId: selectedProvince! }),
    enabled: !!selectedProvince,
  });

  // Fetch wards based on selected district
  const { data: wardsData } = useQuery({
    queryKey: ['wards', selectedDistrict],
    queryFn: () => getWards({ districtId: selectedDistrict! }),
    enabled: !!selectedDistrict,
  });
  const isAddressComplete = form.watch('shipping.phuong') !== '';
  
  useEffect(() => {
    if (isAddressComplete) {
        const priceRequest: ViettelPostPriceRequest = {
          PRODUCT_WEIGHT: 500,
          PRODUCT_PRICE: 5000,
          MONEY_COLLECTION: 0,
          ORDER_SERVICE_ADD: "",
          ORDER_SERVICE: "",
          SENDER_PROVINCE: process.env.NEXT_PUBLIC_VIETTEL_POST_SENDER_PROVINCE || "2",
          SENDER_DISTRICT: process.env.NEXT_PUBLIC_VIETTEL_POST_SENDER_DISTRICT || "47",
          RECEIVER_PROVINCE: selectedProvince!.toString(),
          RECEIVER_DISTRICT: selectedDistrict!.toString(),
          PRODUCT_TYPE: "HH",
          NATIONAL_TYPE: 1,
        };
        return calculatePriceMutation.mutate(priceRequest);
    }
  }, [isAddressComplete, selectedProvince, selectedDistrict]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Thông tin giao hàng</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="shipping.ho"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Họ</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="shipping.ten"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="shipping.email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl><Input type="email" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="shipping.sdt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số điện thoại</FormLabel>
                      <FormControl><Input type="tel" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="shipping.diachi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Địa chỉ</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="shipping.thanhpho"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tỉnh/Thành phố</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedProvince(Number(value));
                          setSelectedDistrict(null);
                          form.setValue('shipping.quan', '');
                          form.setValue('shipping.phuong', '');
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger  className="w-full">
                            <SelectValue placeholder="Chọn tỉnh/thành phố" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {provincesData?.data.map((province) => (
                            <SelectItem key={province.PROVINCE_ID} value={province.PROVINCE_ID.toString()}>
                              {province.PROVINCE_NAME}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="shipping.quan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quận/Huyện</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedDistrict(Number(value));
                          form.setValue('shipping.phuong', '');
                        }}
                        value={field.value}
                        disabled={!selectedProvince}
                      >
                        <FormControl>
                          <SelectTrigger  className="w-full">
                            <SelectValue placeholder="Chọn quận/huyện" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {districtsData?.data.map((district) => (
                            <SelectItem key={district.DISTRICT_ID} value={district.DISTRICT_ID.toString()}>
                              {district.DISTRICT_NAME}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shipping.phuong"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phường/xã</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={!selectedDistrict}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full" >
                            <SelectValue placeholder="Chọn phường/xã" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {wardsData?.data.map((ward) => (
                            <SelectItem key={ward.WARDS_ID} value={ward.WARDS_ID.toString()}>
                              {ward.WARDS_NAME}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            
             {isAddressComplete ? (
                <FormField
                  control={form.control}
                  name="shipping.phuongthucgiaohang"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Phương thức giao hàng</FormLabel>
                      <FormControl>
                        <RadioGroup 
                          onValueChange={(value) => {
                            field.onChange(value);
                            onSetShippingMethod(value as "hoatoc" | "nhanh" | "tietkiem");
                          }} 
                          defaultValue={field.value} 
                          className="space-y-2"
                        >
                          
                          <div className="flex items-center space-x-2 border rounded-md p-3">
                            <FormControl><RadioGroupItem value="tietkiem" id="tietkiem" /></FormControl>
                            <FormLabel htmlFor="tietkiem" className="flex-1 cursor-pointer">
                              <div className="font-medium">Tiết kiệm</div>
                              <div className="text-sm text-muted-foreground"> {shippingPrices["STK"] && (
                      <div className="text-sm text-muted-foreground">
                        {formatHoursToDays(shippingPrices["STK"].time)} - {formatHoursToDays(shippingPrices["STK"].time + 24)}
                      </div>
                    )}</div>
                            </FormLabel>
                            <div className="font-medium">
                              {calculatePriceMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                shippingPrices["STK"] ? 
                                `${formatCurrency(shippingPrices["STK"].price)}` :
                                'Đang tính...'
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 border rounded-md p-3">
                            <FormControl><RadioGroupItem value="nhanh" id="nhanh" /></FormControl>
                            <FormLabel htmlFor="nhanh" className="flex-1 cursor-pointer">
                              <div className="font-medium">Nhanh</div>
                              <div className="text-sm text-muted-foreground">  {shippingPrices["SCN"] && (
                      <div className="text-sm text-muted-foreground">
                        {formatHoursToDays(shippingPrices["SCN"].time)} - {formatHoursToDays(shippingPrices["SCN"].time + 24)}
                      </div>
                    )}</div>
                            </FormLabel>
                            <div className="font-medium">
                              {calculatePriceMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                shippingPrices["SCN"] ? 
                                `${formatCurrency(shippingPrices["SCN"].price)}` :
                                'Đang tính...'
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 border rounded-md p-3">
                            <FormControl><RadioGroupItem value="hoatoc" id="hoatoc" /></FormControl>
                            <FormLabel htmlFor="hoatoc" className="flex-1 cursor-pointer">
                              <div className="font-medium">Hỏa tốc</div>
                              <div className="text-sm text-muted-foreground"> {shippingPrices["SHT"] && (
                      <div className="text-sm text-muted-foreground">
                        {formatHoursToDays(shippingPrices["SHT"].time)} - {formatHoursToDays(shippingPrices["SHT"].time + 24)}
                      </div>
                    )}</div>
                            </FormLabel>
                            <div className="font-medium">
                              {calculatePriceMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                shippingPrices["SHT"] ? 
                                `${formatCurrency(shippingPrices["SHT"].price)}` :
                                'Đang tính...'
                              )}
                            </div>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <div className="p-4 py-5 border rounded-md bg-muted/30">
                  <Package className="mx-auto h-30 w-30 py-5 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground text-center">
                    Vui lòng chọn địa chỉ giao hàng để có phương thức giao hàng
                  </p>
                </div>
              )}
                <FormField
                  control={form.control}
                  name="shipping.ghichu"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ghi chú</FormLabel>
                      <FormControl><Textarea {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Thông tin thanh toán</h2>

              <FormField
                control={form.control}
                name="payment.phuongthuc"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Phương thức thanh toán</FormLabel>
                    <FormControl>
                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-2">
                        <div className="flex items-center space-x-2 border rounded-md p-3">
                          <FormControl><RadioGroupItem value="cod" id="cod" /></FormControl>
                          <FormLabel htmlFor="cod" className="flex-1 cursor-pointer">
                            <div className="font-medium flex items-center gap-2">
                              <div className="relative w-8 h-8">
                                <Image 
                                  className="object-contain"
                                  alt="Cod"
                                  src="/assets/cod.svg" 
                                  fill
                                  sizes="(max-width: 40px) 100vw"
                                />
                              </div>
                              COD
                            </div>
                            <div className="text-sm text-muted-foreground">(Thanh toán khi nhận hàng)</div>
                          </FormLabel>
                        </div>
                        <div className="flex items-center space-x-2 border rounded-md p-3">
                          <FormControl><RadioGroupItem value="momo" id="momo" /></FormControl>
                          <FormLabel htmlFor="momo" className="flex-1 cursor-pointer">
                            <div className="font-medium flex items-center gap-2">
                              <div className="relative w-8 h-8">
                                <Image 
                                  className="object-contain"
                                  alt="Momo"
                                  src="/assets/momo.svg" 
                                  fill
                                  sizes="(max-width: 40px) 100vw"
                                />
                              </div>
                              Momo
                            </div>
                            <div className="text-sm text-muted-foreground">Thanh toán bằng MOMO</div>
                          </FormLabel>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Thông báo bảo mật */}
              <div className="bg-muted/30 p-3 rounded-md flex items-start space-x-2">
                <ShieldCheck className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  Thông tin thanh toán của bạn được mã hóa và bảo mật. Chúng tôi không lưu trữ đầy đủ thông tin thẻ của bạn.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Nút đặt hàng */}
        <div className="space-y-6 flex justify-end">
          <Button type="submit" disabled={isProcessing}>
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xử lý đơn hàng...
              </>
            ) : (
              "Đặt hàng"
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
