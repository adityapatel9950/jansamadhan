import {
  User,
  SafeUser,
  UserProfile,
  UserRole,
  UserQueryFilters,
} from "../types/user.js";
import { getDbPool, isDbConnected } from "../config/db.js";
import { hashPassword } from "../utils/password.js";
import {
  buildPagination,
  buildOrderBy,
  buildWhereBuilder,
  handleDbError,
  PaginationResult,
} from "../utils/dbUtils.js";

// Pre-seeded authentic accounts with standard hash for "sih2026"
const DEFAULT_PASSWORD_HASH = hashPassword("sih2026");

interface MemoryUserRecord {
  user: User;
  profile: UserProfile;
}

const INITIAL_RECORDS: MemoryUserRecord[] = [];
/* const INITIAL_RECORDS: MemoryUserRecord[] = [
//   {
//     user: {
//       id: 'usr-cit-01',
//       email: 'anand.mahto@gmail.com',
//       name: 'Anand Mahto',
//       role: 'CITIZEN',
//       phone: '+91-9431102938',
//       organizationOrDepartment: 'Kisan Vikas Samiti, Ormanjhi',
//       district: 'Ranchi',
//       designation: 'Progressive Farmer & Village Representative',
//       passwordHash: DEFAULT_PASSWORD_HASH,
//       isVerified: true,
//       metadata: { panchayat: 'Ormanjhi South', village: 'Baridih' },
//       createdAt: '2026-01-15T08:30:00Z',
//       updatedAt: '2026-01-15T08:30:00Z',
//     },
//     profile: {
//       id: 'prof-cit-01',
//       userId: 'usr-cit-01',
//       fullName: 'Anand Mahto',
//       phone: '+91-9431102938',
//       district: 'Ranchi',
//       block: 'Ormanjhi',
//       village: 'Baridih',
//       designation: 'Progressive Farmer & Village Representative',
//       metadata: { panchayat: 'Ormanjhi South' },
//       createdAt: '2026-01-15T08:30:00Z',
//       updatedAt: '2026-01-15T08:30:00Z',
//     },
//   },
//   {
//     user: {
//       id: 'usr-gov-01',
//       email: 'nodal.agri@jharkhand.gov.in',
//       name: 'Dr. Rameshwar Oraon',
//       role: 'GOVERNMENT',
//       phone: '+91-651-2446101',
//       organizationOrDepartment: 'Department of Agriculture & Farmers Welfare, Govt of Jharkhand',
//       district: 'Ranchi',
//       designation: 'Joint Director (Micro-Irrigation)',
//       passwordHash: DEFAULT_PASSWORD_HASH,
//       isVerified: true,
//       metadata: { departmentCode: 'JH-AGRI', officeRoom: 'Nepal House, Doranda' },
//       createdAt: '2026-01-10T09:00:00Z',
//       updatedAt: '2026-01-10T09:00:00Z',
//     },
//     profile: {
//       id: 'prof-gov-01',
//       userId: 'usr-gov-01',
//       fullName: 'Dr. Rameshwar Oraon',
//       phone: '+91-651-2446101',
//       district: 'Ranchi',
//       block: 'Namkum',
//       designation: 'Joint Director (Micro-Irrigation)',
//       metadata: { departmentCode: 'JH-AGRI', officeRoom: 'Nepal House, Doranda' },
//       createdAt: '2026-01-10T09:00:00Z',
//       updatedAt: '2026-01-10T09:00:00Z',
//     },
//   },
//   {
//     user: {
//       id: 'usr-uni-01',
//       email: 'dean.research@bitmesra.ac.in',
//       name: 'Dr. Vandana Bhattacharjee',
//       role: 'UNIVERSITY',
//       phone: '+91-651-2275444',
//       organizationOrDepartment: 'Birla Institute of Technology (BIT) Mesra',
//       district: 'Ranchi',
//       designation: 'Dean of Academic Research & Innovation',
//       passwordHash: DEFAULT_PASSWORD_HASH,
//       isVerified: true,
//       metadata: { universityType: 'Deemed University', naacGrade: 'A+' },
//       createdAt: '2026-01-12T10:00:00Z',
//       updatedAt: '2026-01-12T10:00:00Z',
//     },
//     profile: {
//       id: 'prof-uni-01',
//       userId: 'usr-uni-01',
//       fullName: 'Dr. Vandana Bhattacharjee',
//       phone: '+91-651-2275444',
//       district: 'Ranchi',
//       block: 'Kanke',
//       designation: 'Dean of Academic Research & Innovation',
//       metadata: { institutionCode: 'BIT-MESRA' },
//       createdAt: '2026-01-12T10:00:00Z',
//       updatedAt: '2026-01-12T10:00:00Z',
//     },
//   },
//   {
//     user: {
//       id: 'usr-stu-01',
//       email: 'priya.singh@students.iitism.ac.in',
//       name: 'Priya Singh',
//       role: 'STUDENT',
//       phone: '+91-8210394851',
//       organizationOrDepartment: 'IIT (ISM) Dhanbad',
//       district: 'Dhanbad',
//       designation: 'Final Year B.Tech Computer Science (IoT & Embedded)',
//       passwordHash: DEFAULT_PASSWORD_HASH,
//       isVerified: true,
//       metadata: { studentId: '22CS0148', hackathonTeam: 'Team Birsa Innovators' },
//       createdAt: '2026-01-18T11:00:00Z',
//       updatedAt: '2026-01-18T11:00:00Z',
//     },
//     profile: {
//       id: 'prof-stu-01',
//       userId: 'usr-stu-01',
//       fullName: 'Priya Singh',
//       phone: '+91-8210394851',
//       district: 'Dhanbad',
//       block: 'Dhanbad Sadar',
//       designation: 'Final Year B.Tech Computer Science (IoT & Embedded)',
//       metadata: { studentId: '22CS0148', hackathonTeam: 'Team Birsa Innovators' },
//       createdAt: '2026-01-18T11:00:00Z',
//       updatedAt: '2026-01-18T11:00:00Z',
//     },
//   },
//   {
//     user: {
//       id: 'usr-fac-01',
//       email: 'prof.rk.sinha@nitjsr.ac.in',
//       name: 'Prof. R. K. Sinha',
//       role: 'FACULTY',
//       phone: '+91-9430129845',
//       organizationOrDepartment: 'National Institute of Technology (NIT) Jamshedpur',
//       district: 'East Singhbhum',
//       designation: 'Associate Professor, Dept. of Mechanical & Robotics',
//       passwordHash: DEFAULT_PASSWORD_HASH,
//       isVerified: true,
//       metadata: { lab: 'Tribal Appropriate Technology Innovation Center' },
//       createdAt: '2026-01-16T12:00:00Z',
//       updatedAt: '2026-01-16T12:00:00Z',
//     },
//     profile: {
//       id: 'prof-fac-01',
//       userId: 'usr-fac-01',
//       fullName: 'Prof. R. K. Sinha',
//       phone: '+91-9430129845',
//       district: 'East Singhbhum',
//       block: 'Adityapur',
//       designation: 'Associate Professor, Dept. of Mechanical & Robotics',
//       metadata: { lab: 'Tribal Appropriate Technology Innovation Center' },
//       createdAt: '2026-01-16T12:00:00Z',
//       updatedAt: '2026-01-16T12:00:00Z',
//     },
//   },
//   {
//     user: {
//       id: 'usr-ind-01',
//       email: 'csr.jharkhand@tatasteel.com',
//       name: 'Vikram Sengupta',
//       role: 'INDUSTRY',
//       phone: '+91-657-6644211',
//       organizationOrDepartment: 'Tata Steel Foundation',
//       district: 'East Singhbhum',
//       designation: 'Head - Rural Livelihoods & Technical Innovations',
//       passwordHash: DEFAULT_PASSWORD_HASH,
//       isVerified: true,
//       metadata: { industrySector: 'CSR & Heavy Manufacturing', initiative: 'Masti Ki Pathshala & Watersheds' },
//       createdAt: '2026-01-14T14:00:00Z',
//       updatedAt: '2026-01-14T14:00:00Z',
//     },
//     profile: {
//       id: 'prof-ind-01',
//       userId: 'usr-ind-01',
//       fullName: 'Vikram Sengupta',
//       phone: '+91-657-6644211',
//       district: 'East Singhbhum',
//       block: 'Jamshedpur',
//       designation: 'Head - Rural Livelihoods & Technical Innovations',
//       metadata: { sector: 'CSR' },
//       createdAt: '2026-01-14T14:00:00Z',
//       updatedAt: '2026-01-14T14:00:00Z',
//     },
//   },
//   {
//     user: {
//       id: 'usr-adm-01',
//       email: 'admin.sih@jharkhand.gov.in',
//       name: 'Rajiv Ranjan',
//       role: 'ADMIN',
//       phone: '+91-651-2400192',
//       organizationOrDepartment: 'Jharkhand State Innovation Council & Higher Education Dept',
//       district: 'Ranchi',
//       designation: 'State Nodal Officer - SIH 2026 Implementation Cell',
//       passwordHash: DEFAULT_PASSWORD_HASH,
//       isVerified: true,
//       metadata: { office: 'Suchana Bhawan, Kanke Road, Ranchi' },
//       createdAt: '2026-01-01T00:00:00Z',
//       updatedAt: '2026-01-01T00:00:00Z',
//     },
//     profile: {
//       id: 'prof-adm-01',
//       userId: 'usr-adm-01',
//       fullName: 'Rajiv Ranjan',
//       phone: '+91-651-2400192',
//       district: 'Ranchi',
//       block: 'Kanke',
//       designation: 'State Nodal Officer - SIH 2026 Implementation Cell',
//       metadata: { office: 'Suchana Bhawan, Kanke Road, Ranchi' },
//       createdAt: '2026-01-01T00:00:00Z',
//       updatedAt: '2026-01-01T00:00:00Z',
//     },
//   },
]; */

