import api from "../services/api";

export interface SalesDashboardFilters {
  period?: string;
  country?: string;
  store?: string;
  search?: string;
  fromDate?: string;
  toDate?: string;
}

export async function getSalesDashboard(
  brandCode: string,
  month: string,
  filters: SalesDashboardFilters = {}
) {
  const response = await api.get(`/sales/${brandCode}`, {
    params: {
      month,
      period: filters.period || "MTD",
      country: filters.country || "",
      store: filters.store || "",
      search: filters.search || "",
      fromDate: filters.fromDate || "",
      toDate: filters.toDate || "",
    },
  });
  return response.data;
}
