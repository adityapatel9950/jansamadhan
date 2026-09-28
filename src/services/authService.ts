import { apiClient } from "./apiClient";
import { User, LoginCredentials, RegisterCredentials } from "../types/auth";

export interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const res = await apiClient.post<AuthResponse>("/auth/login", credentials);
    if (res.token) {
      localStorage.setItem("jansamadhan_token", res.token);
    }
    return res;
  },

  async register(data: RegisterCredentials): Promise<AuthResponse> {
    const res = await apiClient.post<AuthResponse>("/auth/register", data);
    if (res.token) {
      localStorage.setItem("jansamadhan_token", res.token);
    }
    return res;
  },

  async getCurrentUser(): Promise<User> {
    return apiClient.get<User>("/auth/me");
  },

  async getDemoAccounts(): Promise<User[]> {
    return apiClient.get<User[]>("/auth/demo-accounts");
  },

  logout(): void {
    localStorage.removeItem("jansamadhan_token");
  },
};
