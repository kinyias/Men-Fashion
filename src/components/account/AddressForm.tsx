'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createAddress, updateAddress, getProvinces, getDistricts, getWards } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { Address, AddressFormValues } from '@/types/address';
import { addressFormSchema } from '@/lib/validations/address.validator';
import { Save, X } from 'lucide-react';

interface AddressFormProps {
  isAddingNew: boolean;
  setIsAddingNew: (isAddingNew: boolean) => void;
  setEditingId: (editingId: number | null) => void;
  editingId: number | null;
  initialData?: Partial<Address>;
}

export default function AddressForm({
  isAddingNew,
  setIsAddingNew,
  setEditingId,
  editingId,
  initialData,
}: AddressFormProps) {
  const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);
  const hasSetInitialValues = useRef(false);
  const queryClient = useQueryClient();
  const createAddressMutation = useMutation({
    mutationFn: (data: AddressFormValues) => createAddress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('Địa chỉ đã được thêm thành công');
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Có lỗi xảy ra khi thêm địa chỉ'
      );
    },
  });

  const updateAddressMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: AddressFormValues }) =>
      updateAddress(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('Địa chỉ đã được cập nhật thành công');
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật địa chỉ'
      );
    },
  });

  // Fetch provinces
  const { data: provincesData } = useQuery({
    queryKey: ['provinces'],
    queryFn: () => getProvinces(),
  });

  // Fetch districts based on selected province
  const { data: districtsData } = useQuery({
    queryKey: ['districts', selectedProvince],
    queryFn: () => getDistricts({ provinceId: selectedProvince! }),
    enabled: !!selectedProvince,
  });

  // Fetch wards based on selected district
  const { data: wardsData } = useQuery({
    queryKey: ['wards', selectedDistrict],
    queryFn: () => getWards({ districtId: selectedDistrict! }),
    enabled: !!selectedDistrict,
  });

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: initialData || {
      tennguoinhan: '',
      email: '',
      sodienthoai: '',
      diachi: '',
      phuongxa: '',
      quanhuyen: '',
      tinhthanh: '',
      macdinh: true,
      loaidiachi: 'NHA',
    },
  });

  useEffect(() => {
    if (!initialData || !provincesData?.data || hasSetInitialValues.current) return;
  
    // Find province ID from name
    const province = provincesData.data.find(
      (p) => p.PROVINCE_NAME === initialData.tinhthanh
    );
    if (!province) return;
  
    // Set province
    setSelectedProvince(province.PROVINCE_ID);
    form.setValue('tinhthanh', province.PROVINCE_ID.toString());
  
    // Only proceed with district if province is set and districts data is available
    if (!districtsData?.data) return;
  
    const district = districtsData.data.find(
      (d) => d.DISTRICT_NAME === initialData.quanhuyen
    );
    if (!district) return;
  
    // Set district
    setSelectedDistrict(district.DISTRICT_ID);
    form.setValue('quanhuyen', district.DISTRICT_ID.toString());
  
    // Only proceed with ward if district is set and wards data is available
    if (!wardsData?.data) return;
  
    const ward = wardsData.data.find(
      (w) => w.WARDS_NAME === initialData.phuongxa
    );
    if (!ward) return;
  
    // Set ward
    form.setValue('phuongxa', ward.WARDS_ID.toString());
  
    hasSetInitialValues.current = true;
  }, [initialData, provincesData, districtsData, wardsData, form]);

  const isCreating = createAddressMutation.isPending;
  const isUpdating = updateAddressMutation.isPending;

  const onSubmit = async (data: AddressFormValues) => {
    try {
      // Get the province name from the selected province ID
      const selectedProvinceName =
        provincesData?.data.find(
          (province) => province.PROVINCE_ID.toString() === data.tinhthanh
        )?.PROVINCE_NAME || '';

      // Get the district name from the selected district ID
      const selectedDistrictName =
        districtsData?.data.find(
          (district) => district.DISTRICT_ID.toString() === data.quanhuyen
        )?.DISTRICT_NAME || '';

      // Get the ward name from the selected ward ID
      const selectedWardName =
        wardsData?.data.find(
          (ward) => ward.WARDS_ID.toString() === data.phuongxa
        )?.WARDS_NAME || '';

      // Create modified data with names instead of IDs
      const modifiedData = {
        ...data,
        tinhthanh: selectedProvinceName,
        quanhuyen: selectedDistrictName,
        phuongxa: selectedWardName,
      };

      if (isAddingNew) {
        await createAddressMutation.mutateAsync(modifiedData);
      } else if (editingId) {
        await updateAddressMutation.mutateAsync({
          id: editingId,
          data: modifiedData,
        });
      }
      handleCancel();
    } catch (error) {
      console.log(error)
      // Error is handled by the mutation
    }
  };

  const handleCancel = () => {
    setIsAddingNew(false);
    setEditingId(null);
    form.reset();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isAddingNew ? 'Thêm địa chỉ mới' : 'Chỉnh sửa địa chỉ'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="tennguoinhan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên người nhận</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email (tùy chọn)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sodienthoai"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="diachi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="tinhthanh"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tỉnh/Thành phố</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedProvince(Number(value));
                        setSelectedDistrict(null);
                        form.setValue('quanhuyen', '');
                        form.setValue('phuongxa', '');
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Chọn tỉnh/thành phố" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {provincesData?.data.map((province) => (
                          <SelectItem
                            key={province.PROVINCE_ID}
                            value={province.PROVINCE_ID.toString()}
                          >
                            {province.PROVINCE_NAME}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quanhuyen"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quận/Huyện</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedDistrict(Number(value));
                        form.setValue('phuongxa', '');
                      }}
                      value={field.value}
                      disabled={!selectedProvince}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Chọn quận/huyện" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {districtsData?.data.map((district) => (
                          <SelectItem
                            key={district.DISTRICT_ID}
                            value={district.DISTRICT_ID.toString()}
                          >
                            {district.DISTRICT_NAME}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phuongxa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phường/Xã</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!selectedDistrict}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Chọn phường/xã" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {wardsData?.data.map((ward) => (
                          <SelectItem
                            key={ward.WARDS_ID}
                            value={ward.WARDS_ID.toString()}
                          >
                            {ward.WARDS_NAME}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="loaidiachi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loại địa chỉ</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại địa chỉ" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="NHA">Nhà riêng</SelectItem>
                      <SelectItem value="VAN_PHONG">Văn phòng</SelectItem>
                      <SelectItem value="KHAC">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="macdinh"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Đặt làm địa chỉ mặc định</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={isCreating || isUpdating}>
                <Save className="h-4 w-4 mr-2" />
                {isCreating || isUpdating ? 'Đang xử lý...' : 'Lưu địa chỉ'}
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Hủy
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
