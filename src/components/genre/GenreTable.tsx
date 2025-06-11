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
import { Genre, GenreQueryParams } from '@/types/genre';
import {
  deleteGenre,
  deleteManyGenres,
  getGenres,
  updateGenre,
} from '@/lib/api/api-genre';
import toast from 'react-hot-toast';
import EllipsisPagination from '../ui/EllipsisPagination';

export function GenreTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [queryParams, setQueryParams] = useState<GenreQueryParams>({
    page: 1,
    limit: 5,
    sortBy: 'tenloaitin',
    sortOrder: 'asc',
  });
  const [open, setOpen] = useState(false);
  const [genreToDelete, setGenreToDelete] = useState<Genre | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  const queryClient = useQueryClient();

  // Fetch genres data
  const { data, isLoading, isError } = useQuery({
    queryKey: ['genres', queryParams],
    queryFn: () => getGenres(queryParams),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const genres = data?.data || [];
  const pagination = data?.pagination || {
    page: 1,
    limit: 5,
    totalItems: 0,
    totalPages: 1,
  };

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteGenre(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['genres'] });
      toast.success('Xóa loại tin thành công');
      setOpen(false);
    },
    onError: (error) => {
      console.error('Error deleting genre:', error);
      toast.error('Có lỗi xảy ra khi xóa loại tin');
    },
  });

  // Bulk delete mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: number[]) => deleteManyGenres(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['genres'] });
      toast.success(
        `Đã xóa ${Object.keys(rowSelection).length} loại tin thành công`
      );
      setBulkDeleteOpen(false);
      setRowSelection({});
    },
    onError: (error) => {
      console.error('Error deleting multiple genres:', error);
      toast.error('Có lỗi xảy ra khi xóa loại tin');
    },
  });

  const handleDeleteGenre = (genre: Genre) => {
    deleteMutation.mutate(genre.ma);
  };

  const handleBulkDelete = () => {
    const selectedIds = Object.keys(rowSelection).map((index) => {
      return genres[Number(index)].ma;
    });
    bulkDeleteMutation.mutate(selectedIds);
  };

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: boolean }) =>
      updateGenre(id, {
        tenloaitin: genres.find((g) => g.ma === id)?.tenloaitin || '',
        trangthai: status,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['genres'] });
    },
    onError: (error) => {
      console.error('Error updating genre status:', error);
      toast.error('Có lỗi xảy ra khi cập nhật trạng thái');
    },
  });

  const toggleVisibility = (genre: Genre) => {
    const newStatus = !genre.trangthai;
    updateStatusMutation.mutate(
      { id: genre.ma, status: newStatus },
      {
        onSuccess: () => {
          toast.success(
            `Loại tin "${genre.tenloaitin}" đã được ${
              newStatus ? 'hiện' : 'ẩn'
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
        sortBy: sorting[0].id === 'name' ? 'tenloaitin' : sorting[0].id,
        sortOrder: sorting[0].desc ? 'desc' : 'asc',
        page: 1,
      }));
    }
  }, [sorting]);

  const columns: ColumnDef<Genre>[] = [
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
      accessorKey: 'tenloaitin',
      id: 'name',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Tên loại tin
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="font-medium">{row.original.tenloaitin}</div>
      ),
    },
    {
      id: 'postCount',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Số tin tức
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const postCount = row.original._count?.tin || 0;
        return <div className="max-w-[80px] text-center">{postCount}</div>;
      },
    },
    {
      id: 'status',
      header: 'Trạng thái',
      cell: ({ row }) => {
        const genre = row.original;
        const isHidden = !genre.trangthai;
        const isPending =
          updateStatusMutation.isPending &&
          updateStatusMutation.variables?.id === genre.ma;

        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleVisibility(genre)}
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
        const genre = row.original;

        return (
          <Dialog
            open={open && genreToDelete?.ma === genre.ma}
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
                  <Link href={`/admin/genre/${genre.ma}`}>Sửa</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    setGenreToDelete(genre);
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
                  Bạn có chắc chắn muốn xóa loại tin &quot;{genre.tenloaitin}
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
                  onClick={() => handleDeleteGenre(genre)}
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
    data: genres,
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
          <h1 className="text-2xl font-bold tracking-tight">Loại tin tức</h1>
          {Object.keys(rowSelection).length > 0 && (
            <Dialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  Xoá loại tin đã chọn
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Xác nhận xóa hàng loạt</DialogTitle>
                  <DialogDescription>
                    Bạn có chắc chắn muốn xóa {Object.keys(rowSelection).length}{' '}
                    loại tin đã chọn? Hành động này không thể hoàn tác.
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
              placeholder="Tìm kiếm loại tin..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button asChild>
            <Link href="/admin/genre/create">
              <PlusCircle className="mr-2 h-4 w-4" />
              Thêm loại tin
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
