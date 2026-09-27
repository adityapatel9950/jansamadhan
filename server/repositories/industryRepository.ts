import {
  IndustryPartner,
  Partnership,
  Organization,
  IndustryQueryFilters,
} from '../types/industry.js';
import { getDbPool, isDbConnected } from '../config/db.js';
import {
  buildPagination,
  buildOrderBy,
  buildWhereBuilder,
  handleDbError,
  PaginationResult,
} from '../utils/dbUtils.js';

const INITIAL_PARTNERS: IndustryPartner[] = [
  {
    id: 'ind-01',
    name: 'Tata Steel Foundation',
    sector: 'CSR',
    district: 'East Singhbhum',
    mouSigned: true,
    fundingBudgetInr: 2500000,
    createdAt: '2026-01-14T14:00:00Z',
    updatedAt: '2026-01-14T14:00:00Z',
  },
  {
    id: 'ind-02',
    name: 'Central Coalfields Limited (CCL) CSR Cell',
    sector: 'MINING',
    district: 'Ranchi',
    mouSigned: true,
    fundingBudgetInr: 3000000,
    createdAt: '2026-01-20T10:00:00Z',
    updatedAt: '2026-01-20T10:00:00Z',
  },
  {
    id: 'ind-03',
    name: 'Jharkhand Agrotech Startup Incubator',
    sector: 'AGRO_TECH',
    district: 'Ranchi',
    mouSigned: false,
    fundingBudgetInr: 800000,
    createdAt: '2026-02-01T11:00:00Z',
    updatedAt: '2026-02-01T11:00:00Z',
  },
];

const INITIAL_PARTNERSHIPS: Partnership[] = [
  {
    id: 'part-01',
    projectId: 'proj-01',
    industryPartnerId: 'ind-01',
    type: 'CSR_GRANT',
    grantAmount: 450000,
    status: 'ACTIVE',
    signedAt: '2026-02-15',
    industryPartnerName: 'Tata Steel Foundation',
    projectTitle: 'Low-Head Micro-Solar Drip Automation Controller',
    createdAt: '2026-02-15T10:00:00Z',
    updatedAt: '2026-02-15T10:00:00Z',
  },
];

let memoryPartners: IndustryPartner[] = [...INITIAL_PARTNERS];
let memoryPartnerships: Partnership[] = [...INITIAL_PARTNERSHIPS];

const INDUSTRY_COLUMNS_SQL = `
  id, name, organization_id, sector, contact_person_id,
  district, mou_signed, funding_budget_inr, created_at, updated_at
`;

export class IndustryRepository {
  async findAll(filters: IndustryQueryFilters = {}): Promise<PaginationResult<IndustryPartner>> {
    const { page, limit, offset } = buildPagination(filters);
    const pool = getDbPool();

    if (pool && isDbConnected()) {
      try {
        const wb = buildWhereBuilder();
        if (filters.sector) wb.addFilter('sector', filters.sector);
        if (filters.district) wb.addFilter('district', filters.district);
        if (filters.mouSigned !== undefined) wb.addFilter('mou_signed', filters.mouSigned);
        if (filters.search) wb.addSearch(['name', 'sector', 'district'], filters.search);

        const { whereClause, params, nextParamIndex } = wb.build();

        const countQuery = `SELECT COUNT(*) as count FROM industry_partners ${whereClause}`;
        const countRes = await pool.query(countQuery, params);
        const total = parseInt(countRes.rows[0]?.count || '0', 10);

        const allowedSortCols: Record<string, string> = {
          name: 'name',
          sector: 'sector',
          fundingBudget: 'funding_budget_inr',
          createdAt: 'created_at',
        };
        const orderSql = buildOrderBy(filters, allowedSortCols, 'name', 'ASC');

        const selectQuery = `
          SELECT ${INDUSTRY_COLUMNS_SQL}
          FROM industry_partners
          ${whereClause}
          ${orderSql}
          LIMIT $${nextParamIndex} OFFSET $${nextParamIndex + 1}
        `;
        const selectParams = [...params, limit, offset];
        const res = await pool.query(selectQuery, selectParams);

        const items: IndustryPartner[] = res.rows.map((row) => ({
          id: row.id,
          name: row.name,
          organizationId: row.organization_id,
          sector: row.sector,
          contactPersonId: row.contact_person_id,
          district: row.district,
          mouSigned: row.mou_signed,
          fundingBudgetInr: parseFloat(row.funding_budget_inr) || 0,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        }));

        return { items, total, page, limit, totalPages: Math.ceil(total / limit) || 1 };
      } catch (err) {
        handleDbError(err, 'IndustryRepository.findAll');
      }
    }

    let results = [...memoryPartners];
    if (filters.sector) results = results.filter((p) => p.sector.toLowerCase() === filters.sector!.toLowerCase());
    if (filters.district) results = results.filter((p) => p.district?.toLowerCase() === filters.district!.toLowerCase());
    if (filters.mouSigned !== undefined) results = results.filter((p) => p.mouSigned === filters.mouSigned);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      results = results.filter((p) => p.name.toLowerCase().includes(q) || p.sector.toLowerCase().includes(q));
    }

