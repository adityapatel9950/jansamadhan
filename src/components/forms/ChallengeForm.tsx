import React, { useState } from 'react';
import {
  CreateChallengeInput,
  ChallengePriority,
  CITIZEN_CHALLENGE_CATEGORIES,
} from '../../types/challenge';
import { LocationPicker } from './LocationPicker';
import { FileUpload } from './FileUpload';
import { Button } from '../common/Button';
import { AlertCircle, HelpCircle } from 'lucide-react';

export interface ChallengeFormProps {
  initialValues?: Partial<CreateChallengeInput>;
  onSubmit: (values: CreateChallengeInput) => Promise<void>;
  isLoading?: boolean;
  submitButtonText?: string;
  isEditing?: boolean;
}

export const ChallengeForm: React.FC<ChallengeFormProps> = ({
  initialValues = {},
  onSubmit,
  isLoading = false,
  submitButtonText = 'Submit Societal Challenge',
  isEditing = false,
}) => {
  const [title, setTitle] = useState(initialValues.title || '');
  const [description, setDescription] = useState(initialValues.description || '');
  const [category, setCategory] = useState(initialValues.category || CITIZEN_CHALLENGE_CATEGORIES[0]);
  const [priority, setPriority] = useState<ChallengePriority>(initialValues.priority || 'MEDIUM');
  const [district, setDistrict] = useState(initialValues.district || 'Ranchi');
  const [block, setBlock] = useState(initialValues.block || '');
  const [village, setVillage] = useState(initialValues.village || '');
  const [address, setAddress] = useState(initialValues.address || '');
  const [latitude, setLatitude] = useState<number | undefined>(initialValues.latitude);
  const [longitude, setLongitude] = useState<number | undefined>(initialValues.longitude);
  const [impactedPopulationEstimate, setImpactedPopulationEstimate] = useState<number>(
    initialValues.impactedPopulationEstimate || 500
  );
  const [contactPreference, setContactPreference] = useState<'PHONE' | 'EMAIL' | 'PORTAL' | 'WHATSAPP'>(
    initialValues.contactPreference || 'PORTAL'
  );
  const [supportingImageUrl, setSupportingImageUrl] = useState(initialValues.supportingImageUrl || '');
  const [supportingDocumentUrl, setSupportingDocumentUrl] = useState(
    initialValues.supportingDocumentUrl || ''
  );
  const [tagsInput, setTagsInput] = useState(
    initialValues.tags ? initialValues.tags.join(', ') : ''
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!title || title.trim().length < 5) {
      errs.title = 'Problem title must be at least 5 characters.';
    } else if (title.trim().length > 300) {
      errs.title = 'Title must not exceed 300 characters.';
    }

    if (!description || description.trim().length < 20) {
      errs.description = 'Please provide detailed description (at least 20 characters).';
    }

    if (!category) {
      errs.category = 'Please select a valid category.';
    }

    if (!district) {
      errs.district = 'Please select a district in Jharkhand.';
    }

    if (impactedPopulationEstimate < 0) {
      errs.impactedPopulationEstimate = 'People affected cannot be negative.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0);

    await onSubmit({
      title: title.trim(),
      description: description.trim(),
      category,
      district,
      block: block.trim() || undefined,
      village: village.trim() || undefined,
      address: address.trim() || undefined,
      latitude,
      longitude,
      priority,
      impactedPopulationEstimate: Number(impactedPopulationEstimate),
      contactPreference,
      supportingImageUrl: supportingImageUrl || undefined,
      supportingDocumentUrl: supportingDocumentUrl || undefined,
      tags,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. Problem Overview */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1.5">
          1. Grievance Overview
        </h3>

        {/* Title */}
        <div>
          <label className="block text-xs font-medium text-slate-800 mb-1">
            Problem Statement Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Chronic lack of irrigation water in Ormanjhi terraced farmlands"
            className={`w-full text-xs rounded border px-3 py-2 focus:outline-none ${
              errors.title ? 'border-rose-400 focus:border-rose-600' : 'border-slate-300 focus:border-emerald-600'
            }`}
          />
          {errors.title && <p className="text-[11px] text-rose-600 mt-1">{errors.title}</p>}
        </div>

        {/* Category & Severity Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-800 mb-1">
              Category <span className="text-rose-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full text-xs rounded border border-slate-300 bg-white px-2.5 py-2 focus:border-emerald-600 focus:outline-none"
            >
              {CITIZEN_CHALLENGE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-800 mb-1">
              Problem Severity
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as ChallengePriority)}
              className="w-full text-xs rounded border border-slate-300 bg-white px-2.5 py-2 focus:border-emerald-600 focus:outline-none"
            >
              <option value="LOW">Low (Routine improvement)</option>
              <option value="MEDIUM">Medium (Seasonal hardship)</option>
              <option value="HIGH">High (Major economic/livelihood loss)</option>
              <option value="CRITICAL">Critical (Immediate health/hazard emergency)</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-medium text-slate-800 mb-1">
            Detailed Problem Description <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Explain what is failing, who is impacted, seasonal patterns, and what has been tried so far (minimum 20 characters)..."
            className={`w-full text-xs rounded border p-2.5 focus:outline-none ${
              errors.description ? 'border-rose-400 focus:border-rose-600' : 'border-slate-300 focus:border-emerald-600'
            }`}
          />
          {errors.description && (
            <p className="text-[11px] text-rose-600 mt-1">{errors.description}</p>
          )}
        </div>
      </div>

      {/* 2. Location Information Component */}
      <LocationPicker
        district={district}
        block={block}
        village={village}
        address={address}
        latitude={latitude}
        longitude={longitude}
        onChange={(data) => {
          setDistrict(data.district);
          setBlock(data.block || '');
          setVillage(data.village || '');
          setAddress(data.address || '');
          setLatitude(data.latitude);
          setLongitude(data.longitude);
        }}
        errors={errors}
      />

      {/* 3. Community Impact & Contact */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1.5">
          2. Beneficiaries & Contact Preference
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-800 mb-1">
              Estimated People Affected
            </label>
            <input
              type="number"
              min="0"
              value={impactedPopulationEstimate}
              onChange={(e) => setImpactedPopulationEstimate(parseInt(e.target.value, 10) || 0)}
              className="w-full text-xs rounded border border-slate-300 px-3 py-2 focus:border-emerald-600 focus:outline-none"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Approximate number of villagers or students impacted.
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-800 mb-1">
              Contact Preference for Verification
            </label>
            <select
              value={contactPreference}
              onChange={(e) =>
                setContactPreference(e.target.value as 'PHONE' | 'EMAIL' | 'PORTAL' | 'WHATSAPP')
              }
              className="w-full text-xs rounded border border-slate-300 bg-white px-2.5 py-2 focus:border-emerald-600 focus:outline-none"
            >
              <option value="PORTAL">Through JanSamadhan Portal Dashboard</option>
              <option value="PHONE">Phone Call by Nodal Officer</option>
              <option value="WHATSAPP">WhatsApp Updates</option>
              <option value="EMAIL">Official Email</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-800 mb-1">
            Keywords / Search Tags
          </label>
          <input
            type="text"
            placeholder="e.g. solar, drip-irrigation, rabi-crop, chota-nagpur (comma separated)"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            className="w-full text-xs rounded border border-slate-300 px-3 py-2 focus:border-emerald-600 focus:outline-none"
          />
        </div>
      </div>

      {/* 4. Supporting Evidences & Storage */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1.5">
          3. Supporting Images & Documents
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FileUpload
            label="Field Photograph (Evidence)"
            accept="image/jpeg,image/png,image/webp"
            type="IMAGE"
            value={supportingImageUrl}
            onChange={setSupportingImageUrl}
            helperText="Clear photograph of site, check-dam, or damaged facility."
          />

          <FileUpload
            label="Supporting Document / Report"
            accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            type="DOCUMENT"
            value={supportingDocumentUrl}
            onChange={setSupportingDocumentUrl}
            helperText="Gram Sabha resolution, lab test report, or survey PDF."
          />
        </div>
      </div>

      {/* Submit Controls */}
      <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <HelpCircle className="w-4 h-4 text-slate-400" />
          <span>
            {isEditing
              ? 'Changes will be saved and re-validated by the system.'
              : 'Submissions are verified by Jharkhand nodal officers within 7 working days.'}
          </span>
        </div>

        <Button type="submit" variant="primary" isLoading={isLoading}>
          {submitButtonText}
        </Button>
      </div>
    </form>
  );
};
