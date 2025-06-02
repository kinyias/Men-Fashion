'use client';
import { getSinhVienByKhoaId } from '@/lib/api/api-sinhvien';
import { SinhVien } from '@/types/sinhvien';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import React from 'react';

export default function SinhVienPage() {
  const params = useParams<{ id: string }>();
  const khoaId = Number(params.id);
  const { data: sinhviens } = useQuery({
    queryKey: ['sinhviens', khoaId],
    queryFn: () => getSinhVienByKhoaId(khoaId!),
  });
  return (
    <div>
      <table>
        <tr>
          <th>ma</th>
          <th>ten</th>
          <th>diem</th>
        </tr>
        {sinhviens?.map((item: SinhVien) => (
          <tr key={item.ma}>
            <td>{item.ma}</td>
            <td>{item.ten}</td>
            <td>{item.diem}</td>
          </tr>
        ))}
      </table>
    </div>
  );
}
