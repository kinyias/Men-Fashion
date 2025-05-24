"use client"

import { forwardRef } from "react"
import { DonHang, TrangThaiDonHang } from "@/types"

interface PrintOrdersListProps {
  orders: DonHang[]
  title?: string
}

export const PrintOrdersList = forwardRef<HTMLDivElement, PrintOrdersListProps>(
  ({ orders, title = "Danh Sách Đơn Hàng" }, ref) => {
    // Định dạng ngày tháng
    const formatDate = (dateString: string | Date) => {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat("vi-VN", {
        year: "numeric",
        month: "short",
        day: "numeric",
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

    // Ánh xạ trạng thái sang tiếng Việt
    const getStatusText = (status: string) => {
      switch (status) {
        case TrangThaiDonHang.DA_DAT:
          return "Đã Đặt"
        case TrangThaiDonHang.DANG_XU_LY:
          return "Đang Xử Lý"
        case TrangThaiDonHang.DANG_GIAO_HANG:
          return "Đang Giao Hàng"
        case TrangThaiDonHang.DA_GIAO_HANG:
          return "Đã Giao"
        case "da_huy":
          return "Đã Hủy"
        default:
          return status
      }
    }

    // Tính tổng
    const totalAmount = orders.reduce((sum, order) => sum + order.tonggia, 0)

    return (
      <div ref={ref} className="print-content hidden print:block bg-white p-8 text-black">
        {/* Header */}
        <div className="mb-8 border-b-2 border-gray-300 pb-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
              <p className="text-lg text-gray-600 mt-2">Tổng số đơn hàng: {orders.length}</p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-semibold text-gray-800">TKhang Fashion</h2>
              <p className="text-gray-600">180 Cao Lỗ</p>
              <p className="text-gray-600">Quận 8, TP. Hồ Chí Minh</p>
              <p className="text-gray-600">Điện thoại: (028) 1234-5678</p>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="mb-6 grid grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded border">
            <h3 className="font-semibold text-gray-800">Tổng Đơn Hàng</h3>
            <p className="text-2xl font-bold text-blue-600">{orders.length}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded border">
            <h3 className="font-semibold text-gray-800">Tổng Doanh Thu</h3>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(totalAmount)}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded border">
            <h3 className="font-semibold text-gray-800">Trung Bình/Đơn</h3>
            <p className="text-2xl font-bold text-purple-600">
              {orders.length > 0 ? formatCurrency(totalAmount / orders.length) : formatCurrency(0)}
            </p>
          </div>
        </div>

        {/* Orders Table */}
        <div className="mb-6">
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-3 py-2 text-left">STT</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Mã Đơn Hàng</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Khách Hàng</th>
                <th className="border border-gray-300 px-3 py-2 text-center">Ngày Đặt</th>
                <th className="border border-gray-300 px-3 py-2 text-center">Trạng Thái</th>
                <th className="border border-gray-300 px-3 py-2 text-right">Tổng Tiền</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={order.ma} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="border border-gray-300 px-3 py-2 text-center">{index + 1}</td>
                  <td className="border border-gray-300 px-3 py-2 font-medium">{order.ma}</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <div>
                      <div className="font-medium">{order.ho} {order.ten}</div>
                      <div className="text-xs text-gray-600">{order.email || 'N/A'}</div>
                    </div>
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-center">{formatDate(order.ngaydat)}</td>
                  <td className="border border-gray-300 px-3 py-2 text-center">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        order.trangthai === TrangThaiDonHang.DA_GIAO_HANG
                          ? "bg-green-100 text-green-800"
                          : order.trangthai === TrangThaiDonHang.DANG_GIAO_HANG
                            ? "bg-blue-100 text-blue-800"
                            : order.trangthai === TrangThaiDonHang.DANG_XU_LY
                              ? "bg-yellow-100 text-yellow-800"
                              : order.trangthai === TrangThaiDonHang.DA_HUY
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {getStatusText(order.trangthai)}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-right font-medium">
                    {formatCurrency(order.tonggia)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-200 font-bold">
                <td colSpan={5} className="border border-gray-300 px-3 py-2 text-right">
                  Tổng Cộng:
                </td>
                <td className="border border-gray-300 px-3 py-2 text-right">{formatCurrency(totalAmount)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Status Summary */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">Thống Kê Theo Trạng Thái</h3>
          <div className="grid grid-cols-5 gap-2 text-sm">
            {[TrangThaiDonHang.DA_DAT, TrangThaiDonHang.DANG_XU_LY, TrangThaiDonHang.DANG_GIAO_HANG, TrangThaiDonHang.DA_GIAO_HANG, "da_huy"].map((status) => {
              const count = orders.filter((order) => order.trangthai === status).length
              const percentage = orders.length > 0 ? ((count / orders.length) * 100).toFixed(1) : "0"
              return (
                <div key={status} className="bg-gray-50 p-3 rounded border text-center">
                  <div className="font-medium text-gray-800">{getStatusText(status)}</div>
                  <div className="text-lg font-bold text-blue-600">{count}</div>
                  <div className="text-xs text-gray-600">({percentage}%)</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-300 pt-4 mt-8 text-center text-sm text-gray-600">
          <p>
            Báo cáo được tạo vào ngày {new Date().toLocaleDateString("vi-VN")} lúc{" "}
            {new Date().toLocaleTimeString("vi-VN")}
          </p>
          <p className="mt-2">© 2023 TKhang fashion. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    )
  },
)

PrintOrdersList.displayName = "PrintOrdersList"