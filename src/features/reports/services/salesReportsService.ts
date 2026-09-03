import { type IDoughnutChartItem } from "@/components/reuseable";
import {
  formatDoughnutChartItems,
  getOrderTypeConfig,
  getPaymentMethodsConfig,
  IPaymentMethodKey,
} from "@/utils";
import { IPaymentSummaryData, ISalesByOrderTypeItem } from "../types";

export class SalesReportsService {
  /**
   * Processes payment summary data into formatted doughnut chart items & total
   */
  static getPaymentChartData(paymentSummary?: IPaymentSummaryData | null): {
    total: number;
    chartItems: IDoughnutChartItem[];
  } {
    const cash = Number(paymentSummary?.cash ?? 0);
    const card = Number(paymentSummary?.card ?? 0);
    const online = Number(paymentSummary?.online ?? 0);

    const total = Number(paymentSummary?.total ?? cash + card + online);

    const paymentKeys: IPaymentMethodKey[] = ["cash", "card", "online"];

    const chartItems = formatDoughnutChartItems(
      paymentKeys,
      (key) => {
        const config = getPaymentMethodsConfig(key);
        const value = Number(
          paymentSummary?.[key as keyof IPaymentSummaryData] ?? 0,
        );
        return { label: config.label, color: config.color, value };
      },
      total,
    );

    return { total, chartItems };
  }

  /**
   * Processes sales by order type data into formatted doughnut chart items & total amount
   */
  static getRevenueByOrderTypeChartData(
    orderTypeData?: ISalesByOrderTypeItem[] | Record<string, unknown> | null,
    netSales = 0,
  ): {
    totalAmount: number;
    chartItems: IDoughnutChartItem[];
    isEmpty: boolean;
  } {
    const list: ISalesByOrderTypeItem[] = Array.isArray(orderTypeData)
      ? orderTypeData
      : [];

    const totalAmount = list.reduce(
      (acc: number, item: ISalesByOrderTypeItem) =>
        acc + Number(item.total_sales || item.amount || item.value || 0),
      0,
    );

    const chartItems = formatDoughnutChartItems(
      list,
      (item) => {
        const val = Number(item.total_sales || item.amount || item.value || 0);
        const config = getOrderTypeConfig(item.order_type || "");
        return { label: config.label, color: config.color, value: val };
      },
      netSales,
    );

    return {
      totalAmount,
      chartItems,
      isEmpty: list.length === 0,
    };
  }
}
