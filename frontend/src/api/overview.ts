import api from "./api";

export async function getOverview() {
  const response = await api.get("/overview");
  return response.data;
}