import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Layers,
  Target,
  BarChart3,
  Building2,
  GraduationCap,
  UserCheck,
  ShieldCheck,
  ChevronRight,
  BrainCircuit,
  TrendingUp,
  Award,
  FolderGit2,
  Lock,
  Zap,
  Search,
  Briefcase,
  Users,
  Compass,
  FileCheck2,
  BookOpen,
  LineChart,
} from 'lucide-react';

export default function LandingPage() {
  const { quickDemoLogin } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('all');

  const popularTags = [
    'React.js',
    'Python AI/ML',
    'Cloud DevOps',
    'Data Science',
    'Cybersecurity',
    'Full Stack',
    'Embedded IoT',
  ];

  const handleDemo = async (role) => {
    const res = await quickDemoLogin(role);
    if (res?.success) {
      if (role === 'student') navigate('/student/dashboard');
      else if (role === 'industry') navigate('/industry/dashboard');
      else if (role === 'academician') navigate('/academician/dashboard');
      else if (role === 'institution') navigate('/institution/analytics');
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/opportunities?q=${encodeURIComponent(searchQuery)}`);
  };

  const handleTagClick = (tag) => {
    navigate(`/opportunities?q=${encodeURIComponent(tag)}`);
  };

  return (
    <div className="min-h-screen">
      {/* 1. High-Converting Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Luminous background gradients matching #E3FDFD, #CBF1F5, #A6E3E9, #71C9CE */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] h-[680px] bg-[#71C9CE]/15 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute top-1/3 right-10 w-[420px] h-[420px] bg-[#A6E3E9]/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute top-1/2 left-10 w-[380px] h-[380px] bg-[#CBF1F5]/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Enterprise Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border-[#71C9CE]/30 text-[#A6E3E9] text-xs font-semibold mb-8 shadow-sm shadow-[#71C9CE]/10">
            <Sparkles className="w-4 h-4 text-[#71C9CE]" />
            <span>SkillBridge • Academia-Industry Platform</span>
            <span className="text-[#71C9CE]/50">•</span>
            <span className="text-[#E3FDFD] font-bold">Enterprise Collaboration Suite</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#E3FDFD] max-w-4xl mx-auto leading-[1.15]">
            Bridging the Divide Between{' '}
            <span className="gradient-text">Higher Education</span> &{' '}
            <span className="text-[#71C9CE]">Industry Demands</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-[#CBF1F5]/90 max-w-2xl mx-auto font-normal leading-relaxed">
            The enterprise operating system for academic-industry synergy. Powering automated skill profiling, cryptographically verified digital credentials, AI-matched ATS recruiting, and real-time NIRF policy analytics.
          </p>

          {/* Dynamic Job & Skill Search Bar */}
          <div className="mt-10 max-w-3xl mx-auto">
            <form
              onSubmit={handleSearchSubmit}
              className="p-2 sm:p-2.5 rounded-2xl glass-panel border border-[#71C9CE]/40 shadow-xl shadow-[#71C9CE]/10 flex flex-col sm:flex-row items-center gap-2"
            >
              <div className="flex items-center gap-2 px-3 w-full sm:w-auto flex-1">
                <Search className="w-5 h-5 text-[#71C9CE] shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search target skills, roles (e.g., React, AI Engineer, Cloud DevOps)..."
                  className="w-full bg-transparent text-[#E3FDFD] placeholder-[#CBF1F5]/50 text-sm focus:outline-none"
                />
              </div>

              <div className="hidden sm:block h-6 w-px bg-[#71C9CE]/30"></div>

              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="bg-[#0e242b] border border-[#71C9CE]/30 rounded-xl px-3 py-2 text-xs font-semibold text-[#CBF1F5] focus:outline-none focus:border-[#71C9CE] w-full sm:w-auto"
              >
                <option value="all">All Disciplines</option>
                <option value="software">Software & Cloud</option>
                <option value="ai">AI / Data Science</option>
                <option value="electronics">Electronics / IoT</option>
                <option value="research">Joint Research</option>
              </select>

              <button
                type="submit"
                className="w-full sm:w-auto btn-brand-primary px-6 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shrink-0 transition-transform hover:scale-105"
              >
                <span>Search Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Trending Quick Search Chips */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="text-[#CBF1F5]/60 font-medium">Trending Competencies:</span>
              {popularTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagClick(tag)}
                  className="px-2.5 py-1 rounded-lg bg-[#0e242b] hover:bg-[#122d36] text-[#CBF1F5] hover:text-[#E3FDFD] border border-[#71C9CE]/25 transition-all text-[11px] font-medium"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Live Counter Stats Bar */}
          <div className="mt-14 max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="glass-panel p-4 rounded-2xl border border-[#71C9CE]/25 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs text-[#CBF1F5]/70 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Active Internships</span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#E3FDFD]">2,450+</div>
              <span className="text-[11px] text-[#71C9CE] font-semibold">Tier-1 & GCC Openings</span>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-[#71C9CE]/25 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs text-[#CBF1F5]/70 mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#71C9CE]" />
                <span>Verified Portfolios</span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#E3FDFD]">18,900+</div>
              <span className="text-[11px] text-[#A6E3E9] font-semibold">DigiLocker Verified</span>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-[#71C9CE]/25 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs text-[#CBF1F5]/70 mb-1">
                <Users className="w-3.5 h-3.5 text-[#A6E3E9]" />
                <span>Corporate Mentors</span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#E3FDFD]">780+</div>
              <span className="text-[11px] text-[#CBF1F5] font-semibold">Senior Tech Leaders</span>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-[#71C9CE]/25 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs text-[#CBF1F5]/70 mb-1">
                <LineChart className="w-3.5 h-3.5 text-emerald-400" />
                <span>Avg Match Score</span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#71C9CE]">96.2%</div>
              <span className="text-[11px] text-emerald-300 font-semibold">Rule-Engine Accuracy</span>
            </div>
          </div>

          {/* Quick 1-Click Evaluator Buttons */}
          <div className="mt-12 pt-8 border-t border-[#71C9CE]/20 max-w-3xl mx-auto">
            <p className="text-xs uppercase tracking-wider font-semibold text-[#A6E3E9] mb-3">
              ⚡ Instant Evaluator 1-Click Test Drive (Switch Between Roles)
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => handleDemo('student')}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#0f2a32] hover:bg-[#163a45] border border-[#71C9CE]/40 text-[#E3FDFD] text-xs font-semibold transition-all hover:scale-[1.02]"
              >
                <UserCheck className="w-4 h-4 text-[#71C9CE]" />
                <span>1. Student Portal</span>
              </button>
              <button
                onClick={() => handleDemo('industry')}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#0f2a32] hover:bg-[#163a45] border border-[#71C9CE]/40 text-[#E3FDFD] text-xs font-semibold transition-all hover:scale-[1.02]"
              >
                <Building2 className="w-4 h-4 text-[#A6E3E9]" />
                <span>2. Industry ATS</span>
              </button>
              <button
                onClick={() => handleDemo('academician')}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#0f2a32] hover:bg-[#163a45] border border-[#71C9CE]/40 text-[#E3FDFD] text-xs font-semibold transition-all hover:scale-[1.02]"
              >
                <GraduationCap className="w-4 h-4 text-[#CBF1F5]" />
                <span>3. Dean & Faculty</span>
              </button>
              <button
                onClick={() => handleDemo('institution')}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#0f2a32] hover:bg-[#163a45] border border-[#71C9CE]/40 text-[#E3FDFD] text-xs font-semibold transition-all hover:scale-[1.02]"
              >
                <Award className="w-4 h-4 text-[#71C9CE]" />
                <span>4. NIRF Analytics</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Bento-Box Style Feature Grid (4 Core Pillars) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#71C9CE]/15 text-[#CBF1F5] text-xs font-semibold mb-3 border border-[#71C9CE]/30">
            <Compass className="w-3.5 h-3.5 text-[#71C9CE]" /> Enterprise Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#E3FDFD]">
            The 4-Pillar Collaboration Ecosystem
          </h2>
          <p className="mt-3 text-[#CBF1F5]/80 text-sm sm:text-base">
            Engineered to bridge student skill readiness, corporate hiring pipelines, faculty research attachments, and institutional accreditation.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Pillar 1: Students (Span 7) */}
          <div className="md:col-span-7 glass-panel glass-panel-hover p-8 rounded-3xl border border-[#71C9CE]/30 relative overflow-hidden flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#71C9CE]/20 text-[#71C9CE] flex items-center justify-center border border-[#71C9CE]/40">
                  <BrainCircuit className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#71C9CE]/15 text-[#CBF1F5] border border-[#71C9CE]/30">
                  Pillar 1 • Students
                </span>
              </div>

              <h3 className="text-2xl font-bold text-[#E3FDFD]">
                Visual Competency Profiling & Remedial Roadmaps
              </h3>
              <p className="text-[#CBF1F5]/80 text-sm leading-relaxed">
                Take domain-specific MCQ and coding assessments to map your real readiness index against live corporate job postings. Pinpoint exact skill gaps with direct links to NPTEL, Coursera, and edX remedial roadmaps.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-[#081418]/80 border border-[#71C9CE]/20">
                  <div className="text-xs font-bold text-[#E3FDFD] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#71C9CE]" /> 7-Axis Radar Chart
                  </div>
                  <p className="text-[11px] text-[#CBF1F5]/70 mt-1">Multi-dimensional scoring against industry benchmarks</p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#081418]/80 border border-[#71C9CE]/20">
                  <div className="text-xs font-bold text-[#E3FDFD] flex items-center gap-1.5">
                    <FileCheck2 className="w-4 h-4 text-[#71C9CE]" /> Digital Portfolio Vault
                  </div>
                  <p className="text-[11px] text-[#CBF1F5]/70 mt-1">DigiLocker, SWAYAM & certificate integration</p>
                </div>
              </div>
            </div>

            <Link
              to="/student/dashboard"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#71C9CE] hover:text-[#E3FDFD] transition-colors"
            >
              <span>Explore Student Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Pillar 2: Industry / Recruiters (Span 5) */}
          <div className="md:col-span-5 glass-panel glass-panel-hover p-8 rounded-3xl border border-[#A6E3E9]/30 relative overflow-hidden flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#A6E3E9]/20 text-[#A6E3E9] flex items-center justify-center border border-[#A6E3E9]/40">
                  <Target className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#A6E3E9]/15 text-[#CBF1F5] border border-[#A6E3E9]/30">
                  Pillar 2 • Industry
                </span>
              </div>

              <h3 className="text-xl font-bold text-[#E3FDFD]">
                Skill-Ranked ATS Kanban Pipeline
              </h3>
              <p className="text-[#CBF1F5]/80 text-sm leading-relaxed">
                Filter hundreds of college applicants effortlessly. Candidates are ranked automatically by deterministic skill match percentage badges with verified document badges.
              </p>

              <ul className="space-y-2 text-xs text-[#CBF1F5]/80">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#71C9CE]" /> Kanban stage transitions (Applied to Hired)</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#71C9CE]" /> Corporate mentorship scheduling tools</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#71C9CE]" /> Live industry capstone project hoster</li>
              </ul>
            </div>

            <Link
              to="/industry/dashboard"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#A6E3E9] hover:text-[#E3FDFD] transition-colors"
            >
              <span>Open Industry ATS</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Pillar 3: Academicians & Faculty (Span 5) */}
          <div className="md:col-span-5 glass-panel glass-panel-hover p-8 rounded-3xl border border-[#CBF1F5]/30 relative overflow-hidden flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#CBF1F5]/20 text-[#CBF1F5] flex items-center justify-center border border-[#CBF1F5]/40">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#CBF1F5]/15 text-[#CBF1F5] border border-[#CBF1F5]/30">
                  Pillar 3 • Academicians
                </span>
              </div>

              <h3 className="text-xl font-bold text-[#E3FDFD]">
                Faculty FDPs & Joint Research Hub
              </h3>
              <p className="text-[#CBF1F5]/80 text-sm leading-relaxed">
                Empower university professors and deans to apply for corporate Faculty Development Programs (FDPs), industry training sabbaticals, and launch joint R&D research calls.
              </p>

              <ul className="space-y-2 text-xs text-[#CBF1F5]/80">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#71C9CE]" /> Industrial training attachments</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#71C9CE]" /> Joint patent & grant co-authorship</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#71C9CE]" /> Cohort curriculum gap intelligence</li>
              </ul>
            </div>

            <Link
              to="/academician/dashboard"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#CBF1F5] hover:text-[#E3FDFD] transition-colors"
            >
              <span>Launch Faculty Portal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Pillar 4: Institutions & Policymakers (Span 7) */}
          <div className="md:col-span-7 glass-panel glass-panel-hover p-8 rounded-3xl border border-[#71C9CE]/30 relative overflow-hidden flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#71C9CE]/20 text-[#71C9CE] flex items-center justify-center border border-[#71C9CE]/40">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#71C9CE]/15 text-[#CBF1F5] border border-[#71C9CE]/30">
                  Pillar 4 • Institutions & Policy
                </span>
              </div>

              <h3 className="text-2xl font-bold text-[#E3FDFD]">
                Regional Deficit Heatmaps & NIRF Compliance Suite
              </h3>
              <p className="text-[#CBF1F5]/80 text-sm leading-relaxed">
                Provide institutional deans, university chancellors, and national policymakers with macro analytics: regional skill gaps, placement velocity trends, and 1-click NIRF / AICTE compliance report exports.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-[#081418]/80 border border-[#71C9CE]/20">
                  <div className="text-xs font-bold text-[#E3FDFD] flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-[#71C9CE]" /> Regional Heatmaps
                  </div>
                  <p className="text-[11px] text-[#CBF1F5]/70 mt-1">Cross-state competency deficit mapping</p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#081418]/80 border border-[#71C9CE]/20">
                  <div className="text-xs font-bold text-[#E3FDFD] flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-[#71C9CE]" /> NIRF Audit Generator
                  </div>
                  <p className="text-[11px] text-[#CBF1F5]/70 mt-1">Automated TLR, RPC & GO score audits</p>
                </div>
              </div>
            </div>

            <Link
              to="/institution/analytics"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#71C9CE] hover:text-[#E3FDFD] transition-colors"
            >
              <span>View Policy Analytics Hub</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Enterprise Integration Ecosystem */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-[#71C9CE]/15">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h3 className="text-xl font-bold text-[#E3FDFD]">
            Integrated with National Learning & Credential Networks
          </h3>
          <p className="text-xs text-[#CBF1F5]/70 mt-1">
            Compliant with Digilocker NAD, SWAYAM/NPTEL, AICTE Internshala, and global industry certification standards.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-bold text-[#CBF1F5]/70">
          <span className="px-4 py-2 rounded-xl bg-[#0e242b] border border-[#71C9CE]/20 flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-[#71C9CE]" /> DigiLocker NAD Verified
          </span>
          <span className="px-4 py-2 rounded-xl bg-[#0e242b] border border-[#71C9CE]/20 flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5 text-[#A6E3E9]" /> NPTEL & SWAYAM
          </span>
          <span className="px-4 py-2 rounded-xl bg-[#0e242b] border border-[#71C9CE]/20 flex items-center gap-2">
            <Award className="w-3.5 h-3.5 text-[#CBF1F5]" /> Coursera & edX
          </span>
          <span className="px-4 py-2 rounded-xl bg-[#0e242b] border border-[#71C9CE]/20 flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-[#71C9CE]" /> HackerRank Assessed
          </span>
          <span className="px-4 py-2 rounded-xl bg-[#0e242b] border border-[#71C9CE]/20 flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5 text-[#A6E3E9]" /> Campus ERP / SIS API
          </span>
        </div>
      </section>
    </div>
  );
}
