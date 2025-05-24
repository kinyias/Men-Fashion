"use client"

import { forwardRef } from "react"
import { DonHang } from "@/types"

interface PrintOrderProps {
  order: DonHang
}

export const PrintOrder = forwardRef<HTMLDivElement, PrintOrderProps>(({ order }, ref) => {
  // Định dạng ngày tháng
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date)
  }

  // Định dạng tiền tệ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(amount)
  }


  return (
    <div ref={ref} className="print-content hidden print:block bg-white p-8 text-black">
      {/* Header */}
      <div className="mb-8 border-b-2 border-gray-300 pb-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">HÓA ĐƠN BÁN HÀNG</h1>
            <p className="text-lg text-gray-600 mt-2">Mã đơn hàng: {order.ma}</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-semibold text-gray-800">TKHANG FASHION</h2>
            <p className="text-gray-600">180 Cao Lỗ</p>
            <p className="text-gray-600">Quận 8, TP. Hồ Chí Minh</p>
            <p className="text-gray-600">Điện thoại: (028) 1234-5678</p>
            <p className="text-gray-600">Email: DH52102716@student.stu.edu.vn</p>
          </div>
        </div>
      </div>

      {/* Order Info */}
      <div className="mb-6 grid grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-800">Thông Tin Đơn Hàng</h3>
          <div className="space-y-1">
            <p>
              <span className="font-medium">Ngày đặt:</span> {formatDate(order.ngaydat)}
            </p>
            {/* <p>
              <span className="font-medium">Trạng thái:</span> {getStatusText(order.trangthai)}
            </p> */}
            <p>
              <span className="font-medium">Phương thức thanh toán:</span>{" "}
              {order.thanhToans.phuongthuc === "cod"
                ? "Thanh toán khi nhận hàng (COD)"
                : "Thanh toán qua MoMo"}
            </p>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-800">Thông Tin Khách Hàng</h3>
          <div className="space-y-1">
            <p>
              <span className="font-medium">Tên:</span>{order.ten}
            </p>
            <p>
              <span className="font-medium">Email:</span> {order.email || 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Addresses */}
      <div className="mb-6 grid grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-800">Địa Chỉ Giao Hàng</h3>
          <div className="space-y-1 text-sm">
            <p>{order.ten}</p>
            <p>{order.diachi}</p>
            <p>
              {order.phuong}, {order.quan}, {order.thanhpho}
            </p>
            <p>Số điện thoại: {order.sdt}</p>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-800">Thông Tin Thanh Toán</h3>
          <div className="space-y-1 text-sm">
            <p>Phương thức: {order.thanhToans.phuongthuc === "cod" ? "Thanh toán khi nhận hàng" : "Thanh toán qua MoMo"}</p>
            <p>Trạng thái: {order.thanhToans.trangthai ? "Đã thanh toán" : "Chưa thanh toán"}</p>
            {order.thanhToans.ngaythanhtoan && order.thanhToans.trangthai && (
              <p>Ngày thanh toán: {formatDate(order.thanhToans.ngaythanhtoan)}</p>
            )}
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">Chi Tiết Sản Phẩm</h3>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">STT</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Sản Phẩm</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Số Lượng</th>
              <th className="border border-gray-300 px-4 py-2 text-right">Đơn Giá</th>
              <th className="border border-gray-300 px-4 py-2 text-right">Thành Tiền</th>
            </tr>
          </thead>
          <tbody>
            {order.chiTietDonHangs.map((item, index) => (
              <tr key={item.ma}>
                <td className="border border-gray-300 px-4 py-2 text-center">{index + 1}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="flex items-center gap-3">
                    {/* <div className="w-12 h-12 flex-shrink-0">
                      <Image
                        src={item.sanPham.hinhanh || "/placeholder.svg"}
                        alt={item.sanPham.ten}
                        width={48}
                        height={48}
                        className="object-cover rounded"
                      />
                    </div> */}
                    <span>{item.sanPham.ten}</span>
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">{item.soluong}</td>
                <td className="border border-gray-300 px-4 py-2 text-right">{formatCurrency(item.dongia)}</td>
                <td className="border border-gray-300 px-4 py-2 text-right font-medium">
                  {formatCurrency(item.dongia * item.soluong)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="mb-6">
        <div className="flex justify-end">
          <div className="w-80">
            <div className="space-y-2">
              <div className="flex justify-between py-1">
                <span>Tạm tính:</span>
                <span>{formatCurrency(order.tamtinh)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Phí giao hàng:</span>
                <span>{formatCurrency(order.phigiaohang)}</span>
              </div>
              {order.giamgia && (
                <div className="flex justify-between py-1">
                  <span>Giảm giá:</span>
                  <span>-{formatCurrency(order.giamgia)}</span>
                </div>
              )}
              <div className="border-t border-gray-300 pt-2">
                <div className="flex justify-between py-1 text-lg font-bold">
                  <span>Tổng cộng:</span>
                  <span>{formatCurrency(order.tonggia)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      {order.ghichu && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">Ghi Chú</h3>
          <div className="bg-gray-50 p-4 rounded border">
            <p className="text-sm">{order.ghichu}</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-gray-300 pt-4 mt-8">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h4 className="font-semibold mb-2">Chữ Ký Khách Hàng</h4>
            <div className="h-16 border-b border-gray-300"></div>
            <p className="text-sm text-gray-600 mt-2">Ngày: _______________</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Chữ Ký Người Bán</h4>
            <div className="h-16 border-b border-gray-300"></div>
            <p className="text-sm text-gray-600 mt-2">Ngày: _______________</p>
          </div>
        </div>
        <div className="text-center mt-30 text-sm text-gray-600">
          <p>Cảm ơn quý khách đã mua hàng!</p>
          <p>Hóa đơn được in vào ngày {new Date().toLocaleDateString("vi-VN")}</p>
        </div>
      </div>
    </div>
  )
})

PrintOrder.displayName = "PrintOrder"
