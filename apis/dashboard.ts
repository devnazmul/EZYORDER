import axios from "axios";
import ENV from "@/config/env";

const API_BASE_URL = ENV.API_BASE_URL;

const getHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  Accept: "application/json",
});

export const getDashboardMetric = async (token: string, filterBy: string) => {
  const response = await axios.get(`${API_BASE_URL}/v1.0/dashboard-metric`, {
    headers: getHeaders(token),
    params: { date_filter: filterBy },
    validateStatus: () => true,
  });
  return response.status === 200 && response.data?.success ? response.data.data : null;
};

export const getDashboardLiveOrderBoard = async (token: string) => {
  const response = await axios.get(`${API_BASE_URL}/v1.0/dashboard-live-order-board`, {
    headers: getHeaders(token),
    validateStatus: () => true,
  });
  return response.status === 200 && response.data?.success ? response.data.data : null;
};

export const getDashboardRevenueChart = async (token: string, filterBy: string) => {
  const response = await axios.get(`${API_BASE_URL}/v1.0/dashboard-revenue-chart`, {
    headers: getHeaders(token),
    params: { date_filter: filterBy },
    validateStatus: () => true,
  });
  return response.status === 200 && response.data?.success ? response.data.data || [] : [];
};

export const getDashboardOrdersByType = async (token: string, filterBy: string) => {
  const response = await axios.get(`${API_BASE_URL}/v1.0/dashboard-orders-by-type`, {
    headers: getHeaders(token),
    params: { date_filter: filterBy },
    validateStatus: () => true,
  });
  return response.status === 200 && response.data?.success ? response.data.data || [] : [];
};

export const getDashboardKitchenActivity = async (token: string) => {
  const response = await axios.get(`${API_BASE_URL}/v1.0/dashboard-kitchen-activity`, {
    headers: getHeaders(token),
    validateStatus: () => true,
  });
  return response.status === 200 && response.data?.success ? response.data.data : null;
};

export const getDashboardCouponUsages = async (token: string) => {
  const response = await axios.get(`${API_BASE_URL}/v1.0/dashboard-coupon-usages`, {
    headers: getHeaders(token),
    validateStatus: () => true,
  });
  if (response.status === 200 && response.data?.success) {
    const fallbackImages = [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCZq67zMRRvi6j_fuggIGKbSOxgSe48RWATeoaI6NVBw0kwpS_FsPcSBEjMcsNLddNrpuMUwyLIxlRX6VA35rdXcmQXT9dO4Ux9xGfWxwlw1d0MoyFlVS2IIPLbZq8pYJocnZ9Dl4R8TwuiM8xXY0aZH1Pzwc_mWKpElWazEeVl2nVExqe1O8rpMIk7kMzZ4yK9cITcRhwgHyj3h-tiA3LC0XRHMSVNr_qPB4-qKKrfiX00fPu9AW1CllxA_nCFNttYuw1HuQOK3MsH",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCv9KVyFd23JV6Vd-_gMR-pfU326LNeoFOosLYmrU8M0Q2BvY8emZ7Lj2HEwLf3flLmbtTlotJiCujkWI2l4b5PIbGJnTb8xvX7QhRe3QH4cA4IZM23n2YzBKIq70Nn5dfHdAyE8WbgjVfepBMrgA4rZ56NdcTnmpCglI2Tp2bjD2nWvXcyK5joXPfVhLNSkfx6PikNFFkDHwcXVKLaBpgtHHtc0n-Owof7dFs8u0eL_bc-0doGJGiMgFvbeQQLndVsC0qBToF6ZMvZ",
    ];
    return (response.data.data || []).map((promo: any, idx: number) => ({
      ...promo,
      image:
        promo.image && promo.image.startsWith("http")
          ? promo.image
          : fallbackImages[idx % fallbackImages.length],
    }));
  }
  return [];
};

export const getDashboardRecentOrders = async (token: string) => {
  const response = await axios.get(`${API_BASE_URL}/v1.0/dashboard-recent-orders`, {
    headers: getHeaders(token),
    validateStatus: () => true,
  });
  return response.status === 200 && response.data?.success ? response.data.data || [] : [];
};

export const getDashboardTopDishes = async (token: string, filterBy: string) => {
  const response = await axios.get(`${API_BASE_URL}/v1.0/dashboard-top-dishes`, {
    headers: getHeaders(token),
    params: { date_filter: filterBy },
    validateStatus: () => true,
  });
  return response.status === 200 && response.data?.success ? response.data.data || [] : [];
};
