import { z } from "zod";

export const productFormSchema = z.object({
  ten: z.string().min(2, {
    message: "Tên sản phẩm phải có ít nhất 2 kí tự.",
  }),
  mota: z.string().min(10, {
    message: "Mô tả phải có ít nhất 10 kí tự.",
  }).optional(),
  giaban: z.coerce.number().positive({
    message: "Giá bán phải là số dương.",
  }),
  giagiam: z.coerce.number().positive({
    message: "Giá giảm phải là số dương.",
  }).optional(),
  hinhanh: z.string().optional(),
  noibat: z.boolean(),
  trangthai: z.boolean(),
  madanhmuc: z.coerce.number({
    required_error: "Vui lòng chọn danh mục.",
  }),
  maloaisanpham: z.coerce.number({
    required_error: "Vui lòng chọn loại sản phẩm.",
  }),
  mathuonghieu: z.coerce.number({
    required_error: "Vui lòng chọn thương hiệu.",
  }),
});

export const bienTheSchema = z.object({
  gia: z.coerce.number().positive({
    message: "Giá phải là số dương.",
  }),
  soluong: z.coerce.number().nonnegative({
    message: "Số lượng không được âm.",
  }),
  masp: z.coerce.number(),
  mamausac: z.coerce.number({
    required_error: "Vui lòng chọn màu sắc.",
  }),
  makichco: z.coerce.number({
    required_error: "Vui lòng chọn kích cỡ.",
  }),
});

export const hinhAnhSchema = z.object({
  url: z.string({
    required_error: "URL hình ảnh là bắt buộc.",
  }),
  anhChinh: z.boolean().default(false),
});

export const mauSacWithHinhAnhSchema = z.object({
  ma: z.coerce.number({
    required_error: "Mã màu sắc là bắt buộc.",
  }),
  hinhAnhs: z.array(hinhAnhSchema).optional(),
});

export const createProductSchema = productFormSchema.extend({
  bienThes: z.array(bienTheSchema).optional(),
  mauSacs: z.array(mauSacWithHinhAnhSchema).optional(),
});

export type CreateProductFormValues = z.infer<typeof createProductSchema>;