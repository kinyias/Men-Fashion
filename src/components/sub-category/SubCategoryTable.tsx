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
import { ArrowUpDown, MoreHorizontal, Eye, EyeOff, Search, PlusCircle, Loader2 } from "lucide-react"
import Image from "next/image"
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
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "../ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import toast from "react-hot-toast"
import { LoaiSanPham, LoaiSanPhamQueryParams } from "@/types"
import { deleteSubCategory, deleteManySubCategories, getSubCategories } from "@/lib/api/api-sub-categories"
import EllipsisPagination from "../ui/EllipsisPagination"
import { ApiError } from "@/types"
import axios from "axios"

export function SubCategoryTable() {
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState("")
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false)
  const [open, setOpen] = useState(false)
  const [subCategoryToDelete, setSubCategoryToDelete] = useState<LoaiSanPham | null>(null)
  const [queryParams, setQueryParams] = useState<LoaiSanPhamQueryParams>({
    page: 1,
    limit: 5,
    sortBy: 'ma',
    sortOrder: 'desc',
    search: "",
  })
  
  // Fetch sub-categories
  const { data, isLoading, isError } = useQuery({
    queryKey: ['sub-categories', queryParams],
    queryFn: () => getSubCategories(queryParams),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
  });
  
  const subCategories = data?.data || []
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
        sortOrder: sorting[0].desc ? 'asc' : 'desc',
        page: 1,
      }));
    }
  }, [sorting]);

  // Delete sub-category mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      // Get the sub-category to delete
      const subCategoryToDelete = subCategories.find(sc => sc.ma === id);
      
      // Delete the image if it exists
      if (subCategoryToDelete?.hinhanh) {
        await handleDeleteSubCategory(subCategoryToDelete);
      }
      
      // Delete the sub-category
      return deleteSubCategory(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sub-categories'] })
      toast.success(`Đã xóa loại sản phẩm thành công`)
      setOpen(false)
    },
    onError: (error) => {
      console.error("Error deleting sub-category:", error)
      toast.error('Xóa loại sản phẩm thất bại')
    }
  })
  
  // Bulk delete mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: number[]) => {
      // Delete images for all selected sub-categories
      for (const id of ids) {
        const subCategoryToDelete = subCategories.find(sc => sc.ma === id);
        if (subCategoryToDelete?.hinhanh) {
          await handleDeleteSubCategory(subCategoryToDelete);
        }
      }
      // Delete the sub-categories
      return deleteManySubCategories(ids);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sub-categories'] })
      toast.success(`Đã xóa ${Object.keys(rowSelection).length} loại sản phẩm thành công`)
      setBulkDeleteOpen(false)
      setRowSelection({})
    },
    onError: (error: ApiError) => {
      console.error("Error bulk deleting sub-categories:", error)
      toast.error(`${error.response.data.message}` )
    }
  })
  
  const getImageKey = (src: string) =>
    src.substring(src.lastIndexOf('/') + 1);
    
  const handleDeleteSubCategory = async (subCategory: LoaiSanPham) => {
    if (!subCategory.hinhanh) return;
    
    const imageKey = getImageKey(subCategory.hinhanh);
    try {
      await axios.post('/api/uploadthing/delete', { imageKey });
      console.log(`Deleted image: ${imageKey}`);
    } catch (error) {
      console.error(`Failed to delete image: ${imageKey}`, error);
    }
  }

  const columns: ColumnDef<LoaiSanPham>[] = [
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
      accessorKey: "hinhanh",
      header: "Hình ảnh",
      cell: ({ row }) => (
        <div className="w-20 h-20 relative rounded-md overflow-hidden">
          <Image
            src={row.getValue("hinhanh") || "/placeholder.svg"}
            alt={row.getValue("ten")}
            fill
            sizes="50px"
            className="object-cover"
          />
        </div>
      ),
      enableSorting: false,
    },
    {
      accessorKey: "ten",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Tên loại sản phẩm
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="font-medium">{row.getValue("ten")}</div>,
    },
    {
      accessorKey: "danhMuc.ten",
      header: "Danh mục",
      cell: ({ row }) => <div>{row.original.danhMuc?.ten || ""}</div>,
    },
    {
      accessorKey: "mota",
      header: "Mô tả",
      cell: ({ row }) => <div>{row.getValue("mota")}</div>,
    },
    {
      accessorKey: "noibat",
      header: "Nổi bật",
      cell: ({ row }) => {
        const noibat = row.getValue("noibat") as boolean
  
        return (
          <Badge variant={noibat ? "default" : "outline"}>
            {noibat ? <Eye className="mr-1 h-3 w-3" /> : <EyeOff className="mr-1 h-3 w-3" />}
            {noibat ? "Có" : "Không"}
          </Badge>
        )
      },
    },
    {
      accessorKey: "_count.sanPhams",
      header: "Số sản phẩm",
      cell: ({ row }) => {
        const count = row.original._count?.sanPhams || 0
        return <div className="text-center">{count}</div>
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const subCategory = row.original;
  
        return (
          <Dialog open={open && subCategoryToDelete?.ma === subCategory.ma} onOpenChange={setOpen}>
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
                <Link className="cursor-pointer" href={`/admin/sub-category/${subCategory.ma}`}>Xem</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link className="cursor-pointer" href={`/admin/sub-category/${subCategory.ma}`}>Sửa</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setSubCategoryToDelete(subCategory);
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
                Bạn có chắc chắn muốn xóa loại sản phẩm &quot;{subCategory.ten}&quot;? Hành động này không thể hoàn tác.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button className='cursor-pointer' variant="outline" onClick={() => setOpen(false)}>
                Hủy
              </Button>
              <Button className='cursor-pointer' variant="destructive" onClick={() => deleteMutation.mutate(subCategory.ma)}>
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
    data: subCategories || [],
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
  
  const handleBulkDelete = () => {
    const selectedIds = Object.keys(rowSelection).map(index => {
      return subCategories[Number(index)].ma;
    });
    bulkDeleteMutation.mutate(selectedIds);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div className="flex gap-5">
          <h1 className="text-2xl font-bold tracking-tight">Loại sản phẩm</h1>
          {Object.keys(rowSelection).length > 0 && (
            <Dialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  Xoá loại sản phẩm đã chọn
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Xác nhận xóa hàng loạt</DialogTitle>
                  <DialogDescription>
                    Bạn có chắc chắn muốn xóa {Object.keys(rowSelection).length} loại sản phẩm đã chọn? Hành động này không thể
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
              placeholder="Tìm kiếm loại sản phẩm..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button asChild>
            <Link href="/admin/sub-category/create">
              <PlusCircle className="mr-2 h-4 w-4" />
              Thêm loại sản phẩm
            </Link>
          </Button>
        </div>
      </div>
      
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
                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      Không có dữ liệu nào để hiển thị.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between">
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
              
              <EllipsisPagination 
                currentPage={queryParams.page}
                totalPages={pagination.totalPages}
                onPageChange={(page) => setQueryParams(prev => ({...prev, page }))}
              />
             
            </div>
          </div>
        </>
      )}
    </div>
  )
}