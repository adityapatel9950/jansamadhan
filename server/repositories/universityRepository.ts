import { University, Faculty, StudentTeam, UniversityQueryFilters } from '../types/university.js';
import { getDbPool, isDbConnected } from '../config/db.js';
import {
  buildPagination,
  buildOrderBy,
  buildWhereBuilder,
  handleDbError,
  PaginationResult,
} from '../utils/dbUtils.js';

const INITIAL_UNIVERSITIES: University[] = [
  {
    id: 'uni-bit-01',
    name: 'Birla Institute of Technology (BIT) Mesra',
    code: 'BIT-MESRA',
    district: 'Ranchi',
    institutionType: 'DEEMED',
    contactEmail: 'incubation@bitmesra.ac.in',
    contactPhone: '+91-651-2275444',
    incubationCellName: 'Centre for Quantitative Research & Rural Incubation',
    isActive: true,
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'uni-iit-02',
    name: 'Indian Institute of Technology (Indian School of Mines) Dhanbad',
    code: 'IIT-ISM',
    district: 'Dhanbad',
    institutionType: 'CENTRAL',
    contactEmail: 'academics@iitism.ac.in',
    contactPhone: '+91-326-2235001',
    incubationCellName: 'Centre of Excellence in Mining & IoT Sensors',
    isActive: true,
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'uni-nit-03',
    name: 'National Institute of Technology (NIT) Jamshedpur',
    code: 'NIT-JSR',
    district: 'East Singhbhum',
    institutionType: 'CENTRAL',
    contactEmail: 'dean.acad@nitjsr.ac.in',
    contactPhone: '+91-657-2282234',
    incubationCellName: 'Tribal Appropriate Technology Innovation Center',
    isActive: true,
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'uni-ru-04',
    name: 'Ranchi University',
    code: 'RU-RANCHI',
    district: 'Ranchi',
    institutionType: 'STATE_GOVT',
    contactEmail: 'registrar@ranchiuniversity.ac.in',
    contactPhone: '+91-651-2208553',
    incubationCellName: 'University Innovation & Tribal Livelihoods Cluster',
    isActive: true,
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'uni-poly-05',
    name: 'Government Polytechnic Hazaribagh',
    code: 'GP-HZB',
    district: 'Hazaribagh',
    institutionType: 'POLYTECHNIC',
    contactEmail: 'principal.gphzb@jharkhand.gov.in',
    contactPhone: '+91-6546-264421',
    incubationCellName: 'Rural Mechanical & IoT Skill Cell',
    isActive: true,
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-01-10T10:00:00Z',
  },
];

const INITIAL_FACULTY: Faculty[] = [
  {
    id: 'fac-01',
    userId: 'usr-fac-01',
    universityId: 'uni-nit-03',
    departmentName: 'Mechanical & Robotics',
    specialization: 'Appropriate Technology for Tribal Habitations',
    designation: 'Associate Professor',
    labName: 'Tribal Appropriate Technology Innovation Center',
    fullName: 'Prof. R. K. Sinha',
    email: 'prof.rk.sinha@nitjsr.ac.in',
    universityName: 'NIT Jamshedpur',
    createdAt: '2026-01-16T12:00:00Z',
    updatedAt: '2026-01-16T12:00:00Z',
  },
  {
    id: 'fac-02',
    userId: 'usr-uni-01',
    universityId: 'uni-bit-01',
    departmentName: 'Computer Science & Engineering',
    specialization: 'Distributed Systems & Data Networks',
    designation: 'Dean & Professor',
    fullName: 'Dr. Vandana Bhattacharjee',
    email: 'dean.research@bitmesra.ac.in',
    universityName: 'BIT Mesra',
    createdAt: '2026-01-12T10:00:00Z',
    updatedAt: '2026-01-12T10:00:00Z',
  },
];

