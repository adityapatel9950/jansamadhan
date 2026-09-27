import React, { useState } from 'react';
import { FormField } from './FormField';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

export interface SolutionFormProps {
  challengeTitle: string;
  onSubmit: (data: {
    title: string;
    summary: string;
    technicalStack: string;
    estimatedBudget: number;
    estimatedDurationMonths: number;
  }) => Promise<void>;
  isLoading?: boolean;
}

export const SolutionForm: React.FC<SolutionFormProps> = ({
  challengeTitle,
  onSubmit,
  isLoading = false,
}) => {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [technicalStack, setTechnicalStack] = useState('');
  const [estimatedBudget, setEstimatedBudget] = useState(25000);
  const [estimatedDurationMonths, setEstimatedDurationMonths] = useState(3);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!title.trim() || title.length < 5) {
      errs.title = 'Solution title must be at least 5 characters.';
    }
    if (!summary.trim() || summary.length < 20) {
      errs.summary = 'Summary must be at least 20 characters explaining the solution architecture.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit({
      title,
      summary,
      technicalStack,
      estimatedBudget,
      estimatedDurationMonths,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700">
        <span className="font-semibold text-slate-900">Applying Solution to: </span>
        <span className="italic">{challengeTitle}</span>
      </div>

      <FormField
        label="Proposed Innovation / Project Title"
        required
        error={errors.title}
      >
        <Input
          placeholder="e.g., Low-cost LoRa-based Multi-Depth Soil Moisture Telemetry Unit"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </FormField>

      <FormField
        label="Technical Approach & Architecture"
        required
        description="Detail hardware/software stack, local manufacturing feasibility, and deployment plan."
        error={errors.summary}
      >
        <textarea
          rows={4}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Describe how the solution solves this specific problem, how rural users operate it, and component cost breakdown..."
          className="w-full text-sm p-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-slate-900 bg-white"
        />
      </FormField>

      <FormField
        label="Technical Stack / Components"
        description="e.g., ESP32, Solar MPPT, Flutter, PostgreSQL, LoRaWAN"
      >
        <Input
          placeholder="e.g., ESP32 Microcontroller, Soil Cap Sensor, Firebase/Postgres"
          value={technicalStack}
          onChange={(e) => setTechnicalStack(e.target.value)}
        />
      </FormField>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Estimated Prototype Budget (INR)"
          description="Hardware and pilot testing costs"
        >
          <Input
            type="number"
            min={0}
            step={1000}
            value={estimatedBudget}
            onChange={(e) => setEstimatedBudget(parseFloat(e.target.value) || 0)}
          />
        </FormField>

        <FormField
          label="Estimated Duration (Months)"
          description="Time to deploy functional prototype in field"
        >
          <Input
            type="number"
            min={1}
            max={24}
            value={estimatedDurationMonths}
            onChange={(e) => setEstimatedDurationMonths(parseInt(e.target.value, 10) || 1)}
          />
        </FormField>
      </div>

      <div className="pt-2 flex justify-end gap-2">
        <Button type="submit" variant="primary" isLoading={isLoading}>
          Submit Innovation Proposal
        </Button>
      </div>
    </form>
  );
};
