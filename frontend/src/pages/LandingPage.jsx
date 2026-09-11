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
    <div className="min-h-screen bg-slate-50">
      {/* 1. High-Converting Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Soft atmospheric violet and indigo radial blur glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] h-[680px] bg-violet-200/35 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-indigo-200/25 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute top-1/2 left-10 w-[400px] h-[400px] bg-purple-100/40 rounded-full blur-3xl pointer-events-none -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Enterprise Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-violet-200/80 text-violet-700 text-xs font-semibold mb-8 shadow-xs">
            <Sparkles className="w-4 h-4 text-violet-600" />
            <span>SkillBridge • Production-Ready Platform</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-900 font-bold">Academia–Industry Enterprise Suite</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.15]">
            Bridging the Divide Between{' '}
            <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">Higher Education</span> &{' '}
            <span className="text-slate-900">Industry Demands</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            The modern collaboration operating system for academic-industry synergy. Powering deterministic skill profiling, DigiLocker verified digital credentials, skill-matched recruiting, and real-time NIRF policy analytics.
          </p>

          {/* Dynamic Job & Skill Search Bar */}
          <div className="mt-10 max-w-3xl mx-auto">
            <form
              onSubmit={handleSearchSubmit}
              className="p-2 sm:p-2.5 rounded-2xl bg-white border border-slate-200 shadow-xl shadow-slate-200/60 flex flex-col sm:flex-row items-center gap-2"
            >
              <div className="flex items-center gap-2 px-3 w-full sm:w-auto flex-1">
                <Search className="w-5 h-5 text-violet-600 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search target skills, roles (e.g., React, AI Engineer, Cloud DevOps)..."
                  className="w-full bg-transparent text-slate-900 placeholder-slate-400 text-sm focus:outline-none"
                />
              </div>

              <div className="hidden sm:block h-6 w-px bg-slate-200"></div>

              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-violet-500 w-full sm:w-auto"
              >
                <option value="all">All Disciplines</option>
                <option value="software">Software & Cloud</option>
                <option value="ai">AI / Data Science</option>
                <option value="electronics">Electronics / IoT</option>
                <option value="research">Joint Research</option>
              </select>

              <button
                type="submit"
                className="w-full sm:w-auto btn-brand-primary px-6 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shrink-0"
              >
                <span>Search Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Trending Quick Search Chips */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="text-slate-500 font-medium">Trending Competencies:</span>
              {popularTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagClick(tag)}
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-violet-50 text-slate-600 hover:text-violet-700 border border-slate-200 hover:border-violet-300 transition-all text-[11px] font-medium shadow-xs"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Live Counter Stats Bar */}
          <div className="mt-14 max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 mb-1 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Active Internships</span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">2,450+</div>
              <span className="text-[11px] text-violet-600 font-semibold">Tier-1 & GCC Openings</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 mb-1 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span>Verified Portfolios</span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">18,900+</div>
              <span className="text-[11px] text-emerald-600 font-semibold">DigiLocker Verified</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 mb-1 font-medium">
                <Users className="w-3.5 h-3.5 text-purple-600" />
                <span>Corporate Mentors</span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">780+</div>
              <span className="text-[11px] text-violet-600 font-semibold">Senior Tech Leaders</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 mb-1 font-medium">
                <LineChart className="w-3.5 h-3.5 text-violet-600" />
                <span>Avg Match Score</span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-violet-600">96.2%</div>
              <span className="text-[11px] text-slate-500 font-semibold">Deterministic Accuracy</span>
            </div>
          </div>

          {/* Quick 1-Click Evaluator Buttons */}
          <div className="mt-12 pt-8 border-t border-slate-200 max-w-3xl mx-auto">
            <p className="text-xs uppercase tracking-wider font-bold text-slate-500 mb-3">
              ⚡ Instant 1-Click Role Switcher (Test Drive Portals)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                onClick={() => handleDemo('student')}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white hover:bg-violet-50 border border-slate-200 hover:border-violet-300 text-slate-800 text-xs font-semibold transition-all shadow-xs hover:shadow-sm"
              >
                <UserCheck className="w-4 h-4 text-violet-600" />
                <span>1. Student Portal</span>
              </button>
              <button
                onClick={() => handleDemo('industry')}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white hover:bg-violet-50 border border-slate-200 hover:border-violet-300 text-slate-800 text-xs font-semibold transition-all shadow-xs hover:shadow-sm"
              >
                <Building2 className="w-4 h-4 text-indigo-600" />
                <span>2. Industry ATS</span>
              </button>
              <button
                onClick={() => handleDemo('academician')}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white hover:bg-violet-50 border border-slate-200 hover:border-violet-300 text-slate-800 text-xs font-semibold transition-all shadow-xs hover:shadow-sm"
              >
                <GraduationCap className="w-4 h-4 text-purple-600" />
                <span>3. Dean & Faculty</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Feature Grid (3 Core Pillars) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 text-violet-700 text-xs font-semibold mb-3 border border-violet-200">
            <Compass className="w-3.5 h-3.5 text-violet-600" /> Enterprise Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            The 3-Pillar Collaboration Ecosystem
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            Engineered to bridge student skill readiness, corporate hiring pipelines, and faculty research attachments.
          </p>
        </div>

        {/* 3 Columns Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pillar 1: Students */}
          <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center border border-violet-200">
                  <BrainCircuit className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-200">
                  Pillar 1 • Students
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900">
                Visual Competency Profiling & Remedial Roadmaps
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Take domain-specific MCQ and coding assessments to map your real readiness index against live corporate job postings. Pinpoint exact skill gaps with direct links to NPTEL, Coursera, and edX remedial roadmaps.
              </p>

              <div className="space-y-2 pt-2">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-violet-600" /> 7-Axis Radar Scoring
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Multi-dimensional scoring against industry benchmarks</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" /> Digital Portfolio Vault
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">DigiLocker, SWAYAM & certificate integration</p>
                </div>
              </div>
            </div>

            <Link
              to="/student/dashboard"
              className="inline-flex items-center gap-2 text-xs font-bold text-violet-600 hover:text-violet-800 transition-colors"
            >
              <span>Explore Student Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Pillar 2: Industry / Recruiters */}
          <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-200">
                  <Target className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Pillar 2 • Industry
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900">
                Skill-Ranked ATS Kanban Pipeline
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Filter hundreds of college applicants effortlessly. Candidates are ranked automatically by deterministic skill match percentage badges with verified document credentials.
              </p>

              <ul className="space-y-2 text-xs text-slate-600 pt-2">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" /> Kanban stage transitions (Applied to Hired)</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" /> Corporate mentorship scheduling tools</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" /> Live industry capstone project hoster</li>
              </ul>
            </div>

            <Link
              to="/industry/dashboard"
              className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <span>Open Industry ATS</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Pillar 3: Academicians & Faculty */}
          <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-200">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                  Pillar 3 • Academicians
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900">
                Faculty FDPs & Joint Research Hub
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Empower university professors and deans to apply for corporate Faculty Development Programs (FDPs), industry training sabbaticals, and launch joint R&D research calls.
              </p>

              <ul className="space-y-2 text-xs text-slate-600 pt-2">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-purple-600" /> Industrial training attachments</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-purple-600" /> Joint patent & grant co-authorship</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-purple-600" /> Cohort curriculum gap intelligence</li>
              </ul>
            </div>

            <Link
              to="/academician/dashboard"
              className="inline-flex items-center gap-2 text-xs font-bold text-purple-600 hover:text-purple-800 transition-colors"
            >
              <span>Launch Faculty Portal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Enterprise Integration Ecosystem */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-200">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h3 className="text-xl font-bold text-slate-900">
            Integrated with National Learning & Credential Networks
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Compliant with DigiLocker NAD, SWAYAM/NPTEL, AICTE Internshala, and global industry certification standards.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs font-semibold text-slate-700">
          <span className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-violet-600" /> DigiLocker NAD Verified
          </span>
          <span className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5 text-indigo-600" /> NPTEL & SWAYAM
          </span>
          <span className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center gap-2">
            <Award className="w-3.5 h-3.5 text-purple-600" /> Coursera & edX
          </span>
          <span className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-amber-600" /> HackerRank Assessed
          </span>
          <span className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5 text-emerald-600" /> Campus ERP / SIS API
          </span>
        </div>
      </section>
    </div>
  );
}
