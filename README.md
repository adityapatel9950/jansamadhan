# JanSamadhan (जनसमाधान) — Jharkhand Societal Innovation Platform

**Smart India Hackathon 2026 (SIH 2026) — Phase 2 Release**  
_A Student-Built Societal Problem Intake & Academic R&D Portal for Jharkhand_

---

## 1. Project Overview

**JanSamadhan** is a technology platform connecting citizens, state government departments, universities, students, faculty, and industry/CSR partners in Jharkhand. It tackles ground-level societal challenges across Jharkhand's 24 districts—including rural micro-irrigation, drinking water fluorosis, tribal handicraft grading, and mining culvert subsidences.

### Development Philosophy

- **Authentic Student Team Engineering**: Built cleanly and practically with production patterns, not artificial landing-page templates.
- **Institutional Clarity**: Clean white/slate surfaces with a primary forest green accent (`#14532D`) reflecting Jharkhand's state identity (_Vananchal_).
- **Anti-Slop Discipline**: Zero pill-enclosures for metadata, tabular numerals for figures, no artificial metrics, and no dead clicks.

---

## 2. Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, React Router v7, Lucide React, Recharts
- **Backend**: Node.js, Express, TypeScript (run via `tsx`)
- **Database**: PostgreSQL 14+ / Supabase PostgreSQL compatible with connection pooling (`pg.Pool`)
- **Security & Session**: Bearer JWT tokens, cryptographic PBKDF2 password hashing, RBAC route guards

---

## 3. Phase 2 Database Schema (20 Core Entities)

The PostgreSQL database schema is fully defined in `database/schema.sql` and engineered for PostgreSQL and Supabase.

### Schema Principles

- **Consistent ID Strategy**: Standard string UUID identifiers across all tables.
- **Indexed Search & Filter Fields**: Indexes applied to frequently filtered columns (e.g., `district`, `status`, `category_id`, `priority`, `verification_status`).
- **No Unnecessary Foreign-Key Constraints**: Relationships are maintained via indexed IDs and application-level validation to prevent migration locking and cascade fragility in serverless/distributed environments.
- **Timestamp Tracking**: `created_at` and `updated_at` timestamps on all primary entities.
- **Strict Column Projections**: Repositories explicitly request only required columns—never `SELECT *`.
- **Metadata JSONB**: Used purposefully for domain-specific context (e.g. ground tags, laboratory details) without generic metadata table bloat.

### Entities Overview

1. **`users`**: Core authentication, role (`CITIZEN`, `GOVERNMENT`, `UNIVERSITY`, `STUDENT`, `FACULTY`, `INDUSTRY`, `ADMIN`), and active status.
2. **`user_profiles`**: Extended demographic profile (full name, phone, district, block, village, designation, bio).
3. **`organizations`**: Government departments, universities, industry corporations, and NGOs.
4. **`challenges`**: Core societal problem statements.
   - `id`: Primary key
   - `title`: Problem title
   - `description`: Detailed field description
   - `category_id`: Category foreign key
   - `priority`: `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`
   - `status`: `SUBMITTED`, `UNDER_REVIEW`, `ACCEPTED`, `IN_PROGRESS`, `RESOLVED`, `REJECTED`
   - `district`: Jharkhand district (e.g., Ranchi, Palamu, Dhanbad)
   - `block`: Block/Tehsil (e.g., Ormanjhi, Chainpur)
   - `village`: Habitation or Panchayat
   - `latitude`, `longitude`: Geospatial location coordinates
   - `submitted_by`: Submitter `user_id`
   - `verified_by`: Nodal officer `user_id`
   - `verification_status`: `PENDING`, `VERIFIED`, `REJECTED`
   - `created_at`, `updated_at`: Audit timestamps
5. **`challenge_media`**: Photographic and field documentary evidence attached to challenges.
6. **`challenge_categories`**: Domain taxonomy (Agriculture, Drinking Water, Health, Rural Roads, etc.).
7. **`challenge_assignments`**: Departmental routing to universities and student teams.
8. **`universities`**: Technical institutes (BIT Mesra, IIT ISM Dhanbad, NIT Jamshedpur, Polytechnics).
9. **`departments`**: Administrative state departments (Agriculture, Drinking Water, Health, etc.).
10. **`faculty`**: Academic researchers, lab directors, and hackathon faculty mentors.
11. **`student_teams`**: Student innovator teams, lead student ID, and faculty mentors.
12. **`projects`**: Technical R&D projects developing working prototypes for challenges.
13. **`project_members`**: Project contributors and their roles (Lead, Developer, Hardware Eng, etc.).
14. **`project_milestones`**: Delivery checkpoints, prototype review dates, and completion status.
15. **`industry_partners`**: CSR foundations and industrial sponsors (e.g., Tata Steel Foundation, CCL).
16. **`partnerships`**: CSR grants, commercial pilot agreements, and mentorship allocations.
17. **`solution_proposals`**: Competitive technological proposals submitted by students and faculty.
18. **`notifications`**: User alerts for verification, assignments, and milestone reviews.
19. **`impact_metrics`**: Quantifiable ground outcomes (liters saved, population served, etc.).
20. **`audit_logs`**: Immutable ledger of administrative and verification actions.

