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
import { formatCurrency } from "@/utils/currency"
import { Input } from "../ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import toast from "react-hot-toast"

// Define the Product type
export type Product = {
  id: string
  name: string
  image: string
  category: string
  price: number
  stock: number
  status: "visible" | "hidden"
  createdAt: string
}

// Sample product data
const products: Product[] = [
  {
    id: "PROD-001",
    name: "San phamm",
    image: "/placeholder.svg?height=40&width=40",
    category: "danh muc",
    price: 500000,
    stock: 24,
    status: "visible",
    createdAt: "2023-04-15",
  },
  {
    id: "PROD-002",
    name: "San phamm",
    image: "/placeholder.svg?height=40&width=40",
    category: "danh muc",
    price: 500000,
    stock: 56,
    status: "visible",
    createdAt: "2023-05-20",
  },
  {
    id: "PROD-003",
    name: "San phamm",
    image: "/placeholder.svg?height=40&width=40",
    category: "danh muc",
    price: 500000,
    stock: 12,
    status: "hidden",
    createdAt: "2023-03-10",
  },
  {
    id: "PROD-004",
    name: "San phamm",
    image: "/placeholder.svg?height=40&width=40",
    category: "danh muc",
    price: 500000,
    stock: 32,
    status: "visible",
    createdAt: "2023-06-05",
  },
  {
    id: "PROD-005",
    name: "San phamm",
    image: "/placeholder.svg?height=40&width=40",
    category: "danh muc",
    price: 500000,
    stock: 18,
    status: "visible",
    createdAt: "2023-07-12",
  },
  {
    id: "PROD-006",
    name: "San phamm",
    image: "/placeholder.svg?height=40&width=40",
    category: "danh muc",
    price: 500000,
    stock: 45,
    status: "hidden",
    createdAt: "2023-08-03",
  },
  {
    id: "PROD-007",
    name: "San phamm",
    image: "/placeholder.svg?height=40&width=40",
    category: "danh muc",
    price: 500000,
    stock: 60,
    status: "visible",
    createdAt: "2023-09-18",
  },
  {
    id: "PROD-008",
    name: "San phamm",
    image: "/placeholder.svg?height=40&width=40",
    category: "danh muc",
    price: 500000,
    stock: 22,
    status: "visible",
    createdAt: "2023-10-25",
  },
  {
    id: "PROD-009",
    name: "San phamm",
    image: "/placeholder.svg?height=40&width=40",
    category: "danh muc",
    price: 500000,
    stock: 38,
    status: "hidden",
    createdAt: "2023-11-14",
  },
  {
    id: "PROD-010",
    name: "San phamm",
    image: "/placeholder.svg?height=40&width=40",
    category: "danh muc",
    price: 500000,
    stock: 15,
    status: "visible",
    createdAt: "2023-12-07",
  },
]


export function ProductsTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
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
  const columns: ColumnDef<Product>[] = [
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
      accessorKey: "image",
      header: "Hình ảnh",
      cell: ({ row }) => (
        <div className="w-10 h-10 relative rounded-md overflow-hidden">
          <Image
            src={row.getValue("image") || "/placeholder.svg"}
            alt={row.getValue("name")}
            fill
            className="object-cover"
          />
        </div>
      ),
      enableSorting: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Tên sản phẩm
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "category",
      header: "Danh mục",
      cell: ({ row }) => <div>{row.getValue("category")}</div>,
    },
    {
      accessorKey: "price",
      header: "Giá",
      cell: ({ row }) => <div>{formatCurrency(row.getValue("price"))}</div>,
    },
    {
      accessorKey: "stock",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Số lượng
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div>{row.getValue("stock")}</div>,
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
  
        return (
          <Badge variant={status === "visible" ? "default" : "outline"}>
            {status === "visible" ? <Eye className="mr-1 h-3 w-3" /> : <EyeOff className="mr-1 h-3 w-3" />}
            {status === "visible" ? "Hiện" : "Ẩn"}
          </Badge>
        )
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const product = row.original;
  
        return (
          <Dialog open={open && productToDelete?.id === product.id} onOpenChange={setOpen}>
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
                <Link href={`/dashboard/products/${product.id}`}>Xem</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/products/${product.id}`}>Sửa</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setProductToDelete(product);
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
                Bạn có chắc chắn muốn xóa sản phẩm &quot;{product.name}&quot;? Hành động này không thể hoàn tác.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button className='cursor-pointer' variant="outline" onClick={() => setOpen(false)}>
                Hủy
              </Button>
              <Button className='cursor-pointer' variant="destructive" onClick={() => handleDeleteProduct(product)}>
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
    data: products,
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
    toast.success(`Đã xóa ${selectedIds.length} sản phẩm`)
  }
  const handleBulkDelete = () => {
    const selectedIds = Object.keys(rowSelection).map(Number);
    
    bulkDeleteMutation(selectedIds);
    setBulkDeleteOpen(false);
  };
  const handleDeleteProduct = (product: Product) => {
    toast.success(`Đã xóa sản phẩm ${product.name}`)
    setOpen(false);
  };
  return (
    <div className="space-y-4">
       <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
      <div className="flex gap-5">
      <h1 className="text-2xl font-bold tracking-tight">Sản phẩm</h1>
      {Object.keys(rowSelection).length > 0 && (
          <Dialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm">
                Xoá sản phẩm đã chọn
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Xác nhận xóa hàng loạt</DialogTitle>
                <DialogDescription>
                  Bạn có chắc chắn muốn xóa {Object.keys(rowSelection).length} sản phẩm đã chọn? Hành động này không thể
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
            placeholder="Tìm kiếm sản phẩm..."
            className="pl-8 w-full"
            // value={searchQuery}
            // onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button asChild>
          <Link href="/admin/products/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Thêm sản phẩm
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
