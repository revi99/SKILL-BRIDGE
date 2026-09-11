import React from 'react';
import { Target, Zap, AlertCircle } from 'lucide-react';

export default function MatchBadge({ percent = 0, size = 'md' }) {
  const rounded = Math.round(percent);

  let badgeColor = 'bg-rose-50 text-rose-700 border-rose-200';
  let dotColor = 'bg-rose-500';
  let label = 'Low Match';
  let icon = AlertCircle;

  if (rounded >= 80) {
    badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-xs';
    dotColor = 'bg-emerald-500';
    label = 'Excellent Match';
    icon = Zap;
  } else if (rounded >= 60) {
    badgeColor = 'bg-violet-50 text-violet-700 border-violet-200 shadow-xs';
    dotColor = 'bg-violet-500';
    label = 'Good Match';
    icon = Target;
  } else if (rounded >= 40) {
    badgeColor = 'bg-amber-50 text-amber-700 border-amber-200 shadow-xs';
    dotColor = 'bg-amber-500';
    label = 'Partial Match';
    icon = AlertCircle;
  }

  const Icon = icon;

  if (size === 'sm') {
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeColor}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
        <span>{rounded}% Match</span>
      </span>
    );
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badgeColor}`}>
      <Icon className="w-3.5 h-3.5" />
      <span>{rounded}% Match</span>
      <span className="text-[10px] opacity-80 uppercase tracking-wider font-mono">({label})</span>
    </div>
  );
}
