"use client"

import React, { useState } from "react"
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
import { ArrowUpDown, MoreHorizontal, Eye, EyeOff, Search, PlusCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

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

// Define the ProductType type
export type ProductType = {
  ma: number
  ten: string
  mota: string
  hinhanh: string
  noibat: boolean
  madanhmuc: number
  tendanhmuc: string
}

// Sample product type data
const productTypes: ProductType[] = [
  {
    ma: 1,
    ten: "Áo sơ mi",
    mota: "Áo sơ mi nam dài tay",
    hinhanh: "/placeholder.svg?height=40&width=40",
    noibat: true,
    madanhmuc: 1,
    tendanhmuc: "Áo"
  },
  {
    ma: 2,
    ten: "Áo thun",
    mota: "Áo thun nam ngắn tay",
    hinhanh: "/placeholder.svg?height=40&width=40",
    noibat: false,
    madanhmuc: 1,
    tendanhmuc: "Áo"
  },
  {
    ma: 3,
    ten: "Quần jean",
    mota: "Quần jean nam dáng slim fit",
    hinhanh: "/placeholder.svg?height=40&width=40",
    noibat: true,
    madanhmuc: 2,
    tendanhmuc: "Quần"
  },
  {
    ma: 4,
    ten: "Quần kaki",
    mota: "Quần kaki nam dáng regular",
    hinhanh: "/placeholder.svg?height=40&width=40",
    noibat: false,
    madanhmuc: 2,
    tendanhmuc: "Quần"
  },
  {
    ma: 5,
    ten: "Giày tây",
    mota: "Giày tây nam da bò",
    hinhanh: "/placeholder.svg?height=40&width=40",
    noibat: true,
    madanhmuc: 3,
    tendanhmuc: "Giày"
  },
  {
    ma: 6,
    ten: "Giày thể thao",
    mota: "Giày thể thao nam",
    hinhanh: "/placeholder.svg?height=40&width=40",
    noibat: false,
    madanhmuc: 3,
    tendanhmuc: "Giày"
  },
  {
    ma: 7,
    ten: "Thắt lưng",
    mota: "Thắt lưng nam da bò",
    hinhanh: "/placeholder.svg?height=40&width=40",
    noibat: true,
    madanhmuc: 4,
    tendanhmuc: "Phụ kiện"
  },
  {
    ma: 8,
    ten: "Ví da",
    mota: "Ví da nam",
    hinhanh: "/placeholder.svg?height=40&width=40",
    noibat: false,
    madanhmuc: 4,
    tendanhmuc: "Phụ kiện"
  }
]

export function SubCategoryTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [typeToDelete, setTypeToDelete] = useState<ProductType | null>(null);

  const columns: ColumnDef<ProductType>[] = [
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
        <div className="w-10 h-10 relative rounded-md overflow-hidden">
          <Image
            src={row.getValue("hinhanh") || "/placeholder.svg"}
            alt={row.getValue("ten")}
            fill
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
      accessorKey: "tendanhmuc",
      header: "Danh mục",
      cell: ({ row }) => <div>{row.getValue("tendanhmuc")}</div>,
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
      id: 'actions',
      cell: ({ row }) => {
        const productType = row.original;
  
        return (
          <Dialog open={open && typeToDelete?.ma === productType.ma} onOpenChange={setOpen}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/sub-category/${productType.ma}`}>Xem</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/sub-category/${productType.ma}`}>Sửa</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setTypeToDelete(productType);
                  setOpen(true);
                }}
                className="text-destructive focus:text-destructive className='cursor-pointer'"
              >
                Xoá
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Xác nhận xóa</DialogTitle>
              <DialogDescription>
                Bạn có chắc chắn muốn xóa loại sản phẩm &quot;{productType.ten}&quot;? Hành động này không thể hoàn tác.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button className='cursor-pointer' variant="outline" onClick={() => setOpen(false)}>
                Hủy
              </Button>
              <Button className='cursor-pointer' variant="destructive" onClick={() => handleDeleteType(productType)}>
                Xóa
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        );
      },
    },
  ]
  
  const table = useReactTable({
    data: productTypes,
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
  })
  
  const bulkDeleteMutation = (selectedIds: number[]) => {
    toast.success(`Đã xóa ${selectedIds.length} loại sản phẩm`)
  }
  
  const handleBulkDelete = () => {
    const selectedIds = Object.keys(rowSelection).map(Number);
    
    bulkDeleteMutation(selectedIds);
    setBulkDeleteOpen(false);
  };
  
  const handleDeleteType = (productType: ProductType) => {
    toast.success(`Đã xóa loại sản phẩm ${productType.ten}`)
    setOpen(false);
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
                <Button variant="destructive" onClick={handleBulkDelete}>
                  Xóa
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
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} hàng
          được chọn.
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Trước
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Sau
          </Button>
        </div>
      </div>
    </div>
  )
}