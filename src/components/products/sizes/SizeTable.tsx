"use client"

import React, { useState, useEffect, useRef } from "react"
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
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import toast from "react-hot-toast"
import { KichCo, KichCoQueryParams } from "@/types"
import { deleteSize, deleteManySizes, getSizes } from "@/lib/api/api-sizes"
import EllipsisPagination from "@/components/ui/EllipsisPagination"

export function SizeTable() {
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState("")
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false)
  const [open, setOpen] = useState(false)
  const [sizeToDelete, setSizeToDelete] = useState<KichCo | null>(null)
  const [queryParams, setQueryParams] = useState<KichCoQueryParams>({
    page: 1,
    limit: 5,
    sortBy: 'ma',
    sortOrder: 'asc',
    search: "",
  })
  
  // Add a mounted ref to track component mount state
  const isMounted = useRef(false)
  
  // Set mounted ref to true after initial render
  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  // Fetch sizes
  const { data, isLoading } = useQuery({
    queryKey: ['sizes', queryParams],
    queryFn: () => getSizes(queryParams),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
  });
  
  const sizes = data?.data || []
  const pagination = data?.pagination || {
    page: 1,
    pageSize: 5,
    totalItems: 0,
    totalPages: 1,
  }
  
  // Update search with debounce - only if component is mounted
  useEffect(() => {
    if (!isMounted.current) return
    
    const timer = setTimeout(() => {
      setQueryParams(prev => ({ ...prev, search: searchQuery, page: 1 }))
    }, 500)
    return () => clearTimeout(timer)
  }, [searchQuery])
  
  // Update sorting - only if component is mounted
  useEffect(() => {
    if (!isMounted.current || sorting.length === 0) return
    
    setQueryParams(prev => ({
      ...prev,
      sortBy: sorting[0].id,
      sortOrder: sorting[0].desc ? 'desc' : 'asc',
      page: 1,
    }))
  }, [sorting])

  // Delete size mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteSize(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sizes'] })
      toast.success(`Đã xóa kích cỡ thành công`)
      setOpen(false)
    },
    onError: (error) => {
      console.error("Error deleting size:", error)
      toast.error('Xóa kích cỡ thất bại')
    }
  })
  
  // Bulk delete mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: number[]) => deleteManySizes(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sizes'] })
      toast.success(`Đã xóa ${Object.keys(rowSelection).length} kích cỡ thành công`)
      setBulkDeleteOpen(false)
      setRowSelection({})
    },
    onError: (error) => {
      console.error("Error bulk deleting sizes:", error)
      toast.error('Xóa kích cỡ hàng loạt thất bại')
    }
  })

  const columns: ColumnDef<KichCo>[] = [
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
            Tên kích cỡ
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="font-medium">{row.getValue("ten")}</div>,
    },
    {
      accessorKey: "_count.bienThes",
      header: "Số biến thể",
      cell: ({ row }) => {
        const count = row.original._count?.bienThes || 0
        return <div className="text-center">{count}</div>
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const size = row.original;
  
        return (
          <Dialog open={open && sizeToDelete?.ma === size.ma} onOpenChange={setOpen}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Hành động</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link className="cursor-pointer" href={`/admin/sizes/${size.ma}`}>Xem</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link className="cursor-pointer" href={`/admin/sizes/${size.ma}`}>Sửa</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setSizeToDelete(size);
                  setOpen(true);
                }}
                className="text-destructive focus:text-destructive cursor-pointer"
              >
                Xoá
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Xác nhận xóa</DialogTitle>
              <DialogDescription>
                Bạn có chắc chắn muốn xóa kích cỡ &quot;{size.ten}&quot;? Hành động này không thể hoàn tác.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button className='cursor-pointer' variant="outline" onClick={() => setOpen(false)}>
                Hủy
              </Button>
              <Button className='cursor-pointer' variant="destructive" onClick={() => deleteMutation.mutate(size.ma)}>
                {deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {deleteMutation.isPending ? 'Đang xoá...' : 'Xóa'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        );
      },
    },
  ]
  
  const table = useReactTable({
    data: sizes || [],
    columns: columns,
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
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm kích cỡ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {Object.keys(rowSelection).length > 0 && (
            <Dialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setBulkDeleteOpen(true)}
                className="h-8"
              >
                Xóa {Object.keys(rowSelection).length} mục
              </Button>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Xác nhận xóa hàng loạt</DialogTitle>
                  <DialogDescription>
                    Bạn có chắc chắn muốn xóa {Object.keys(rowSelection).length} kích cỡ đã chọn? Hành động này không thể hoàn tác.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setBulkDeleteOpen(false)}>
                    Hủy
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={() => {
                      const selectedIds = Object.keys(rowSelection).map(
                        (index) => sizes[parseInt(index)].ma
                      )
                      bulkDeleteMutation.mutate(selectedIds)
                    }}
                  >
                    {bulkDeleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {bulkDeleteMutation.isPending ? 'Đang xoá...' : 'Xóa'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
          <Button asChild>
            <Link href="/admin/sizes/create">
              <PlusCircle className="mr-2 h-4 w-4" />
              Thêm kích cỡ
            </Link>
          </Button>
        </div>
      </div>
      <div className="rounded-md border">
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
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="flex justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
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
      </div>
      <div className="flex items-center justify-end space-x-2">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <span>
              Đã chọn {table.getFilteredSelectedRowModel().rows.length} / {" "}
              {table.getFilteredRowModel().rows.length} mục
            </span>
          )}
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