let memoryRecords: MemoryUserRecord[] = [...INITIAL_RECORDS];

const USER_COLUMNS_SQL = `
  u.id, u.email, u.role, u.password_hash, u.is_active, u.created_at, u.updated_at,
  p.full_name, p.phone, p.district, p.block, p.village, p.designation, p.organization_id, p.metadata
`;

export class UserRepository {
  /**
   * Finds a user by email, selecting only necessary security and profile fields.
   */
  async findByEmail(email: string): Promise<User | null> {
    const normalizedEmail = email.toLowerCase().trim();
    const pool = getDbPool();

    if (pool && isDbConnected()) {
      try {
        const query = `
          SELECT ${USER_COLUMNS_SQL}
          FROM users u
          LEFT JOIN user_profiles p ON p.user_id = u.id
          WHERE LOWER(u.email) = LOWER($1)
          LIMIT 1
        `;
        const res = await pool.query(query, [normalizedEmail]);
        if (res.rows[0]) {
          const row = res.rows[0];
          return {
            id: row.id,
            email: row.email,
            name: row.full_name || row.email,
            role: row.role as UserRole,
            phone: row.phone,
            organizationOrDepartment: row.designation,
            district: row.district,
            designation: row.designation,
            passwordHash: row.password_hash,
            isVerified: row.is_active,
            metadata: row.metadata || {},
            createdAt: row.created_at,
            updatedAt: row.updated_at,
          };
        }
        return null;
      } catch (err) {
        handleDbError(err, "UserRepository.findByEmail");
      }
    }

    const found = memoryRecords.find(
      (r) => r.user.email.toLowerCase() === normalizedEmail,
    );
    return found ? found.user : null;
  }

