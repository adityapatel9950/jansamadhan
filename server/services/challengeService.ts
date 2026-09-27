import { challengeRepository } from '../repositories/challengeRepository.js';
import { departmentRepository } from '../repositories/departmentRepository.js';
import {
  Challenge,
  CreateChallengeDTO,
  UpdateChallengeDTO,
  ChallengeQueryFilters,
  ChallengeStatus,
  ChallengeStats,
} from '../types/challenge.js';
import { UserRole } from '../types/user.js';

export class ChallengeService {
  async getChallenges(filters: ChallengeQueryFilters) {
    return challengeRepository.findAll(filters);
  }

  async getChallengeById(id: string): Promise<Challenge | null> {
    return challengeRepository.findById(id);
  }

  async createChallenge(
    dto: CreateChallengeDTO,
    submitter: { id: string; name: string; role: UserRole }
  ): Promise<Challenge> {
    let departmentName = dto.departmentName;
    if (dto.departmentId && !departmentName) {
      const dept = await departmentRepository.findById(dto.departmentId);
      if (dept) {
        departmentName = dept.name;
      }
    }

    return challengeRepository.create({
      title: dto.title.trim(),
      description: dto.description.trim(),
      category: dto.category,
      district: dto.district,
      block: dto.block,
      village: dto.village,
      address: dto.address,
      latitude: dto.latitude,
      longitude: dto.longitude,
      departmentId: dto.departmentId,
      departmentName: departmentName,
      priority: dto.priority || 'MEDIUM',
      status: dto.status || 'SUBMITTED',
      locationDetails: dto.locationDetails,
      impactedPopulationEstimate: dto.impactedPopulationEstimate,
      contactPreference: dto.contactPreference,
      supportingImageUrl: dto.supportingImageUrl,
      supportingDocumentUrl: dto.supportingDocumentUrl,
      tags: dto.tags || [],
      submittedByUserId: submitter.id,
      submittedBy: submitter.id,
      submittedByName: submitter.name,
      submittedByRole: submitter.role,
    });
  }

  /**
   * Edit challenge before verification (only allowed if status is DRAFT or SUBMITTED,
   * and caller is owner or admin).
   */
  async updateChallenge(
    id: string,
    dto: UpdateChallengeDTO,
    user: { id: string; role: UserRole }
  ): Promise<Challenge> {
    const existing = await challengeRepository.findById(id);
    if (!existing) {
      throw new Error(`Challenge with ID "${id}" was not found.`);
    }

    // Authorization check: owner or admin
    const isOwner = existing.submittedBy === user.id || existing.submittedByUserId === user.id;
    const isAdmin = user.role === 'ADMIN';
    if (!isOwner && !isAdmin) {
      throw new Error('Forbidden: You can only edit challenges that you submitted.');
    }

    // Lifecycle check: only editable before verification
    const editableStatuses: ChallengeStatus[] = ['DRAFT', 'SUBMITTED'];
    if (!editableStatuses.includes(existing.status) && !isAdmin) {
      throw new Error(
        `Challenge cannot be edited once verified or moved to "${existing.status}".`
      );
    }

    const updated = await challengeRepository.update(id, dto);
    if (!updated) {
      throw new Error(`Failed to update challenge "${id}".`);
    }

    return updated;
  }

  async updateChallengeStatus(
    id: string,
    status: ChallengeStatus,
    verifier?: { id: string; name: string }
  ): Promise<Challenge> {
    const existing = await challengeRepository.findById(id);
    if (!existing) {
      throw new Error(`Challenge with ID "${id}" was not found.`);
    }

    let verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED' | undefined;
    if (['VERIFIED', 'ASSIGNED', 'IN_PROGRESS', 'PILOT', 'RESOLVED', 'CLOSED', 'ACCEPTED'].includes(status)) {
      verificationStatus = 'VERIFIED';
    } else if (status === 'REJECTED') {
      verificationStatus = 'REJECTED';
    } else if (status === 'SUBMITTED' || status === 'UNDER_REVIEW') {
      verificationStatus = 'PENDING';
    }

    const updated = await challengeRepository.updateStatus(
      id,
      status,
      verifier?.id,
      verificationStatus
    );
    if (!updated) {
      throw new Error(`Failed to update status for challenge "${id}".`);
    }

    return updated;
  }

  async getDashboardStats(): Promise<ChallengeStats> {
    return challengeRepository.getStats();
  }

  async getStats(): Promise<ChallengeStats> {
    return challengeRepository.getStats();
  }
}

export const challengeService = new ChallengeService();
