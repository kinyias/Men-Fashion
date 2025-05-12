"use client"

import React, { useState, useEffect } from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Search, PlusCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "../ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import toast from "react-hot-toast"
import { ThuongHieu, ThuongHieuQueryParams } from "@/types"
import { deleteBrand, deleteManyBrands, getBrands } from "@/lib/api/api-brands"
import EllipsisPagination from "../ui/EllipsisPagination"

export function BrandTable() {
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState("")
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false)
  const [open, setOpen] = useState(false)
  const [brandToDelete, setBrandToDelete] = useState<ThuongHieu | null>(null)
  const [queryParams, setQueryParams] = useState<ThuongHieuQueryParams>({
    page: 1,
    limit: 5,
    sortBy: 'ma',
    sortOrder: 'asc',
    search: "",
  })
  
  // Fetch brands
  const { data, isLoading, isError } = useQuery({
    queryKey: ['brands', queryParams],
    queryFn: () => getBrands(queryParams),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
  });
  
  const brands = data?.data || []
  const pagination = data?.pagination || {
    page: 1,
    limit: 5,
    totalItems: 0,
    totalPages: 1,
  }
  
  // Update search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setQueryParams(prev => ({ ...prev, search: searchQuery, page: 1 }))
    }, 500)
    return () => clearTimeout(timer)
  }, [searchQuery])
  
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

  // Delete brand mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteBrand(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] })
      toast.success(`Đã xóa thương hiệu thành công`)
      setOpen(false)
    },
    onError: (error) => {
      console.error("Error deleting brand:", error)
      toast.error('Xóa thương hiệu thất bại')
    }
  })
  
  // Bulk delete mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: number[]) => deleteManyBrands(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] })
      toast.success(`Đã xóa ${Object.keys(rowSelection).length} thương hiệu thành công`)
      setBulkDeleteOpen(false)
      setRowSelection({})
    },
    onError: (error) => {
      console.error("Error bulk deleting brands:", error)
      toast.error('Xóa thương hiệu thất bại')
    }
  })

  const columns: ColumnDef<ThuongHieu>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "ten",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Tên thương hiệu
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="font-medium">{row.getValue("ten")}</div>,
    },
    {
      accessorKey: "mota",
      header: "Mô tả",
      cell: ({ row }) => <div>{row.getValue("mota")}</div>,
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const brand = row.original;
  
        return (
          <Dialog open={open && brandToDelete?.ma === brand.ma} onOpenChange={setOpen}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                <DropdownMenuItem
                >
                  <Link className="cursor-pointer" href={`/admin/brands/${brand.ma}`}>Sửa</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    setBrandToDelete(brand)
                    setOpen(true)
                  }}
                  className="text-destructive focus:text-destructive"
                >
                  Xóa
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Bạn có chắc chắn muốn xóa?</DialogTitle>
                <DialogDescription>
                  Hành động này sẽ xóa thương hiệu &quot;{brand.ten}&quot; và không thể hoàn tác.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Hủy</Button>
                <Button 
                  variant="destructive" 
                  onClick={() => deleteMutation.mutate(brand.ma)}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? "Đang xóa..." : "Xóa"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )
      },
    },
  ]

  // Handle bulk delete
  const handleBulkDelete = () => {
    const selectedIds = Object.keys(rowSelection).map(index => brands[parseInt(index)].ma)
    bulkDeleteMutation.mutate(selectedIds)
  }

  const table = useReactTable({
    data: brands,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    manualPagination: true,
    pageCount: pagination.totalPages,
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div className="flex gap-5">
          <h1 className="text-2xl font-bold tracking-tight">Thương hiệu</h1>
          {Object.keys(rowSelection).length > 0 && (
            <Dialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  Xoá thương hiệu đã chọn
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Xác nhận xóa hàng loạt</DialogTitle>
                  <DialogDescription>
                    Bạn có chắc chắn muốn xóa {Object.keys(rowSelection).length} thương hiệu đã chọn? Hành động này không thể
                    hoàn tác.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setBulkDeleteOpen(false)}>
                    Hủy
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={handleBulkDelete}
                    disabled={bulkDeleteMutation.isPending}
                  >
                    {bulkDeleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {bulkDeleteMutation.isPending ? 'Đang xoá...' : 'Xóa'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
        <div className="flex flex-col md:flex-row w-full md:w-auto gap-4 md:gap-2">
          <div className="relative w-full md:w-[300px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Tìm kiếm thương hiệu..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button asChild>
            <Link href="/admin/categories/create">
              <PlusCircle className="mr-2 h-4 w-4" />
              Thêm thương hiệu
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="rounded-md border">
        {isLoading ? (
          <div className="flex justify-center items-center h-24">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : isError ? (
          <div className="flex justify-center items-center h-24 text-destructive">
            Có lỗi xảy ra khi tải dữ liệu
          </div>
        ) : brands.length === 0 ? (
          <div className="flex justify-center items-center h-24 text-muted-foreground">
            Không tìm thấy thương hiệu nào
          </div>
        ) : (
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
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
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    Không tìm thấy kết quả.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
      
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {Object.keys(rowSelection).length} trong {pagination.totalItems} thương hiệu được chọn.
        </div>
        <div className="space-x-2">
          <EllipsisPagination 
            currentPage={pagination.page} 
            totalPages={pagination.totalPages} 
            onPageChange={(page) => setQueryParams(prev => ({ ...prev, page }))} 
          />
        </div>
      </div>
    </div>
  )
}