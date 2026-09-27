import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { AuthGuard } from '../guards/AuthGuard';
import { RoleGuard } from '../guards/RoleGuard';
import { useAuth } from '../hooks/useAuth';

// Auth Pages
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';

// Citizen Pages
import { CitizenDashboard } from '../pages/citizen/CitizenDashboard';
import { CitizenChallenges } from '../pages/citizen/CitizenChallenges';
import { MyChallengesPage } from '../pages/citizen/MyChallengesPage';
import { NewChallengePage } from '../pages/citizen/NewChallengePage';
import { ChallengeDetailsPage } from '../pages/citizen/ChallengeDetailsPage';

// Government Pages
import { GovernmentDashboard } from '../pages/government/GovernmentDashboard';
import { GovernmentChallenges } from '../pages/government/GovernmentChallenges';

// University Pages
import { UniversityDashboard } from '../pages/university/UniversityDashboard';
import { UniversityChallenges } from '../pages/university/UniversityChallenges';

// Industry Pages
import { IndustryDashboard } from '../pages/industry/IndustryDashboard';

// Admin Pages
import { AdminDashboard } from '../pages/admin/AdminDashboard';

// Root Redirect Helper
const RootRedirect: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    case 'CITIZEN':
      return <Navigate to="/citizen/dashboard" replace />;
    case 'GOVERNMENT':
      return <Navigate to="/government/dashboard" replace />;
    case 'UNIVERSITY':
    case 'STUDENT':
    case 'FACULTY':
      return <Navigate to="/university/dashboard" replace />;
    case 'INDUSTRY':
      return <Navigate to="/industry/dashboard" replace />;
    case 'ADMIN':
      return <Navigate to="/admin/dashboard" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        {/* Public & Auth Routes */}
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Citizen Routes */}
        <Route
          path="/citizen/dashboard"
          element={
            <AuthGuard>
              <RoleGuard allowedRoles={['CITIZEN', 'ADMIN']}>
                <CitizenDashboard />
              </RoleGuard>
            </AuthGuard>
          }
        />
        <Route
          path="/citizen/challenges"
          element={
            <AuthGuard>
              <RoleGuard allowedRoles={['CITIZEN', 'ADMIN']}>
                <CitizenChallenges />
              </RoleGuard>
            </AuthGuard>
          }
        />
        <Route
          path="/citizen/my-challenges"
          element={
            <AuthGuard>
              <RoleGuard allowedRoles={['CITIZEN', 'ADMIN']}>
                <MyChallengesPage />
              </RoleGuard>
            </AuthGuard>
          }
        />
        <Route
          path="/citizen/challenges/:id"
          element={
            <AuthGuard>
              <RoleGuard allowedRoles={['CITIZEN', 'GOVERNMENT', 'UNIVERSITY', 'STUDENT', 'FACULTY', 'INDUSTRY', 'ADMIN']}>
                <ChallengeDetailsPage />
              </RoleGuard>
            </AuthGuard>
          }
        />
        <Route
          path="/citizen/new-challenge"
          element={
            <AuthGuard>
              <RoleGuard allowedRoles={['CITIZEN', 'ADMIN']}>
                <NewChallengePage />
              </RoleGuard>
            </AuthGuard>
          }
        />

        {/* Government Routes */}
        <Route
          path="/government/dashboard"
          element={
            <AuthGuard>
              <RoleGuard allowedRoles={['GOVERNMENT', 'ADMIN']}>
                <GovernmentDashboard />
              </RoleGuard>
            </AuthGuard>
          }
        />
        <Route
          path="/government/challenges"
          element={
            <AuthGuard>
              <RoleGuard allowedRoles={['GOVERNMENT', 'ADMIN']}>
                <GovernmentChallenges />
              </RoleGuard>
            </AuthGuard>
          }
        />

        {/* University Routes */}
        <Route
          path="/university/dashboard"
          element={
            <AuthGuard>
              <RoleGuard allowedRoles={['UNIVERSITY', 'STUDENT', 'FACULTY', 'ADMIN']}>
                <UniversityDashboard />
              </RoleGuard>
            </AuthGuard>
          }
        />
        <Route
          path="/university/challenges"
          element={
            <AuthGuard>
              <RoleGuard allowedRoles={['UNIVERSITY', 'STUDENT', 'FACULTY', 'ADMIN']}>
                <UniversityChallenges />
              </RoleGuard>
            </AuthGuard>
          }
        />

        {/* Industry Routes */}
        <Route
          path="/industry/dashboard"
          element={
            <AuthGuard>
              <RoleGuard allowedRoles={['INDUSTRY', 'ADMIN']}>
                <IndustryDashboard />
              </RoleGuard>
            </AuthGuard>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <AuthGuard>
              <RoleGuard allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </RoleGuard>
            </AuthGuard>
          }
        />

        {/* Catch-all Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};
