import api from "./api";

export async function getSalesDashboard(
  brandCode: string,
  month = "2026_06",
  filters: {
    period?: string;
    country?: string;
    store?: string;
    search?: string;
  } = {}
) {
  const response = await api.get(`/sales/${brandCode}`, {
    params: {
      month,
      ...filters,
    },
  });

  return response.data;
}