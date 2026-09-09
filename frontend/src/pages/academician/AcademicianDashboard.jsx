import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
import {
  GraduationCap,
  BarChart3,
  BookOpen,
  TrendingUp,
  AlertTriangle,
  Users,
  CheckCircle2,
  PlusCircle,
  Sparkles,
  ArrowRight,
  PieChart as PieIcon,
  Layers,
  FlaskConical,
  Award,
  Building2,
  Send,
  Calendar,
  Filter,
  X,
  Plus,
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
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const PIE_COLORS = ['#71C9CE', '#A6E3E9', '#CBF1F5', '#10b981', '#f59e0b'];

export default function AcademicianDashboard() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [collaborations, setCollaborations] = useState([]);
  const [activeTab, setActiveTab] = useState('gaps'); // 'gaps' | 'fdp' | 'research'
  const [loading, setLoading] = useState(true);

  // Proposal modal state
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [proposalForm, setProposalForm] = useState({
    title: '',
    type: 'Joint Research',
    department: 'Computer Science & Engineering',
    objectives: '',
    expectedOutcomes: '',
    durationMonths: 12,
  });

  // Mock active FDPs / Industrial Training list
  const [fdpList, setFdpList] = useState([
    {
      id: 1,
      title: 'AICTE-Microsoft Faculty Immersion: Generative AI & Cloud Systems',
      provider: 'Microsoft India R&D',
      duration: '4 Weeks (Hybrid)',
      stipend: 'Sponsored by AICTE',
      eligibility: 'Assistant / Associate Professors in CS/IT',
      status: 'Open for Application',
      deadline: 'Sept 30, 2026',
    },
    {
      id: 2,
      title: 'Industrial Sabbatical: Embedded Systems & Electric Mobility',
      provider: 'Tata Motors & Bosch Technologies',
      duration: '8 Weeks On-site',
      stipend: '₹50,000 Industrial Grant',
      eligibility: 'Electrical / Electronics Faculty',
      status: 'Shortlisting',
      deadline: 'Oct 15, 2026',
    },
    {
      id: 3,
      title: 'Advanced Cybersecurity & Threat Intelligence Masterclass',
      provider: 'Cisco Systems India',
      duration: '2 Weeks Virtual',
      stipend: 'Certificate of Excellence',
      eligibility: 'All Engineering Disciplines',
      status: 'Open for Application',
      deadline: 'Oct 20, 2026',
    },
  ]);

  const [appliedFdp, setAppliedFdp] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [anaRes, collabRes] = await Promise.all([
          api.get('/analytics/academic-gap-overview').catch(() => ({ data: {} })),
          api.get('/collaborations').catch(() => ({ data: {} })),
        ]);

        if (anaRes.data?.success) setAnalytics(anaRes.data);
        if (collabRes.data?.success) setCollaborations(collabRes.data.collaborations || []);
      } catch (err) {
        console.error('Failed to load academic data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleApplyFdp = (fdpId) => {
    setAppliedFdp((prev) => [...prev, fdpId]);
    alert('Faculty application submitted! Institutional approval routing has been initiated.');
  };

  const handleCreateProposal = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/collaborations', proposalForm);
      if (res.data.success) {
        setCollaborations((prev) => [res.data.collaboration, ...prev]);
        setShowProposalModal(false);
        alert('Joint Academic-Industry Research Proposal published to corporate network!');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit proposal');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#71C9CE] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const readinessData = [
    { name: 'Industry-Ready', value: analytics?.readinessDistribution?.['Industry-Ready'] || 1 },
    { name: 'Developing', value: analytics?.readinessDistribution?.['Developing'] || 2 },
    { name: 'Exploring', value: analytics?.readinessDistribution?.['Exploring'] || 0 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Dean & Faculty Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#71C9CE]/30 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#71C9CE]/15 text-[#CBF1F5] border border-[#71C9CE]/30">
                Academic Administration & R&D
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#0e242b] text-[#CBF1F5] border border-[#A6E3E9]/30">
                {user?.instituteName || 'Institutional Dean'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#E3FDFD]">
              Faculty & Dean Portal: {user?.name}
            </h1>
            <p className="text-[#CBF1F5]/70 text-xs sm:text-sm mt-1 max-w-2xl">
              Cohort skill-gap intelligence, Faculty Development Programs (FDPs), industrial attachments, and joint academic-industry research partnerships.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowProposalModal(true)}
              className="btn-brand-primary px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post Research Call / FDP</span>
            </button>

            <Link
              to="/institution/analytics"
              className="glass-panel hover:bg-[#122d36] text-[#CBF1F5] text-xs font-semibold px-4 py-2.5 rounded-xl border border-[#A6E3E9]/30 flex items-center gap-2 transition-all"
            >
              <BarChart3 className="w-4 h-4 text-[#71C9CE]" />
              <span>NIRF Policy Suite</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Top Summary KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="glass-panel p-5 rounded-2xl border border-[#A6E3E9]/15">
          <div className="flex items-center justify-between text-[#CBF1F5]/70 mb-2">
            <span className="text-xs font-medium">Assessed Students</span>
            <Users className="w-4 h-4 text-[#71C9CE]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#E3FDFD]">{analytics?.totalAssessedStudents || 3}</span>
            <span className="text-xs text-[#71C9CE] font-semibold">Active Cohort</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-[#A6E3E9]/15">
          <div className="flex items-center justify-between text-[#CBF1F5]/70 mb-2">
            <span className="text-xs font-medium">Average Cohort Score</span>
            <TrendingUp className="w-4 h-4 text-[#A6E3E9]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#E3FDFD]">{analytics?.averageCohortScore || 74}%</span>
            <span className="text-xs text-emerald-400 font-medium">Competent</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-[#A6E3E9]/15">
          <div className="flex items-center justify-between text-[#CBF1F5]/70 mb-2">
            <span className="text-xs font-medium">Active Research Calls</span>
            <FlaskConical className="w-4 h-4 text-[#CBF1F5]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#71C9CE]">{collaborations.length || 2}</span>
            <span className="text-xs text-[#CBF1F5]/60">Joint Proposals</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-[#A6E3E9]/15">
          <div className="flex items-center justify-between text-[#CBF1F5]/70 mb-2">
            <span className="text-xs font-medium">Available FDP Grants</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-300">{fdpList.length}</span>
            <span className="text-xs text-emerald-400 font-medium">Industry Calls</span>
          </div>
        </div>
      </div>

      {/* 3. Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#71C9CE]/20 pb-2">
        <button
          onClick={() => setActiveTab('gaps')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'gaps'
              ? 'bg-[#71C9CE] text-[#061519] shadow-md shadow-[#71C9CE]/20'
              : 'text-[#CBF1F5] hover:bg-[#0e242b]'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Curriculum Skill Gap Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab('fdp')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'fdp'
              ? 'bg-[#71C9CE] text-[#061519] shadow-md shadow-[#71C9CE]/20'
              : 'text-[#CBF1F5] hover:bg-[#0e242b]'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Faculty Development (FDP) & Industrial Sabbaticals</span>
        </button>

        <button
          onClick={() => setActiveTab('research')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'research'
              ? 'bg-[#71C9CE] text-[#061519] shadow-md shadow-[#71C9CE]/20'
              : 'text-[#CBF1F5] hover:bg-[#0e242b]'
          }`}
        >
          <FlaskConical className="w-4 h-4" />
          <span>Joint Industry-Academic Research Hub ({collaborations.length})</span>
        </button>
      </div>

      {/* TAB 1: Skill Gap Intelligence */}
      {activeTab === 'gaps' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Bar Chart of Average Competency */}
            <div className="lg:col-span-8 glass-panel p-6 rounded-3xl border border-[#A6E3E9]/20 space-y-6">
              <div className="flex items-center justify-between border-b border-[#A6E3E9]/15 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-[#E3FDFD] flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-[#71C9CE]" />
                    <span>Cohort Average vs Industry Requirement (75% Benchmark)</span>
                  </h3>
                  <p className="text-xs text-[#CBF1F5]/70 mt-0.5">
                    Measured across all student assessments in {user?.instituteName || 'College'}
                  </p>
                </div>
              </div>

              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics?.topSkills || []} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1a424e" />
                    <XAxis dataKey="skill" stroke="#A6E3E9" tick={{ fill: '#CBF1F5', fontSize: 11 }} interval={0} angle={-15} textAnchor="end" />
                    <YAxis domain={[0, 100]} stroke="#A6E3E9" tick={{ fill: '#CBF1F5', fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0e242b', borderColor: '#71C9CE', borderRadius: '8px', fontSize: '12px', color: '#E3FDFD' }} />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    <Bar dataKey="avgScore" name="Cohort Average Score" fill="#71C9CE" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="benchmark" name="Industry Benchmark" fill="#A6E3E9" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Right: Readiness Breakdown Pie */}
            <div className="lg:col-span-4 glass-panel p-6 rounded-3xl border border-[#A6E3E9]/20 space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-[#A6E3E9]/15 pb-4 mb-2">
                  <h3 className="text-base font-bold text-[#E3FDFD] flex items-center gap-2">
                    <PieIcon className="w-4 h-4 text-[#71C9CE]" />
                    <span>Placement Readiness</span>
                  </h3>
                </div>

                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={readinessData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {readinessData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#0e242b', borderColor: '#71C9CE', borderRadius: '8px', fontSize: '12px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-2 text-xs">
                  {readinessData.map((item, idx) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[idx] }}></span>
                        <span className="text-[#CBF1F5]">{item.name}</span>
                      </div>
                      <span className="font-bold text-[#E3FDFD]">{item.value} Students</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-[#A6E3E9]/15 text-center">
                <span className="text-[11px] text-[#71C9CE] font-semibold">
                  Curriculum intervention recommended for emerging tech
                </span>
              </div>
            </div>
          </div>

          {/* Critical Intervention Action Items */}
          <div className="glass-panel p-6 rounded-3xl border border-[#71C9CE]/25 space-y-4">
            <div className="flex items-center justify-between border-b border-[#A6E3E9]/15 pb-3">
              <h3 className="text-base font-bold text-[#E3FDFD] flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <span>Curriculum Action Plan: Identified Cohort Skill Deficits</span>
              </h3>
              <span className="text-xs text-[#CBF1F5]/70 font-semibold">Priority Interventions</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-[#081418]/80 border border-[#71C9CE]/20 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#E3FDFD]">1. Docker & Containerization</span>
                  <span className="text-rose-400 font-bold">-22% Gap</span>
                </div>
                <p className="text-[11px] text-[#CBF1F5]/70">
                  Cohort average is 58% vs 80% industry benchmark. Introduce cloud-native lab workshops in Semester 6.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#081418]/80 border border-[#71C9CE]/20 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#E3FDFD]">2. REST API Security & OAuth</span>
                  <span className="text-amber-400 font-bold">-16% Gap</span>
                </div>
                <p className="text-[11px] text-[#CBF1F5]/70">
                  Cohort average is 64% vs 80% benchmark. Integrate OWASP API Top 10 into Web Technology syllabus.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#081418]/80 border border-[#71C9CE]/20 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#E3FDFD]">3. TypeScript & Clean Code</span>
                  <span className="text-emerald-400 font-bold">-8% Gap</span>
                </div>
                <p className="text-[11px] text-[#CBF1F5]/70">
                  Minor deficit. Students are closing this via recommended NPTEL self-paced micro-credentials.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Faculty Development Programs (FDPs) & Sabbaticals */}
      {activeTab === 'fdp' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-[#71C9CE]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <GraduationCap className="w-5 h-5 text-[#71C9CE]" />
                <h2 className="text-lg font-bold text-[#E3FDFD]">Faculty Development Programs (FDPs) & Industrial Sabbaticals</h2>
              </div>
              <p className="text-xs text-[#CBF1F5]/70">
                AICTE-recognized corporate training attachments for university professors and researchers.
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#71C9CE]/15 text-[#CBF1F5] border border-[#71C9CE]/30">
              {fdpList.length} Active Industry Calls
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {fdpList.map((fdp) => {
              const isApplied = appliedFdp.includes(fdp.id);

              return (
                <div
                  key={fdp.id}
                  className="glass-panel p-6 rounded-3xl border border-[#A6E3E9]/20 hover:border-[#71C9CE]/40 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#71C9CE]/15 text-[#CBF1F5] border border-[#71C9CE]/30">
                        {fdp.provider}
                      </span>
                      <span className="text-[10px] text-[#A6E3E9] font-mono">{fdp.duration}</span>
                    </div>

                    <h3 className="text-base font-bold text-[#E3FDFD] leading-snug">{fdp.title}</h3>
                    <p className="text-xs text-[#CBF1F5]/70">Eligibility: {fdp.eligibility}</p>
                    <p className="text-xs text-[#71C9CE] font-semibold">Grant / Funding: {fdp.stipend}</p>
                  </div>

                  <div className="pt-4 border-t border-[#A6E3E9]/15 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-[#CBF1F5]/60">Deadline: {fdp.deadline}</span>
                    {isApplied ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1 text-xs">
                        <CheckCircle2 className="w-4 h-4" /> Applied
                      </span>
                    ) : (
                      <button
                        onClick={() => handleApplyFdp(fdp.id)}
                        className="btn-brand-primary px-4 py-1.5 rounded-xl text-xs font-bold"
                      >
                        Apply for FDP →
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: Joint Academic-Industry Research Hub */}
      {activeTab === 'research' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-[#71C9CE]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <FlaskConical className="w-5 h-5 text-[#71C9CE]" />
                <h2 className="text-lg font-bold text-[#E3FDFD]">Joint Academic-Industry Research Hub</h2>
              </div>
              <p className="text-xs text-[#CBF1F5]/70">
                Co-author research patents, apply for joint corporate R&D grants, and match with tech co-investigators.
              </p>
            </div>

            <button
              onClick={() => setShowProposalModal(true)}
              className="btn-brand-primary px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Submit Joint Research Call</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {collaborations.map((collab) => (
              <div
                key={collab._id}
                className="glass-panel p-6 rounded-3xl border border-[#A6E3E9]/20 hover:border-[#71C9CE]/40 transition-all space-y-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#71C9CE]/15 text-[#CBF1F5] uppercase">
                      {collab.type || 'Joint Research'}
                    </span>
                    <h3 className="text-base font-bold text-[#E3FDFD] mt-2">{collab.title}</h3>
                    <p className="text-xs text-[#A6E3E9] mt-0.5">{collab.department || 'Computer Science'}</p>
                  </div>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                    {collab.status || 'Active Call'}
                  </span>
                </div>

                <p className="text-xs text-[#CBF1F5]/80 line-clamp-3 leading-relaxed">
                  {collab.objectives || 'Collaborative research partnership focusing on cutting-edge enterprise applications.'}
                </p>

                <div className="pt-3 border-t border-[#A6E3E9]/15 flex items-center justify-between text-xs">
                  <span className="text-[#CBF1F5]/60">Duration: {collab.durationMonths || 12} Months</span>
                  <span className="text-[#71C9CE] font-semibold">
                    {collab.interestedCompanies?.length || 1} Corporate Industry Partners Interested
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Submit Research Proposal Modal */}
      {showProposalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#71C9CE]/50 max-w-lg w-full space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-extrabold text-[#E3FDFD]">Submit Joint Research Call</h3>
              <button onClick={() => setShowProposalModal(false)} className="text-[#CBF1F5] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProposal} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#CBF1F5] mb-1">Proposal Title:</label>
                <input
                  type="text"
                  required
                  value={proposalForm.title}
                  onChange={(e) => setProposalForm({ ...proposalForm, title: e.target.value })}
                  placeholder="e.g., Scalable AI for Healthcare Defect Detection"
                  className="w-full bg-[#0e242b] border border-[#71C9CE]/30 rounded-xl p-2.5 text-[#E3FDFD] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#CBF1F5] mb-1">Discipline / Dept:</label>
                  <input
                    type="text"
                    value={proposalForm.department}
                    onChange={(e) => setProposalForm({ ...proposalForm, department: e.target.value })}
                    className="w-full bg-[#0e242b] border border-[#71C9CE]/30 rounded-xl p-2.5 text-[#E3FDFD]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#CBF1F5] mb-1">Duration (Months):</label>
                  <input
                    type="number"
                    value={proposalForm.durationMonths}
                    onChange={(e) => setProposalForm({ ...proposalForm, durationMonths: Number(e.target.value) })}
                    className="w-full bg-[#0e242b] border border-[#71C9CE]/30 rounded-xl p-2.5 text-[#E3FDFD]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#CBF1F5] mb-1">Research Objectives & Industry Scope:</label>
                <textarea
                  rows={3}
                  required
                  value={proposalForm.objectives}
                  onChange={(e) => setProposalForm({ ...proposalForm, objectives: e.target.value })}
                  placeholder="Explain research goals, lab equipment available, and desired industry co-investigator input..."
                  className="w-full bg-[#0e242b] border border-[#71C9CE]/30 rounded-xl p-2.5 text-[#E3FDFD]"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowProposalModal(false)}
                  className="px-4 py-2 rounded-xl text-[#CBF1F5] hover:bg-[#0e242b]"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-brand-primary px-5 py-2 rounded-xl font-bold">
                  Publish to Corporate Network
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