const INITIAL_TEAMS: StudentTeam[] = [
  {
    id: 'team-01',
    teamName: 'Team Birsa Innovators',
    universityId: 'uni-iit-02',
    leadStudentId: 'usr-stu-01',
    facultyMentorId: 'usr-fac-01',
    status: 'ACTIVE',
    leadStudentName: 'Priya Singh',
    universityName: 'IIT (ISM) Dhanbad',
    memberCount: 5,
    createdAt: '2026-01-18T11:00:00Z',
    updatedAt: '2026-01-18T11:00:00Z',
  },
  {
    id: 'team-02',
    teamName: 'Jharkhand Agrotech Cohort',
    universityId: 'uni-bit-01',
    leadStudentId: 'usr-stu-02',
    facultyMentorId: 'usr-uni-01',
    status: 'ACTIVE',
    leadStudentName: 'Amit Soren',
    universityName: 'BIT Mesra',
    memberCount: 4,
    createdAt: '2026-01-22T14:00:00Z',
    updatedAt: '2026-01-22T14:00:00Z',
  },
];

let memoryUniversities: University[] = [...INITIAL_UNIVERSITIES];
let memoryFaculty: Faculty[] = [...INITIAL_FACULTY];
let memoryTeams: StudentTeam[] = [...INITIAL_TEAMS];

const UNIVERSITY_COLUMNS_SQL = `
  id, name, code, district, institution_type, contact_email,
  contact_phone, incubation_cell_name, is_active, created_at, updated_at
`;

export class UniversityRepository {
  /**
   * Retrieves paginated universities with district filtering and search.
   */
  async findAll(filters: UniversityQueryFilters = {}): Promise<PaginationResult<University>> {
    const { page, limit, offset } = buildPagination(filters);
    const pool = getDbPool();

    if (pool && isDbConnected()) {
      try {
        const wb = buildWhereBuilder();
        if (filters.district) wb.addFilter('district', filters.district);
        if (filters.institutionType) wb.addFilter('institution_type', filters.institutionType);
        if (filters.search) wb.addSearch(['name', 'code', 'district'], filters.search);

        const { whereClause, params, nextParamIndex } = wb.build();

        const countQuery = `SELECT COUNT(*) as count FROM universities ${whereClause}`;
        const countRes = await pool.query(countQuery, params);
        const total = parseInt(countRes.rows[0]?.count || '0', 10);

        const allowedSortCols: Record<string, string> = {
          name: 'name',
          code: 'code',
          district: 'district',
          createdAt: 'created_at',
        };
        const orderSql = buildOrderBy(filters, allowedSortCols, 'name', 'ASC');

        const selectQuery = `
          SELECT ${UNIVERSITY_COLUMNS_SQL}
          FROM universities
          ${whereClause}
          ${orderSql}
          LIMIT $${nextParamIndex} OFFSET $${nextParamIndex + 1}
        `;
        const selectParams = [...params, limit, offset];
        const res = await pool.query(selectQuery, selectParams);

        const items: University[] = res.rows.map((row) => ({
          id: row.id,
          name: row.name,
          code: row.code,
          district: row.district,
          institutionType: row.institution_type,
          contactEmail: row.contact_email,
          contactPhone: row.contact_phone,
          incubationCellName: row.incubation_cell_name,
          isActive: row.is_active,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        }));

        return { items, total, page, limit, totalPages: Math.ceil(total / limit) || 1 };
      } catch (err) {
        handleDbError(err, 'UniversityRepository.findAll');
      }
    }

    let results = [...memoryUniversities];
    if (filters.district) results = results.filter((u) => u.district.toLowerCase() === filters.district!.toLowerCase());
    if (filters.institutionType) results = results.filter((u) => u.institutionType === filters.institutionType);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      results = results.filter((u) => u.name.toLowerCase().includes(q) || u.code.toLowerCase().includes(q));
    }

