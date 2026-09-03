import dayjs from "dayjs";

export interface IDateRangeResult {
  start_date: string;
  end_date: string;
}

/**
 * Calculates start_date and end_date strings (YYYY-MM-DD) aligned with calendar boundaries.
 * Strictly uses dayjs as per Rule #10.
 *
 * @param period "Today" | "Yesterday" | "This Week" | "This Month" or custom string
 */
export const getDateRange = (period: string): IDateRangeResult => {
  const now = dayjs();

  if (period === "Today") {
    const today = now.format("YYYY-MM-DD");
    return {
      start_date: today,
      end_date: today,
    };
  }

  if (period === "Yesterday") {
    const yesterday = now.subtract(1, "day").format("YYYY-MM-DD");
    return {
      start_date: yesterday,
      end_date: yesterday,
    };
  }

  if (period === "This Week") {
    return {
      start_date: now.startOf("week").format("YYYY-MM-DD"),
      end_date: now.endOf("week").format("YYYY-MM-DD"),
    };
  }

  if (period === "This Month") {
    return {
      start_date: now.startOf("month").format("YYYY-MM-DD"),
      end_date: now.endOf("month").format("YYYY-MM-DD"),
    };
  }

  if (period === "All Time") {
    return {
      start_date: "",
      end_date: "",
    };
  }

  return {
    start_date: now.format("YYYY-MM-DD"),
    end_date: now.format("YYYY-MM-DD"),
  };
};

export default getDateRange;
