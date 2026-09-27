import React, { useRef, useState } from 'react';
import { Upload, X, FileCheck, AlertCircle, Loader2 } from 'lucide-react';
import { challengeService } from '../../services/challengeService';

export interface FileUploadProps {
  label: string;
  accept: string;
  type: 'IMAGE' | 'DOCUMENT';
  value?: string;
  onChange: (url: string) => void;
  helperText?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  accept,
  type,
  value,
  onChange,
  helperText,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 8MB for prototype upload)
    if (file.size > 8 * 1024 * 1024) {
      setError('File size must be under 8MB.');
      return;
    }

    setError(null);
    setIsUploading(true);
    setFileName(file.name);

    try {
      // Read as base64
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64Data = reader.result as string;
          const res = await challengeService.uploadFile(base64Data, file.name, file.type, type);
          onChange(res.url);
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : 'Upload failed';
          setError(msg);
        } finally {
          setIsUploading(false);
        }
      };
      reader.onerror = () => {
        setError('Failed to read file locally.');
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      setError('Could not process selected file.');
      setIsUploading(false);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
        {label}
      </label>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />

      {!value && !isUploading && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 hover:border-emerald-600 rounded-lg p-4 text-center cursor-pointer transition-colors bg-slate-50 hover:bg-emerald-50/30 group"
        >
          <Upload className="w-6 h-6 text-slate-400 group-hover:text-emerald-700 mx-auto mb-1.5 transition-colors" />
          <p className="text-xs font-medium text-slate-700 group-hover:text-emerald-950">
            Click to upload {type.toLowerCase()}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {helperText || (type === 'IMAGE' ? 'JPEG, PNG up to 8MB' : 'PDF or DOC up to 8MB')}
          </p>
        </div>
      )}

      {isUploading && (
        <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 flex items-center justify-center gap-2 text-xs text-slate-600">
          <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
          <span>Processing and storing {fileName}...</span>
        </div>
      )}

      {value && !isUploading && (
        <div className="border border-emerald-200 bg-emerald-50/60 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            {type === 'IMAGE' ? (
              <img
                src={value}
                alt="Preview"
                className="w-10 h-10 object-cover rounded border border-emerald-300 shrink-0"
              />
            ) : (
              <FileCheck className="w-8 h-8 text-emerald-700 shrink-0" />
            )}
            <div className="min-w-0">
              <p className="text-xs font-semibold text-emerald-950 truncate">
                {fileName || 'Supporting File Attached'}
              </p>
              <p className="text-[11px] text-emerald-700">Uploaded & ready</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="Remove file"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {error && (
        <p className="text-xs text-rose-600 flex items-center gap-1 mt-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};