---

## 4. Phase 2 Repository Layer & Database Utilities

Repositories encapsulate all SQL operations with parameterized queries, column projections, and connection pooling.

```
server/repositories/
├── userRepository.ts          # users & user_profiles queries, auth lookups
├── challengeRepository.ts     # challenges, categories, media, assignments
├── universityRepository.ts    # universities, faculty, student_teams
├── projectRepository.ts       # projects, milestones, proposals, impact_metrics
├── industryRepository.ts      # industry_partners, partnerships, organizations
├── notificationRepository.ts  # notifications and audit logs
├── departmentRepository.ts    # state department lookups
└── index.ts                   # Central repository export barrel
```

### Reusable Database Utilities (`server/utils/dbUtils.ts`)

- **`buildPagination(options)`**: Bounds page/limit parameters and computes safe offsets.
- **`buildOrderBy(sortOptions, allowedCols, defaultCol, defaultOrder)`**: Validates sorting fields against an allowlist to prevent SQL injection.
- **`buildWhereBuilder()`**: Parameterized filter builder for conditions, operators, and search keywords (`ILIKE`).
- **`handleDbError(err, context)`**: Sanitizes errors to prevent credential or schema leaks while preserving error causes for logs.

---

## 5. Project Directory Structure

```
├── database/
│   └── schema.sql                 # Complete 20-entity PostgreSQL / Supabase DDL
├── server/
│   ├── config/
│   │   ├── db.ts                  # Connection pooling (pg.Pool) with fallback
│   │   └── env.ts                 # Environment configurations
│   ├── controllers/               # Express controllers
│   ├── middleware/                # JWT auth, role RBAC, logging, error handling
│   ├── repositories/              # Phase 2 repositories (SQL data layer)
│   ├── routes/                    # API routes (/api/challenges, /api/universities, etc.)
│   ├── schedulers/                # Background maintenance scheduler
│   ├── services/                  # Business logic layer
│   ├── types/                     # Shared TypeScript domain interfaces
│   └── utils/                     # dbUtils, JWT, password hashing, response formatters
├── src/                           # React 19 Frontend SPA
└── server.ts                      # Full-stack entry point
```

---

## 6. Environment Variables

Create a `.env` file in the project root (sample provided in `.env.example`):

```bash
# Server Configuration
PORT=3000
NODE_ENV="development"

# Authentication Secret
JWT_SECRET="jansamadhan_sih_2026_jwt_secret_dev_key"
JWT_EXPIRES_IN="7d"

# Database Configuration (PostgreSQL / Supabase PostgreSQL)
# Option A: Full Connection String (Local Postgres or Supabase pooler)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/jansamadhan"

# Option B: Object-based parameters (Standard pg.Pool)
PGHOST="localhost"
PGPORT=5432
PGUSER="postgres"
PGPASSWORD="password"
PGDATABASE="jansamadhan"
PGSSL="false"
```

_Note_: If PostgreSQL is not active locally, the repository layer automatically falls back to an active stateful in-memory repository pre-seeded with authentic Jharkhand demonstration data, ensuring the app runs immediately without throwing unhandled database errors.

---

## 7. Installation & Running Locally

1. **Install Dependencies**:

   ```bash
   npm install
   ```

2. **Run the Full-Stack Dev Server**:

   ```bash
   npm run dev
   ```

   This launches `server.ts` via `tsx` on `http://localhost:3000`. Express handles `/api/*` endpoints while mounting Vite dev middleware for React frontend hot-reloading on port 3000.

3. **Build for Production**:

   ```bash
   npm run build
   npm start
   ```

4. **Initialize PostgreSQL / Supabase (Optional)**:
   To use an external database, run `database/schema.sql` against your PostgreSQL or Supabase instance, then set `DATABASE_URL` in `.env`.

---

## 8. How Frontend and Backend Communicate

1. **Centralized API Client (`src/services/apiClient.ts`)**:
   All HTTP requests from the browser go through `apiClient`. It automatically retrieves the Bearer token from `localStorage.getItem('jansamadhan_token')` and appends `Authorization: Bearer <token>` to request headers.

2. **Service Layer Isolation**:
   No React component calls `fetch()` or `axios` directly. Views use `challengeService`, `departmentService`, or `authService`, keeping UI decoupled from endpoint URLs.

3. **Standardized Responses**:
   The backend responds in a unified JSON structure:
   ```json
   {
     "success": true,
     "data": { ... },
     "message": "Optional feedback message",
     "timestamp": "2026-02-26T12:00:00.000Z"
   }
   ```

---

## 9. How Authentication & Role-Based Access Works

### Supported Roles

1. `CITIZEN`: Submits societal issues, tracks status, browses public challenges.
2. `GOVERNMENT`: Department officers review, verify ground reality, and assign problems for R&D.
3. `UNIVERSITY`: Incubation cells and deans track problem statements.
4. `STUDENT`: BTech / Polytechnic students browse open problems and submit innovation proposals.
5. `FACULTY`: Principal investigators apply for departmental research pilots.
6. `INDUSTRY`: CSR heads (e.g. Tata Steel Foundation) and startups sponsor pilots.
7. `ADMIN`: State Nodal Officer monitors statewide metrics and audit logs.

