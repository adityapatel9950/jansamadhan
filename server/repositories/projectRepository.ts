import {
  Project,
  ProjectMilestone,
  SolutionProposal,
  ImpactMetric,
  ProjectQueryFilters,
  ProjectStage,
  MilestoneStatus,
} from '../types/project.js';
import { getDbPool, isDbConnected } from '../config/db.js';
import {
  buildPagination,
  buildOrderBy,
  buildWhereBuilder,
  handleDbError,
  PaginationResult,
} from '../utils/dbUtils.js';

const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-01',
    challengeId: 'ch-2026-001',
    title: 'Low-Head Micro-Solar Drip Automation Controller',
    description: 'Autonomous low-pressure drip irrigation unit with sub-surface capacitive soil moisture monitoring, designed for un-electrified tribal plateau farmland in Ormanjhi.',
    universityId: 'uni-bit-01',
    teamId: 'team-02',
    stage: 'PROTOTYPE',
    budgetAllocated: 45000,
    startDate: '2026-02-10',
    targetCompletionDate: '2026-05-30',
    status: 'ACTIVE',
    challengeTitle: 'Solar-Powered Low-Head Drip Irrigation for Plateau Terraces in Ormanjhi',
    universityName: 'BIT Mesra',
    teamName: 'Jharkhand Agrotech Cohort',
    createdAt: '2026-02-10T10:00:00Z',
    updatedAt: '2026-02-18T12:00:00Z',
  },
  {
    id: 'proj-02',
    challengeId: 'ch-2026-002',
    title: 'Activated Bauxite-Alumina Household Fluoride Filter',
    description: 'Low-cost gravity flow filtration cartridge utilizing locally abundant bauxite residue from Lohardaga mines to absorb fluoride ions below 0.8 ppm.',
    universityId: 'uni-nit-03',
    teamId: 'team-01',
    stage: 'FIELD_TESTING',
    budgetAllocated: 60000,
    startDate: '2026-02-01',
    targetCompletionDate: '2026-06-15',
    status: 'ACTIVE',
    challengeTitle: 'Fluoride and Iron Contamination Remediation in Ground Wells of Chainpur',
    universityName: 'NIT Jamshedpur',
    teamName: 'Team Birsa Innovators',
    createdAt: '2026-02-01T14:00:00Z',
    updatedAt: '2026-02-20T16:00:00Z',
  },
];

const INITIAL_MILESTONES: ProjectMilestone[] = [
  {
    id: 'ms-01',
    projectId: 'proj-01',
    title: 'Benchtop Sensor Calibration & Circuit Schematics',
    description: 'Validate analog soil dielectric probes across Ormanjhi red laterite soil samples.',
    dueDate: '2026-03-15',
    completionDate: '2026-03-12',
    status: 'COMPLETED',
    verifiedBy: 'usr-fac-01',
    createdAt: '2026-02-10T10:00:00Z',
    updatedAt: '2026-03-12T15:00:00Z',
  },
  {
    id: 'ms-02',
    projectId: 'proj-01',
    title: 'Field Enclosure 3D Print & Solar MPPT Integration',
    description: 'Weatherproof IP65 housing for field installation in Baridih village.',
    dueDate: '2026-04-10',
    status: 'PENDING',
    createdAt: '2026-02-10T10:00:00Z',
    updatedAt: '2026-02-10T10:00:00Z',
  },
];

const INITIAL_PROPOSALS: SolutionProposal[] = [
  {
    id: 'prop-01',
    challengeId: 'ch-2026-001',
    proposerId: 'usr-stu-01',
    proposerRole: 'STUDENT',
    title: 'Low-Head Solar Drip Automation System',
    summary: 'An ultra low-power ESP32 microcontroller system powered by a 20W mini solar panel that actuates a 12V motorized ball valve based on capacitive soil moisture.',
    technicalStack: 'ESP32, LoRa SX1276, Solenoid Valves, Flutter App',
    estimatedBudget: 45000,
    estimatedDurationMonths: 3,
    status: 'APPROVED',
    createdAt: '2026-02-05T09:00:00Z',
    updatedAt: '2026-02-08T11:00:00Z',
  },
  {
    id: 'prop-02',
    challengeId: 'ch-2026-003',
    proposerId: 'usr-fac-01',
    proposerRole: 'FACULTY',
    title: 'Spectroscopic NIR Handheld Lac Purity Analyzer',
    summary: 'A portable handheld device using narrow-band near-infrared LEDs to quantify resin moisture and foreign bark debris within 45 seconds on field.',
    technicalStack: 'AS7265x Spectral Sensor, STM32, BLE, Python ML',
    estimatedBudget: 85000,
    estimatedDurationMonths: 4,
    status: 'UNDER_EVALUATION',
    createdAt: '2026-02-15T14:30:00Z',
    updatedAt: '2026-02-15T14:30:00Z',
  },
];

