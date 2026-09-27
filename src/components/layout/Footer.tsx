import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">JanSamadhan Jharkhand</span>
            <span>·</span>
            <span>Smart India Hackathon 2026 Student Innovation Project</span>
          </div>

          <div className="flex items-center gap-6">
            <span>Department of Higher & Technical Education, Govt of Jharkhand</span>
            <span>·</span>
            <span className="tabular-nums">Phase 1 Release</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