    const total = results.length;
    const items = results.slice(offset, offset + limit);

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) || 1 };
  }

  async findById(id: string): Promise<IndustryPartner | null> {
    const pool = getDbPool();
    if (pool && isDbConnected()) {
      try {
        const query = `
          SELECT ${INDUSTRY_COLUMNS_SQL}
          FROM industry_partners
          WHERE id = $1
          LIMIT 1
        `;
        const res = await pool.query(query, [id]);
        if (res.rows[0]) {
          const row = res.rows[0];
          return {
            id: row.id,
            name: row.name,
            organizationId: row.organization_id,
            sector: row.sector,
            contactPersonId: row.contact_person_id,
            district: row.district,
            mouSigned: row.mou_signed,
            fundingBudgetInr: parseFloat(row.funding_budget_inr) || 0,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
          };
        }
        return null;
      } catch (err) {
        handleDbError(err, 'IndustryRepository.findById');
      }
    }
    return memoryPartners.find((p) => p.id === id) || null;
  }

  async createPartner(data: {
    name: string;
    organizationId?: string;
    sector: string;
    district?: string;
    fundingBudgetInr?: number;
    mouSigned?: boolean;
  }): Promise<IndustryPartner> {
    const id = `ind-${Date.now()}`;
    const now = new Date().toISOString();
    const partner: IndustryPartner = {
      id,
      name: data.name,
      organizationId: data.organizationId,
      sector: data.sector,
      district: data.district,
      mouSigned: data.mouSigned || false,
      fundingBudgetInr: data.fundingBudgetInr || 0,
      createdAt: now,
      updatedAt: now,
    };

    const pool = getDbPool();
    if (pool && isDbConnected()) {
      try {
        const query = `
          INSERT INTO industry_partners (id, name, organization_id, sector, district, mou_signed, funding_budget_inr, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          RETURNING ${INDUSTRY_COLUMNS_SQL}
        `;
        const res = await pool.query(query, [
          partner.id,
          partner.name,
          partner.organizationId || null,
          partner.sector,
          partner.district || null,
          partner.mouSigned,
          partner.fundingBudgetInr,
          partner.createdAt,
          partner.updatedAt,
        ]);
        if (res.rows[0]) return partner;
      } catch (err) {
        handleDbError(err, 'IndustryRepository.createPartner');
      }
    }

    memoryPartners.push(partner);
    return partner;
  }

  async getPartnershipsForProject(projectId: string): Promise<Partnership[]> {
    const pool = getDbPool();
    if (pool && isDbConnected()) {
      try {
        const query = `
          SELECT p.id, p.project_id, p.industry_partner_id, p.type, p.grant_amount, p.status, p.signed_at, p.created_at, p.updated_at,
                 ip.name as industry_partner_name, pr.title as project_title
          FROM partnerships p
          LEFT JOIN industry_partners ip ON ip.id = p.industry_partner_id
          LEFT JOIN projects pr ON pr.id = p.project_id
          WHERE p.project_id = $1
          ORDER BY p.created_at DESC
        `;
        const res = await pool.query(query, [projectId]);
        return res.rows.map((row) => ({
          id: row.id,
          projectId: row.project_id,
          industryPartnerId: row.industry_partner_id,
          type: row.type,
          grantAmount: parseFloat(row.grant_amount) || 0,
          status: row.status,
          signedAt: row.signed_at,
          industryPartnerName: row.industry_partner_name,
          projectTitle: row.project_title,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        }));
      } catch (err) {
        handleDbError(err, 'IndustryRepository.getPartnershipsForProject');
      }
    }
    return memoryPartnerships.filter((p) => p.projectId === projectId);
  }

  async createPartnership(data: {
    projectId: string;
    industryPartnerId: string;
    type: Partnership['type'];
    grantAmount?: number;
  }): Promise<Partnership> {
    const id = `part-${Date.now()}`;
    const now = new Date().toISOString();
    const partnership: Partnership = {
      id,
      projectId: data.projectId,
      industryPartnerId: data.industryPartnerId,
      type: data.type,
      grantAmount: data.grantAmount || 0,
      status: 'PROPOSED',
      createdAt: now,
      updatedAt: now,
    };

    const pool = getDbPool();
    if (pool && isDbConnected()) {
      try {
        const query = `
          INSERT INTO partnerships (id, project_id, industry_partner_id, type, grant_amount, status, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          RETURNING id, project_id, industry_partner_id, type, grant_amount, status, created_at
        `;
        const res = await pool.query(query, [
          partnership.id,
          partnership.projectId,
          partnership.industryPartnerId,
          partnership.type,
          partnership.grantAmount,
          partnership.status,
          partnership.createdAt,
          partnership.updatedAt,
        ]);
        if (res.rows[0]) return partnership;
      } catch (err) {
        handleDbError(err, 'IndustryRepository.createPartnership');
      }
    }

    memoryPartnerships.push(partnership);
    return partnership;
  }
}

export const industryRepository = new IndustryRepository();
