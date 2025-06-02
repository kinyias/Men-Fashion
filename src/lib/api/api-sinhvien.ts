import { SinhVien } from "@/types/sinhvien";
import api from "../axios-client";

export const getSinhVienByKhoaId = async (id: number): Promise<SinhVien[]> => {
  const response = await api.get(`/api/sinhvien/${id}`);
  return response.data;
};