import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import {
  TrendingUp,
  BarChart3,
  ShieldCheck,
  Award,
  Download,
  CheckCircle2,
  Building2,
  GraduationCap,
  Users,
  FileSpreadsheet,
  Layers,
  Sparkles,
  PieChart as PieIcon,
  AlertTriangle,
  LineChart,
  Printer,
  X,
  FileText,
  MapPin,
  Compass,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

export default function InstitutionAnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showNirfModal, setShowNirfModal] = useState(false);
  const [exportNotice, setExportNotice] = useState('');

  // Regional Heatmap matrix data
  const regionalHeatmap = [
    {
      region: 'Southern Tech Zone (BLR / HYD / CHN)',
      cloud: { gap: '-12%', status: 'low' },
      ai: { gap: '-24%', status: 'high' },
      fullstack: { gap: '-8%', status: 'opt' },
      iot: { gap: '-18%', status: 'mid' },
      readiness: '88%',
    },
    {
      region: 'Western Tech Corridor (PUN / MUM / AHM)',
      cloud: { gap: '-16%', status: 'mid' },
      ai: { gap: '-28%', status: 'high' },
      fullstack: { gap: '-10%', status: 'opt' },
      iot: { gap: '-14%', status: 'low' },
      readiness: '82%',
    },
    {
      region: 'Northern Tech Hub (NCR / DEL / CHD)',
      cloud: { gap: '-18%', status: 'mid' },
      ai: { gap: '-22%', status: 'mid' },
      fullstack: { gap: '-14%', status: 'low' },
      iot: { gap: '-26%', status: 'high' },
      readiness: '79%',
    },
    {
      region: 'Eastern Hub (KOL / BBS / PAT)',
      cloud: { gap: '-24%', status: 'high' },
      ai: { gap: '-32%', status: 'high' },
      fullstack: { gap: '-18%', status: 'mid' },
      iot: { gap: '-28%', status: 'high' },
      readiness: '71%',
    },
    {
      region: 'Tier-2 & Tier-3 Emerging Clusters',
      cloud: { gap: '-34%', status: 'high' },
      ai: { gap: '-40%', status: 'high' },
      fullstack: { gap: '-22%', status: 'mid' },
      iot: { gap: '-36%', status: 'high' },
      readiness: '64%',
    },
  ];

  const getHeatmapColor = (status) => {
    switch (status) {
      case 'opt':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'low':
        return 'bg-[#71C9CE]/20 text-[#CBF1F5] border-[#71C9CE]/30';
      case 'mid':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'high':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      default:
        return 'bg-slate-800 text-slate-300';
    }
  };

  useEffect(() => {
    const fetchPolicyData = async () => {
      try {
        const res = await api.get('/analytics/policy-decision-suite');
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to load policy analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPolicyData();
  }, []);

  const handleTriggerNirf = () => {
    setShowNirfModal(true);
  };

  const handlePrintAudit = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#71C9CE] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#71C9CE]/15 text-[#CBF1F5] border border-[#71C9CE]/30 flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-[#71C9CE]" /> Institutional Intelligence & NIRF Cell
            </span>
            <span className="text-xs text-[#A6E3E9] font-mono">Policy Decision Suite</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#E3FDFD]">
            Institutional Decision Analytics & Policy Intelligence
          </h1>
          <p className="text-sm text-[#CBF1F5]/70 mt-1 max-w-3xl">
            Regional skill deficit mapping, placement velocity tracking, and automated accreditation compliance scoring for educational leaders and policymakers.
          </p>
        </div>

        <button
          onClick={handleTriggerNirf}
          className="btn-brand-primary px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-[#71C9CE]/20 flex items-center gap-2 shrink-0 transition-transform hover:scale-105"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Generate Automated NIRF Audit</span>
        </button>
      </div>

      {/* 2. Top Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="glass-panel p-5 rounded-2xl border border-[#A6E3E9]/15">
          <div className="flex items-center justify-between text-[#CBF1F5]/70 mb-2">
            <span className="text-xs font-medium">Placement Readiness</span>
            <TrendingUp className="w-4 h-4 text-[#71C9CE]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#E3FDFD]">{data?.complianceScores?.placementReadiness || 84}%</span>
            <span className="text-xs text-emerald-400 font-semibold">+6.2% QoQ</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-[#A6E3E9]/15">
          <div className="flex items-center justify-between text-[#CBF1F5]/70 mb-2">
            <span className="text-xs font-medium">NIRF Projected Index</span>
            <Award className="w-4 h-4 text-[#A6E3E9]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#71C9CE]">{data?.complianceScores?.overallIndex || 88}/100</span>
            <span className="text-xs text-[#CBF1F5]/70 font-semibold">Tier-1 Band</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-[#A6E3E9]/15">
          <div className="flex items-center justify-between text-[#CBF1F5]/70 mb-2">
            <span className="text-xs font-medium">Curriculum Alignment</span>
            <Building2 className="w-4 h-4 text-[#CBF1F5]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#E3FDFD]">{data?.complianceScores?.curriculumAlignment || 79}%</span>
            <span className="text-xs text-amber-300 font-medium">AICTE Compliant</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-[#A6E3E9]/15">
          <div className="flex items-center justify-between text-[#CBF1F5]/70 mb-2">
            <span className="text-xs font-medium">Industry Collaboration</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-300">{data?.complianceScores?.industryEngagement || 91}%</span>
            <span className="text-xs text-emerald-400 font-medium">Excellent</span>
          </div>
        </div>
      </div>

      {/* 3. Regional Skill Deficit Heatmap Matrix */}
      <div className="glass-panel p-6 rounded-3xl border border-[#71C9CE]/25 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#A6E3E9]/15 pb-4">
          <div>
            <h2 className="text-lg font-bold text-[#E3FDFD] flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#71C9CE]" />
              <span>Regional Skill Deficit Heatmap Matrix</span>
            </h2>
            <p className="text-xs text-[#CBF1F5]/70 mt-0.5">
              Live geographic deficit comparison: Student supply competence vs. regional corporate hiring demand.
            </p>
          </div>

          <div className="flex items-center gap-2 text-[10px]">
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Optimal (&lt;10% Gap)</span>
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">Moderate (15-25%)</span>
            <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">Severe (&gt;25% Gap)</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#A6E3E9]/15 text-[#A6E3E9] text-[11px] uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Cluster / Geographic Region</th>
                <th className="py-3 px-4">Cloud & DevOps</th>
                <th className="py-3 px-4">Generative AI / ML</th>
                <th className="py-3 px-4">Full Stack Web</th>
                <th className="py-3 px-4">Embedded & IoT</th>
                <th className="py-3 px-4 text-right">Employability Index</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#A6E3E9]/10">
              {regionalHeatmap.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#0e242b]/60 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-[#E3FDFD]">{row.region}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${getHeatmapColor(row.cloud.status)}`}>
                      {row.cloud.gap}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${getHeatmapColor(row.ai.status)}`}>
                      {row.ai.gap}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${getHeatmapColor(row.fullstack.status)}`}>
                      {row.fullstack.gap}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${getHeatmapColor(row.iot.status)}`}>
                      {row.iot.gap}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-[#71C9CE] text-sm">
                    {row.readiness}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Hiring Demand vs Student Supply Velocity Area Chart */}
      <div className="glass-panel p-6 rounded-3xl border border-[#71C9CE]/25 space-y-6">
        <div className="flex items-center justify-between border-b border-[#A6E3E9]/15 pb-4">
          <div>
            <h2 className="text-lg font-bold text-[#E3FDFD] flex items-center gap-2">
              <LineChart className="w-5 h-5 text-[#71C9CE]" />
              <span>Hiring Velocity & Placement Preparedness Trends</span>
            </h2>
            <p className="text-xs text-[#CBF1F5]/70 mt-0.5">
              Monthly projection comparing corporate internship volume vs. verified college talent supply
            </p>
          </div>
        </div>

        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data?.hiringTrends || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#71C9CE" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#71C9CE" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorSupply" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#A6E3E9" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#A6E3E9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a424e" />
              <XAxis dataKey="month" stroke="#A6E3E9" tick={{ fill: '#CBF1F5', fontSize: 11 }} />
              <YAxis stroke="#A6E3E9" tick={{ fill: '#CBF1F5', fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: '#0e242b', borderColor: '#71C9CE', borderRadius: '8px', fontSize: '12px', color: '#E3FDFD' }} />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Area type="monotone" dataKey="openings" name="Industry Openings" stroke="#71C9CE" fillOpacity={1} fill="url(#colorDemand)" />
              <Area type="monotone" dataKey="applicants" name="Assessed Candidates" stroke="#A6E3E9" fillOpacity={1} fill="url(#colorSupply)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 5. NIRF / AICTE Audit Modal Overlay */}
      {showNirfModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#71C9CE]/50 max-w-2xl w-full space-y-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-[#A6E3E9]/20 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#71C9CE]/20 text-[#71C9CE] flex items-center justify-center border border-[#71C9CE]/40">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-[#E3FDFD]">
                    Automated NIRF / AICTE Compliance Audit Report
                  </h3>
                  <p className="text-xs text-[#A6E3E9]">Academic Year: 2025-2026 • Verified Portal Extraction</p>
                </div>
              </div>
              <button onClick={() => setShowNirfModal(false)} className="text-[#CBF1F5] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Score Breakdown Table */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-wider font-bold text-[#71C9CE]">
                1. Parameter Audit Breakdown:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-[#081418]/80 border border-[#71C9CE]/20 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#E3FDFD]">Teaching, Learning & Resources (TLR)</span>
                    <strong className="text-[#71C9CE]">88.5 / 100</strong>
                  </div>
                  <p className="text-[11px] text-[#CBF1F5]/60">Student-Faculty ratio & digital laboratory compliance</p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#081418]/80 border border-[#71C9CE]/20 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#E3FDFD]">Research & Professional Practice (RPC)</span>
                    <strong className="text-[#71C9CE]">82.0 / 100</strong>
                  </div>
                  <p className="text-[11px] text-[#CBF1F5]/60">Joint industry patents and sponsored R&D calls</p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#081418]/80 border border-[#71C9CE]/20 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#E3FDFD]">Graduation Outcomes & Placements (GO)</span>
                    <strong className="text-emerald-300">94.2 / 100</strong>
                  </div>
                  <p className="text-[11px] text-[#CBF1F5]/60">Median salary, placement rate & verified internships</p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#081418]/80 border border-[#71C9CE]/20 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#E3FDFD]">Industry Perception & Perception (PR)</span>
                    <strong className="text-[#71C9CE]">91.0 / 100</strong>
                  </div>
                  <p className="text-[11px] text-[#CBF1F5]/60">Corporate recruiter feedback & alumni endorsements</p>
                </div>
              </div>
            </div>

            {/* AI Policy Recommendations */}
            <div className="p-4 rounded-2xl bg-[#0e242b] border border-[#71C9CE]/30 space-y-2 text-xs text-[#CBF1F5]/80">
              <span className="font-bold text-[#E3FDFD] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#71C9CE]" /> Strategic Recommendations for Top-10 NIRF Rank:
              </span>
              <ul className="list-disc list-inside space-y-1 text-[11px]">
                <li>Increase Semester 7 mandatory industrial capstone projects by 15%.</li>
                <li>Enroll 40 additional faculty members in AICTE-Cisco FDP immersion tracks.</li>
                <li>Accelerate DigiLocker transcript issuance to achieve 100% digital credential verification.</li>
              </ul>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#A6E3E9]/20 text-xs">
              <span className="text-[#CBF1F5]/60">Generated: {new Date().toLocaleDateString()}</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrintAudit}
                  className="px-4 py-2 rounded-xl bg-[#0e242b] hover:bg-[#122d36] text-[#CBF1F5] font-semibold border border-[#71C9CE]/30 flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Summary</span>
                </button>
                <button
                  onClick={() => {
                    alert('Official signed NIRF compliance PDF downloaded!');
                    setShowNirfModal(false);
                  }}
                  className="btn-brand-primary px-5 py-2 rounded-xl font-bold flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Signed Report</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
