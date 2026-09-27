import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Building2,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  Compass,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  if (!user) return null;

  const role = user.role;

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
      isActive
        ? 'bg-emerald-900 text-white font-semibold'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between shrink-0">
      <div className="space-y-6">
        <div>
          <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            {role} Portal
          </div>
          <div className="mt-2 space-y-1">
            {/* Citizen Links */}
            {role === 'CITIZEN' && (
              <>
                <NavLink to="/citizen/dashboard" className={linkClass}>
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Citizen Overview</span>
                </NavLink>
                <NavLink to="/citizen/challenges" end className={linkClass}>
                  <FileText className="w-4 h-4" />
                  <span>Browse Challenges</span>
                </NavLink>
                <NavLink to="/citizen/challenges/new" className={linkClass}>
                  <PlusCircle className="w-4 h-4" />
                  <span>Report Societal Problem</span>
                </NavLink>
              </>
            )}

            {/* Government Links */}
            {role === 'GOVERNMENT' && (
              <>
                <NavLink to="/government/dashboard" className={linkClass}>
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Officer Dashboard</span>
                </NavLink>
                <NavLink to="/government/challenges" className={linkClass}>
                  <Building2 className="w-4 h-4" />
                  <span>Review & Prioritize</span>
                </NavLink>
                <NavLink to="/citizen/challenges/new" className={linkClass}>
                  <PlusCircle className="w-4 h-4" />
                  <span>Post Dept Need</span>
                </NavLink>
              </>
            )}

            {/* University / Student / Faculty Links */}
            {(role === 'UNIVERSITY' || role === 'STUDENT' || role === 'FACULTY') && (
              <>
                <NavLink to="/university/dashboard" className={linkClass}>
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Academic Innovation Hub</span>
                </NavLink>
                <NavLink to="/university/challenges" className={linkClass}>
                  <GraduationCap className="w-4 h-4" />
                  <span>R&D Challenges</span>
                </NavLink>
                <NavLink to="/citizen/challenges/new" className={linkClass}>
                  <PlusCircle className="w-4 h-4" />
                  <span>Submit Campus Idea</span>
                </NavLink>
              </>
            )}

            {/* Industry Links */}
            {role === 'INDUSTRY' && (
              <>
                <NavLink to="/industry/dashboard" className={linkClass}>
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Industry & CSR Hub</span>
                </NavLink>
                <NavLink to="/citizen/challenges" className={linkClass}>
                  <Briefcase className="w-4 h-4" />
                  <span>Explore Problems</span>
                </NavLink>
              </>
            )}

            {/* Admin Links */}
            {role === 'ADMIN' && (
              <>
                <NavLink to="/admin/dashboard" className={linkClass}>
                  <ShieldCheck className="w-4 h-4" />
                  <span>State Administration</span>
                </NavLink>
                <NavLink to="/government/challenges" className={linkClass}>
                  <Building2 className="w-4 h-4" />
                  <span>All Dept Submissions</span>
                </NavLink>
                <NavLink to="/citizen/challenges" className={linkClass}>
                  <Compass className="w-4 h-4" />
                  <span>Citizen Registry</span>
                </NavLink>
              </>
            )}
          </div>
        </div>

        {/* Institutional Reference Notice */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-md text-[11px] text-slate-600 space-y-1">
          <div className="font-semibold text-slate-800">Smart India Hackathon 2026</div>
          <p className="leading-relaxed">
            Phase 1: Problem intake, inter-departmental routing, and academic R&D alignment for Jharkhand.
          </p>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400">
        <div>Govt of Jharkhand · SIH 2026</div>
        <div className="text-[10px] mt-0.5">Version 1.0 (Phase 1 Build)</div>
      </div>
    </aside>
  );
};
