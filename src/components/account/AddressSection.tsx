'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Plus, Edit, Trash2, Home, Building } from 'lucide-react';
import AddressForm from './AddressForm';
import { Address } from '@/types/address';
import { Skeleton } from '@/components/ui/skeleton';
import { deleteAddress, getAddresses } from '@/lib/api/api-address';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import EllipsisPagination from '../ui/EllipsisPagination';

export function AddressSection() {
  const queryClient = useQueryClient();
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<number | null>(null);
  const [page, setPage] = useState(1);

  const { data: userAddresses, isLoading } = useQuery({
    queryKey: ['addresses', page],
    queryFn: () => getAddresses({ page, limit: 6 }),
  });

  const deleteAddressMutation = useMutation({
    mutationFn: (id: number) => deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('Địa chỉ đã được xóa thành công');
      setDeleteDialogOpen(false);
      setAddressToDelete(null);
    },
  });

  const handleAddNew = () => {
    setIsAddingNew(true);
    setEditingId(null);
    setEditingAddress(null);
  };

  const handleEdit = (address: Address) => {
    setEditingId(address.ma);
    setEditingAddress(address);
    setIsAddingNew(false);
  };

  const handleDelete = (id: number) => {
    setAddressToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (addressToDelete) {
      await deleteAddressMutation.mutateAsync(addressToDelete);
    }
  };

  const isDeleting = deleteAddressMutation.isPending;
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Sổ địa chỉ
              </CardTitle>
              <CardDescription>
                Quản lý địa chỉ giao hàng của bạn
              </CardDescription>
            </div>
            {!isAddingNew && !editingId && (
              <Button onClick={handleAddNew}>
                <Plus className="h-4 w-4 mr-2" />
                Thêm địa chỉ
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Add/Edit Form */}
      {(isAddingNew || editingId) && (
        <AddressForm
          isAddingNew={isAddingNew}
          setIsAddingNew={setIsAddingNew}
          setEditingId={setEditingId}
          editingId={editingId}
          initialData={editingAddress || undefined}
        />
      )}

      {/* Address List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {userAddresses?.data.map((address) => {
          const Icon = address.loaidiachi === 'NHA' ? Home : Building;

          return (
            <Card key={address.ma} className="relative">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    <h3 className="font-semibold">
                      {address.loaidiachi === 'NHA'
                        ? 'Nhà riêng'
                        : address.loaidiachi === 'VAN_PHONG'
                        ? 'Văn phòng'
                        : 'Khác'}
                    </h3>
                  </div>

                  {address.macdinh && (
                    <Badge variant="default" className="text-xs">
                      Mặc định
                    </Badge>
                  )}
                </div>

                <div className="space-y-1 text-sm">
                  <p className="font-medium">{address.tennguoinhan}</p>
                  {address.email && (
                    <p className="text-muted-foreground">{address.email}</p>
                  )}
                  <p>{address.diachi}</p>
                  <p>
                    {address.phuongxa}, {address.quanhuyen}, {address.tinhthanh}
                  </p>
                  <p className="text-muted-foreground">{address.sodienthoai}</p>
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(address)}
                    disabled={isDeleting}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Chỉnh sửa
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(address.ma)}
                    disabled={isDeleting}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Pagination */}
      {userAddresses?.pagination && userAddresses.pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <EllipsisPagination
              currentPage={page}
              totalPages={userAddresses.pagination.totalPages}
              onPageChange={(newPage) => setPage(newPage)}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa địa chỉ</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa địa chỉ này? Hành động này không thể
              hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Đang xóa...' : 'Xóa'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {userAddresses?.data.length === 0 && !isAddingNew && (
        <Card>
          <CardContent className="text-center py-12">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Chưa có địa chỉ nào</h3>
            <p className="text-muted-foreground mb-4">
              Thêm địa chỉ đầu tiên để thanh toán nhanh hơn
            </p>
            <Button onClick={handleAddNew}>
              <Plus className="h-4 w-4 mr-2" />
              Thêm địa chỉ đầu tiên
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
