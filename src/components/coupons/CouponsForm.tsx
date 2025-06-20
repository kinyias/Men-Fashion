"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CalendarIcon, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { useRouter, useParams } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { couponsSchema, LoaiKhuyenMai } from "@/lib/validations/coupons.validator"
import { KhuyenMai, KhuyenMaiFormValues } from "@/types"
import { createCoupon, updateCoupon } from "@/lib/api/api-coupons"
import { formatNumber, parseCurrency } from "@/utils/currency"
import { useEffect } from "react"

interface CouponsFormProps {
  coupon?: KhuyenMai
}

export default function CouponsForm({ coupon }: CouponsFormProps) {
  const router = useRouter()
  const params = useParams()
  const queryClient = useQueryClient()
  const couponId = params?.id ? Number(params.id) : undefined
  const isEditMode = !!couponId 

  const form = useForm<z.infer<typeof couponsSchema>>({
    resolver: zodResolver(couponsSchema),
    defaultValues: {
      ten: coupon?.ten || "",
      loaikhuyenmai: coupon?.loaikhuyenmai || LoaiKhuyenMai.SO_TIEN_CO_DINH,
      giatrigiam: coupon?.giatrigiam || 0,
      giatridonhang: coupon?.giatridonhang || 0,
      giamtoida: coupon?.giamtoida || 0,
      ngaybatdat: coupon?.ngaybatdat ? new Date(coupon.ngaybatdat) : undefined,
      ngayketthuc: coupon?.ngayketthuc ? new Date(coupon.ngayketthuc) : undefined,
    },
  })

  // Create coupon mutation
  const createMutation = useMutation({
    mutationFn: (data: KhuyenMaiFormValues) => createCoupon(data),
    onSuccess: () => {
      toast.success('Tạo mã khuyến mãi thành công')
      router.push('/admin/coupons')
      queryClient.invalidateQueries({ queryKey: ['coupons'] })
    },
    onError: (error: any) => {
      console.error("Error creating coupon:", error)
      toast.error(`Tạo mã khuyến mãi thất bại. ${error.response?.data?.message || 'Vui lòng thử lại sau'}`)
    }
  })
  
  // Update coupon mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: KhuyenMaiFormValues }) => 
      updateCoupon(id, data),
    onSuccess: () => {
      toast.success('Cập nhật mã khuyến mãi thành công')
      router.push('/admin/coupons')
      queryClient.invalidateQueries({ queryKey: ['coupons'] })
      queryClient.invalidateQueries({ queryKey: ['coupon', couponId] })
    },
    onError: (error: any) => {
      console.error("Error updating coupon:", error)
      toast.error(`Cập nhật mã khuyến mãi thất bại. ${error.response?.data?.message || 'Vui lòng thử lại sau'}`)
    }
  })

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  async function onSubmit(values: z.infer<typeof couponsSchema>) {
    try {
      const formattedData = {
        ...values,
        ngaybatdat: values.ngaybatdat.toISOString(),
        ngayketthuc: values.ngayketthuc.toISOString(),
      }

      if (isEditMode && couponId) {
        updateMutation.mutate({ id: couponId, data: formattedData })
      } else {
        createMutation.mutate(formattedData)
      }
    } catch (error) {
      console.error(error)
      toast.error('Đã xảy ra lỗi. Vui lòng thử lại sau.')
    }
  }
  const loaikhuyenmai = form.watch("loaikhuyenmai");
  const giatrigiam = form.watch("giatrigiam");
  
  useEffect(() => {
    if (loaikhuyenmai === LoaiKhuyenMai.SO_TIEN_CO_DINH) {
      form.setValue("giamtoida", giatrigiam || 0);
    }
  }, [loaikhuyenmai, giatrigiam, form]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditMode ? 'Cập nhật mã khuyến mãi' : 'Tạo mã khuyến mãi mới'}</CardTitle>
        <CardDescription>
          {isEditMode 
            ? 'Cập nhật thông tin cho mã khuyến mãi hiện có' 
            : 'Điền thông tin để tạo mã khuyến mãi mới cho hệ thống'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="ten"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên khuyến mãi</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên khuyến mãi" {...field} />
                  </FormControl>
                  <FormDescription>Tên mô tả cho mã khuyến mãi này.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="loaikhuyenmai"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loại khuyến mãi</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại khuyến mãi" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={LoaiKhuyenMai.SO_TIEN_CO_DINH}>Giảm số tiền cố định</SelectItem>
                      <SelectItem value={LoaiKhuyenMai.PHAN_TRAM}>Giảm theo phần trăm</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Chọn hình thức giảm giá.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="giamtoida"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giá trị giảm tối đa</FormLabel>
                  <FormControl>
                    <Input 
                      type="text" 
                      placeholder="1000000"
                      value={formatNumber(Number(field.value))}
                      onChange={(e) => field.onChange(parseCurrency(e.target.value))}
                      disabled={loaikhuyenmai === LoaiKhuyenMai.SO_TIEN_CO_DINH}
                      className={loaikhuyenmai === LoaiKhuyenMai.SO_TIEN_CO_DINH ? "bg-gray-100 cursor-not-allowed" : ""}
                    />
                  </FormControl>
                  <FormDescription>  {loaikhuyenmai === LoaiKhuyenMai.SO_TIEN_CO_DINH
          ? "Tự động bằng giá trị giảm khi giảm theo số tiền cố định."
          : "Giá trị giảm tối đa (VNĐ)."}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="giatrigiam"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giá trị giảm</FormLabel>
                    <FormControl>
                      <Input 
                        type="text" 
                        placeholder={form.watch("loaikhuyenmai") === LoaiKhuyenMai.PHAN_TRAM ? "10" : "50000"}
                        value={form.watch("loaikhuyenmai") === LoaiKhuyenMai.PHAN_TRAM 
                          ? field.value.toString() 
                          : formatNumber(Number(field.value))}
                        onChange={(e) => {
                          const value = form.watch("loaikhuyenmai") === LoaiKhuyenMai.PHAN_TRAM
                            ? e.target.value
                            : parseCurrency(e.target.value);
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      {form.watch("loaikhuyenmai") === LoaiKhuyenMai.PHAN_TRAM
                        ? "Phần trăm giảm giá (%)."
                        : "Số tiền giảm giá (VNĐ)."}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="giatridonhang"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giá trị đơn hàng tối thiểu</FormLabel>
                    <FormControl>
                      <Input 
                        type="text" 
                        placeholder="100000"
                        value={formatNumber(Number(field.value))}
                        onChange={(e) => field.onChange(parseCurrency(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>Giá trị đơn hàng tối thiểu để áp dụng (VNĐ).</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="ngaybatdat"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Ngày bắt đầu</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                          >
                            {field.value ? format(field.value, "dd/MM/yyyy", { locale: vi }) : <span>Chọn ngày</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => {
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            return date < today && !isEditMode;
                          }}
                          locale={vi}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ngayketthuc"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Ngày kết thúc</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                          >
                            {field.value ? format(field.value, "dd/MM/yyyy", { locale: vi }) : <span>Chọn ngày</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            (date < new Date() && !isEditMode) || (form.getValues("ngaybatdat") && date < form.getValues("ngaybatdat"))
                          }
                          locale={vi}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <CardFooter className="px-0 pt-6">
              <Button type="submit" className="ml-auto" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditMode ? "Đang cập nhật..." : "Đang tạo..."}
                  </>
                ) : (
                  isEditMode ? "Cập nhật khuyến mãi" : "Tạo khuyến mãi"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
