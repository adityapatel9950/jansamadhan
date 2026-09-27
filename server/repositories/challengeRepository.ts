import {
  Challenge,
  ChallengeMedia,
  ChallengeAssignment,
  ChallengeQueryFilters,
  ChallengeStatus,
  ChallengeStats,
  UpdateChallengeDTO,
} from '../types/challenge.js';
import { UserRole } from '../types/user.js';
import { getDbPool, isDbConnected } from '../config/db.js';
import {
  buildPagination,
  buildOrderBy,
  buildWhereBuilder,
  handleDbError,
  PaginationResult,
} from '../utils/dbUtils.js';

// Pre-seeded authentic Jharkhand societal challenges matching Phase 3 schema
const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: 'ch-2026-001',
    title: 'Solar-Powered Low-Head Drip Irrigation for Plateau Terraces in Ormanjhi',
    description: 'Smallholder farmers in the Chota Nagpur plateau lack continuous grid electricity. During Rabi season, terraced fields suffer 60% crop failure because traditional pumps cannot lift water from check dams without expensive diesel generators.',
    categoryId: 'cat-agri-01',
    category: 'Agriculture',
    district: 'Ranchi',
    block: 'Ormanjhi',
    village: 'Baridih',
    address: 'Near Baridih Check Dam, Panchayat Ormanjhi South',
    latitude: 23.4821,
    longitude: 85.4719,
    submittedBy: 'usr-cit-01',
    submittedByName: 'Anand Mahto',
    submittedByRole: 'CITIZEN',
    submittedByUserId: 'usr-cit-01',
    verifiedBy: 'usr-gov-01',
    verificationStatus: 'VERIFIED',
    status: 'ASSIGNED',
    priority: 'HIGH',
    departmentId: 'dept-agr-01',
    departmentName: 'Department of Agriculture, Animal Husbandry & Co-operative',
    locationDetails: 'Panchayat Ormanjhi South, Blocks Baridih & Kuchu',
    impactedPopulationEstimate: 3400,
    contactPreference: 'PHONE',
    tags: ['solar-irrigation', 'plateau-farming', 'rabi-crops', 'water-conservation'],
    metadata: { checkDamsCount: 4, averageLandholdingAcres: 1.8 },
    createdAt: '2026-02-01T09:15:00Z',
    updatedAt: '2026-02-08T14:20:00Z',
  },
  {
    id: 'ch-2026-002',
    title: 'Fluoride and Iron Contamination Remediation in Ground Wells of Chainpur',
    description: 'Over 18 tribal habitations in Chainpur block report dental and skeletal fluorosis due to natural bedrock fluoride exceeding 2.8 mg/L (national limit 1.0 mg/L). Community filtration units often fail due to lack of local filter media replacement.',
    categoryId: 'cat-water-02',
    category: 'Water',
    district: 'Palamu',
    block: 'Chainpur',
    village: 'Mahuadanr Border',
    address: 'Habitation clusters 3 and 7, Chainpur',
    latitude: 23.9628,
    longitude: 84.1873,
    submittedBy: 'usr-cit-01',
    submittedByName: 'Anand Mahto',
    submittedByRole: 'CITIZEN',
    submittedByUserId: 'usr-cit-01',
    verifiedBy: 'usr-gov-01',
    verificationStatus: 'VERIFIED',
    status: 'IN_PROGRESS',
    priority: 'CRITICAL',
    departmentId: 'dept-dws-02',
    departmentName: 'Drinking Water & Sanitation Department',
    locationDetails: 'Chainpur Block, Palamu - 18 tribal tolas affected',
    impactedPopulationEstimate: 12500,
    contactPreference: 'PHONE',
    tags: ['fluoride-contamination', 'potable-water', 'filtration', 'tribal-health'],
    metadata: { currentPpmLevel: 2.85, affectedVillagesCount: 18 },
    createdAt: '2026-01-28T11:45:00Z',
    updatedAt: '2026-02-04T10:10:00Z',
  },
  {
    id: 'ch-2026-003',
    title: 'Off-Grid Cold Storage for Lac and Mahua Minor Forest Produce in Khunti',
    description: 'Tribal forest gatherers collect seasonal Lac and Mahua flowers in Murhu block, but without temperature and moisture controlled storage, harvest deteriorates within 72 hours, forcing distress selling at 30% of fair value to middlemen.',
    categoryId: 'cat-forest-03',
    category: 'Rural Livelihoods',
    district: 'Khunti',
    block: 'Murhu',
    village: 'Panchayat Bhavan Area',
    address: 'Near Murhu Haat Bazaar',
    latitude: 23.0722,
    longitude: 85.2794,
    submittedBy: 'usr-cit-01',
    submittedByName: 'Anand Mahto',
    submittedByRole: 'CITIZEN',
    submittedByUserId: 'usr-cit-01',
    verifiedBy: 'usr-gov-01',
    verificationStatus: 'VERIFIED',
    status: 'VERIFIED',
    priority: 'HIGH',
    departmentId: 'dept-wfr-04',
    departmentName: 'Scheduled Tribe & Backward Classes Welfare Department',
    locationDetails: 'Murhu Block Market Complex, Khunti',
    impactedPopulationEstimate: 4200,
    contactPreference: 'PORTAL',
    tags: ['minor-forest-produce', 'cold-storage', 'tribal-livelihood', 'solar-cooling'],
    metadata: { seasonalHarvestTons: 120 },
    createdAt: '2026-02-03T16:00:00Z',
    updatedAt: '2026-02-12T09:00:00Z',
  },
  {
    id: 'ch-2026-004',
    title: 'IoT Early Warning for Coal Fire and Subsidence Cracks in Jharia Habitations',
    description: 'Deep underground mine fires cause toxic carbon monoxide venting and sudden surface subsidence in densely populated bustees of Jharia. Low-cost subsurface thermal sensing nodes are needed to warn ward residents before structural collapse.',
    categoryId: 'cat-mine-04',
    category: 'Environment',
    district: 'Dhanbad',
    block: 'Jharia',
    village: 'Borea Bustee',
    latitude: 23.7439,
    longitude: 86.4132,
    submittedBy: 'usr-fac-01',
    submittedByName: 'Prof. Subodh Kumar',
    submittedByRole: 'FACULTY',
    submittedByUserId: 'usr-fac-01',
    verifiedBy: 'usr-gov-01',
    verificationStatus: 'VERIFIED',
    status: 'PILOT',
    priority: 'CRITICAL',
    departmentId: 'dept-min-05',
    departmentName: 'Department of Mines & Geology',
    locationDetails: 'Borea Bustee & Ghanudih, Jharia Coalfield',
    impactedPopulationEstimate: 18000,
    contactPreference: 'EMAIL',
    tags: ['mine-fire', 'iot-warning', 'subsidence-monitoring', 'disaster-prevention'],
    metadata: { fireZoneBustees: 3 },
    createdAt: '2026-01-20T08:00:00Z',
    updatedAt: '2026-02-10T11:20:00Z',
  },
  {
    id: 'ch-2026-005',
    title: 'Portable Point-of-Care Sickle Cell Anemia Screening Device for West Singhbhum',
    description: 'High prevalence of sickle cell trait among Ho and Santhal tribal communities in Kolhan region leads to severe infant mortality and chronic pain crises. Current electrophoresis testing takes 3 weeks from district headquarters.',
    categoryId: 'cat-health-05',
    category: 'Healthcare',
    district: 'West Singhbhum',
    block: 'Chaibasa',
    village: 'Ghatshila Rural Belt',
    latitude: 22.5539,
    longitude: 85.8078,
    submittedBy: 'usr-stu-01',
    submittedByName: 'Priya Kumari',
    submittedByRole: 'STUDENT',
    submittedByUserId: 'usr-stu-01',
    verifiedBy: 'usr-gov-01',
    verificationStatus: 'VERIFIED',
    status: 'RESOLVED',
    priority: 'HIGH',
    departmentId: 'dept-hlt-01',
    departmentName: 'Health, Medical Education & Family Welfare Department',
    locationDetails: 'Chaibasa & Jagannathpur Community Health Centers',
    impactedPopulationEstimate: 8500,
    contactPreference: 'WHATSAPP',
    tags: ['sickle-cell', 'point-of-care', 'microfluidics', 'tribal-healthcare'],
    metadata: { targetedScreeningsPerMonth: 1500 },
    createdAt: '2026-01-18T10:30:00Z',
    updatedAt: '2026-02-14T17:00:00Z',
  },
];

