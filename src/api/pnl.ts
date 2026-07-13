import api from "../services/api";

export interface PnlDashboardFilters {
  fromDate?: string;
  toDate?: string;
}

export async function getPnlDashboard(
  brandCode: string,
  filters: PnlDashboardFilters = {}
) {
  const response = await api.get(`/pnl/${brandCode}`, {
    params: {
      fromDate: filters.fromDate || "",
      toDate: filters.toDate || "",
    },
  });

  return response.data;
}
