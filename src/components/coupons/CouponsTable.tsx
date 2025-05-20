"use client"

import { useEffect, useState } from "react"
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Edit, ArrowUpDown, Loader2 } from "lucide-react"
import Link from "next/link"
import { KhuyenMai } from "@/types"
import { useQuery } from "@tanstack/react-query"
import { getCoupons } from "@/lib/api"
import EllipsisPagination from "../ui/EllipsisPagination"

interface CouponsTableProps {
  searchQuery: string
  typeFilter: string
  activeFilter: string
}

export function CouponsTable({ searchQuery, typeFilter, activeFilter }: CouponsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [queryParams, setQueryParams] = useState({
    page: 1,
    limit: 5,
    search: "",
    loaikhuyenmai: undefined as string | undefined,
    active: undefined as string | undefined,
    sortBy: undefined as string | undefined,
    sortOrder: undefined as "asc" | "desc" | undefined,
  })

  // Update query params when search or filters change
  useEffect(() => {
    const timer = setTimeout(() => {
      setQueryParams(prev => ({
        ...prev,
        search: searchQuery,
        loaikhuyenmai: typeFilter === "all" ? undefined : typeFilter,
        active: activeFilter === "all" ? undefined : activeFilter,
        page: 1
      }))
    }, 500)
    return () => clearTimeout(timer)
  }, [searchQuery, typeFilter, activeFilter])

  // Update sorting when table sorting changes
  useEffect(() => {
    if (sorting.length > 0) {
      setQueryParams(prev => ({
        ...prev,
        sortBy: sorting[0].id,
        sortOrder: sorting[0].desc ? 'desc' : 'asc',
        page: 1,
      }));
    } else {
      setQueryParams(prev => ({
        ...prev,
        sortBy: undefined,
        sortOrder: undefined,
      }));
    }
  }, [sorting]);

  // Fetch coupons with React Query
  const { data, isLoading, isError } = useQuery({
    queryKey: ['coupons', queryParams],
    queryFn: () => getCoupons(queryParams),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
  });

  const coupons = data?.data || []
  const pagination = data?.pagination || {
    page: 1,
    limit: 5,
    totalItems: 0,
    totalPages: 1,
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Check if coupon is active
  const isCouponActive = (startDate: string, endDate: string) => {
    const now = new Date()
    return new Date(startDate) <= now && now <= new Date(endDate)
  }

  // Define columns
  const columns: ColumnDef<KhuyenMai>[] = [
    {
      accessorKey: "ma",
      header: "Mã",
      cell: ({ row }) => <div className="font-medium">{row.getValue("ma")}</div>,
    },
    {
      accessorKey: "ten",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Tên khuyến mãi
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="font-medium">{row.getValue("ten")}</div>,
    },
    {
      accessorKey: "loaikhuyenmai",
      header: "Loại khuyến mãi",
      cell: ({ row }) => {
        const type = row.getValue("loaikhuyenmai") as string
        return (
          <Badge variant="outline">
            {type === 'phan_tram' ? 'Giảm theo %' : 'Giảm theo tiền'}
          </Badge>
        )
      },
    },
    {
      accessorKey: "giatrigiam",
      header: () => <div className="text-right">Giá trị giảm</div>,
      cell: ({ row }) => {
        const amount = Number(row.getValue("giatrigiam"))
        const type = row.original.loaikhuyenmai
        return (
          <div className="text-right font-medium">
            {type === 'phan_tram' ? `${amount}%` : formatCurrency(amount)}
          </div>
        )
      },
    },
    {
      accessorKey: "giatridonhang",
      header: () => <div className="text-right">Giá trị đơn hàng tối thiểu</div>,
      cell: ({ row }) => {
        const amount = Number(row.getValue("giatridonhang"))
        return <div className="text-right font-medium">{formatCurrency(amount)}</div>
      },
    },
    {
      accessorKey: "ngaybatdat",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hidden md:flex"
          >
            Ngày bắt đầu
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="hidden md:block">{formatDate(row.getValue("ngaybatdat"))}</div>,
    },
    {
      accessorKey: "ngayketthuc",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hidden md:flex"
          >
            Ngày kết thúc
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="hidden md:block">{formatDate(row.getValue("ngayketthuc"))}</div>,
    },
    {
      id: "status",
      header: "Trạng thái",
      cell: ({ row }) => {
        const isActive = isCouponActive(row.original.ngaybatdat, row.original.ngayketthuc)
        return (
          <Badge variant={isActive ? "default" : "secondary"}>
            {isActive ? "Đang hoạt động" : "Hết hạn"}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const coupon = row.original

        return (
          <div className="text-right">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/admin/coupons/${coupon.ma}`}>
                <Edit className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </Link>
            </Button>
          </div>
        )
      },
    },
  ]

  // Initialize table
  const table = useReactTable({
    data: coupons,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    manualPagination: true,
    manualSorting: true,
  })

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : isError ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-destructive">Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.</p>
        </div>
      ) : (
        <>
          <div className="border rounded-md">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id}>
                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                          </TableHead>
                        )
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                        className="cursor-pointer"
                        onClick={() => {
                          window.location.href = `/admin/coupons/${row.original.ma}`
                        }}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-24 text-center">
                        Không tìm thấy khuyến mãi phù hợp với tiêu chí của bạn
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between px-4 py-2 border-t">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">Số hàng mỗi trang</p>
                <select
                  value={queryParams.limit}
                  onChange={(e) => {
                    const newLimit = Number(e.target.value);
                    setQueryParams(prev => ({ ...prev, limit: newLimit, page: 1 }));
                  }}
                  className="h-8 w-[70px] rounded-md border border-input bg-background px-2 py-1 text-sm"
                >
                  {[5, 10, 20, 30, 50].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      {pageSize}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setQueryParams(prev => ({ ...prev, page: prev.page - 1 }));
                  }}
                  disabled={pagination.page <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <EllipsisPagination 
                  currentPage={queryParams.page}
                  totalPages={pagination.totalPages}
                  onPageChange={(page) => setQueryParams(prev => ({...prev, page }))}
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setQueryParams(prev => ({ ...prev, page: prev.page + 1 }));
                  }}
                  disabled={pagination.page >= pagination.totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}