let memoryChallenges: Challenge[] = [...INITIAL_CHALLENGES];
let memoryMedia: ChallengeMedia[] = [];
let memoryAssignments: ChallengeAssignment[] = [];

// Explicitly projected SQL column list for challenges
const CHALLENGE_COLUMNS_SQL = `
  c.id, c.title, c.description, c.category_id, c.priority, c.status,
  c.district, c.block, c.village, c.latitude, c.longitude,
  c.submitted_by, c.verified_by, c.verification_status, c.metadata,
  c.created_at, c.updated_at
`;

export class ChallengeRepository {
  /**
   * Retrieves single challenge with explicit column selection and submitter name resolution.
   */
  async findById(id: string): Promise<Challenge | null> {
    const pool = getDbPool();

    if (pool && isDbConnected()) {
      try {
        const query = `
          SELECT ${CHALLENGE_COLUMNS_SQL},
                 p.full_name as submitter_name,
                 u.role as submitter_role,
                 cat.name as category_name
          FROM challenges c
          LEFT JOIN user_profiles p ON p.user_id = c.submitted_by
          LEFT JOIN users u ON u.id = c.submitted_by
          LEFT JOIN challenge_categories cat ON cat.id = c.category_id
          WHERE c.id = $1
          LIMIT 1
        `;
        const res = await pool.query(query, [id]);
        if (!res.rows[0]) return null;

        const row = res.rows[0];
        const meta = typeof row.metadata === 'string' ? JSON.parse(row.metadata) : row.metadata || {};

        return {
          id: row.id,
          title: row.title,
          description: row.description,
          categoryId: row.category_id,
          category: meta.category || row.category_name || 'General',
          priority: row.priority,
          status: row.status,
          district: row.district,
          block: row.block || undefined,
          village: row.village || undefined,
          address: meta.address,
          latitude: row.latitude ? parseFloat(row.latitude) : undefined,
          longitude: row.longitude ? parseFloat(row.longitude) : undefined,
          submittedBy: row.submitted_by,
          submittedByName: row.submitter_name || 'Citizen',
          submittedByRole: row.submitter_role || 'CITIZEN',
          submittedByUserId: row.submitted_by,
          verifiedBy: row.verified_by || undefined,
          verificationStatus: row.verification_status,
          departmentId: meta.departmentId,
          departmentName: meta.departmentName,
          locationDetails: meta.locationDetails,
          impactedPopulationEstimate: meta.impactedPopulationEstimate,
          contactPreference: meta.contactPreference,
          supportingImageUrl: meta.supportingImageUrl,
          supportingDocumentUrl: meta.supportingDocumentUrl,
          tags: meta.tags || [],
          metadata: meta,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        };
      } catch (err) {
        handleDbError(err, 'ChallengeRepository.findById');
      }
    }

    return memoryChallenges.find((c) => c.id === id) || null;
  }

