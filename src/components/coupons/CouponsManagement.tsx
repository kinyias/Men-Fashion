"use client"

import { useState } from "react"
import { CouponsTable } from "@/components/coupons/CouponsTable"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus } from "lucide-react"
import Link from "next/link"

export function CouponsManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [activeFilter, setActiveFilter] = useState("all")

  return (
    <div className="space-x-4">
      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div className="flex gap-5">
            <h1 className="text-2xl font-bold tracking-tight">Quản Lý Khuyến Mãi</h1>
          </div>
          <div className="flex flex-col md:flex-row w-full md:w-auto gap-4 md:gap-2">
            <div className="relative w-full md:w-[300px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Tìm kiếm khuyến mãi..."
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Loại khuyến mãi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất Cả</SelectItem>
                <SelectItem value="phan_tram">Giảm theo %</SelectItem>
                <SelectItem value="tien_mat">Giảm theo tiền</SelectItem>
              </SelectContent>
            </Select>
            <Select value={activeFilter} onValueChange={setActiveFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất Cả</SelectItem>
                <SelectItem value="true">Đang hoạt động</SelectItem>
                <SelectItem value="false">Hết hạn</SelectItem>
              </SelectContent>
            </Select>
            <Button asChild>
              <Link href="/admin/coupons/new">
                <Plus className="mr-2 h-4 w-4" />
                Thêm Khuyến Mãi
              </Link>
            </Button>
          </div>
        </div>
        <div className="w-full">
          <CouponsTable 
            searchQuery={searchQuery} 
            typeFilter={typeFilter} 
            activeFilter={activeFilter} 
          />
        </div>
      </div>
    </div>
  )
}