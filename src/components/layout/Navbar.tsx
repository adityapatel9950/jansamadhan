import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { UserRole } from "../../types/auth";
import {
  Shield,
  Layers,
  ChevronDown,
  User as UserIcon,
  LogOut,
  Bell,
  Menu,
  X,
  PlusCircle,
} from "lucide-react";

interface DemoPersona {
  role: UserRole;
  label: string;
  email: string;
  desc: string;
}

const DEMO_PERSONAS: DemoPersona[] = [
  {
    role: "CITIZEN",
    label: "Citizen Submitter",
    email: "anand.mahto@gmail.com",
    desc: "Farmer & Village Rep, Ranchi",
  },
  {
    role: "GOVERNMENT",
    label: "State Nodal Officer",
    email: "nodal.agri@jharkhand.gov.in",
    desc: "Joint Director, Dept of Agriculture",
  },
  {
    role: "STUDENT",
    label: "Student Innovator",
    email: "priya.kumari@student.bitmesra.ac.in",
    desc: "Capstone Team Lead, BIT Mesra",
  },
  {
    role: "FACULTY",
    label: "Academic Mentor",
    email: "subodh.kumar@cse.iitism.ac.in",
    desc: "Professor & Lab Director, IIT ISM Dhanbad",
  },
  {
    role: "INDUSTRY",
    label: "Industry CSR Partner",
    email: "csr.projects@tatasteel.com",
    desc: "Program Head, Tata Steel Foundation",
  },
  {
    role: "ADMIN",
    label: "State Administrator",
    email: "director.it@jharkhand.gov.in",
    desc: "Dept of Information Technology",
  },
];

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout, switchDemoRole } = useAuth();
  const navigate = useNavigate();

  const [isDemoMenuOpen, setIsDemoMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handlePersonaSelect = async (role: UserRole) => {
    setIsDemoMenuOpen(false);
    await switchDemoRole(role);
    switch (role) {
      case "CITIZEN":
        navigate("/citizen/dashboard");
        break;
      case "GOVERNMENT":
        navigate("/government/dashboard");
        break;
      case "STUDENT":
      case "FACULTY":
      case "UNIVERSITY":
        navigate("/university/dashboard");
        break;
      case "INDUSTRY":
        navigate("/industry/dashboard");
        break;
      case "ADMIN":
        navigate("/admin/dashboard");
        break;
      default:
        navigate("/citizen/dashboard");
    }
  };

  const getDashboardPath = (role?: UserRole) => {
    switch (role) {
      case "CITIZEN":
        return "/citizen/dashboard";
      case "GOVERNMENT":
        return "/government/dashboard";
      case "STUDENT":
      case "FACULTY":
      case "UNIVERSITY":
        return "/university/dashboard";
      case "INDUSTRY":
        return "/industry/dashboard";
      case "ADMIN":
        return "/admin/dashboard";
      default:
        return "/login";
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Zone 1: Branding */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-emerald-800 text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-xs">
                JS
              </div>
              <div>
                <span className="font-bold text-slate-900 text-sm tracking-tight block">
                  JanSamadhan
                </span>
                <span className="text-[10px] text-slate-500 font-medium block -mt-0.5">
                  जनसमाधान · Jharkhand Innovation
                </span>
              </div>
            </Link>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-5 text-xs font-medium text-slate-600">
            {isAuthenticated ? (
              <>
                <Link
                  to={getDashboardPath(user?.role)}
                  className="hover:text-emerald-900 transition-colors"
                >
                  Dashboard
                </Link>
                {user?.role === "CITIZEN" && (
                  <Link
                    to="/citizen/my-challenges"
                    className="hover:text-emerald-900 transition-colors"
                  >
                    My Challenges
                  </Link>
                )}
                <Link
                  to="/citizen/challenges"
                  className="hover:text-emerald-900 transition-colors"
                >
                  All Challenges
                </Link>
                {user?.role === "CITIZEN" && (
                  <Link
                    to="/citizen/new-challenge"
                    className="text-emerald-800 hover:text-emerald-950 font-semibold flex items-center gap-1"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Report Issue</span>
                  </Link>
                )}
                {user?.role === "GOVERNMENT" && (
                  <Link
                    to="/government/challenges"
                    className="hover:text-emerald-900 transition-colors"
                  >
                    Department Review
                  </Link>
                )}
                {(user?.role === "UNIVERSITY" ||
                  user?.role === "STUDENT" ||
                  user?.role === "FACULTY") && (
                  <Link
                    to="/university/challenges"
                    className="hover:text-emerald-900 transition-colors"
                  >
                    R&D Problem Statements
                  </Link>
                )}
                {user?.role === "ADMIN" && (
                  <Link
                    to="/admin/dashboard"
                    className="hover:text-emerald-900 transition-colors"
                  >
                    State Oversight
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hover:text-slate-900 transition-colors"
                >
                  Citizen Portal
                </Link>
                <Link
                  to="/login"
                  className="hover:text-slate-900 transition-colors"
                >
                  Universities & R&D
                </Link>
                <Link
                  to="/login"
                  className="hover:text-slate-900 transition-colors"
                >
                  State Departments
                </Link>
              </>
            )}
          </nav>

          {/* Zone 3: Actions & Demo Switcher */}
          <div className="flex items-center gap-3">
            {/* Quick Demo Switcher Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDemoMenuOpen(!isDemoMenuOpen)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-md transition-colors"
                title="Switch role persona for SIH evaluation"
              >
                <Layers className="w-3.5 h-3.5 text-emerald-800" />
                <span className="hidden sm:inline">Role Persona:</span>
                <span className="font-semibold text-emerald-900">
                  {user?.role || "Switch Role"}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {isDemoMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsDemoMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg border border-slate-200 py-1.5 z-50 text-left">
                    <div className="px-3 py-1.5 border-b border-slate-100">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        SIH 2026 Evaluation Roles
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Instant zero-password login simulation
                      </p>
                    </div>
                    {DEMO_PERSONAS.map((p) => (
                      <button
                        key={p.role}
                        type="button"
                        onClick={() => handlePersonaSelect(p.role)}
                        className={`w-full text-left px-3 py-2 text-xs hover:bg-slate-50 transition-colors flex flex-col ${
                          user?.role === p.role
                            ? "bg-emerald-50/60 font-semibold"
                            : ""
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-slate-900">
                            {p.label}
                          </span>
                          <span className="text-[10px] uppercase font-bold text-slate-400">
                            {p.role}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 truncate">
                          {p.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* User status & Logout */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={logout}
                  className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 px-3 py-1.5 rounded transition-colors"
              >
                Sign In
              </Link>
            )}

            {/* Mobile menu trigger */}
            <div className="flex md:hidden">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-1.5 text-slate-600 hover:bg-slate-100 rounded"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2 text-xs font-medium text-slate-700">
          <Link
            to={getDashboardPath(user?.role)}
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-1.5"
          >
            Dashboard
          </Link>
          <Link
            to="/citizen/my-challenges"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-1.5"
          >
            My Challenges
          </Link>
          <Link
            to="/citizen/challenges"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-1.5"
          >
            All Challenges
          </Link>
          <Link
            to="/citizen/new-challenge"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-1.5 text-emerald-800 font-semibold"
          >
            Report Problem
          </Link>
        </div>
      )}
    </header>
  );
};
