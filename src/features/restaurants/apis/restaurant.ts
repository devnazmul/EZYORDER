import axiosClient from "@/config/axiosClient";
import {
  IBusinessTimingQueryParams,
  IBusinessTimingResponse,
  IMenuCatalogResponse,
  IMenuQueryParams,
  IRestaurantQueryParams,
  IRestaurantResponse,
} from "@/types";

/**
 * Fetch restaurant settings by ID
 */
export const getRestaurant = async (
  params?: IRestaurantQueryParams,
): Promise<IRestaurantResponse | null> => {
  const id = params?.restaurant_id;
  const response = await axiosClient.get<IRestaurantResponse>(
    `/restaurant/${id}`,
    {
      validateStatus: () => true,
    },
  );
  return response.status === 200 && response.data ? response.data : null;
};

/**
 * Fetch business timings/days by restaurant ID
 */
export const getBusinessTiming = async (
  params?: IBusinessTimingQueryParams,
): Promise<IBusinessTimingResponse | null> => {
  const restaurantId = params?.restaurant_id;
  const response = await axiosClient.get<IBusinessTimingResponse>(
    `/v1.0/business-days/${restaurantId}`,
    {
      validateStatus: () => true,
    },
  );
  return response.status === 200 && response.data ? response.data : null;
};

/**
 * Fetch full menu catalog (categories, dishes, variation types, and variations)
 */
export const getMenuCatalog = async (
  params?: IMenuQueryParams,
): Promise<IMenuCatalogResponse | null> => {
  const response = await axiosClient.get<IMenuCatalogResponse>(
    "/menu-dishes-variationtypes-variations",
    {
      params,
      validateStatus: () => true,
    },
  );
  return response.status === 200 && response.data ? response.data : null;
};
