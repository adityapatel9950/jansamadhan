-- JanSamadhan (जनसमाधान) - Jharkhand Societal Innovation Platform
-- Smart India Hackathon 2026 - Phase 2 Comprehensive Database Schema
-- Compatible with PostgreSQL 14+ and Supabase PostgreSQL

-- Enable UUID extension if available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. USERS TABLE
-- Authentication credentials and core system identity
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(32) NOT NULL, -- CITIZEN, GOVERNMENT, UNIVERSITY, STUDENT, FACULTY, INDUSTRY, ADMIN
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);

-- ============================================================================
-- 2. USER_PROFILES TABLE
-- Extended personal and professional details for citizens, officers, academics
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_profiles (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    district VARCHAR(100),
    block VARCHAR(100),
    village VARCHAR(100),
    address TEXT,
    avatar_url VARCHAR(500),
    bio TEXT,
    organization_id VARCHAR(64),
    designation VARCHAR(150),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_district ON user_profiles(district);
CREATE INDEX IF NOT EXISTS idx_user_profiles_organization_id ON user_profiles(organization_id);

-- ============================================================================
-- 3. ORGANIZATIONS TABLE
-- Institutional umbrella for government departments, university boards, CSRs
-- ============================================================================
CREATE TABLE IF NOT EXISTS organizations (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- GOVERNMENT_DEPT, UNIVERSITY, INDUSTRY_CORP, NGO, STARTUP
    registration_number VARCHAR(100),
    district VARCHAR(100),
    website VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    is_verified BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_organizations_type ON organizations(type);
CREATE INDEX IF NOT EXISTS idx_organizations_district ON organizations(district);
CREATE INDEX IF NOT EXISTS idx_organizations_name ON organizations(name);

-- ============================================================================
-- 4. CHALLENGE_CATEGORIES TABLE
-- Domain taxonomy (Agriculture, Water, Health, Education, Forestry, etc.)
-- ============================================================================
CREATE TABLE IF NOT EXISTS challenge_categories (
    id VARCHAR(64) PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_challenge_categories_code ON challenge_categories(code);

-- ============================================================================
-- 5. CHALLENGES TABLE
-- Core societal problem statement intake across Jharkhand districts
-- ============================================================================
CREATE TABLE IF NOT EXISTS challenges (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(300) NOT NULL,
    description TEXT NOT NULL,
    category_id VARCHAR(64) NOT NULL,
    priority VARCHAR(32) NOT NULL DEFAULT 'MEDIUM', -- LOW, MEDIUM, HIGH, CRITICAL
    status VARCHAR(32) NOT NULL DEFAULT 'SUBMITTED', -- SUBMITTED, UNDER_REVIEW, ACCEPTED, IN_PROGRESS, RESOLVED, REJECTED
    district VARCHAR(100) NOT NULL,
    block VARCHAR(100),
    village VARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    submitted_by VARCHAR(64) NOT NULL, -- user_id
    verified_by VARCHAR(64), -- nodal officer user_id
    verification_status VARCHAR(32) NOT NULL DEFAULT 'PENDING', -- PENDING, VERIFIED, REJECTED
    metadata JSONB DEFAULT '{}'::jsonb, -- impacted population estimate, keywords, ground tags
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_challenges_category_id ON challenges(category_id);
CREATE INDEX IF NOT EXISTS idx_challenges_priority ON challenges(priority);
CREATE INDEX IF NOT EXISTS idx_challenges_status ON challenges(status);
CREATE INDEX IF NOT EXISTS idx_challenges_district ON challenges(district);
CREATE INDEX IF NOT EXISTS idx_challenges_block ON challenges(block);
CREATE INDEX IF NOT EXISTS idx_challenges_submitted_by ON challenges(submitted_by);
CREATE INDEX IF NOT EXISTS idx_challenges_verified_by ON challenges(verified_by);
CREATE INDEX IF NOT EXISTS idx_challenges_verification_status ON challenges(verification_status);
CREATE INDEX IF NOT EXISTS idx_challenges_created_at ON challenges(created_at DESC);

-- ============================================================================
-- 6. CHALLENGE_MEDIA TABLE
-- Photographic and documentary evidence of ground grievances
-- ============================================================================
CREATE TABLE IF NOT EXISTS challenge_media (
    id VARCHAR(64) PRIMARY KEY,
    challenge_id VARCHAR(64) NOT NULL,
    media_type VARCHAR(32) NOT NULL, -- IMAGE, DOCUMENT, AUDIO, VIDEO
    url VARCHAR(500) NOT NULL,
    caption VARCHAR(255),
    uploaded_by VARCHAR(64) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_challenge_media_challenge_id ON challenge_media(challenge_id);

-- ============================================================================
-- 7. CHALLENGE_ASSIGNMENTS TABLE
-- Inter-agency routing to departments, universities, and student teams
-- ============================================================================
CREATE TABLE IF NOT EXISTS challenge_assignments (
    id VARCHAR(64) PRIMARY KEY,
    challenge_id VARCHAR(64) NOT NULL,
    assigned_to_entity_type VARCHAR(32) NOT NULL, -- DEPARTMENT, UNIVERSITY, STUDENT_TEAM, FACULTY
    assigned_to_id VARCHAR(64) NOT NULL,
    assigned_by VARCHAR(64) NOT NULL, -- Nodal officer user_id
    status VARCHAR(32) NOT NULL DEFAULT 'ASSIGNED', -- ASSIGNED, ACCEPTED, DECLINED, COMPLETED
    remarks TEXT,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_challenge_assignments_challenge_id ON challenge_assignments(challenge_id);
CREATE INDEX IF NOT EXISTS idx_challenge_assignments_entity ON challenge_assignments(assigned_to_entity_type, assigned_to_id);
CREATE INDEX IF NOT EXISTS idx_challenge_assignments_status ON challenge_assignments(status);

-- ============================================================================
-- 8. UNIVERSITIES TABLE
-- Technical institutes, polytechnics, and state universities in Jharkhand
-- ============================================================================
CREATE TABLE IF NOT EXISTS universities (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE, -- e.g. BIT-MESRA, IIT-ISM, NIT-JSR, RU-RANCHI
    district VARCHAR(100) NOT NULL,
    institution_type VARCHAR(50), -- CENTRAL, STATE_GOVT, DEEMED, POLYTECHNIC, PRIVATE
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    incubation_cell_name VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_universities_code ON universities(code);
CREATE INDEX IF NOT EXISTS idx_universities_district ON universities(district);

-- ============================================================================
-- 9. DEPARTMENTS TABLE
-- Jharkhand State Government Administrative Departments
-- ============================================================================
CREATE TABLE IF NOT EXISTS departments (
    id VARCHAR(64) PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    nodal_officer_id VARCHAR(64),
    nodal_officer_name VARCHAR(255),
    nodal_officer_email VARCHAR(255),
    contact_phone VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_departments_code ON departments(code);
CREATE INDEX IF NOT EXISTS idx_departments_category ON departments(category);

-- ============================================================================
-- 10. FACULTY TABLE
-- University researchers, lab directors, and hackathon mentors
-- ============================================================================
CREATE TABLE IF NOT EXISTS faculty (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL UNIQUE,
    university_id VARCHAR(64) NOT NULL,
    department_name VARCHAR(150) NOT NULL,
    specialization VARCHAR(255),
    designation VARCHAR(100),
    lab_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_faculty_user_id ON faculty(user_id);
CREATE INDEX IF NOT EXISTS idx_faculty_university_id ON faculty(university_id);

-- ============================================================================
-- 11. STUDENT_TEAMS TABLE
-- Student cohorts participating in SIH 2026 capstones & hackathons
-- ============================================================================
CREATE TABLE IF NOT EXISTS student_teams (
    id VARCHAR(64) PRIMARY KEY,
    team_name VARCHAR(150) NOT NULL,
    university_id VARCHAR(64) NOT NULL,
    lead_student_id VARCHAR(64) NOT NULL,
    faculty_mentor_id VARCHAR(64),
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_student_teams_university_id ON student_teams(university_id);
CREATE INDEX IF NOT EXISTS idx_student_teams_lead ON student_teams(lead_student_id);

-- ============================================================================
-- 12. PROJECTS TABLE
-- Technological R&D projects developing solutions for challenges
-- ============================================================================
CREATE TABLE IF NOT EXISTS projects (
    id VARCHAR(64) PRIMARY KEY,
    challenge_id VARCHAR(64) NOT NULL,
    title VARCHAR(300) NOT NULL,
    description TEXT NOT NULL,
    team_id VARCHAR(64),
    university_id VARCHAR(64),
    industry_partner_id VARCHAR(64),
    stage VARCHAR(32) NOT NULL DEFAULT 'IDEATION', -- IDEATION, PROTOTYPE, PILOT_READY, FIELD_TESTING, DEPLOYED
    budget_allocated DECIMAL(12, 2) DEFAULT 0.00,
    start_date DATE,
    target_completion_date DATE,
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, PAUSED, COMPLETED, ABANDONED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_projects_challenge_id ON projects(challenge_id);
CREATE INDEX IF NOT EXISTS idx_projects_team_id ON projects(team_id);
CREATE INDEX IF NOT EXISTS idx_projects_university_id ON projects(university_id);
CREATE INDEX IF NOT EXISTS idx_projects_stage ON projects(stage);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);

-- ============================================================================
-- 13. PROJECT_MEMBERS TABLE
-- Roster of students, researchers, and technical contributors
-- ============================================================================
CREATE TABLE IF NOT EXISTS project_members (
    id VARCHAR(64) PRIMARY KEY,
    project_id VARCHAR(64) NOT NULL,
    user_id VARCHAR(64) NOT NULL,
    role_in_project VARCHAR(50) NOT NULL, -- LEAD, DEVELOPER, HARDWARE_ENG, FIELD_TESTER, MENTOR
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_project_members_project_id ON project_members(project_id);
CREATE INDEX IF NOT EXISTS idx_project_members_user_id ON project_members(user_id);

-- ============================================================================
-- 14. PROJECT_MILESTONES TABLE
-- Sprint delivery gates, prototypes, and field test verification
-- ============================================================================
CREATE TABLE IF NOT EXISTS project_milestones (
    id VARCHAR(64) PRIMARY KEY,
    project_id VARCHAR(64) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATE,
    completion_date DATE,
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING', -- PENDING, IN_REVIEW, COMPLETED, OVERDUE
    verified_by VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_project_milestones_project_id ON project_milestones(project_id);
CREATE INDEX IF NOT EXISTS idx_project_milestones_status ON project_milestones(status);

-- ============================================================================
-- 15. INDUSTRY_PARTNERS TABLE
-- Corporate sponsors, manufacturing partners, and CSR foundations
-- ============================================================================
CREATE TABLE IF NOT EXISTS industry_partners (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    organization_id VARCHAR(64),
    sector VARCHAR(100) NOT NULL, -- CSR, MANUFACTURING, MINING, IT_IOT, AGRO_TECH
    contact_person_id VARCHAR(64),
    district VARCHAR(100),
    mou_signed BOOLEAN DEFAULT FALSE,
    funding_budget_inr DECIMAL(14, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_industry_partners_sector ON industry_partners(sector);
CREATE INDEX IF NOT EXISTS idx_industry_partners_district ON industry_partners(district);

-- ============================================================================
-- 16. PARTNERSHIPS TABLE
-- CSR grants, lab co-sponsorships, and commercial pilot contracts
-- ============================================================================
CREATE TABLE IF NOT EXISTS partnerships (
    id VARCHAR(64) PRIMARY KEY,
    project_id VARCHAR(64) NOT NULL,
    industry_partner_id VARCHAR(64) NOT NULL,
    type VARCHAR(50) NOT NULL, -- CSR_GRANT, MENTORSHIP, LAB_ACCESS, COMMERCIAL_PILOT
    grant_amount DECIMAL(12, 2) DEFAULT 0.00,
    status VARCHAR(32) NOT NULL DEFAULT 'PROPOSED', -- PROPOSED, ACTIVE, COMPLETED, TERMINATED
    signed_at DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_partnerships_project_id ON partnerships(project_id);
CREATE INDEX IF NOT EXISTS idx_partnerships_industry_id ON partnerships(industry_partner_id);
CREATE INDEX IF NOT EXISTS idx_partnerships_status ON partnerships(status);

-- ============================================================================
-- 17. SOLUTION_PROPOSALS TABLE
-- Initial competitive bids from student teams and incubation startups
-- ============================================================================
CREATE TABLE IF NOT EXISTS solution_proposals (
    id VARCHAR(64) PRIMARY KEY,
    challenge_id VARCHAR(64) NOT NULL,
    proposer_id VARCHAR(64) NOT NULL,
    proposer_role VARCHAR(32) NOT NULL,
    title VARCHAR(300) NOT NULL,
    summary TEXT NOT NULL,
    technical_stack VARCHAR(255),
    estimated_budget DECIMAL(12, 2) DEFAULT 0.00,
    estimated_duration_months INTEGER DEFAULT 3,
    status VARCHAR(32) NOT NULL DEFAULT 'PROPOSED', -- PROPOSED, UNDER_EVALUATION, SHORTLISTED, APPROVED, REJECTED
    reviewer_feedback TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_solution_proposals_challenge_id ON solution_proposals(challenge_id);
CREATE INDEX IF NOT EXISTS idx_solution_proposals_proposer_id ON solution_proposals(proposer_id);
CREATE INDEX IF NOT EXISTS idx_solution_proposals_status ON solution_proposals(status);

-- ============================================================================
-- 18. NOTIFICATIONS TABLE
-- Real-time alerts for challenge verification, assignment, and milestones
-- ============================================================================
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL, -- CHALLENGE_STATUS, PROPOSAL_REVIEW, ASSIGNMENT, MILESTONE_ALERT, SYSTEM
    link VARCHAR(255),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- ============================================================================
-- 19. IMPACT_METRICS TABLE
-- Quantifiable ground improvements achieved by deployed technologies
-- ============================================================================
CREATE TABLE IF NOT EXISTS impact_metrics (
    id VARCHAR(64) PRIMARY KEY,
    challenge_id VARCHAR(64) NOT NULL,
    project_id VARCHAR(64),
    metric_key VARCHAR(100) NOT NULL, -- POPULATION_SERVED, WATER_LITERS_SAVED, YIELD_INCREASE_PCT, RESPONSE_TIME_HRS
    metric_value DECIMAL(14, 2) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    measured_date DATE DEFAULT CURRENT_DATE,
    verified_by VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_impact_metrics_challenge_id ON impact_metrics(challenge_id);
CREATE INDEX IF NOT EXISTS idx_impact_metrics_project_id ON impact_metrics(project_id);
CREATE INDEX IF NOT EXISTS idx_impact_metrics_key ON impact_metrics(metric_key);

-- ============================================================================
-- 20. AUDIT_LOGS TABLE
-- Immutable tamper-evident audit ledger for state governance
-- ============================================================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    entity_type VARCHAR(64) NOT NULL,
    entity_id VARCHAR(64) NOT NULL,
    action VARCHAR(100) NOT NULL,
    performed_by_user_id VARCHAR(64) NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(performed_by_user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