  /**
   * Finds user and joined profile by ID, without sensitive password hash.
   */
  async findById(id: string): Promise<SafeUser | null> {
    const pool = getDbPool();

    if (pool && isDbConnected()) {
      try {
        const query = `
          SELECT u.id, u.email, u.role, u.is_active, u.created_at, u.updated_at,
                 p.id as profile_id, p.full_name, p.phone, p.district, p.block, p.village,
                 p.designation, p.organization_id, p.metadata
          FROM users u
          LEFT JOIN user_profiles p ON p.user_id = u.id
          WHERE u.id = $1
          LIMIT 1
        `;
        const res = await pool.query(query, [id]);
        if (res.rows[0]) {
          const row = res.rows[0];
          return {
            id: row.id,
            email: row.email,
            name: row.full_name || row.email,
            role: row.role as UserRole,
            phone: row.phone,
            organizationOrDepartment: row.designation,
            district: row.district,
            designation: row.designation,
            isVerified: row.is_active,
            metadata: row.metadata || {},
            createdAt: row.created_at,
            updatedAt: row.updated_at,
            profile: row.profile_id
              ? {
                  id: row.profile_id,
                  userId: row.id,
                  fullName: row.full_name,
                  phone: row.phone,
                  district: row.district,
                  block: row.block,
                  village: row.village,
                  organizationId: row.organization_id,
                  designation: row.designation,
                  metadata: row.metadata,
                  createdAt: row.created_at,
                  updatedAt: row.updated_at,
                }
              : undefined,
          };
        }
        return null;
      } catch (err) {
        handleDbError(err, "UserRepository.findById");
      }
    }

    const record = memoryRecords.find((r) => r.user.id === id);
    if (!record) return null;
    const { passwordHash: _, ...safe } = record.user;
    return {
      ...safe,
      profile: record.profile,
    };
  }

