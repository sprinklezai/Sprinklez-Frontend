import api from "../services/api";

export interface ExecutiveOverviewFilters {
  period?: "MTD" | "YTD";
  country?: string;
}

export async function getExecutiveOverview(
  filters: ExecutiveOverviewFilters = {}
) {
  const response = await api.get("/executive-overview", {
    params: {
      period: filters.period || "MTD",
      country: filters.country || "",
    },
  });

  return response.data;
}
