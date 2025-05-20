import { z } from "zod";

export enum LoaiKhuyenMai {
    PHAN_TRAM = "phan_tram",
    SO_TIEN_CO_DINH = "tien_mat",
  }
  
  export  const couponsSchema = z
    .object({
      ten: z.string().min(2, {
        message: "Tên khuyến mãi phải có ít nhất 2 ký tự.",
      }),
      loaikhuyenmai: z.nativeEnum(LoaiKhuyenMai, {
        message: "Vui lòng chọn loại khuyến mãi.",
      }),
      giatrigiam: z.coerce.number().positive({
        message: "Giá trị giảm phải là số dương.",
      }),
      giatridonhang: z.coerce.number().positive({
        message: "Giá trị đơn hàng phải là số dương.",
      }),
      ngaybatdat: z.date({
        required_error: "Vui lòng chọn ngày bắt đầu.",
      }),
      ngayketthuc: z.date({
        required_error: "Vui lòng chọn ngày kết thúc.",
      }),
    })
    .refine((data) => data.ngayketthuc > data.ngaybatdat, {
      message: "Ngày kết thúc phải sau ngày bắt đầu.",
      path: ["ngayketthuc"],
    })