### Demo Persona Switcher (For SIH Evaluation)

In the top navigation bar, evaluators can click **Role Persona** to instantly switch between 7 pre-configured accounts (password for all demo accounts is `sih2026`):

- **Anand Mahto** (`CITIZEN`) — Farmer, Ormanjhi Block, Ranchi
- **Dr. Rameshwar Oraon** (`GOVERNMENT`) — Joint Director, Dept of Agriculture, Ranchi
- **Dr. Vandana Bhattacharjee** (`UNIVERSITY`) — Dean Research, BIT Mesra
- **Priya Singh** (`STUDENT`) — Final Year BTech CSE, IIT ISM Dhanbad
- **Prof. R.K. Sinha** (`FACULTY`) — Head of Robotics & IoT Lab, NIT Jamshedpur
- **Vikram Sengupta** (`INDUSTRY`) — Head Rural Livelihoods, Tata Steel Foundation
- **Rajiv Ranjan** (`ADMIN`) — State Nodal Coordinator, Suchana Bhawan, Ranchi

---

## 8. How Future Phases Should Be Added

- **Phase 2 (Milestone Tracking & Grant Disbursement)**:
  - Add `milestones` and `grant_allocations` tables in `database/schema.sql`.
  - Implement student milestone submission forms and faculty progress reviews.
  - Enable the Task Scheduler (`server/schedulers/taskScheduler.ts`) to trigger automated SLA alerts for challenges older than 14 days without department triage.
- **Phase 3 (Citizen Challenge Submission & Tracking)**: Complete citizen grievance registration, 10-stage lifecycle tracking, location picker, file upload abstraction, and pre-verification editing.

---

## 10. Phase 3: Citizen Challenge Submission & Tracking Architecture

Phase 3 introduces comprehensive citizen intake, verification tracking, pre-verification editing, and storage abstraction.

### 1. Citizen Features

- **Citizen Dashboard**: Real-time KPI feed (Total challenges, Under Review, Verified/R&D, My Problems), quick action triggers, category distribution analytics, and recent state problems.
- **Problem Submission**: Full multi-step form capturing title, detailed context, 12 official categories, district, block, village, street address, GPS latitude/longitude (auto-detectable), severity, beneficiaries, contact preference, and supporting files.
- **My Challenges**: Filterable, searchable table showing only submissions belonging to the logged-in citizen (`/citizen/my-challenges`).
- **Challenge Status Tracking**: Dedicated visual lifecycle stepper showing the 10-stage resolution pipeline:
  `DRAFT` → `SUBMITTED` → `UNDER_REVIEW` → `VERIFIED` → `REJECTED` → `ASSIGNED` → `IN_PROGRESS` → `PILOT` → `RESOLVED` → `CLOSED`.
- **Edit Before Verification**: Citizens can edit all fields before nodal officer verification. If status has moved beyond `SUBMITTED`, modifications are locked.
- **Upload Supporting Images & Documents**: Dedicated upload interface with size and MIME validation.
- **Storage Abstraction (`server/services/storageService.ts`)**: Implements `IStorageService` interface allowing zero-cost in-memory/base64 storage for hackathon testing, ready to bind Supabase Storage or AWS S3 without changing controller code.

### 2. Standardized Reusable UI Components

- **`ChallengeForm`**: (`src/components/forms/ChallengeForm.tsx`) — Validated problem intake and edit form.
- **`FileUpload`**: (`src/components/forms/FileUpload.tsx`) — Image and document file upload with preview and removal.
- **`LocationPicker`**: (`src/components/forms/LocationPicker.tsx`) — District selector with 24 Jharkhand districts, block, village, address, and GPS browser coordinates.
- **`StatusBadge`**: (`src/components/common/StatusBadge.tsx`) — Color-coded badges for all 10 challenge statuses.
- **`ChallengeCard`**: (`src/components/common/ChallengeCard.tsx`) — Responsive card display for challenges.
- **`ChallengeTable`**: (`src/components/common/ChallengeTable.tsx`) — Standardized tabular display with actions (Track, Edit).
- **`SearchFilter`**: (`src/components/common/SearchFilter.tsx`) — Integrated search bar with category, district, and status dropdowns.
- **`ChallengeStatusTracker`**: (`src/components/common/ChallengeStatusTracker.tsx`) — Progressive visual pipeline stepper.

### 3. Backend Architecture Flow

```
HTTP Request
  → Route: /api/challenges (/my/submissions, /upload, /:id)
  → Controller: ChallengeController (validates token, checks permissions)
  → Validator: validateCreateChallengeInput, validateUpdateChallengeInput (double validation)
  → Service: ChallengeService (enforces ownership and pre-verification edit rules)
  → Storage: FreePrototypeStorageService (IStorageService interface)
  → Repository: ChallengeRepository (parameterized SQL, explicit column projections)
  → Database: PostgreSQL / Memory / Firebase dual sync
```

#   j a n s a m a d h a n 
 
 
