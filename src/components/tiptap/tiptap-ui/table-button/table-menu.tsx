"use client";

import React from "react";
import { Editor } from "@tiptap/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  Grid3X3,
  RowsIcon,
  Columns,
  Trash,
  MergeIcon,
  SplitIcon,
} from "lucide-react";
interface TableMenuProps {
  editor: Editor | null;
}

export function TableMenu({ editor }: TableMenuProps) {
  if (!editor) return null;

  const isTableSelected = editor.isActive("table");

  if (!isTableSelected) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1 border-dashed"
        >
          <Grid3X3 className="h-4 w-4" />
          Bảng
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuItem
          className="flex gap-1"
          onClick={() => editor.chain().focus().addColumnBefore().run()}
          disabled={!editor.can().addColumnBefore()}
        >
          <Columns className="h-4 w-4" /> Thêm cột trước
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex gap-1"
          onClick={() => editor.chain().focus().addColumnAfter().run()}
          disabled={!editor.can().addColumnAfter()}
        >
          <Columns className="h-4 w-4" /> Thêm cột sau
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex gap-1"
          onClick={() => editor.chain().focus().deleteColumn().run()}
          disabled={!editor.can().deleteColumn()}
        >
          <Trash className="h-4 w-4" /> Xóa cột
        </DropdownMenuItem>

        <DropdownMenuItem
          className="flex gap-1"
          onClick={() => editor.chain().focus().addRowBefore().run()}
          disabled={!editor.can().addRowBefore()}
        >
          <RowsIcon className="h-4 w-4" /> Thêm hàng trên
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex gap-1"
          onClick={() => editor.chain().focus().addRowAfter().run()}
          disabled={!editor.can().addRowAfter()}
        >
          <RowsIcon className="h-4 w-4" /> Thêm hàng dưới
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex gap-1"
          onClick={() => editor.chain().focus().deleteRow().run()}
          disabled={!editor.can().deleteRow()}
        >
          <Trash className="h-4 w-4" /> Xóa hàng
        </DropdownMenuItem>

        <DropdownMenuItem
          className="flex gap-1"
          onClick={() => editor.chain().focus().mergeCells().run()}
          disabled={!editor.can().mergeCells()}
        >
          <MergeIcon className="h-4 w-4" /> Gộp
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex gap-1"
          onClick={() => editor.chain().focus().splitCell().run()}
          disabled={!editor.can().splitCell()}
        >
          <SplitIcon className="h-4 w-4" /> Tách
        </DropdownMenuItem>

        {/* <DropdownMenuItem
          className="flex gap-1"
          onClick={() => editor.chain().focus().setCellAttribute('backgroundColor', '#f8f9fa').run()}
        >
          <div className="h-4 w-4 bg-gray-100 rounded border border-gray-200" /> Light background
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex gap-1"
          onClick={() => editor.chain().focus().setCellAttribute('backgroundColor', 'transparent').run()}
        >
          <div className="h-4 w-4 bg-transparent rounded border border-gray-200" /> Clear background
        </DropdownMenuItem> */}

        <DropdownMenuItem
          className="flex gap-1"
          onClick={() => editor.chain().focus().deleteTable().run()}
          disabled={!editor.can().deleteTable()}
        >
          <Trash className="h-4 w-4" /> Xóa bảng
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}