// import {
//     type ColumnDef,
//   } from "@tanstack/react-table"
// import { Product } from "./ProductsTable"
// import { Checkbox } from "@/components/ui/checkbox"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Badge } from "@/components/ui/badge"
// import Image from "next/image"
// import { Button } from "../ui/button"
// import { ArrowUpDown, Eye, EyeOff, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
// import { formatCurrency } from "@/utils/currency"
// import Link from "next/link"
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
// export const columnsProducts: ColumnDef<Product>[] = [
//     {
//       id: "select",
//       header: ({ table }) => (
//         <Checkbox
//           checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
//           onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
//           aria-label="Select all"
//         />
//       ),
//       cell: ({ row }) => (
//         <Checkbox
//           checked={row.getIsSelected()}
//           onCheckedChange={(value) => row.toggleSelected(!!value)}
//           aria-label="Select row"
//         />
//       ),
//       enableSorting: false,
//       enableHiding: false,
//     },
//     {
//       accessorKey: "image",
//       header: "Hình ảnh",
//       cell: ({ row }) => (
//         <div className="w-10 h-10 relative rounded-md overflow-hidden">
//           <Image
//             src={row.getValue("image") || "/placeholder.svg"}
//             alt={row.getValue("name")}
//             fill
//             className="object-cover"
//           />
//         </div>
//       ),
//       enableSorting: false,
//     },
//     {
//       accessorKey: "name",
//       header: ({ column }) => {
//         return (
//           <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
//             Tên sản phẩm
//             <ArrowUpDown className="ml-2 h-4 w-4" />
//           </Button>
//         )
//       },
//       cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
//     },
//     {
//       accessorKey: "category",
//       header: "Danh mục",
//       cell: ({ row }) => <div>{row.getValue("category")}</div>,
//     },
//     {
//       accessorKey: "price",
//       header: "Giá",
//       cell: ({ row }) => <div>{formatCurrency(row.getValue("price"))}</div>,
//     },
//     {
//       accessorKey: "stock",
//       header: ({ column }) => {
//         return (
//           <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
//             Số lượng
//             <ArrowUpDown className="ml-2 h-4 w-4" />
//           </Button>
//         )
//       },
//       cell: ({ row }) => <div>{row.getValue("stock")}</div>,
//     },
//     {
//       accessorKey: "status",
//       header: "Trạng thái",
//       cell: ({ row }) => {
//         const status = row.getValue("status") as string
  
//         return (
//           <Badge variant={status === "visible" ? "default" : "outline"}>
//             {status === "visible" ? <Eye className="mr-1 h-3 w-3" /> : <EyeOff className="mr-1 h-3 w-3" />}
//             {status === "visible" ? "Hiện" : "Ẩn"}
//           </Badge>
//         )
//       },
//     },
//     {
//       id: 'actions',
//       cell: ({ row }) => {
//         const product = row.original;

//         return (
//           <Dialog open={open && postToDelete?.id_tin === product.id} onOpenChange={setOpen}>
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" className="h-8 w-8 p-0">
//                 <span className="sr-only">Open menu</span>
//                 <MoreHorizontal className="h-4 w-4" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuLabel>Actions</DropdownMenuLabel>
//               <DropdownMenuItem asChild>
//                 <Link href={`/dashboard/products/${product.id}`}>Xem</Link>
//               </DropdownMenuItem>
//               <DropdownMenuItem asChild>
//                 <Link href={`/dashboard/products/${product.id}`}>Sửa</Link>
//               </DropdownMenuItem>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem
//                 onClick={() => {
//                   setPostToDelete(product);
//                   setOpen(true);
//                 }}
//                 className="text-destructive focus:text-destructive className='cursor-pointer'"
//               >
//                 Xoá
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Xác nhận xóa</DialogTitle>
//               <DialogDescription>
//                 Bạn có chắc chắn muốn xóa sản phẩm &quot;{product.name}&quot;? Hành động này không thể hoàn tác.
//               </DialogDescription>
//             </DialogHeader>
//             <DialogFooter>
//               <Button className='cursor-pointer' variant="outline" onClick={() => setOpen(false)}>
//                 Hủy
//               </Button>
//               <Button className='cursor-pointer' variant="destructive" onClick={() => handleDeletePost(product)}>
//               {/* {deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//               {deleteMutation.isPending ? 'Đang xoá...' : 'Xoá'} */}
//               Xóa
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//         );
//       },
//     },
//   ]