    const total = results.length;
    const items = results.slice(offset, offset + limit);

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) || 1 };
  }

  async findById(id: string): Promise<University | null> {
    const pool = getDbPool();
    if (pool && isDbConnected()) {
      try {
        const query = `
          SELECT ${UNIVERSITY_COLUMNS_SQL}
          FROM universities
          WHERE id = $1
          LIMIT 1
        `;
        const res = await pool.query(query, [id]);
        if (res.rows[0]) {
          const row = res.rows[0];
          return {
            id: row.id,
            name: row.name,
            code: row.code,
            district: row.district,
            institutionType: row.institution_type,
            contactEmail: row.contact_email,
            contactPhone: row.contact_phone,
            incubationCellName: row.incubation_cell_name,
            isActive: row.is_active,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
          };
        }
        return null;
      } catch (err) {
        handleDbError(err, 'UniversityRepository.findById');
      }
    }
    return memoryUniversities.find((u) => u.id === id) || null;
  }

  async findFacultyByUniversity(universityId: string): Promise<Faculty[]> {
    const pool = getDbPool();
    if (pool && isDbConnected()) {
      try {
        const query = `
          SELECT f.id, f.user_id, f.university_id, f.department_name, f.specialization,
                 f.designation, f.lab_name, f.created_at, f.updated_at,
                 p.full_name, u.email, un.name as university_name
          FROM faculty f
          LEFT JOIN user_profiles p ON p.user_id = f.user_id
          LEFT JOIN users u ON u.id = f.user_id
          LEFT JOIN universities un ON un.id = f.university_id
          WHERE f.university_id = $1
          ORDER BY f.department_name ASC
        `;
        const res = await pool.query(query, [universityId]);
        return res.rows.map((row) => ({
          id: row.id,
          userId: row.user_id,
          universityId: row.university_id,
          departmentName: row.department_name,
          specialization: row.specialization,
          designation: row.designation,
          labName: row.lab_name,
          fullName: row.full_name,
          email: row.email,
          universityName: row.university_name,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        }));
      } catch (err) {
        handleDbError(err, 'UniversityRepository.findFacultyByUniversity');
      }
    }
    return memoryFaculty.filter((f) => f.universityId === universityId);
  }

  async findTeamsByUniversity(universityId: string): Promise<StudentTeam[]> {
    const pool = getDbPool();
    if (pool && isDbConnected()) {
      try {
        const query = `
          SELECT st.id, st.team_name, st.university_id, st.lead_student_id,
                 st.faculty_mentor_id, st.status, st.created_at, st.updated_at,
                 p.full_name as lead_student_name, un.name as university_name
          FROM student_teams st
          LEFT JOIN user_profiles p ON p.user_id = st.lead_student_id
          LEFT JOIN universities un ON un.id = st.university_id
          WHERE st.university_id = $1
          ORDER BY st.team_name ASC
        `;
        const res = await pool.query(query, [universityId]);
        return res.rows.map((row) => ({
          id: row.id,
          teamName: row.team_name,
          universityId: row.university_id,
          leadStudentId: row.lead_student_id,
          facultyMentorId: row.faculty_mentor_id,
          status: row.status,
          leadStudentName: row.lead_student_name,
          universityName: row.university_name,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        }));
      } catch (err) {
        handleDbError(err, 'UniversityRepository.findTeamsByUniversity');
      }
    }
    return memoryTeams.filter((t) => t.universityId === universityId);
  }

  async createStudentTeam(data: {
    teamName: string;
    universityId: string;
    leadStudentId: string;
    facultyMentorId?: string;
  }): Promise<StudentTeam> {
    const id = `team-${Date.now()}`;
    const now = new Date().toISOString();
    const newTeam: StudentTeam = {
      id,
      teamName: data.teamName,
      universityId: data.universityId,
      leadStudentId: data.leadStudentId,
      facultyMentorId: data.facultyMentorId,
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now,
    };

    const pool = getDbPool();
    if (pool && isDbConnected()) {
      try {
        const query = `
          INSERT INTO student_teams (id, team_name, university_id, lead_student_id, faculty_mentor_id, status, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          RETURNING id, team_name, university_id, lead_student_id, faculty_mentor_id, status, created_at, updated_at
        `;
        const res = await pool.query(query, [
          newTeam.id,
          newTeam.teamName,
          newTeam.universityId,
          newTeam.leadStudentId,
          newTeam.facultyMentorId || null,
          newTeam.status,
          newTeam.createdAt,
          newTeam.updatedAt,
        ]);
        if (res.rows[0]) return res.rows[0];
      } catch (err) {
        handleDbError(err, 'UniversityRepository.createStudentTeam');
      }
    }

    memoryTeams.push(newTeam);
    return newTeam;
  }
}

export const universityRepository = new UniversityRepository();
