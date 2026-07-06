import api from "./api";

export interface LoginRequest {
  emp_id: string;
  password: string;
}

export async function login(data: LoginRequest) {
  const response = await api.post("/login", data);
  return response.data;
}