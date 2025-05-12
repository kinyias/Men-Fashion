export interface ApiError {
    message: string;
    errors?: Array<{
      param: string;
      msg: string;
    }>;
  }