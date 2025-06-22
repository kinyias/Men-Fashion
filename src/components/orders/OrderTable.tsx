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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, MoreHorizontal, Eye, ArrowUpDown, Loader2 } from "lucide-react"
import Link from "next/link"
import { DonHang, TrangThaiDonHang } from "@/types"
import { useQuery } from "@tanstack/react-query"
import { getOrders } from "@/lib/api"
import EllipsisPagination from "../ui/EllipsisPagination"

interface OrdersTableProps {
  searchQuery: string
  statusFilter: string
}

export function OrdersTable({ searchQuery, statusFilter }: OrdersTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [queryParams, setQueryParams] = useState({
    page: 1,
    limit: 10,
    search: "",
    trangthai: undefined as TrangThaiDonHang | undefined,
  })

  // Update query params when search or status filter changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setQueryParams(prev => ({
        ...prev,
        search: searchQuery,
        trangthai: statusFilter === "all" ? undefined : statusFilter as TrangThaiDonHang,
        page: 1
      }))
    }, 500)
    return () => clearTimeout(timer)
  }, [searchQuery, statusFilter])

  // Update sorting when table sorting changes
  useEffect(() => {
    if (sorting.length > 0) {
      setQueryParams(prev => ({
        ...prev,
        sortBy: sorting[0].id,
        sortOrder: sorting[0].desc ? 'desc' : 'asc',
        page: 1,
      }));
    }
  }, [sorting]);

  // Fetch orders with React Query
  const { data, isLoading, isError } = useQuery({
    queryKey: ['orders', queryParams],
    queryFn: () => getOrders(queryParams),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
  });

  const orders = data?.data || []
  const pagination = data?.pagination || {
    page: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 1,
  }

  // Định dạng ngày tháng
  const formatDate = (dateString: Date) => {
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

  // Ánh xạ màu sắc cho trạng thái
  const getStatusBadgeVariant = (status: TrangThaiDonHang) => {
    switch (status) {
      case TrangThaiDonHang.DA_DAT:
        return "outline"
      case TrangThaiDonHang.DANG_XU_LY:
        return "secondary"
      case TrangThaiDonHang.DANG_GIAO_HANG:
        return "default"
      case TrangThaiDonHang.DA_GIAO_HANG:
        return "default"
      case TrangThaiDonHang.DA_HUY:
        return "destructive"
      default:
        return "outline"
    }
  }

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

  // Định nghĩa cột
  const columns: ColumnDef<DonHang>[] = [
    {
      accessorKey: "ma",
      header: "Mã Đơn Hàng",
      cell: ({ row }) => <div className="font-medium">{row.getValue("ma")}</div>,
    },
    {
      accessorKey: "customer",
      header: "Khách Hàng",
      cell: ({ row }) => {
        const order = row.original
        return (
          <div>
            <div className="font-medium">{`${order.ten}`}</div>
            <div className="text-sm text-muted-foreground">{order.email}</div>
          </div>
        )
      },
    },
    {
      accessorKey: "ngaydat",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hidden md:flex"
          >
            Ngày Đặt
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="hidden md:block">{formatDate(row.getValue("ngaydat"))}</div>,
    },
    {
      accessorKey: "trangthai",
      header: "Trạng Thái",
      cell: ({ row }) => {
        const status = row.getValue("trangthai") as TrangThaiDonHang
        return <Badge variant={getStatusBadgeVariant(status)}>{getStatusText(status)}</Badge>
      },
    },
    {
      accessorKey: "tonggia",
      header: () => <div className="text-right">Tổng Tiền</div>,
      cell: ({ row }) => {
        const amount = Number(row.getValue("tonggia"))
        return <div className="text-right font-medium">{formatCurrency(amount)}</div>
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const order = row.original

        return (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Mở menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/admin/orders/${order.ma}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    Xem chi tiết
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]

  // Khởi tạo bảng
  const table = useReactTable({
    data: orders,
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
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-24 text-center">
                        Không tìm thấy đơn hàng phù hợp với tiêu chí của bạn
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
