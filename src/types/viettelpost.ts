export interface ViettelPostProvince {
  PROVINCE_ID: number;
  PROVINCE_CODE: string;
  PROVINCE_NAME: string;
}

export interface ViettelPostDistrict {
  DISTRICT_ID: number;
  DISTRICT_VALUE: string;
  DISTRICT_NAME: string;
  PROVINCE_ID: number;
}

export interface ViettelPostWard {
  WARDS_ID: number;
  WARDS_NAME: string;
  DISTRICT_ID: number;
}

export interface ViettelPostProvinceResponse {
  status: number;
  error: boolean;
  message: string;
  data: ViettelPostProvince[];
}

export interface ViettelPostDistrictResponse {
  status: number;
  error: boolean;
  message: string;
  data: ViettelPostDistrict[];
}

export interface ViettelPostWardResponse {
  status: number;
  error: boolean;
  message: string;
  data: ViettelPostWard[];
}

export interface ViettelPostQueryParams {
  provinceId?: number;
  districtId?: number;
}


export interface ViettelPostLoginRequest {
  USERNAME: string;
  PASSWORD: string;
}

export interface ViettelPostLoginResponse {
  status: number;
  error: boolean;
  message: string;
  data: {
    userId: number;
    token: string;
    partner: number;
    phone: string;
    expired: number;
    encrypted: string | null;
    source: number;
  };
}

export interface ViettelPostPriceRequest {
  PRODUCT_WEIGHT: number;
  PRODUCT_PRICE: number;
  MONEY_COLLECTION: number;
  ORDER_SERVICE_ADD: string;
  ORDER_SERVICE: string;
  SENDER_PROVINCE: string;
  SENDER_DISTRICT: string;
  RECEIVER_PROVINCE: string;
  RECEIVER_DISTRICT: string;
  PRODUCT_TYPE: string;
  NATIONAL_TYPE: number;
}

export interface ViettelPostPriceResponse {
  status: number;
  error: boolean;
  message: string;
  data: ViettelPostPrice[];
}

export interface ViettelPostPrice {
    service: string;
    MONEY_TOTAL_OLD: number;
    MONEY_TOTAL: number;
    MONEY_TOTAL_FEE: number;
    MONEY_FEE: number;
    MONEY_COLLECTION_FEE: number;
    MONEY_OTHER_FEE: number;
    MONEY_VAS: number;
    MONEY_VAT: number;
    KPI_HT: number;
  }