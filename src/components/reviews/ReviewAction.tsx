'use client';

import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { DanhGia } from '@/types';

interface ReviewActionsProps {
  review: DanhGia;
  onDelete: (id: number) => void;
}

export function ReviewActions({ review, onDelete }: ReviewActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="mr-2 h-4 w-4" />
          Xóa
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bạn có chắc chắn muốn xóa đánh giá này?</DialogTitle>
          <DialogDescription>
            Hành động này không thể hoàn tác. Đánh giá này sẽ bị xóa vĩnh viễn
            khỏi cơ sở dữ liệu.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
            Hủy
          </Button>
          <Button variant="destructive" onClick={() => onDelete(review.ma)}>
            Xóa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