  /**
   * Creates a user in the `users` table and creates corresponding entry in `user_profiles`.
   */
  async create(
    user: Omit<User, "id" | "createdAt" | "updatedAt">,
  ): Promise<SafeUser> {
    const id = `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const profileId = `prof-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const newUser: User = {
      ...user,
      id,
      createdAt: now,
      updatedAt: now,
    };

    const newProfile: UserProfile = {
      id: profileId,
      userId: id,
      fullName: user.name,
      phone: user.phone,
      district: user.district,
      designation: user.designation,
      metadata: user.metadata || {},
      createdAt: now,
      updatedAt: now,
    };

    const pool = getDbPool();
    if (pool && isDbConnected()) {
      const client = await pool.connect();
      try {
        await client.query("BEGIN");

        // Insert into users
        const userInsertSql = `
          INSERT INTO users (id, email, role, password_hash, is_active, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING id, email, role, is_active, created_at, updated_at
        `;
        const userRes = await client.query(userInsertSql, [
          newUser.id,
          newUser.email,
          newUser.role,
          newUser.passwordHash || "",
          newUser.isVerified,
          newUser.createdAt,
          newUser.updatedAt,
        ]);

        // Insert into user_profiles
        const profileInsertSql = `
          INSERT INTO user_profiles (id, user_id, full_name, phone, district, designation, metadata, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          RETURNING id, user_id, full_name, phone, district, designation, metadata, created_at, updated_at
        `;
        const profileRes = await client.query(profileInsertSql, [
          newProfile.id,
          newProfile.userId,
          newProfile.fullName,
          newProfile.phone || null,
          newProfile.district || null,
          newProfile.designation || null,
          JSON.stringify(newProfile.metadata || {}),
          newProfile.createdAt,
          newProfile.updatedAt,
        ]);

        await client.query("COMMIT");

        const uRow = userRes.rows[0];
        const pRow = profileRes.rows[0];

        return {
          id: uRow.id,
          email: uRow.email,
          name: pRow.full_name,
          role: uRow.role,
          phone: pRow.phone,
          district: pRow.district,
          designation: pRow.designation,
          isVerified: uRow.is_active,
          createdAt: uRow.created_at,
          updatedAt: uRow.updated_at,
          profile: {
            id: pRow.id,
            userId: pRow.user_id,
            fullName: pRow.full_name,
            phone: pRow.phone,
            district: pRow.district,
            designation: pRow.designation,
            metadata: pRow.metadata,
            createdAt: pRow.created_at,
            updatedAt: pRow.updated_at,
          },
        };
      } catch (err) {
        await client.query("ROLLBACK");
        handleDbError(err, "UserRepository.create");
      } finally {
        client.release();
      }
    }

    memoryRecords.push({ user: newUser, profile: newProfile });
    const { passwordHash: _, ...safeUser } = newUser;
    return {
      ...safeUser,
      profile: newProfile,
    };
  }

