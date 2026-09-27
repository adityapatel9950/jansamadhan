import { apiClient } from './apiClient';
import {
  Challenge,
  CreateChallengeInput,
  UpdateChallengeInput,
  ChallengeStats,
  ChallengeFilterState,
} from '../types/challenge';
import { PaginatedResult } from '../types/common';
import { firestoreChallengeService } from '../firebase/firestoreService';

export interface UploadFileResponse {
  url: string;
  fileName: string;
  sizeBytes: number;
  mimeType: string;
}

export const challengeService = {
  async getChallenges(filters: ChallengeFilterState = {}): Promise<PaginatedResult<Challenge>> {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.category) params.append('category', filters.category);
    if (filters.district) params.append('district', filters.district);
    if (filters.block) params.append('block', filters.block);
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', String(filters.page));
    if (filters.limit) params.append('limit', String(filters.limit));
    if (filters.submittedBy) params.append('submittedBy', filters.submittedBy);
    if (filters.submittedByUserId) params.append('submittedByUserId', filters.submittedByUserId);

    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await apiClient.get<PaginatedResult<Challenge>>(`/challenges${query}`);

    // Proactively sync pre-seeded records to Firestore in the background
    if (res.items && res.items.length > 0) {
      Promise.all(
        res.items.map((item) => firestoreChallengeService.createChallenge(item).catch(() => {}))
      ).catch(() => {});
    }

    return res;
  },

  async getMyChallenges(filters: ChallengeFilterState = {}): Promise<PaginatedResult<Challenge>> {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.category) params.append('category', filters.category);
    if (filters.district) params.append('district', filters.district);
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', String(filters.page));
    if (filters.limit) params.append('limit', String(filters.limit));

    const query = params.toString() ? `?${params.toString()}` : '';
    return apiClient.get<PaginatedResult<Challenge>>(`/challenges/my/submissions${query}`);
  },

  async getChallengeById(id: string): Promise<Challenge> {
    try {
      const fsItem = await firestoreChallengeService.getChallengeById(id);
      if (fsItem) return fsItem;
    } catch {
      // ignore
    }
    return apiClient.get<Challenge>(`/challenges/${id}`);
  },

  async createChallenge(input: CreateChallengeInput): Promise<Challenge> {
    const created = await apiClient.post<Challenge>('/challenges', input);
    try {
      await firestoreChallengeService.createChallenge(created);
    } catch (err) {
      console.warn('Syncing challenge to Firestore failed:', err);
    }
    return created;
  },

  async updateChallenge(id: string, input: UpdateChallengeInput): Promise<Challenge> {
    const updated = await apiClient.put<Challenge>(`/challenges/${id}`, input);
    try {
      await firestoreChallengeService.createChallenge(updated);
    } catch (err) {
      console.warn('Syncing updated challenge to Firestore failed:', err);
    }
    return updated;
  },

  async updateChallengeStatus(id: string, status: string): Promise<Challenge> {
    const updated = await apiClient.patch<Challenge>(`/challenges/${id}/status`, { status });
    try {
      await firestoreChallengeService.updateStatus(id, status as any);
    } catch (err) {
      console.warn('Syncing status to Firestore failed:', err);
    }
    return updated;
  },

  async uploadFile(fileData: string, fileName: string, mimeType: string, type: 'IMAGE' | 'DOCUMENT' = 'IMAGE'): Promise<UploadFileResponse> {
    return apiClient.post<UploadFileResponse>('/challenges/upload', {
      fileData,
      fileName,
      mimeType,
      type,
    });
  },

  async getDashboardStats(): Promise<ChallengeStats> {
    try {
      const stats = await firestoreChallengeService.getStats();
      if (stats.total > 0) return stats;
    } catch {
      // fallback
    }
    return apiClient.get<ChallengeStats>('/stats/dashboard');
  },
};
