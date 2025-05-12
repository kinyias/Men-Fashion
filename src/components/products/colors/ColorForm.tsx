import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { colorFormSchema } from '@/lib/validations/color.validator';
import { MauSac, MauSacFormValues } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

interface ColorFormProps {
  initialData?: MauSac;
  onSubmit: (data: MauSacFormValues) => Promise<void>;
  isSubmitting: boolean;
}

export function ColorForm({ initialData, onSubmit, isSubmitting }: ColorFormProps) {
  const router = useRouter();
  const [colorPreview, setColorPreview] = useState<string>(initialData?.ma_mau || '#000000');
  
  const form = useForm<MauSacFormValues>({
    resolver: zodResolver(colorFormSchema),
    defaultValues: {
      ten: initialData?.ten || '',
      ma_mau: initialData?.ma_mau || '#000000',
    },
  });

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setColorPreview(value);
    form.setValue('ma_mau', value);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
       
 <Card>
          {/* <CardHeader>
            <CardTitle>{isEditMode ? 'Cập nhật kích cỡ' : 'Thông tin kích cỡ'}</CardTitle>
          </CardHeader> */}
          <CardContent className="space-y-6">
          <FormField
          control={form.control}
          name="ten"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên màu sắc</FormLabel>
              <FormControl>
                <Input placeholder="Nhập tên màu sắc" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="ma_mau"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mã màu</FormLabel>
              <div className="flex items-center gap-4">
                <FormControl>
                  <Input 
                    type="text" 
                    placeholder="#RRGGBB" 
                    {...field} 
                    onChange={handleColorChange}
                  />
                </FormControl>
                <div 
                  className="h-10 w-10 rounded-md border" 
                  style={{ backgroundColor: colorPreview }}
                />
                <Input 
                  type="color" 
                  value={colorPreview}
                  onChange={handleColorChange}
                  className="w-12 h-10 p-1 cursor-pointer"
                />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
          </CardContent>
          <CardFooter className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Hủy
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? 'Cập nhật' : 'Tạo mới'}
          </Button>
          </CardFooter>
        </Card>
        <div className="flex justify-end gap-4">
         
        </div>
      </form>
    </Form>
  );
}