  /**
   * Paginated, parameterized query with filtering on status, category, district, block, search.
   */
  async findAll(filters: ChallengeQueryFilters = {}): Promise<PaginationResult<Challenge>> {
    const { page, limit, offset } = buildPagination(filters);
    const pool = getDbPool();

    if (pool && isDbConnected()) {
      try {
        const wb = buildWhereBuilder();
        if (filters.status) wb.addFilter('c.status', filters.status);
        if (filters.district) wb.addFilter('c.district', filters.district);
        if (filters.block) wb.addFilter('c.block', filters.block);
        if (filters.categoryId) wb.addFilter('c.category_id', filters.categoryId);
        if (filters.verificationStatus) wb.addFilter('c.verification_status', filters.verificationStatus);

        const submitterId = filters.submittedBy || filters.submittedByUserId;
        if (submitterId) wb.addFilter('c.submitted_by', submitterId);

        if (filters.search) {
          wb.addSearch(['c.title', 'c.description', 'c.district', 'c.block', 'c.village'], filters.search);
        }

        const { whereClause, params } = wb.build();

        // Count Query
        const countQuery = `
          SELECT COUNT(*) as count
          FROM challenges c
          ${whereClause}
        `;
        const countRes = await pool.query(countQuery, params);
        const total = parseInt(countRes.rows[0]?.count || '0', 10);

        // Sort Sanitization
        const allowedSortCols: Record<string, string> = {
          createdAt: 'c.created_at',
          priority: 'c.priority',
          status: 'c.status',
          district: 'c.district',
          title: 'c.title',
        };
        const orderSql = buildOrderBy(filters, allowedSortCols, 'createdAt', 'DESC');

        // Parameterized Select Query (explicit projected columns only)
        const selectQuery = `
          SELECT ${CHALLENGE_COLUMNS_SQL},
                 p.full_name as submitter_name,
                 u.role as submitter_role,
                 cat.name as category_name
          FROM challenges c
          LEFT JOIN user_profiles p ON p.user_id = c.submitted_by
          LEFT JOIN users u ON u.id = c.submitted_by
          LEFT JOIN challenge_categories cat ON cat.id = c.category_id
          ${whereClause}
          ${orderSql}
          LIMIT $${params.length + 1} OFFSET $${params.length + 2}
        `;

        const queryParams = [...params, limit, offset];
        const res = await pool.query(selectQuery, queryParams);

        const items: Challenge[] = res.rows.map((row) => {
          const meta = typeof row.metadata === 'string' ? JSON.parse(row.metadata) : row.metadata || {};
          return {
            id: row.id,
            title: row.title,
            description: row.description,
            categoryId: row.category_id,
            category: meta.category || row.category_name || 'General',
            priority: row.priority,
            status: row.status,
            district: row.district,
            block: row.block || undefined,
            village: row.village || undefined,
            address: meta.address,
            latitude: row.latitude ? parseFloat(row.latitude) : undefined,
            longitude: row.longitude ? parseFloat(row.longitude) : undefined,
            submittedBy: row.submitted_by,
            submittedByName: row.submitter_name || 'Citizen',
            submittedByRole: row.submitter_role || 'CITIZEN',
            submittedByUserId: row.submitted_by,
            verifiedBy: row.verified_by || undefined,
            verificationStatus: row.verification_status,
            departmentId: meta.departmentId,
            departmentName: meta.departmentName,
            locationDetails: meta.locationDetails,
            impactedPopulationEstimate: meta.impactedPopulationEstimate,
            contactPreference: meta.contactPreference,
            supportingImageUrl: meta.supportingImageUrl,
            supportingDocumentUrl: meta.supportingDocumentUrl,
            tags: meta.tags || [],
            metadata: meta,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
          };
        });

        return {
          items,
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1,
        };
      } catch (err) {
        handleDbError(err, 'ChallengeRepository.findAll');
      }
    }

    // Memory Store Fallback
    let results = [...memoryChallenges];

    if (filters.status) results = results.filter((c) => c.status === filters.status);
    if (filters.district) results = results.filter((c) => c.district.toLowerCase() === filters.district!.toLowerCase());
    if (filters.block) results = results.filter((c) => c.block?.toLowerCase() === filters.block!.toLowerCase());
    if (filters.categoryId) results = results.filter((c) => c.categoryId === filters.categoryId);
    if (filters.category) results = results.filter((c) => c.category.toLowerCase() === filters.category!.toLowerCase());

    const submitter = filters.submittedBy || filters.submittedByUserId;
    if (submitter) results = results.filter((c) => c.submittedBy === submitter || c.submittedByUserId === submitter);

    if (filters.search) {
      const q = filters.search.toLowerCase();
      results = results.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.district.toLowerCase().includes(q) ||
          (c.tags && c.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }

    results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const total = results.length;
    const paginatedItems = results.slice(offset, offset + limit);

    return {
      items: paginatedItems,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  /**
   * Creates a challenge with parameterized queries and explicit columns.
   */
  async create(data: {
    title: string;
    description: string;
    categoryId?: string;
    category?: string;
    priority?: Challenge['priority'];
    district: string;
    block?: string;
    village?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
    submittedByUserId?: string;
    submittedBy?: string;
    submittedByName?: string;
    submittedByRole?: UserRole;
    departmentId?: string;
    departmentName?: string;
    locationDetails?: string;
    impactedPopulationEstimate?: number;
    contactPreference?: 'PHONE' | 'EMAIL' | 'PORTAL' | 'WHATSAPP';
    supportingImageUrl?: string;
    supportingDocumentUrl?: string;
    status?: ChallengeStatus;
    tags?: string[];
  }): Promise<Challenge> {
    const id = `ch-2026-${String(memoryChallenges.length + 1).padStart(3, '0')}`;
    const now = new Date().toISOString();
    const submitterId = data.submittedBy || data.submittedByUserId || 'usr-cit-01';

    const metadata: Record<string, unknown> = {
      category: data.category,
      departmentId: data.departmentId,
      departmentName: data.departmentName,
      locationDetails: data.locationDetails,
      address: data.address,
      impactedPopulationEstimate: data.impactedPopulationEstimate || 0,
      contactPreference: data.contactPreference || 'PORTAL',
      supportingImageUrl: data.supportingImageUrl,
      supportingDocumentUrl: data.supportingDocumentUrl,
      tags: data.tags || [],
    };

    const initialStatus: ChallengeStatus = data.status || 'SUBMITTED';

    const newChallenge: Challenge = {
      id,
      title: data.title,
      description: data.description,
      categoryId: data.categoryId || 'cat-general',
      category: data.category || 'General',
      priority: data.priority || 'MEDIUM',
      status: initialStatus,
      district: data.district,
      block: data.block,
      village: data.village,
      address: data.address,
      latitude: data.latitude,
      longitude: data.longitude,
      submittedBy: submitterId,
      submittedByName: data.submittedByName || 'Citizen',
      submittedByRole: data.submittedByRole || 'CITIZEN',
      submittedByUserId: submitterId,
      verificationStatus: 'PENDING',
      departmentId: data.departmentId,
      departmentName: data.departmentName,
      locationDetails: data.locationDetails,
      impactedPopulationEstimate: data.impactedPopulationEstimate || 0,
      contactPreference: data.contactPreference || 'PORTAL',
      supportingImageUrl: data.supportingImageUrl,
      supportingDocumentUrl: data.supportingDocumentUrl,
      tags: data.tags || [],
      metadata,
      createdAt: now,
      updatedAt: now,
    };

    const pool = getDbPool();
    if (pool && isDbConnected()) {
      try {
        const insertSql = `
          INSERT INTO challenges (
            id, title, description, category_id, priority, status,
            district, block, village, latitude, longitude,
            submitted_by, verification_status, metadata, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
          RETURNING ${CHALLENGE_COLUMNS_SQL}
        `;
        const params = [
          newChallenge.id,
          newChallenge.title,
          newChallenge.description,
          newChallenge.categoryId,
          newChallenge.priority,
          newChallenge.status,
          newChallenge.district,
          newChallenge.block || null,
          newChallenge.village || null,
          newChallenge.latitude || null,
          newChallenge.longitude || null,
          newChallenge.submittedBy,
          newChallenge.verificationStatus,
          JSON.stringify(newChallenge.metadata),
          now,
          now,
        ];
        await pool.query(insertSql, params);
        return newChallenge;
      } catch (err) {
        handleDbError(err, 'ChallengeRepository.create');
      }
    }

    memoryChallenges.unshift(newChallenge);
    return newChallenge;
  }

  /**
   * Updates challenge details before verification (Phase 3 requirement)
   */
  async update(id: string, data: UpdateChallengeDTO): Promise<Challenge | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    const now = new Date().toISOString();
    const updatedMeta = {
      ...(existing.metadata || {}),
      ...(data.metadata || {}),
      ...(data.address ? { address: data.address } : {}),
      ...(data.contactPreference ? { contactPreference: data.contactPreference } : {}),
      ...(data.supportingImageUrl ? { supportingImageUrl: data.supportingImageUrl } : {}),
      ...(data.supportingDocumentUrl ? { supportingDocumentUrl: data.supportingDocumentUrl } : {}),
      ...(data.category ? { category: data.category } : {}),
      ...(data.impactedPopulationEstimate !== undefined ? { impactedPopulationEstimate: data.impactedPopulationEstimate } : {}),
    };

    const pool = getDbPool();
    if (pool && isDbConnected()) {
      try {
        const updateSql = `
          UPDATE challenges
          SET title = COALESCE($1, title),
              description = COALESCE($2, description),
              priority = COALESCE($3, priority),
              district = COALESCE($4, district),
              block = COALESCE($5, block),
              village = COALESCE($6, village),
              latitude = COALESCE($7, latitude),
              longitude = COALESCE($8, longitude),
              metadata = $9,
              updated_at = $10
          WHERE id = $11
          RETURNING ${CHALLENGE_COLUMNS_SQL}
        `;
        const params = [
          data.title || null,
          data.description || null,
          data.priority || null,
          data.district || null,
          data.block || null,
          data.village || null,
          data.latitude || null,
          data.longitude || null,
          JSON.stringify(updatedMeta),
          now,
          id,
        ];
        await pool.query(updateSql, params);
        return this.findById(id);
      } catch (err) {
        handleDbError(err, 'ChallengeRepository.update');
      }
    }

    const index = memoryChallenges.findIndex((c) => c.id === id);
    if (index === -1) return null;

    memoryChallenges[index] = {
      ...memoryChallenges[index],
      title: data.title || memoryChallenges[index].title,
      description: data.description || memoryChallenges[index].description,
      category: data.category || memoryChallenges[index].category,
      priority: data.priority || memoryChallenges[index].priority,
      district: data.district || memoryChallenges[index].district,
      block: data.block !== undefined ? data.block : memoryChallenges[index].block,
      village: data.village !== undefined ? data.village : memoryChallenges[index].village,
      address: data.address !== undefined ? data.address : memoryChallenges[index].address,
      latitude: data.latitude !== undefined ? data.latitude : memoryChallenges[index].latitude,
      longitude: data.longitude !== undefined ? data.longitude : memoryChallenges[index].longitude,
      impactedPopulationEstimate:
        data.impactedPopulationEstimate !== undefined
          ? data.impactedPopulationEstimate
          : memoryChallenges[index].impactedPopulationEstimate,
      contactPreference: data.contactPreference || memoryChallenges[index].contactPreference,
      supportingImageUrl: data.supportingImageUrl || memoryChallenges[index].supportingImageUrl,
      supportingDocumentUrl: data.supportingDocumentUrl || memoryChallenges[index].supportingDocumentUrl,
      tags: data.tags || memoryChallenges[index].tags,
      metadata: updatedMeta,
      updatedAt: now,
    };

    return memoryChallenges[index];
  }

  /**
   * Updates status and optional verification tracking.
   */
  async updateStatus(
    id: string,
    status: ChallengeStatus,
    verifiedBy?: string,
    verificationStatus?: 'PENDING' | 'VERIFIED' | 'REJECTED'
  ): Promise<Challenge | null> {
    const now = new Date().toISOString();
    const pool = getDbPool();

    if (pool && isDbConnected()) {
      try {
        const updateSql = `
          UPDATE challenges
          SET status = $1,
              verified_by = COALESCE($2, verified_by),
              verification_status = COALESCE($3, verification_status),
              updated_at = $4
          WHERE id = $5
          RETURNING ${CHALLENGE_COLUMNS_SQL}
        `;
        const res = await pool.query(updateSql, [status, verifiedBy || null, verificationStatus || null, now, id]);
        if (res.rows[0]) {
          return this.findById(id);
        }
        return null;
      } catch (err) {
        handleDbError(err, 'ChallengeRepository.updateStatus');
      }
    }

    const item = memoryChallenges.find((c) => c.id === id);
    if (!item) return null;
    item.status = status;
    if (verifiedBy) item.verifiedBy = verifiedBy;
    if (verificationStatus) item.verificationStatus = verificationStatus;
    item.updatedAt = now;
    return item;
  }

  /**
   * Aggregates challenge counts for dashboards.
   */
  async getStats(): Promise<ChallengeStats> {
    const pool = getDbPool();

    if (pool && isDbConnected()) {
      try {
        const statusQuery = `
          SELECT status, COUNT(*) as count
          FROM challenges
          GROUP BY status
        `;
        const catQuery = `
          SELECT COALESCE(cat.name, c.category_id) as category_name, COUNT(*) as count
          FROM challenges c
          LEFT JOIN challenge_categories cat ON cat.id = c.category_id
          GROUP BY COALESCE(cat.name, c.category_id)
        `;
        const distQuery = `
          SELECT district, COUNT(*) as count
          FROM challenges
          GROUP BY district
        `;

        const [statusRes, catRes, distRes] = await Promise.all([
          pool.query(statusQuery),
          pool.query(catQuery),
          pool.query(distQuery),
        ]);

        const stats: ChallengeStats = {
          total: 0,
          submitted: 0,
          underReview: 0,
          accepted: 0,
          inProgress: 0,
          resolved: 0,
          byCategory: {},
          byDistrict: {},
        };

        for (const r of statusRes.rows) {
          const cnt = parseInt(r.count, 10);
          stats.total += cnt;
          if (r.status === 'SUBMITTED' || r.status === 'DRAFT') stats.submitted += cnt;
          else if (r.status === 'UNDER_REVIEW') stats.underReview += cnt;
          else if (r.status === 'VERIFIED' || r.status === 'ACCEPTED' || r.status === 'ASSIGNED') stats.accepted += cnt;
          else if (r.status === 'IN_PROGRESS' || r.status === 'PILOT') stats.inProgress += cnt;
          else if (r.status === 'RESOLVED' || r.status === 'CLOSED') stats.resolved += cnt;
        }

        for (const r of catRes.rows) {
          stats.byCategory[r.category_name] = parseInt(r.count, 10);
        }

        for (const r of distRes.rows) {
          stats.byDistrict[r.district] = parseInt(r.count, 10);
        }

        return stats;
      } catch (err) {
        handleDbError(err, 'ChallengeRepository.getStats');
      }
    }

    const list = memoryChallenges;
    const stats: ChallengeStats = {
      total: list.length,
      submitted: 0,
      underReview: 0,
      accepted: 0,
      inProgress: 0,
      resolved: 0,
      byCategory: {},
      byDistrict: {},
    };

    for (const c of list) {
      if (c.status === 'SUBMITTED' || c.status === 'DRAFT') stats.submitted++;
      else if (c.status === 'UNDER_REVIEW') stats.underReview++;
      else if (c.status === 'VERIFIED' || c.status === 'ACCEPTED' || c.status === 'ASSIGNED') stats.accepted++;
      else if (c.status === 'IN_PROGRESS' || c.status === 'PILOT') stats.inProgress++;
      else if (c.status === 'RESOLVED' || c.status === 'CLOSED') stats.resolved++;

      const cat = c.category || 'General';
      stats.byCategory[cat] = (stats.byCategory[cat] || 0) + 1;
      stats.byDistrict[c.district] = (stats.byDistrict[c.district] || 0) + 1;
    }

    return stats;
  }
}

export const challengeRepository = new ChallengeRepository();
