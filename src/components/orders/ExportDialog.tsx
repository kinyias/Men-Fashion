"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { DonHang, TrangThaiDonHang } from "@/types"
import { Download } from "lucide-react"

interface ExportDialogProps {
  isOpen: boolean
  onClose: () => void
  orders: DonHang[]
}

export function ExportDialog({ isOpen, onClose, orders }: ExportDialogProps) {
  const [fileType, setFileType] = useState<"csv">("csv")
  const [includeHeaders, setIncludeHeaders] = useState(true)
  const [selectedFields, setSelectedFields] = useState({
    ma: true,
    customerName: true,
    ngaydat: true,
    trangthai: true,
    tonggia: true,
    diachi: true,
    sdt: true,
    email: true,
    ghichu: true,
  })

  // Ánh xạ trạng thái sang tiếng Việt
  const getStatusText = (status: TrangThaiDonHang) => {
    switch (status) {
      case TrangThaiDonHang.DA_DAT:
        return "Đã Đặt"
      case TrangThaiDonHang.DANG_XU_LY:
        return "Đang Xử Lý"
      case TrangThaiDonHang.DANG_GIAO_HANG:
        return "Đang Giao Hàng"
      case TrangThaiDonHang.DA_GIAO_HANG:
        return "Đã Giao Hàng"
      case TrangThaiDonHang.DA_HUY:
        return "Đã Hủy"
      default:
        return status
    }
  }

  const handleExport = () => {
    // Prepare data for export
    const exportData = orders.map(order => {
      const row: Record<string, string> = {}
      
      if (selectedFields.ma) row['Mã Đơn Hàng'] = order.ma.toString()
      if (selectedFields.customerName) row['Khách Hàng'] = `${order.ten}`
      if (selectedFields.ngaydat) row['Ngày Đặt'] = new Date(order.ngaydat).toLocaleDateString('vi-VN')
      if (selectedFields.trangthai) row['Trạng Thái'] = getStatusText(order.trangthai)
      if (selectedFields.tonggia) row['Tổng Tiền'] = order.tonggia.toString()
      if (selectedFields.diachi) row['Địa Chỉ'] = `${order.diachi}, ${order.phuong}, ${order.quan}, ${order.thanhpho}`
      if (selectedFields.sdt) row['Số Điện Thoại'] = order.sdt
      if (selectedFields.email && order.email) row['Email'] = order.email
      if (selectedFields.ghichu && order.ghichu) row['Ghi Chú'] = order.ghichu
      return row
    })
    
    // Convert to CSV
    const headers = Object.keys(exportData[0] || {})
    let csv = '\uFEFF' // Add BOM for UTF-8

    // Add headers if selected
    if (includeHeaders) {
      csv += headers.join(',') + '\n'
    }

    // Add data rows
    exportData.forEach(row => {
      const values = headers.map(header => {
        const value = row[header] || ''
        // Escape quotes and wrap in quotes to handle commas and special characters
        return `"${value.replace(/"/g, '""')}"`
      })
      csv += values.join(',') + '\n'
    })

    // Create and download file with UTF-8 encoding
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `don-hang-${new Date().toISOString().slice(0, 10)}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url) // Clean up the URL object
    
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Xuất Dữ Liệu Đơn Hàng</DialogTitle>
          <DialogDescription>
            Chọn định dạng và các trường dữ liệu bạn muốn xuất
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="file-type">Định dạng file</Label>
            <RadioGroup id="file-type" value={fileType} onValueChange={(value) => setFileType(value as "csv")}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="csv" id="csv" />
                <Label htmlFor="csv">CSV</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="grid gap-2">
            <Label>Tùy chọn</Label>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="include-headers" 
                checked={includeHeaders} 
                onCheckedChange={(checked) => setIncludeHeaders(checked as boolean)} 
              />
              <Label htmlFor="include-headers">Bao gồm tiêu đề cột</Label>
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label>Chọn trường dữ liệu</Label>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="field-ma" 
                  checked={selectedFields.ma} 
                  onCheckedChange={(checked) => 
                    setSelectedFields(prev => ({ ...prev, ma: checked as boolean }))
                  } 
                />
                <Label htmlFor="field-ma">Mã đơn hàng</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="field-customer" 
                  checked={selectedFields.customerName} 
                  onCheckedChange={(checked) => 
                    setSelectedFields(prev => ({ ...prev, customerName: checked as boolean }))
                  } 
                />
                <Label htmlFor="field-customer">Khách hàng</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="field-date" 
                  checked={selectedFields.ngaydat} 
                  onCheckedChange={(checked) => 
                    setSelectedFields(prev => ({ ...prev, ngaydat: checked as boolean }))
                  } 
                />
                <Label htmlFor="field-date">Ngày đặt</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="field-status" 
                  checked={selectedFields.trangthai} 
                  onCheckedChange={(checked) => 
                    setSelectedFields(prev => ({ ...prev, trangthai: checked as boolean }))
                  } 
                />
                <Label htmlFor="field-status">Trạng thái</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="field-total" 
                  checked={selectedFields.tonggia} 
                  onCheckedChange={(checked) => 
                    setSelectedFields(prev => ({ ...prev, tonggia: checked as boolean }))
                  } 
                />
                <Label htmlFor="field-total">Tổng tiền</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="field-address" 
                  checked={selectedFields.diachi} 
                  onCheckedChange={(checked) => 
                    setSelectedFields(prev => ({ ...prev, diachi: checked as boolean }))
                  } 
                />
                <Label htmlFor="field-address">Địa chỉ</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="field-phone" 
                  checked={selectedFields.sdt} 
                  onCheckedChange={(checked) => 
                    setSelectedFields(prev => ({ ...prev, sdt: checked as boolean }))
                  } 
                />
                <Label htmlFor="field-phone">Số điện thoại</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="field-email" 
                  checked={selectedFields.email} 
                  onCheckedChange={(checked) => 
                    setSelectedFields(prev => ({ ...prev, email: checked as boolean }))
                  } 
                />
                <Label htmlFor="field-email">Email</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="field-notes" 
                  checked={selectedFields.ghichu} 
                  onCheckedChange={(checked) => 
                    setSelectedFields(prev => ({ ...prev, ghichu: checked as boolean }))
                  } 
                />
                <Label htmlFor="field-notes">Ghi chú</Label>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Hủy</Button>
          <Button onClick={handleExport} className="gap-1">
            <Download className="h-4 w-4" />
            Xuất
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}