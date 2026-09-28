import { apiClient } from "./apiClient";
import {
  Challenge,
  CreateChallengeInput,
  UpdateChallengeInput,
  ChallengeStats,
  ChallengeFilterState,
} from "../types/challenge";
import { PaginatedResult } from "../types/common";

export interface UploadFileResponse {
  url: string;
  fileName: string;
  sizeBytes: number;
  mimeType: string;
}

export const challengeService = {
  async getChallenges(
    filters: ChallengeFilterState = {},
  ): Promise<PaginatedResult<Challenge>> {
    const params = new URLSearchParams();
    if (filters.status) params.append("status", filters.status);
    if (filters.category) params.append("category", filters.category);
    if (filters.district) params.append("district", filters.district);
    if (filters.block) params.append("block", filters.block);
    if (filters.search) params.append("search", filters.search);
    if (filters.page) params.append("page", String(filters.page));
    if (filters.limit) params.append("limit", String(filters.limit));
    if (filters.submittedBy) params.append("submittedBy", filters.submittedBy);
    if (filters.submittedByUserId)
      params.append("submittedByUserId", filters.submittedByUserId);

    const query = params.toString() ? `?${params.toString()}` : "";
    const res = await apiClient.get<PaginatedResult<Challenge>>(
      `/challenges${query}`,
    );

    return res;
  },

  async getMyChallenges(
    filters: ChallengeFilterState = {},
  ): Promise<PaginatedResult<Challenge>> {
    const params = new URLSearchParams();
    if (filters.status) params.append("status", filters.status);
    if (filters.category) params.append("category", filters.category);
    if (filters.district) params.append("district", filters.district);
    if (filters.search) params.append("search", filters.search);
    if (filters.page) params.append("page", String(filters.page));
    if (filters.limit) params.append("limit", String(filters.limit));

    const query = params.toString() ? `?${params.toString()}` : "";
    return apiClient.get<PaginatedResult<Challenge>>(
      `/challenges/my/submissions${query}`,
    );
  },

  async getChallengeById(id: string): Promise<Challenge> {
    return apiClient.get<Challenge>(`/challenges/${id}`);
  },

  async createChallenge(input: CreateChallengeInput): Promise<Challenge> {
    return apiClient.post<Challenge>("/challenges", input);
  },

  async updateChallenge(
    id: string,
    input: UpdateChallengeInput,
  ): Promise<Challenge> {
    return apiClient.put<Challenge>(`/challenges/${id}`, input);
  },

  async updateChallengeStatus(id: string, status: string): Promise<Challenge> {
    return apiClient.patch<Challenge>(`/challenges/${id}/status`, { status });
  },

  async uploadFile(
    fileData: string,
    fileName: string,
    mimeType: string,
    type: "IMAGE" | "DOCUMENT" = "IMAGE",
  ): Promise<UploadFileResponse> {
    return apiClient.post<UploadFileResponse>("/challenges/upload", {
      fileData,
      fileName,
      mimeType,
      type,
    });
  },

  async getDashboardStats(): Promise<ChallengeStats> {
    return apiClient.get<ChallengeStats>("/stats/dashboard");
  },
};
