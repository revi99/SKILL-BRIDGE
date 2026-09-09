import React from 'react';
import { Target, Zap, AlertCircle } from 'lucide-react';

export default function MatchBadge({ percent = 0, size = 'md' }) {
  const rounded = Math.round(percent);

  let badgeColor = 'bg-rose-500/10 text-rose-300 border-rose-500/30';
  let dotColor = 'bg-rose-400';
  let label = 'Low Match';
  let icon = AlertCircle;

  if (rounded >= 80) {
    badgeColor = 'bg-[#71C9CE]/20 text-[#E3FDFD] border-[#71C9CE]/50 shadow-sm shadow-[#71C9CE]/20';
    dotColor = 'bg-[#71C9CE]';
    label = 'Excellent Match';
    icon = Zap;
  } else if (rounded >= 60) {
    badgeColor = 'bg-[#A6E3E9]/20 text-[#CBF1F5] border-[#A6E3E9]/40';
    dotColor = 'bg-[#A6E3E9]';
    label = 'Good Match';
    icon = Target;
  } else if (rounded >= 40) {
    badgeColor = 'bg-amber-500/15 text-amber-300 border-amber-500/40';
    dotColor = 'bg-amber-400';
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
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${badgeColor}`}>
      <Icon className="w-3.5 h-3.5" />
      <span>{rounded}% Match</span>
      <span className="text-[10px] opacity-80 uppercase tracking-wider font-mono">({label})</span>
    </div>
  );
}
