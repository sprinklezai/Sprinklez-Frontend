import api from "./api";

export interface SalesMonthOption {
  value: string;
  label: string;
  status?: "closed" | "in_progress";
  hasMonthlySummary?: boolean;
  dailyFileCount?: number;
  fileName?: string;
}

export interface SalesMonthsResponse {
  success: boolean;
  latestMonth: string | null;
  latestAvailableDate: string | null;
  count: number;
  months: SalesMonthOption[];
}

export async function getSalesMonths(): Promise<SalesMonthsResponse> {
  const response = await api.get<SalesMonthsResponse>(
    "/sales-months"
  );

  return response.data;
}
