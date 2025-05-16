"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { checkoutSchema, type CheckoutFormValues } from "@/lib/validations/checkout.validator"
import { Textarea } from "../ui/textarea"

interface CheckoutFormProps {
  onSubmit: (data: CheckoutFormValues) => void
  isProcessing: boolean
}

export function CheckoutForm({ onSubmit, isProcessing }: CheckoutFormProps) {
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
        phuongthucgiaohang: "standard",
      },
      payment: {
        phuongthuc: "credit",
        cardNumber: "",
        cardName: "",
        expiryDate: "",
        cvv: "",
        saveCard: false,
        sameAsShipping: true,
      },
    },
    mode: "onChange",
  })

  const { watch } = form
  const paymentMethod = watch("payment.phuongthuc")

  // Định dạng số thẻ
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  // Định dạng ngày hết hạn
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    if (v.length > 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`
    }
    return v
  }

  const handleSubmit = (data: CheckoutFormValues) => {
    onSubmit(data)
  }

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

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="shipping.thanhpho"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Tỉnh/Thành phố</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
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
                      <FormControl><Input {...field} /></FormControl>
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
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
              <FormField
                control={form.control}
                name="shipping.phuongthucgiaohang"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Phương thức giao hàng</FormLabel>
                    <FormControl>
                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-2">
                        <div className="flex items-center space-x-2 border rounded-md p-3">
                          <FormControl><RadioGroupItem value="standard" id="standard" /></FormControl>
                          <FormLabel htmlFor="standard" className="flex-1 cursor-pointer">
                            <div className="font-medium">Giao hàng tiêu chuẩn</div>
                            <div className="text-sm text-muted-foreground">3-5 ngày làm việc</div>
                          </FormLabel>
                          <div className="font-medium">$12.99</div>
                        </div>
                        <div className="flex items-center space-x-2 border rounded-md p-3">
                          <FormControl><RadioGroupItem value="express" id="express" /></FormControl>
                          <FormLabel htmlFor="express" className="flex-1 cursor-pointer">
                            <div className="font-medium">Giao hàng nhanh</div>
                            <div className="text-sm text-muted-foreground">1-2 ngày làm việc</div>
                          </FormLabel>
                          <div className="font-medium">$24.99</div>
                        </div>
                      </RadioGroup>
                    </FormControl>
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
                          <FormControl><RadioGroupItem value="credit" id="credit" /></FormControl>
                          <FormLabel htmlFor="credit" className="flex-1 cursor-pointer">
                            <div className="font-medium">Thẻ tín dụng / Ghi nợ</div>
                            <div className="text-sm text-muted-foreground">Chấp nhận tất cả các loại thẻ phổ biến</div>
                          </FormLabel>
                          <div className="flex space-x-1">
                            <div className="h-6 w-10 bg-muted rounded"></div>
                            <div className="h-6 w-10 bg-muted rounded"></div>
                            <div className="h-6 w-10 bg-muted rounded"></div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 border rounded-md p-3">
                          <FormControl><RadioGroupItem value="momo" id="paypal" /></FormControl>
                          <FormLabel htmlFor="paypal" className="flex-1 cursor-pointer">
                            <div className="font-medium">Momo</div>
                            <div className="text-sm text-muted-foreground">Thanh toán bằng MOMO</div>
                          </FormLabel>
                          <div className="h-6 w-10 bg-muted rounded"></div>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Thông tin thẻ */}
              {paymentMethod === "credit" && (
                <div className="space-y-4">
                  {/* Số thẻ */}
                  <FormField
                    control={form.control}
                    name="payment.cardNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số thẻ</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="1234 5678 9012 3456"
                            {...field}
                            onChange={(e) => {
                              const formatted = formatCardNumber(e.target.value)
                              field.onChange(formatted.replace(/\s/g, ""))
                              e.target.value = formatted
                            }}
                            maxLength={19}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Tên trên thẻ */}
                  <FormField
                    control={form.control}
                    name="payment.cardName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên trên thẻ</FormLabel>
                        <FormControl><Input placeholder="Nguyễn Văn A" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Ngày hết hạn & CVV */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="payment.expiryDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ngày hết hạn</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="MM/YY"
                              {...field}
                              onChange={(e) => {
                                const formatted = formatExpiryDate(e.target.value)
                                field.onChange(formatted)
                                e.target.value = formatted
                              }}
                              maxLength={5}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="payment.cvv"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CVV</FormLabel>
                          <FormControl><Input placeholder="123" {...field} type="password" maxLength={4} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Lưu thẻ */}
                  <FormField
                    control={form.control}
                    name="payment.saveCard"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Lưu thông tin thẻ cho lần mua sau</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Địa chỉ thanh toán giống địa chỉ giao hàng */}
              <FormField
                control={form.control}
                name="payment.sameAsShipping"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Địa chỉ thanh toán giống địa chỉ giao hàng</FormLabel>
                    </div>
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
