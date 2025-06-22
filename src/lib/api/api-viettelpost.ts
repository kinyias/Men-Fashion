import axios from 'axios';
import { 
    ViettelPostProvinceResponse, 
    ViettelPostDistrictResponse,
  ViettelPostWardResponse,
  ViettelPostQueryParams,
  ViettelPostLoginRequest,
  ViettelPostLoginResponse,
  ViettelPostPriceRequest,
  ViettelPostPriceResponse,
  ViettelPostBillRequest,
  ViettelPostBillResponse
} from '@/types/viettelpost';
  const api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_VIETTEL_POST_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

export const getProvinces = async (
): Promise<ViettelPostProvinceResponse> => {
  const response = await api.get(`/v2/categories/listProvinceById?provinceId=-1`);
  return response.data;
};

export const getDistricts = async (
  queryParams?: ViettelPostQueryParams
): Promise<ViettelPostDistrictResponse> => {
  const params = new URLSearchParams();
  if (queryParams?.provinceId !== undefined) {
    params.append('provinceId', queryParams.provinceId.toString());
  }

  const response = await api.get(`/v2/categories/listDistrict?${params.toString()}`);
  return response.data;
};

export const getWards = async (
  queryParams?: ViettelPostQueryParams
): Promise<ViettelPostWardResponse> => {
  const params = new URLSearchParams();
  if (queryParams?.districtId !== undefined) {
    params.append('districtId', queryParams.districtId.toString());
  }

  const response = await api.get(`/v2/categories/listWards?${params.toString()}`);
  return response.data;
};

export const login = async (
  credentials: ViettelPostLoginRequest
): Promise<ViettelPostLoginResponse> => {
  const response = await api.post(
    `/v2/user/Login`,
    credentials
  );
  return response.data;
};

export const calculatePrice = async (
  priceRequest: ViettelPostPriceRequest,
): Promise<ViettelPostPriceResponse> => {
  const response = await axios.post(
    `/api/proxy-calculate-price`,
    priceRequest
  );
  return response.data;
};

export const createBill = async (
  billRequest: ViettelPostBillRequest
): Promise<ViettelPostBillResponse> => {
  const response = await axios.post(
    `/api/proxy-create-bill`,
    billRequest
  );
  return response.data;
};