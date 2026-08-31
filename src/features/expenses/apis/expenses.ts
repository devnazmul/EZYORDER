// 3. External libraries / config
import axiosClient from "@/config/axiosClient";

// 6. Types
import type {
  ICreateExpensePayload,
  IExpenseListParams,
  IExpenseListResponse,
  IExpenseMatrixParams,
  IExpenseMatrixResponse,
  IExpenseMutationResponse,
  IExpenseTrendParams,
  IExpenseTrendResponse,
  IExpenseTypesParams,
  IExpenseTypesResponse,
  IPaymentMethodBreakdownParams,
  IPaymentMethodBreakdownResponse,
  IUpdateExpensePayload,
  IUploadReceiptResponse,
} from "../types/expenses.types";

// GET ALL EXPENSES FOR A RESTAURANT
export const getExpenses = async (
  restaurantId: number | string,
  perPage: number = 20,
  params: Partial<IExpenseListParams> = {},
): Promise<IExpenseListResponse | null> => {
  const mergedParams: Record<string, unknown> = {
    order_by: "asc",
    page: 1,
    ...params,
  };

  // Remove empty string / null / undefined values so query filters work cleanly
  Object.keys(mergedParams).forEach((key) => {
    const val = mergedParams[key];
    if (val === "" || val === null || val === undefined) {
      delete mergedParams[key];
    }
  });

  const response = await axiosClient.get<IExpenseListResponse>(
    `/v1.0/expenses/${restaurantId}/${perPage}`,
    {
      params: mergedParams,
      validateStatus: () => true,
    },
  );
  return response.status === 200 && response.data ? response.data : null;
};

// GET ALL EXPENSE TYPES FOR A RESTAURANT
export const getExpenseTypes = async (
  restaurantId: number | string,
  perPage: number = 1000,
  params: Partial<IExpenseTypesParams> = {},
): Promise<IExpenseTypesResponse | null> => {
  const response = await axiosClient.get<IExpenseTypesResponse>(
    `/v1.0/expense-types/${restaurantId}/${perPage}`,
    {
      params,
      validateStatus: () => true,
    },
  );
  return response.status === 200 && response.data ? response.data : null;
};

// GET ALL EXPENSE MATRIX (KPI SUMMARY)
export const getExpenseMatrix = async (
  params: IExpenseMatrixParams = {},
): Promise<IExpenseMatrixResponse | null> => {
  const response = await axiosClient.get<IExpenseMatrixResponse>(
    "/v1.0/expenses/matrix",
    {
      params,
      validateStatus: () => true,
    },
  );
  return response.status === 200 && response.data ? response.data : null;
};

// GET EXPENSE PAYMENT METHOD BREAKDOWN
export const getExpensePaymentMethodBreakdown = async (
  params: IPaymentMethodBreakdownParams = {},
): Promise<IPaymentMethodBreakdownResponse | null> => {
  const response = await axiosClient.get<IPaymentMethodBreakdownResponse>(
    "/v1.0/expenses/payment-method-breakdown",
    {
      params,
      validateStatus: () => true,
    },
  );
  return response.status === 200 && response.data ? response.data : null;
};

// GET EXPENSE TREND
export const getExpenseTrend = async (
  params: IExpenseTrendParams = {},
): Promise<IExpenseTrendResponse | null> => {
  const response = await axiosClient.get<IExpenseTrendResponse>(
    "/v1.0/expenses/trend",
    {
      params,
      validateStatus: () => true,
    },
  );
  return response.status === 200 && response.data ? response.data : null;
};

// CREATE EXPENSE
export const createExpense = async (
  payload: ICreateExpensePayload,
): Promise<IExpenseMutationResponse> => {
  const response = await axiosClient.post<IExpenseMutationResponse>(
    "/v1.0/expenses",
    payload,
    { validateStatus: (status) => status < 400 },
  );
  return response.data;
};

// UPDATE EXPENSE
export const updateExpense = async (
  payload: IUpdateExpensePayload,
): Promise<IExpenseMutationResponse> => {
  const response = await axiosClient.put<IExpenseMutationResponse>(
    "/v1.0/expenses",
    payload,
    { validateStatus: (status) => status < 400 },
  );
  return response.data;
};

// UPLOAD RECEIPT FILE
export const uploadReceiptFile = async (
  fileUri: string,
  fileName?: string,
  mimeType?: string,
): Promise<string | null> => {
  const formData = new FormData();
  const name = fileName || fileUri.split("/").pop() || "receipt.jpg";

  let type = mimeType;
  if (!type) {
    const lowerName = name.toLowerCase();
    if (lowerName.endsWith(".png")) type = "image/png";
    else if (lowerName.endsWith(".pdf")) type = "application/pdf";
    else if (lowerName.endsWith(".webp")) type = "image/webp";
    else type = "image/jpeg";
  }

  formData.append("file", {
    uri: fileUri,
    name,
    type,
  } as unknown as Blob);

  const response = await axiosClient.post<IUploadReceiptResponse>(
    "/v1.0/payments-invoice-file",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      validateStatus: () => true,
    },
  );

  const location =
    response.data?.data?.full_location || response.data?.full_location;

  if ((response.status === 200 || response.status === 201) && location) {
    return location;
  }
  return null;
};
