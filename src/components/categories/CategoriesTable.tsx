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
import { ArrowUpDown, MoreHorizontal, Search, PlusCircle } from "lucide-react"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "../ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import toast from "react-hot-toast"

// Define the Product type
export type Category = {
  ma: number
  ten: string
  mota: string
}

// Sample product data
const categories: Category[] = [
    { ma: 1, ten: "Áo", mota: "Áo thời trang lịch lãm" },
    { ma: 2, ten: "Quần", mota: "Các loại quần âu, quần jean,..." },
    { ma: 3, ten: "Giày", mota: "Giày tây, giày sneaker,..." },
    { ma: 4, ten: "Phụ kiện", mota: "Phụ kiện mang đến sự thoải mãi và lịch lám" },
]


export function CategoriesTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  // React.useEffect(() => {
  //   if (searchQuery) {
  //     setColumnFilters([
  //       {
  //         id: "name",
  //         value: searchQuery,
  //       },
  //     ])
  //   } else {
  //     setColumnFilters([])
  //   }
  // }, [searchQuery])
  const columns: ColumnDef<Category>[] = [
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
            Tên danh mục
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
        const category = row.original;
  
        return (
          <Dialog open={open && categoryToDelete?.ma === category.ma} onOpenChange={setOpen}>
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
                <Link href={`/dashboard/categories/${category.ma}`}>Xem</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/categories/${category.ma}`}>Sửa</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setCategoryToDelete(category);
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
                Bạn có chắc chắn muốn xóa sản phẩm &quot;{category.ten}&quot;? Hành động này không thể hoàn tác.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button className='cursor-pointer' variant="outline" onClick={() => setOpen(false)}>
                Hủy
              </Button>
              <Button className='cursor-pointer' variant="destructive" onClick={() => handleDeleteCategory(category)}>
              {/* {deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {deleteMutation.isPending ? 'Đang xoá...' : 'Xoá'} */}
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
    data: categories,
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
    toast.success(`Đã xóa ${selectedIds.length} danh mục`)
  }
  const handleBulkDelete = () => {
    const selectedIds = Object.keys(rowSelection).map(Number);
    
    bulkDeleteMutation(selectedIds);
    setBulkDeleteOpen(false);
  };
  const handleDeleteCategory= (category: Category) => {
    toast.success(`Đã xóa danh mục ${category.ten}`)
    setOpen(false);
  };
  return (
    <div className="space-y-4">
       <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
      <div className="flex gap-5">
      <h1 className="text-2xl font-bold tracking-tight">Danh mục</h1>
      {Object.keys(rowSelection).length > 0 && (
          <Dialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm">
                Xoá danh mục đã chọn
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Xác nhận xóa hàng loạt</DialogTitle>
                <DialogDescription>
                  Bạn có chắc chắn muốn xóa {Object.keys(rowSelection).length} danh mục đã chọn? Hành động này không thể
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
            placeholder="Tìm kiếm danh mục..."
            className="pl-8 w-full"
            // value={searchQuery}
            // onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button asChild>
          <Link href="/admin/categories/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Thêm danh mục
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