  /**
   * Paginated, filtered, and searchable listing of users.
   */
  async findAll(
    filters: UserQueryFilters = {},
  ): Promise<PaginationResult<SafeUser>> {
    const { page, limit, offset } = buildPagination(filters);
    const pool = getDbPool();

    if (pool && isDbConnected()) {
      try {
        const wb = buildWhereBuilder();
        if (filters.role) wb.addFilter("u.role", filters.role);
        if (filters.district) wb.addFilter("p.district", filters.district);
        if (filters.search)
          wb.addSearch(
            ["p.full_name", "u.email", "p.district", "p.designation"],
            filters.search,
          );

        const { whereClause, params, nextParamIndex } = wb.build();

        const countQuery = `
          SELECT COUNT(*) as count
          FROM users u
          LEFT JOIN user_profiles p ON p.user_id = u.id
          ${whereClause}
        `;
        const countRes = await pool.query(countQuery, params);
        const total = parseInt(countRes.rows[0]?.count || "0", 10);

        const allowedSortCols: Record<string, string> = {
          createdAt: "u.created_at",
          email: "u.email",
          name: "p.full_name",
          role: "u.role",
        };
        const orderSql = buildOrderBy(
          filters,
          allowedSortCols,
          "createdAt",
          "DESC",
        );

        const selectQuery = `
          SELECT u.id, u.email, u.role, u.is_active, u.created_at, u.updated_at,
                 p.id as profile_id, p.full_name, p.phone, p.district, p.block, p.village, p.designation
          FROM users u
          LEFT JOIN user_profiles p ON p.user_id = u.id
          ${whereClause}
          ${orderSql}
          LIMIT $${nextParamIndex} OFFSET $${nextParamIndex + 1}
        `;
        const selectParams = [...params, limit, offset];
        const res = await pool.query(selectQuery, selectParams);

        const items: SafeUser[] = res.rows.map((row) => ({
          id: row.id,
          email: row.email,
          name: row.full_name || row.email,
          role: row.role as UserRole,
          phone: row.phone,
          district: row.district,
          designation: row.designation,
          isVerified: row.is_active,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        }));

        return {
          items,
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1,
        };
      } catch (err) {
        handleDbError(err, "UserRepository.findAll");
      }
    }

    let records = [...memoryRecords];
    if (filters.role)
      records = records.filter((r) => r.user.role === filters.role);
    if (filters.district)
      records = records.filter(
        (r) =>
          r.profile.district?.toLowerCase() === filters.district!.toLowerCase(),
      );
    if (filters.search) {
      const q = filters.search.toLowerCase();
      records = records.filter(
        (r) =>
          r.user.name.toLowerCase().includes(q) ||
          r.user.email.toLowerCase().includes(q) ||
          (r.profile.district && r.profile.district.toLowerCase().includes(q)),
      );
    }

    const total = records.length;
    const paginated = records.slice(offset, offset + limit);
    const items: SafeUser[] = paginated.map((r) => {
      const { passwordHash: _, ...safe } = r.user;
      return { ...safe, profile: r.profile };
    });

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async getDemoAccounts(): Promise<SafeUser[]> {
    return [];
  }
}

export const userRepository = new UserRepository();
