import api from '@/lib/axios-client';
import { 
  ViettelPostProvinceResponse, 
  ViettelPostDistrictResponse,
  ViettelPostWardResponse,
  ViettelPostQueryParams,
  ViettelPostLoginRequest,
  ViettelPostLoginResponse,
  ViettelPostPriceRequest,
  ViettelPostPriceResponse
} from '@/types/viettelpost';

export const getProvinces = async (
  queryParams?: ViettelPostQueryParams
): Promise<ViettelPostProvinceResponse> => {
  const params = new URLSearchParams();
  if (queryParams?.provinceId !== undefined) {
    params.append('provinceId', queryParams.provinceId.toString());
  }

  const response = await api.get(`${process.env.VIETTEL_POST_URL}/v2/categories/listProvinceById?${params.toString()}`);
  return response.data;
};

export const getDistricts = async (
  queryParams?: ViettelPostQueryParams
): Promise<ViettelPostDistrictResponse> => {
  const params = new URLSearchParams();
  if (queryParams?.provinceId !== undefined) {
    params.append('provinceId', queryParams.provinceId.toString());
  }

  const response = await api.get(`${process.env.VIETTEL_POST_URL}/v2/categories/listDistrict?${params.toString()}`);
  return response.data;
};

export const getWards = async (
  queryParams?: ViettelPostQueryParams
): Promise<ViettelPostWardResponse> => {
  const params = new URLSearchParams();
  if (queryParams?.districtId !== undefined) {
    params.append('districtId', queryParams.districtId.toString());
  }

  const response = await api.get(`${process.env.VIETTEL_POST_URL}/v2/categories/listWards?${params.toString()}`);
  return response.data;
};

export const login = async (
  credentials: ViettelPostLoginRequest
): Promise<ViettelPostLoginResponse> => {
  const response = await api.post(
    `${process.env.VIETTEL_POST_URL}/v2/user/Login`,
    credentials
  );
  return response.data;
};

export const calculatePrice = async (
  priceRequest: ViettelPostPriceRequest,
): Promise<ViettelPostPriceResponse> => {
    const loginResponse = await login({
        USERNAME: process.env.VIETTEL_POST_USERNAME || 'email@gmail.com',
        PASSWORD: process.env.VIETTEL_POST_PASSWORD || 'password'
      });
  const response = await api.post(
    `${process.env.VIETTEL_POST_URL}/v2/order/getPrice`,
    priceRequest,
    {
      headers: {
        'Authorization': loginResponse.data.token
      }
    }
  );
  return response.data;
};