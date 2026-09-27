import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Card } from '../../components/common/Card';
import { FormField } from '../../components/forms/FormField';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { UserRole } from '../../types/auth';
import { ShieldCheck, UserCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, switchDemoRole, demoAccounts } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getDashboardForRole = (role: UserRole): string => {
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await login({ email, password });
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname;
      navigate(from || '/citizen/dashboard');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid credentials';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (role: UserRole) => {
    setIsLoading(true);
    setError(null);
    try {
      await switchDemoRole(role);
      navigate(getDashboardForRole(role));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to switch demo persona';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          JanSamadhan Authentication Portal
        </h1>
        <p className="text-xs text-slate-500 mt-1 max-w-lg mx-auto">
          Jharkhand State Societal Innovation Platform · Smart India Hackathon 2026
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left: Standard Credentials Form */}
        <div className="md:col-span-6">
          <Card
            headerKicker="Portal Access"
            title="Sign In with Credentials"
            subtitle="Access your registered state innovation profile"
            footer={
              <div className="text-center">
                New user in Jharkhand?{' '}
                <Link to="/register" className="font-semibold text-emerald-900 hover:underline">
                  Create an account
                </Link>
              </div>
            }
          >
            {error && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded text-xs text-rose-700">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <FormField label="Registered Email Address" required>
                <Input
                  type="email"
                  placeholder="e.g. yourname@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </FormField>

              <FormField label="Password" required>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </FormField>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  isLoading={isLoading}
                >
                  Sign In
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Right: Quick SIH 2026 Evaluator Personas */}
        <div className="md:col-span-6 space-y-4">
          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <div className="flex items-center gap-2 text-emerald-900 mb-1">
              <ShieldCheck className="w-5 h-5 text-emerald-800" />
              <h2 className="text-sm font-semibold text-slate-900">
                SIH 2026 Evaluation Personas
              </h2>
            </div>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Test role-specific workflows across government, academia, and industry with one click:
            </p>

            <div className="space-y-2">
              {demoAccounts.map((account) => (
                <button
                  key={account.id}
                  onClick={() => handleQuickLogin(account.role)}
                  disabled={isLoading}
                  className="w-full text-left p-2.5 rounded border border-slate-200 hover:border-emerald-800 hover:bg-slate-50 transition-colors flex items-center justify-between group"
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-900 group-hover:text-emerald-900">
                        {account.name}
                      </span>
                      <span className="font-mono text-[10px] px-1.5 py-0.2 bg-slate-100 border border-slate-200 rounded text-slate-600">
                        {account.role}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5">
                      {account.designation} · {account.district}
                    </div>
                  </div>
                  <UserCheck className="w-4 h-4 text-slate-300 group-hover:text-emerald-800 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
