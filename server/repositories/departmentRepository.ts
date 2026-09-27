import { Department } from '../types/department.js';
import { getDbPool, isDbConnected } from '../config/db.js';

// Pre-seeded Jharkhand Government Departments
const INITIAL_DEPARTMENTS: Department[] = [
  {
    id: 'dept-agr-01',
    code: 'JH-AGRI',
    name: 'Department of Agriculture, Animal Husbandry & Co-operative',
    category: 'Agriculture & Irrigation',
    nodalOfficerName: 'Dr. Rameshwar Oraon',
    nodalOfficerEmail: 'nodal.agri@jharkhand.gov.in',
    contactPhone: '+91-651-2446101',
    description: 'Empowering smallholder farmers, tribal lac & silk cultivation, micro-irrigation in plateau terrain.',
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'dept-dws-02',
    code: 'JH-DWSD',
    name: 'Department of Drinking Water & Sanitation',
    category: 'Drinking Water & Sanitation',
    nodalOfficerName: 'Sanjay Kumar, IAS',
    nodalOfficerEmail: 'secy-dwsd@jharkhand.gov.in',
    contactPhone: '+91-651-2446210',
    description: 'Providing functional household tap connections, fluoride/arsenic filtration in mineral zones.',
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'dept-hmt-03',
    code: 'JH-HED',
    name: 'Department of Higher and Technical Education',
    category: 'Education & Skill Development',
    nodalOfficerName: 'Prof. Alok Sahay',
    nodalOfficerEmail: 'director.tech@jharkhand.gov.in',
    contactPhone: '+91-651-2446330',
    description: 'Fostering research, polytechnic incubation, university-industry technology transfer in Jharkhand.',
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'dept-rur-04',
    code: 'JH-RDD',
    name: 'Department of Rural Development',
    category: 'Rural Infrastructure & Roads',
    nodalOfficerName: 'Manish Ranjan, IAS',
    nodalOfficerEmail: 'rdd-jh@gov.in',
    contactPhone: '+91-651-2446415',
    description: 'Pradhan Mantri Gram Sadak Yojana connectivity across hilly tribal hamlets and watershed development.',
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'dept-frs-05',
    code: 'JH-FOREST',
    name: 'Department of Forest, Environment & Climate Change',
    category: 'Forest & Environment',
    nodalOfficerName: 'Shashi Nandkeolyar, IFS',
    nodalOfficerEmail: 'pccf-jh@nic.in',
    contactPhone: '+91-651-2446522',
    description: 'Conservation of Saranda and Dalma ecosystems, elephant corridor management, non-timber forest produce.',
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'dept-hlt-06',
    code: 'JH-HEALTH',
    name: 'Department of Health, Medical Education & Family Welfare',
    category: 'Public Health & Nutrition',
    nodalOfficerName: 'Dr. Arun Kumar Prasad',
    nodalOfficerEmail: 'health-secy@jharkhand.gov.in',
    contactPhone: '+91-651-2446633',
    description: 'Addressing sickle cell anemia screening, rural primary health centres, telemedicine in remote blocks.',
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'dept-welfare-07',
    code: 'JH-WELFARE',
    name: 'Department of Scheduled Tribe, Scheduled Caste & Backward Class Welfare',
    category: 'Tribal Livelihoods & Handicrafts',
    nodalOfficerName: 'Sunita Soren',
    nodalOfficerEmail: 'tribal-welfare@jharkhand.gov.in',
    contactPhone: '+91-651-2446750',
    description: 'Promotion of Dokra metal crafts, Sohrai paintings, tribal youth incubation and entrepreneurship.',
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-01-10T10:00:00Z',
  },
];

let memoryDepartments: Department[] = [...INITIAL_DEPARTMENTS];

export class DepartmentRepository {
  async findAll(): Promise<Department[]> {
    const pool = getDbPool();
    if (pool && isDbConnected()) {
      try {
        const query = `
          SELECT id, code, name, category, nodal_officer_name, nodal_officer_email, contact_phone, description, created_at, updated_at
          FROM departments
          ORDER BY name ASC
        `;
        const result = await pool.query(query);
        if (result.rows.length > 0) {
          return result.rows.map((row) => ({
            id: row.id,
            code: row.code,
            name: row.name,
            category: row.category,
            nodalOfficerName: row.nodal_officer_name,
            nodalOfficerEmail: row.nodal_officer_email,
            contactPhone: row.contact_phone,
            description: row.description,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
          }));
        }
      } catch (err) {
        console.warn('[DepartmentRepository] DB error, falling back to cached memory data:', err);
      }
    }
    return memoryDepartments;
  }

  async findById(id: string): Promise<Department | null> {
    const pool = getDbPool();
    if (pool && isDbConnected()) {
      try {
        const query = `
          SELECT id, code, name, category, nodal_officer_name, nodal_officer_email, contact_phone, description, created_at, updated_at
          FROM departments
          WHERE id = $1
          LIMIT 1
        `;
        const result = await pool.query(query, [id]);
        if (result.rows[0]) {
          const row = result.rows[0];
          return {
            id: row.id,
            code: row.code,
            name: row.name,
            category: row.category,
            nodalOfficerName: row.nodal_officer_name,
            nodalOfficerEmail: row.nodal_officer_email,
            contactPhone: row.contact_phone,
            description: row.description,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
          };
        }
      } catch (err) {
        console.warn('[DepartmentRepository] DB error, falling back to memory data:', err);
      }
    }
    return memoryDepartments.find((d) => d.id === id) || null;
  }
}

export const departmentRepository = new DepartmentRepository();
