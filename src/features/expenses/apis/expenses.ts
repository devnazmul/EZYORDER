// 3. External libraries / config
import axiosClient from "@/config/axiosClient";

// 6. Types
import type {
  ICreateExpensePayload,
  ICreateExpenseTypePayload,
  IExpenseListParams,
  IExpenseListResponse,
  IExpenseMatrixParams,
  IExpenseMatrixResponse,
  IExpenseMutationResponse,
  IExpenseTrendParams,
  IExpenseTrendResponse,
  IExpenseTypeMutationResponse,
  IExpenseTypesParams,
  IExpenseTypesResponse,
  IPaymentMethodBreakdownParams,
  IPaymentMethodBreakdownResponse,
  IUpdateExpensePayload,
  IUpdateExpenseTypePayload,
  IUploadReceiptResponse,
} from "../types/expenses.types";

// GET ALL EXPENSES FOR A RESTAURANT
export const getExpenses = async (
  restaurantId: number | string,
  perPage: number = 20,
  params: Partial<IExpenseListParams> = {},
): Promise<IExpenseListResponse> => {
  const mergedParams: Record<string, unknown> = {
    order_by: "desc",
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
      validateStatus: (status) => status < 400,
    },
  );
  return response.data;
};

// GET ALL EXPENSE TYPES FOR A RESTAURANT
export const getExpenseTypes = async (
  restaurantId: number | string,
  perPage: number = 1000,
  params: Partial<IExpenseTypesParams> = {},
): Promise<IExpenseTypesResponse> => {
  const response = await axiosClient.get<IExpenseTypesResponse>(
    `/v1.0/expense-types/${restaurantId}/${perPage}`,
    {
      params,
      validateStatus: (status) => status < 400,
    },
  );
  return response.data;
};

// GET ALL EXPENSE MATRIX (KPI SUMMARY)
export const getExpenseMatrix = async (
  params: IExpenseMatrixParams = {},
): Promise<IExpenseMatrixResponse> => {
  const response = await axiosClient.get<IExpenseMatrixResponse>(
    "/v1.0/expenses/matrix",
    {
      params,
      validateStatus: (status) => status < 400,
    },
  );
  return response.data;
};

// GET EXPENSE PAYMENT METHOD BREAKDOWN
export const getExpensePaymentMethodBreakdown = async (
  params: IPaymentMethodBreakdownParams = {},
): Promise<IPaymentMethodBreakdownResponse> => {
  const response = await axiosClient.get<IPaymentMethodBreakdownResponse>(
    "/v1.0/expenses/payment-method-breakdown",
    {
      params,
      validateStatus: (status) => status < 400,
    },
  );
  return response.data;
};

// GET EXPENSE TREND
export const getExpenseTrend = async (
  params: IExpenseTrendParams = {},
): Promise<IExpenseTrendResponse> => {
  const response = await axiosClient.get<IExpenseTrendResponse>(
    "/v1.0/expenses/trend",
    {
      params,
      validateStatus: (status) => status < 400,
    },
  );
  return response.data;
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
): Promise<string> => {
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
      validateStatus: (status) => status < 400,
    },
  );

  const location =
    response.data?.data?.full_location || response.data?.full_location;

  if (location) {
    return location;
  }
  throw new Error("Failed to retrieve uploaded receipt file location.");
};

// CREATE EXPENSE TYPE
export const createExpenseType = async (
  payload: ICreateExpenseTypePayload,
): Promise<IExpenseTypeMutationResponse> => {
  const response = await axiosClient.post<IExpenseTypeMutationResponse>(
    "/v1.0/expense-types",
    payload,
    { validateStatus: (status) => status < 400 },
  );
  return response.data;
};

// UPDATE EXPENSE TYPE
export const updateExpenseType = async (
  payload: IUpdateExpenseTypePayload,
): Promise<IExpenseTypeMutationResponse> => {
  const response = await axiosClient.put<IExpenseTypeMutationResponse>(
    "/v1.0/expense-types",
    payload,
    { validateStatus: (status) => status < 400 },
  );
  return response.data;
};

// DELETE EXPENSE TYPE
export const deleteExpenseType = async (
  id: number | string,
): Promise<IExpenseTypeMutationResponse> => {
  const response = await axiosClient.delete<IExpenseTypeMutationResponse>(
    `/v1.0/expense-types/${id}`,
    { validateStatus: (status) => status < 400 },
  );
  return response.data;
};
