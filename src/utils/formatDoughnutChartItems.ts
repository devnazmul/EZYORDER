import { type IDoughnutChartItem } from "@/components/reuseable";

/**
 * Generic reusable helper to convert any dataset into formatted DoughnutChart items
 * with automatic percentage calculation and non-zero value filtering.
 */
export function formatDoughnutChartItems<T>(
  items: T[],
  getItem: (item: T) => { label: string; color: string; value: number },
  total: number,
): IDoughnutChartItem[] {
  return items
    .map((item) => {
      const { label, color, value } = getItem(item);
      const percent =
        total > 0 ? Math.min(Math.round((value / total) * 100), 100) : 0;

      return {
        label,
        value,
        color,
        legendValue: `${percent}%`,
      };
    })
    .filter((chartItem) => chartItem.value > 0);
}

export default formatDoughnutChartItems;
