import { PaginationOptions, SortOptions } from '../utils/dbUtils.js';

export interface Organization {
  id: string;
  name: string;
  type: 'GOVERNMENT_DEPT' | 'UNIVERSITY' | 'INDUSTRY_CORP' | 'NGO' | 'STARTUP';
  registrationNumber?: string;
  district?: string;
  website?: string;
  contactEmail?: string;
  contactPhone?: string;
  isVerified: boolean;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface IndustryPartner {
  id: string;
  name: string;
  organizationId?: string;
  sector: string; // CSR, MANUFACTURING, MINING, IT_IOT, AGRO_TECH
  contactPersonId?: string;
  district?: string;
  mouSigned: boolean;
  fundingBudgetInr: number;
  createdAt: string;
  updatedAt: string;
}

export interface Partnership {
  id: string;
  projectId: string;
  industryPartnerId: string;
  type: 'CSR_GRANT' | 'MENTORSHIP' | 'LAB_ACCESS' | 'COMMERCIAL_PILOT';
  grantAmount: number;
  status: 'PROPOSED' | 'ACTIVE' | 'COMPLETED' | 'TERMINATED';
  signedAt?: string;
  createdAt: string;
  updatedAt: string;
  // Joined fields
  industryPartnerName?: string;
  projectTitle?: string;
}

export interface IndustryQueryFilters extends PaginationOptions, SortOptions {
  sector?: string;
  district?: string;
  mouSigned?: boolean;
  search?: string;
}
