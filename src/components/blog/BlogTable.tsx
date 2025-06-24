'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type ColumnFiltersState,
  getFilteredRowModel,
} from '@tanstack/react-table';
import {
  ArrowUpDown,
  Eye,
  EyeOff,
  Loader2,
  MoreHorizontal,
  PlusCircle,
  Search,
  Star,
  StarOff,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Blog, BlogQueryParams } from '@/types/blogs';
import {
  deleteBlog,
  deleteManyBlogs,
  getBlogs,
  updateBlog,
} from '@/lib/api/api-blogs';
import toast from 'react-hot-toast';
import EllipsisPagination from '../ui/EllipsisPagination';

export function BlogTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [queryParams, setQueryParams] = useState<BlogQueryParams>({
    page: 1,
    limit: 5,
    sortBy: 'ma',
    sortOrder: 'asc',
  });
  const [open, setOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<Blog | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  const queryClient = useQueryClient();

  // Fetch blogs data
  const { data, isLoading, isError } = useQuery({
    queryKey: ['blogs', queryParams],
    queryFn: () => getBlogs(queryParams),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const blogs = data?.data || [];
  const pagination = data?.pagination || {
    page: 1,
    limit: 5,
    totalItems: 0,
    totalPages: 1,
  };

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteBlog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      toast.success('Xóa tin tức thành công');
      setOpen(false);
    },
    onError: (error) => {
      console.error('Error deleting blog:', error);
      toast.error('Có lỗi xảy ra khi xóa tin tức');
    },
  });

  // Bulk delete mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: number[]) => deleteManyBlogs(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      toast.success(
        `Đã xóa ${Object.keys(rowSelection).length} tin tức thành công`
      );
      setBulkDeleteOpen(false);
      setRowSelection({});
    },
    onError: (error) => {
      console.error('Error deleting multiple blogs:', error);
      toast.error('Có lỗi xảy ra khi xóa tin tức');
    },
  });

  const handleDeleteBlog = (blog: Blog) => {
    deleteMutation.mutate(blog.ma);
  };

  const handleBulkDelete = () => {
    const selectedIds = Object.keys(rowSelection).map((index) => {
      return blogs[Number(index)].ma;
    });
    bulkDeleteMutation.mutate(selectedIds);
  };

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: boolean }) =>
      updateBlog(id, {
        ...blogs.find((b) => b.ma === id)!,
        trangthai: status,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
    onError: (error) => {
      console.error('Error updating blog status:', error);
      toast.error('Có lỗi xảy ra khi cập nhật trạng thái');
    },
  });

  // Update hot status mutation
  const updateHotStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: boolean }) =>
      updateBlog(id, {
        ...blogs.find((b) => b.ma === id)!,
        tinhot: status,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
    onError: (error) => {
      console.error('Error updating hot status:', error);
      toast.error('Có lỗi xảy ra khi cập nhật trạng thái tin hot');
    },
  });

  const toggleVisibility = (blog: Blog) => {
    const newStatus = !blog.trangthai;
    updateStatusMutation.mutate(
      { id: blog.ma, status: newStatus },
      {
        onSuccess: () => {
          toast.success(
            `Tin tức "${blog.tieude}" đã được ${newStatus ? 'hiện' : 'ẩn'}.`
          );
        },
      }
    );
  };

  const toggleHotStatus = (blog: Blog) => {
    const newStatus = !blog.tinhot;
    updateHotStatusMutation.mutate(
      { id: blog.ma, status: newStatus },
      {
        onSuccess: () => {
          toast.success(
            `Tin tức "${blog.tieude}" ${
              newStatus ? 'đã được đánh dấu là tin hot' : 'không còn là tin hot'
            }.`
          );
        },
      }
    );
  };

  // Update search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setQueryParams((prev) => ({ ...prev, search: searchTerm, page: 1 }));
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Update sorting
  useEffect(() => {
    if (sorting.length > 0) {
      setQueryParams((prev) => ({
        ...prev,
        sortBy: sorting[0].id === 'title' ? 'tieude' : sorting[0].id,
        sortOrder: sorting[0].desc ? 'desc' : 'asc',
        page: 1,
      }));
    }
  }, [sorting]);

  const columns: ColumnDef<Blog>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
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
      accessorKey: 'tieude',
      id: 'title',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Tiêu đề
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="font-medium max-w-[300px] truncate">
          {row.original.tieude}
        </div>
      ),
      enableSorting: false,
    },
    {
      id: 'category',
      header: 'Loại tin',
      cell: ({ row }) => {
        return (
          <div className="max-w-[200px] truncate">
            {row.original.loaitin?.tenloaitin || 'N/A'}
          </div>
        );
      },
    },
    {
      id: 'author',
      header: 'Tác giả',
      cell: ({ row }) => {
        const author = row.original.nguoiDung;
        return (
          <div className="max-w-[200px] truncate">
            {author ? `${author.ten}` : 'N/A'}
          </div>
        );
      },
    },
    {
      id: 'hot',
      header: 'Tin hot',
      cell: ({ row }) => {
        const blog = row.original;
        const isHot = blog.tinhot;
        const isPending =
          updateHotStatusMutation.isPending &&
          updateHotStatusMutation.variables?.id === blog.ma;

        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleHotStatus(blog)}
            disabled={isPending}
            className={isHot ? 'text-yellow-500' : 'text-muted-foreground'}
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : isHot ? (
              <Star className="h-4 w-4 mr-2" />
            ) : (
              <StarOff className="h-4 w-4 mr-2" />
            )}
            {isPending ? 'Đang cập nhật...' : isHot ? 'Hot' : 'Thường'}
          </Button>
        );
      },
    },
    {
      id: 'status',
      header: 'Trạng thái',
      cell: ({ row }) => {
        const blog = row.original;
        const isHidden = !blog.trangthai;
        const isPending =
          updateStatusMutation.isPending &&
          updateStatusMutation.variables?.id === blog.ma;

        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleVisibility(blog)}
            disabled={isPending}
            className={isHidden ? 'text-muted-foreground' : 'text-primary'}
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : isHidden ? (
              <EyeOff className="h-4 w-4 mr-2" />
            ) : (
              <Eye className="h-4 w-4 mr-2" />
            )}
            {isPending ? 'Đang cập nhật...' : isHidden ? 'Ẩn' : 'Hiện'}
          </Button>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const blog = row.original;

        return (
          <Dialog
            open={open && blogToDelete?.ma === blog.ma}
            onOpenChange={setOpen}
          >
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
                  <Link href={`/admin/blogs/${blog.ma}`}>Sửa</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    setBlogToDelete(blog);
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
                  Bạn có chắc chắn muốn xóa tin tức &quot;{blog.tieude}
                  &quot;? Hành động này không thể hoàn tác.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  className="cursor-pointer"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={deleteMutation.isPending}
                >
                  Hủy
                </Button>
                <Button
                  className="cursor-pointer"
                  variant="destructive"
                  onClick={() => handleDeleteBlog(blog)}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {deleteMutation.isPending ? 'Đang xoá...' : 'Xoá'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        );
      },
    },
  ];

  const table = useReactTable({
    data: blogs,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
    manualPagination: true,
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div className="flex gap-5">
          <h1 className="text-2xl font-bold tracking-tight">Tin tức</h1>
          {Object.keys(rowSelection).length > 0 && (
            <Dialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  Xoá tin tức đã chọn
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Xác nhận xóa hàng loạt</DialogTitle>
                  <DialogDescription>
                    Bạn có chắc chắn muốn xóa {Object.keys(rowSelection).length}{' '}
                    tin tức đã chọn? Hành động này không thể hoàn tác.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setBulkDeleteOpen(false)}
                  >
                    Hủy
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleBulkDelete}
                    disabled={bulkDeleteMutation.isPending}
                  >
                    {bulkDeleteMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
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
              placeholder="Tìm kiếm tin tức..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button asChild>
            <Link href="/admin/blogs/create">
              <PlusCircle className="mr-2 h-4 w-4" />
              Thêm tin tức
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
          <p className="text-destructive">
            Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.
          </p>
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
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
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
                  setQueryParams((prev) => ({
                    ...prev,
                    limit: newLimit,
                    page: 1,
                  }));
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
                onPageChange={(page) =>
                  setQueryParams((prev) => ({ ...prev, page }))
                }
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
