import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Card } from '../../components/common/Card';
import { FormField } from '../../components/forms/FormField';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';
import { UserRole } from '../../types/auth';
import { JHARKHAND_DISTRICTS } from '../../utils/formatters';

const ROLE_OPTIONS = [
  { value: 'CITIZEN', label: 'Citizen / Resident / Farmer' },
  { value: 'GOVERNMENT', label: 'Government Officer / Dept Representative' },
  { value: 'UNIVERSITY', label: 'University Administrator / Incubation Cell' },
  { value: 'STUDENT', label: 'Student Innovator (BTech / Polytechnic / Degree)' },
  { value: 'FACULTY', label: 'University Faculty / Principal Investigator' },
  { value: 'INDUSTRY', label: 'Industry Partner / Startup / CSR Entity' },
];

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'CITIZEN' as UserRole,
    phone: '',
    district: 'Ranchi',
    organizationOrDepartment: '',
    designation: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill out all required fields.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await register(formData);
      navigate('/citizen/dashboard');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <Card
        headerKicker="Registration"
        title="Create JanSamadhan Account"
        subtitle="Register as a Citizen, Student, Faculty, Government Officer or Industry Partner"
        footer={
          <div className="text-center">
            Already registered on JanSamadhan?{' '}
            <Link to="/login" className="font-semibold text-emerald-900 hover:underline">
              Sign In
            </Link>
          </div>
        }
      >
        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded text-xs text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Full Name" required>
              <Input
                placeholder="e.g. Ramesh Mahto"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </FormField>

            <FormField label="Portal Role" required>
              <Select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                options={ROLE_OPTIONS}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Official / Personal Email" required>
              <Input
                type="email"
                placeholder="e.g. ramesh@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </FormField>

            <FormField label="Password" required description="Minimum 6 characters">
              <Input
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Jharkhand District" required>
              <Select
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                options={JHARKHAND_DISTRICTS.map((d) => ({ value: d, label: d }))}
              />
            </FormField>

            <FormField label="Mobile / Contact Phone">
              <Input
                type="tel"
                placeholder="+91-9876543210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Organization / Department / College"
              description="e.g. BIT Mesra, Agriculture Dept, Gram Panchayat"
            >
              <Input
                placeholder="Institution or Organization"
                value={formData.organizationOrDepartment}
                onChange={(e) =>
                  setFormData({ ...formData, organizationOrDepartment: e.target.value })
                }
              />
            </FormField>

            <FormField
              label="Designation / Academic Program"
              description="e.g. BTech 3rd Yr, Assistant Professor, Block Nodal"
            >
              <Input
                placeholder="Designation"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              />
            </FormField>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={isLoading}
            >
              Complete Registration
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
