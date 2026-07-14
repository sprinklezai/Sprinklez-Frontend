import api from "./api";

export interface SalesMonth {
  value: string;
  label: string;
}

export interface SalesMonthsResponse {
  success: boolean;
  latestMonth: string | null;
  months: SalesMonth[];
}

export async function getSalesMonths() {
  const response =
    await api.get<SalesMonthsResponse>("/sales-months");

  return response.data;
}