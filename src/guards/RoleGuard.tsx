import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types/auth';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { ShieldAlert } from 'lucide-react';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children }) => {
  const { user, switchDemoRole } = useAuth();

  if (!user) {
    return null;
  }

  // ADMIN has full access across all sections
  if (user.role === 'ADMIN' || allowedRoles.includes(user.role)) {
    return <>{children}</>;
  }

  // Role routing helper
  const getRoleDashboard = (role: UserRole): string => {
    switch (role) {
      case 'CITIZEN':
        return '/citizen/dashboard';
      case 'GOVERNMENT':
        return '/government/dashboard';
      case 'UNIVERSITY':
      case 'STUDENT':
      case 'FACULTY':
        return '/university/dashboard';
      case 'INDUSTRY':
        return '/industry/dashboard';
      case 'ADMIN':
        return '/admin/dashboard';
      default:
        return '/';
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-16 px-4">
      <Card
        title="Role Access Restricted"
        headerKicker="Access Control"
        footer={
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link to={getRoleDashboard(user.role)}>
              <Button variant="outline" size="sm">
                Return to My Dashboard ({user.role})
              </Button>
            </Link>
            {allowedRoles[0] && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => switchDemoRole(allowedRoles[0])}
              >
                Switch to {allowedRoles[0]} Persona
              </Button>
            )}
          </div>
        }
      >
        <div className="flex items-start gap-4">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-700 leading-relaxed">
              This portal section is restricted to{' '}
              <span className="font-semibold text-slate-900">
                {allowedRoles.join(' or ')}
              </span>{' '}
              roles. You are currently authenticated as{' '}
              <span className="font-semibold text-slate-900">{user.name}</span> with role{' '}
              <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-slate-100 border border-slate-300 rounded text-slate-800">
                {user.role}
              </span>
              .
            </p>
            <p className="mt-3 text-xs text-slate-500">
              For Smart India Hackathon evaluation, you can switch personas instantly using the button below or via the top navigation bar.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
