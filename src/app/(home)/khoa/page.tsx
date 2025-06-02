'use client';
import { Button } from '@/components/ui/button';
import { getAllKhoa } from '@/lib/api/api-khoa';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import React from 'react';

export default function KhoaPage() {
  const { data: khoa } = useQuery({
    queryKey: ['khoa'],
    queryFn: () => getAllKhoa(),
  });
  return (
    <div>
      <table>
        <tr>
          <th>ma</th>
          <th>ten</th>
          <th>actions</th>
        </tr>
        {khoa?.map((item) => (
          <tr key={item.ma}>
            <td>{item.ma}</td>
            <td>{item.ten}</td>
            <td>
              <Link href={`/khoa/${item.ma}`}>
                <Button>DSSV</Button>
              </Link>
            </td>
          </tr>
        ))}
      </table>
    </div>
  );
}
