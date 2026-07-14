import api from "../services/api";

export interface SalesChatFilters {
  brandCode: string;
  month: string;
  period: string;
  country?: string;
  store?: string;
  fromDate?: string;
  toDate?: string;
}

function getToken() {
  return (
    localStorage.getItem("auth_token") ||
    sessionStorage.getItem("auth_token") ||
    ""
  );
}

export async function askSalesAssistant(
  question: string,
  filters: SalesChatFilters
) {
  const response = await api.post(
    "/sales-chat",
    { question, ...filters },
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return response.data;
}