const INITIAL_METRICS: ImpactMetric[] = [
  {
    id: 'met-01',
    challengeId: 'ch-2026-001',
    projectId: 'proj-01',
    metricKey: 'WATER_LITERS_SAVED',
    metricValue: 185000,
    unit: 'Liters/Month',
    measuredDate: '2026-02-24',
    verifiedBy: 'usr-gov-01',
    createdAt: '2026-02-24T10:00:00Z',
  },
];

let memoryProjects: Project[] = [...INITIAL_PROJECTS];
let memoryMilestones: ProjectMilestone[] = [...INITIAL_MILESTONES];
let memoryProposals: SolutionProposal[] = [...INITIAL_PROPOSALS];
let memoryMetrics: ImpactMetric[] = [...INITIAL_METRICS];

const PROJECT_COLUMNS_SQL = `
  p.id, p.challenge_id, p.title, p.description, p.team_id,
  p.university_id, p.industry_partner_id, p.stage, p.budget_allocated,
  p.start_date, p.target_completion_date, p.status, p.created_at, p.updated_at
`;

export class ProjectRepository {
  async findAll(filters: ProjectQueryFilters = {}): Promise<PaginationResult<Project>> {
    const { page, limit, offset } = buildPagination(filters);
    const pool = getDbPool();

    if (pool && isDbConnected()) {
      try {
        const wb = buildWhereBuilder();
        if (filters.challengeId) wb.addFilter('p.challenge_id', filters.challengeId);
        if (filters.universityId) wb.addFilter('p.university_id', filters.universityId);
        if (filters.teamId) wb.addFilter('p.team_id', filters.teamId);
        if (filters.stage) wb.addFilter('p.stage', filters.stage);
        if (filters.status) wb.addFilter('p.status', filters.status);
        if (filters.search) wb.addSearch(['p.title', 'p.description'], filters.search);

        const { whereClause, params, nextParamIndex } = wb.build();

        const countQuery = `SELECT COUNT(*) as count FROM projects p ${whereClause}`;
        const countRes = await pool.query(countQuery, params);
        const total = parseInt(countRes.rows[0]?.count || '0', 10);

        const allowedSortCols: Record<string, string> = {
          createdAt: 'p.created_at',
          title: 'p.title',
          stage: 'p.stage',
          budgetAllocated: 'p.budget_allocated',
        };
        const orderSql = buildOrderBy(filters, allowedSortCols, 'createdAt', 'DESC');

        const selectQuery = `
          SELECT ${PROJECT_COLUMNS_SQL},
                 c.title as challenge_title,
                 u.name as university_name,
                 st.team_name
          FROM projects p
          LEFT JOIN challenges c ON c.id = p.challenge_id
          LEFT JOIN universities u ON u.id = p.university_id
          LEFT JOIN student_teams st ON st.id = p.team_id
          ${whereClause}
          ${orderSql}
          LIMIT $${nextParamIndex} OFFSET $${nextParamIndex + 1}
        `;
        const selectParams = [...params, limit, offset];
        const res = await pool.query(selectQuery, selectParams);

        const items: Project[] = res.rows.map((row) => ({
          id: row.id,
          challengeId: row.challenge_id,
          title: row.title,
          description: row.description,
          teamId: row.team_id,
          universityId: row.university_id,
          industryPartnerId: row.industry_partner_id,
          stage: row.stage,
          budgetAllocated: parseFloat(row.budget_allocated) || 0,
          startDate: row.start_date,
          targetCompletionDate: row.target_completion_date,
          status: row.status,
          challengeTitle: row.challenge_title,
          universityName: row.university_name,
          teamName: row.team_name,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        }));

        return { items, total, page, limit, totalPages: Math.ceil(total / limit) || 1 };
      } catch (err) {
        handleDbError(err, 'ProjectRepository.findAll');
      }
    }

    let results = [...memoryProjects];
    if (filters.challengeId) results = results.filter((p) => p.challengeId === filters.challengeId);
    if (filters.universityId) results = results.filter((p) => p.universityId === filters.universityId);
    if (filters.stage) results = results.filter((p) => p.stage === filters.stage);
    if (filters.status) results = results.filter((p) => p.status === filters.status);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      results = results.filter((p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }

    const total = results.length;
    const items = results.slice(offset, offset + limit);

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) || 1 };
  }

  async findById(id: string): Promise<Project | null> {
    const pool = getDbPool();
    if (pool && isDbConnected()) {
      try {
        const query = `
          SELECT ${PROJECT_COLUMNS_SQL},
                 c.title as challenge_title,
                 u.name as university_name,
                 st.team_name
          FROM projects p
          LEFT JOIN challenges c ON c.id = p.challenge_id
          LEFT JOIN universities u ON u.id = p.university_id
          LEFT JOIN student_teams st ON st.id = p.team_id
          WHERE p.id = $1
          LIMIT 1
        `;
        const res = await pool.query(query, [id]);
        if (res.rows[0]) {
          const row = res.rows[0];
          return {
            id: row.id,
            challengeId: row.challenge_id,
            title: row.title,
            description: row.description,
            teamId: row.team_id,
            universityId: row.university_id,
            industryPartnerId: row.industry_partner_id,
            stage: row.stage,
            budgetAllocated: parseFloat(row.budget_allocated) || 0,
            startDate: row.start_date,
            targetCompletionDate: row.target_completion_date,
            status: row.status,
            challengeTitle: row.challenge_title,
            universityName: row.university_name,
            teamName: row.team_name,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
          };
        }
        return null;
      } catch (err) {
        handleDbError(err, 'ProjectRepository.findById');
      }
    }
    return memoryProjects.find((p) => p.id === id) || null;
  }

  async createProject(data: {
    challengeId: string;
    title: string;
    description: string;
    teamId?: string;
    universityId?: string;
    industryPartnerId?: string;
    budgetAllocated?: number;
    startDate?: string;
    targetCompletionDate?: string;
  }): Promise<Project> {
    const id = `proj-${Date.now()}`;
    const now = new Date().toISOString();
    const newProject: Project = {
      id,
      challengeId: data.challengeId,
      title: data.title,
      description: data.description,
      teamId: data.teamId,
      universityId: data.universityId,
      industryPartnerId: data.industryPartnerId,
      stage: 'IDEATION',
      budgetAllocated: data.budgetAllocated || 0,
      startDate: data.startDate,
      targetCompletionDate: data.targetCompletionDate,
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now,
    };

    const pool = getDbPool();
    if (pool && isDbConnected()) {
      try {
        const query = `
          INSERT INTO projects (
            id, challenge_id, title, description, team_id,
            university_id, industry_partner_id, stage, budget_allocated,
            start_date, target_completion_date, status, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
          RETURNING id, challenge_id, title, description, stage, budget_allocated, status, created_at, updated_at
        `;
        const res = await pool.query(query, [
          newProject.id,
          newProject.challengeId,
          newProject.title,
          newProject.description,
          newProject.teamId || null,
          newProject.universityId || null,
          newProject.industryPartnerId || null,
          newProject.stage,
          newProject.budgetAllocated,
          newProject.startDate || null,
          newProject.targetCompletionDate || null,
          newProject.status,
          newProject.createdAt,
          newProject.updatedAt,
        ]);
        if (res.rows[0]) return res.rows[0];
      } catch (err) {
        handleDbError(err, 'ProjectRepository.createProject');
      }
    }

    memoryProjects.unshift(newProject);
    return newProject;
  }

  async updateStage(id: string, stage: ProjectStage): Promise<Project | null> {
    const now = new Date().toISOString();
    const pool = getDbPool();

    if (pool && isDbConnected()) {
      try {
        const query = `
          UPDATE projects
          SET stage = $1, updated_at = $2
          WHERE id = $3
          RETURNING id, challenge_id, title, stage, status, updated_at
        `;
        const res = await pool.query(query, [stage, now, id]);
        if (res.rows[0]) return this.findById(id);
        return null;
      } catch (err) {
        handleDbError(err, 'ProjectRepository.updateStage');
      }
    }

    const item = memoryProjects.find((p) => p.id === id);
    if (!item) return null;
    item.stage = stage;
    item.updatedAt = now;
    return item;
  }

  async getMilestones(projectId: string): Promise<ProjectMilestone[]> {
    const pool = getDbPool();
    if (pool && isDbConnected()) {
      try {
        const query = `
          SELECT id, project_id, title, description, due_date, completion_date, status, verified_by, created_at, updated_at
          FROM project_milestones
          WHERE project_id = $1
          ORDER BY due_date ASC
        `;
        const res = await pool.query(query, [projectId]);
        return res.rows.map((row) => ({
          id: row.id,
          projectId: row.project_id,
          title: row.title,
          description: row.description,
          dueDate: row.due_date,
          completionDate: row.completion_date,
          status: row.status,
          verifiedBy: row.verified_by,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        }));
      } catch (err) {
        handleDbError(err, 'ProjectRepository.getMilestones');
      }
    }
    return memoryMilestones.filter((m) => m.projectId === projectId);
  }

  async addMilestone(data: {
    projectId: string;
    title: string;
    description?: string;
    dueDate?: string;
  }): Promise<ProjectMilestone> {
    const id = `ms-${Date.now()}`;
    const now = new Date().toISOString();
    const milestone: ProjectMilestone = {
      id,
      projectId: data.projectId,
      title: data.title,
      description: data.description,
      dueDate: data.dueDate,
      status: 'PENDING',
      createdAt: now,
      updatedAt: now,
    };

    const pool = getDbPool();
    if (pool && isDbConnected()) {
      try {
        const query = `
          INSERT INTO project_milestones (id, project_id, title, description, due_date, status, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          RETURNING id, project_id, title, description, due_date, status, created_at, updated_at
        `;
        const res = await pool.query(query, [
          milestone.id,
          milestone.projectId,
          milestone.title,
          milestone.description || null,
          milestone.dueDate || null,
          milestone.status,
          milestone.createdAt,
          milestone.updatedAt,
        ]);
        if (res.rows[0]) return res.rows[0];
      } catch (err) {
        handleDbError(err, 'ProjectRepository.addMilestone');
      }
    }

    memoryMilestones.push(milestone);
    return milestone;
  }

  async getProposalsForChallenge(challengeId: string): Promise<SolutionProposal[]> {
    const pool = getDbPool();
    if (pool && isDbConnected()) {
      try {
        const query = `
          SELECT id, challenge_id, proposer_id, proposer_role, title, summary,
                 technical_stack, estimated_budget, estimated_duration_months,
                 status, reviewer_feedback, created_at, updated_at
          FROM solution_proposals
          WHERE challenge_id = $1
          ORDER BY created_at DESC
        `;
        const res = await pool.query(query, [challengeId]);
        return res.rows.map((row) => ({
          id: row.id,
          challengeId: row.challenge_id,
          proposerId: row.proposer_id,
          proposerRole: row.proposer_role,
          title: row.title,
          summary: row.summary,
          technicalStack: row.technical_stack,
          estimatedBudget: parseFloat(row.estimated_budget) || 0,
          estimatedDurationMonths: row.estimated_duration_months,
          status: row.status,
          reviewerFeedback: row.reviewer_feedback,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        }));
      } catch (err) {
        handleDbError(err, 'ProjectRepository.getProposalsForChallenge');
      }
    }
    return memoryProposals.filter((p) => p.challengeId === challengeId);
  }

  async createProposal(data: {
    challengeId: string;
    proposerId: string;
    proposerRole: string;
    title: string;
    summary: string;
    technicalStack?: string;
    estimatedBudget?: number;
    estimatedDurationMonths?: number;
  }): Promise<SolutionProposal> {
    const id = `prop-${Date.now()}`;
    const now = new Date().toISOString();
    const proposal: SolutionProposal = {
      id,
      challengeId: data.challengeId,
      proposerId: data.proposerId,
      proposerRole: data.proposerRole,
      title: data.title,
      summary: data.summary,
      technicalStack: data.technicalStack,
      estimatedBudget: data.estimatedBudget || 0,
      estimatedDurationMonths: data.estimatedDurationMonths || 3,
      status: 'PROPOSED',
      createdAt: now,
      updatedAt: now,
    };

    const pool = getDbPool();
    if (pool && isDbConnected()) {
      try {
        const query = `
          INSERT INTO solution_proposals (
            id, challenge_id, proposer_id, proposer_role, title, summary,
            technical_stack, estimated_budget, estimated_duration_months, status, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
          RETURNING id, challenge_id, title, status, created_at
        `;
        const res = await pool.query(query, [
          proposal.id,
          proposal.challengeId,
          proposal.proposerId,
          proposal.proposerRole,
          proposal.title,
          proposal.summary,
          proposal.technicalStack || null,
          proposal.estimatedBudget,
          proposal.estimatedDurationMonths,
          proposal.status,
          proposal.createdAt,
          proposal.updatedAt,
        ]);
        if (res.rows[0]) return proposal;
      } catch (err) {
        handleDbError(err, 'ProjectRepository.createProposal');
      }
    }

    memoryProposals.unshift(proposal);
    return proposal;
  }

  async getImpactMetrics(challengeId: string): Promise<ImpactMetric[]> {
    const pool = getDbPool();
    if (pool && isDbConnected()) {
      try {
        const query = `
          SELECT id, challenge_id, project_id, metric_key, metric_value, unit, measured_date, verified_by, created_at
          FROM impact_metrics
          WHERE challenge_id = $1
          ORDER BY measured_date DESC
        `;
        const res = await pool.query(query, [challengeId]);
        return res.rows.map((row) => ({
          id: row.id,
          challengeId: row.challenge_id,
          projectId: row.project_id,
          metricKey: row.metric_key,
          metricValue: parseFloat(row.metric_value),
          unit: row.unit,
          measuredDate: row.measured_date,
          verifiedBy: row.verified_by,
          createdAt: row.created_at,
        }));
      } catch (err) {
        handleDbError(err, 'ProjectRepository.getImpactMetrics');
      }
    }
    return memoryMetrics.filter((m) => m.challengeId === challengeId);
  }
}

export const projectRepository = new ProjectRepository();
