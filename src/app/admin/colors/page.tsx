import { Metadata } from 'next';
import { ColorTable } from '@/components/products/colors/ColorTable';

export const metadata: Metadata = {
  title: 'Quản lý màu sắc',
  description: 'Quản lý danh sách màu sắc trong hệ thống',
};

export default function ColorsPage() {
  return (
    <div className="container mx-auto py-6">
      <ColorTable />
    </div>
  );
}