import React from 'react';
import { MemoryStatus, SourceType } from '@/types';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | 'default'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
    | 'neutral'
    | 'purple'
    | 'teal'
    | 'emerald'
    | 'amber'
    | 'rose'
    | 'indigo'
    | 'slate';
  size?: 'sm' | 'md';
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}: BadgeProps) {
  const sizeStyles = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  const variantStyles = {
    default: 'bg-teal-50 text-teal-700 border-teal-200/80',
    teal: 'bg-teal-50 text-teal-700 border-teal-200/80',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    warning: 'bg-amber-50 text-amber-700 border-amber-200/80',
    amber: 'bg-amber-50 text-amber-700 border-amber-200/80',
    danger: 'bg-rose-50 text-rose-700 border-rose-200/80',
    rose: 'bg-rose-50 text-rose-700 border-rose-200/80',
    info: 'bg-sky-50 text-sky-700 border-sky-200/80',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200/80',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
  }[variant];

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${sizeStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: MemoryStatus | string }) {
  switch (status) {
    case 'CURRENT':
      return (
        <Badge variant="success" size="sm" className="font-semibold tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
          CURRENT
        </Badge>
      );
    case 'STOPPED':
    case 'HISTORICAL':
      return (
        <Badge variant="neutral" size="sm" className="font-semibold tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-1.5" />
          STOPPED / HISTORICAL
        </Badge>
      );
    case 'TEMPORARY':
      return (
        <Badge variant="info" size="sm" className="font-semibold tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mr-1.5" />
          TEMPORARY
        </Badge>
      );
    case 'CONFLICTED':
      return (
        <Badge variant="danger" size="sm" className="font-semibold tracking-wide animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5" />
          CONFLICT DETECTED
        </Badge>
      );
    case 'UNKNOWN':
    case 'UNVERIFIED':
    default:
      return (
        <Badge variant="warning" size="sm" className="font-semibold tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-1.5" />
          UNVERIFIED
        </Badge>
      );
  }
}

export function SourceBadge({ source }: { source: SourceType | string }) {
  const label = {
    PATIENT_REPORTED: 'Patient-Reported',
    DOCTOR_RECOMMENDATION: 'Physician Directive',
    SYSTEM_GENERATED: 'System Synthesized',
    SYNTHETIC_DEMO_RECORD: 'Synthetic Profile',
    UNKNOWN: 'Unverified Source',
  }[source] || source;

  return (
    <span className="inline-flex items-center text-[11px] text-slate-500 font-medium">
      <span className="w-1 h-1 rounded-full bg-slate-400 mr-1.5" />
      {label}
    </span>
  );
}
