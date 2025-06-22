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
export interface ViettelPostBillItem {
  PRODUCT_NAME: string;
  PRODUCT_PRICE: number;
  PRODUCT_WEIGHT: number;
  PRODUCT_QUANTITY: number;
}
export interface ViettelPostBillRequest {
  ORDER_NUMBER: string;
  GROUPADDRESS_ID: number;
  CUS_ID: number;
  DELIVERY_DATE: string;
  SENDER_FULLNAME: string;
  SENDER_ADDRESS: string;
  SENDER_EMAIL: string;
  SENDER_WARD: number;
  SENDER_DISTRICT: number;
  SENDER_PROVINCE: number;
  RECEIVER_FULLNAME: string;
  RECEIVER_ADDRESS: string;
  RECEIVER_PHONE: string;
  RECEIVER_EMAIL: string;
  PRODUCT_TYPE: string;
  ORDER_PAYMENT: number;
  ORDER_SERVICE: string;
  ORDER_SERVICE_ADD: string;
  ORDER_VOUCHER: string;
  ORDER_NOTE: string;
  MONEY_COLLECTION: number;
  MONEY_TOTALFEE: number;
  MONEY_FEECOD: number;
  MONEY_FEEVAS: number;
  MONEY_FEEINSURRANCE: number;
  MONEY_FEE: number;
  MONEY_FEEOTHER: number;
  MONEY_TOTALVAT: number;
  MONEY_TOTAL: number;
  LIST_ITEM: ViettelPostBillItem[];
}

export interface ViettelPostBillResponse {
  status: number;
  error: boolean;
  message: string;
  data: {
    data:{
      ORDER_NUMBER: string;
      MONEY_COLLECTION: number;
      EXCHANGE_WEIGHT: number;
      MONEY_TOTAL: number;
      MONEY_TOTAL_FEE: number;
      MONEY_FEE: number;
      MONEY_COLLECTION_FEE: number;
      MONEY_OTHER_FEE: number;
      MONEY_VAS: number;
      MONEY_VAT: number;
      KPI_HT: number;
      RECEIVER_PROVINCE: number;
      RECEIVER_DISTRICT: number;
      RECEIVER_WARDS: number;
    }
  };
}
