import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
import MatchBadge from '../../components/MatchBadge';
import {
  Award,
  BookOpen,
  Briefcase,
  Layers,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  ExternalLink,
  CheckCircle2,
  Clock,
  ShieldCheck,
  FileText,
  UploadCloud,
  FileCheck2,
  FolderGit2,
  Lock,
  Zap,
  Filter,
  Eye,
  Plus,
} from 'lucide-react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [postings, setPostings] = useState([]);
  const [applications, setApplications] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'portfolio' | 'feed'
  const [loading, setLoading] = useState(true);

  // Application Modal state
  const [selectedPost, setSelectedPost] = useState(null);
  const [coverNote, setCoverNote] = useState('');
  const [applying, setApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profRes, postRes, appRes, docRes] = await Promise.all([
          api.get('/profile/me').catch(() => ({ data: {} })),
          api.get('/postings').catch(() => ({ data: {} })),
          api.get('/applications/my').catch(() => ({ data: {} })),
          api.get('/documents').catch(() => ({ data: {} })),
        ]);

        if (profRes.data?.success) setProfile(profRes.data.profile);
        if (postRes.data?.success) setPostings(postRes.data.postings || []);
        if (appRes.data?.success) setApplications(appRes.data.applications || []);
        if (docRes.data?.success) setDocuments(docRes.data.documents || []);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!selectedPost) return;
    setApplying(true);
    try {
      const res = await api.post('/applications/apply', {
        postingId: selectedPost._id,
        coverNote,
      });
      if (res.data.success) {
        setApplySuccess('Application submitted successfully with verified skill badge attached!');
        setApplications((prev) => [res.data.application, ...prev]);
        setTimeout(() => {
          setSelectedPost(null);
          setCoverNote('');
          setApplySuccess('');
        }, 2000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Application failed. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Radar chart data mapping
  const radarData =
    profile?.skillScores?.map((s) => ({
      skill: s.skill,
      score: s.score,
      benchmark: 75,
    })) || [];

  const shortlistedCount = applications.filter(
    (a) => a.status === 'Shortlisted' || a.status === 'Interview Scheduled'
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-slate-50">
      {/* 1. Welcome Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-violet-100/50 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200">
                Student Enterprise Portal
              </span>
              {profile ? (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {profile.readinessLevel}
                </span>
              ) : (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                  Assessment Pending
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Welcome back, {user?.name || 'Student'} 👋
            </h1>
            <p className="text-slate-500 text-sm mt-1 max-w-xl">
              {user?.instituteName || 'College of Engineering'} • {user?.degree || 'B.Tech Computer Science'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/student/assessment"
              className="flex items-center gap-2 btn-brand-primary text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl shadow-md transition-all hover:scale-105"
            >
              <Award className="w-4 h-4" />
              <span>{profile ? 'Retake Competency Test' : 'Take Skill Assessment'}</span>
            </Link>

            <Link
              to="/student/vault"
              className="flex items-center gap-2 btn-brand-secondary text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition-all"
            >
              <Lock className="w-4 h-4 text-violet-600" />
              <span>DigiLocker Vault</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Stat Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Readiness Index</span>
            <TrendingUp className="w-4 h-4 text-violet-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {profile ? `${profile.overallScore}%` : 'N/A'}
            </span>
            <span className="text-xs text-emerald-600 font-semibold">{profile?.readinessLevel || 'Pending'}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Assessed Skills</span>
            <Layers className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {profile?.skillScores?.length || 0}
            </span>
            <span className="text-xs text-slate-500">Competencies</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Active Applications</span>
            <Briefcase className="w-4 h-4 text-purple-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{applications.length}</span>
            <span className="text-xs text-slate-500">Submitted</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Shortlisted</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-violet-600">{shortlistedCount}</span>
            <span className="text-xs text-slate-500 font-medium">Opportunities</span>
          </div>
        </div>
      </div>

      {/* 3. Tab Navigation Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'profile'
              ? 'bg-violet-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Skill Profile & Gap Radar</span>
        </button>

        <button
          onClick={() => setActiveTab('portfolio')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'portfolio'
              ? 'bg-violet-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Digital Portfolio ({documents.length} Verified)</span>
        </button>

        <button
          onClick={() => setActiveTab('feed')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'feed'
              ? 'bg-violet-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Personalized Opportunities ({postings.length})</span>
        </button>
      </div>

      {/* TAB 1: Skill Profile & Gap Radar */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Col: Skill Radar & Strengths */}
          <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-violet-600" />
                  <span>Skill Competency Profile</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Domain: <strong className="text-slate-800">{profile?.domain || 'Full Stack Web Development'}</strong>
                </p>
              </div>
              <Link to="/student/profile" className="text-xs text-violet-600 hover:text-violet-800 font-semibold flex items-center gap-1">
                Full Details <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {profile && radarData.length > 0 ? (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="skill" stroke="#64748b" tick={{ fill: '#334155', fontSize: 12, fontWeight: 600 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#cbd5e1" />
                    <Radar name="Student Score" dataKey="score" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.4} />
                    <Radar name="Industry Benchmark" dataKey="benchmark" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.15} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px', color: '#0f172a', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-12 px-4 space-y-3">
                <Award className="w-12 h-12 text-slate-300 mx-auto" />
                <p className="text-sm text-slate-900 font-semibold">No skill assessment taken yet</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Take the quick 5-minute assessment to map your competencies and calculate matching scores.
                </p>
                <Link
                  to="/student/assessment"
                  className="inline-flex items-center gap-2 px-5 py-2.5 btn-brand-primary rounded-xl text-xs font-bold"
                >
                  Start Assessment Now
                </Link>
              </div>
            )}

            {/* Strengths Chips */}
            {profile?.strengths?.length > 0 && (
              <div className="pt-2 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                  Verified Technical Strengths:
                </span>
                <div className="flex flex-wrap gap-2">
                  {profile.strengths.map((str) => (
                    <span
                      key={str}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{str}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Col: Identified Gaps & Remedial Action */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  <span>Identified Skill Gaps</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Recommended remedial learning paths</p>
              </div>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                {profile?.gaps?.length || 0} Gaps
              </span>
            </div>

            {profile?.gaps?.length > 0 ? (
              <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
                {profile.gaps.map((gap) => (
                  <div
                    key={gap.skill}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-violet-300 transition-all space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-xs font-bold text-slate-900">{gap.skill}</span>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Current: <strong className="text-rose-600">{gap.currentScore}%</strong> • Target:{' '}
                          <strong className="text-violet-600">{gap.benchmarkScore}%</strong>
                        </p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                        -{gap.gapPercentage}% Gap
                      </span>
                    </div>

                    {gap.learningResourceUrl && (
                      <a
                        href={gap.learningResourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 flex items-center justify-between gap-2 p-2 rounded-xl bg-white hover:bg-violet-50 border border-slate-200 text-slate-700 hover:text-violet-700 text-xs transition-colors group shadow-xs"
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          <BookOpen className="w-3.5 h-3.5 text-violet-600 shrink-0" />
                          <span className="truncate font-medium">{gap.resourceTitle || 'Curated Course Roadmap'}</span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-violet-600 shrink-0" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-slate-500 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <p className="text-sm font-semibold text-slate-900">No Critical Skill Gaps!</p>
                <p className="text-xs text-slate-500">Your competencies meet current industry benchmarks.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Digital Portfolio & Verified Credentials */}
      {activeTab === 'portfolio' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="w-5 h-5 text-violet-600" />
                <h2 className="text-lg font-bold text-slate-900">Digital Portfolio & Verified Vault</h2>
              </div>
              <p className="text-xs text-slate-500">
                Credentials synced directly with DigiLocker NAD, NPTEL, and University Academic Records.
              </p>
            </div>

            <Link
              to="/student/vault"
              className="btn-brand-primary px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 self-start sm:self-auto"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Manage Credentials in Vault</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map((doc) => (
              <div
                key={doc._id}
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-violet-300 shadow-sm hover:shadow-md transition-all space-y-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center border border-violet-200">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{doc.title}</h3>
                      <span className="text-[11px] text-violet-700 font-semibold uppercase">{doc.category}</span>
                    </div>
                  </div>

                  {doc.isVerified && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-600 space-y-1">
                  <p>Issuer: <strong className="text-slate-800">{doc.issuingAuthority || 'University / Provider'}</strong></p>
                  <p>Sync Engine: <strong className="text-violet-700">{doc.verificationSource || 'DigiLocker NAD'}</strong></p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">Attached to ATS applications</span>
                  <a
                    href={doc.fileUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="text-violet-600 hover:text-violet-800 font-semibold flex items-center gap-1"
                  >
                    View Document <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Personalized Opportunity Feed */}
      {activeTab === 'feed' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-violet-600" />
                <span>Personalized Opportunity Feed</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Automatically ranked by your assessed skill match percentage
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-200">
              {postings.length} Live Openings
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {postings.map((post) => (
              <div
                key={post._id}
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-violet-300 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 uppercase">
                      {post.type}
                    </span>
                    <MatchBadge percent={post.matchPercent || 88} size="sm" />
                  </div>

                  <h3 className="text-base font-bold text-slate-900 line-clamp-1">{post.title}</h3>
                  <p className="text-xs text-violet-600 font-semibold mt-0.5">{post.companyName}</p>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2">{post.description}</p>
                </div>

                <div>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {post.requiredSkills?.map((skill) => (
                      <span
                        key={skill}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                    <span className="text-slate-800 font-mono font-bold">{post.stipend || 'Competitive'}</span>
                    <button
                      onClick={() => setSelectedPost(post)}
                      className="px-4 py-1.5 btn-brand-primary rounded-xl text-xs font-bold"
                    >
                      Apply Now →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Application Modal Overlay */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-violet-600">Apply to Opening</span>
                <h3 className="text-xl font-extrabold text-slate-900">{selectedPost.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{selectedPost.companyName}</p>
              </div>
              <MatchBadge percent={selectedPost.matchPercent || 88} size="md" />
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Verified Digital Portfolio & Skill Radar will be automatically shared with recruiter.</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-violet-600" />
                <span>DigiLocker credential hash attached to submission.</span>
              </div>
            </div>

            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Candidate Note / Statement of Interest:
                </label>
                <textarea
                  rows={3}
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                  placeholder="Explain your relevant project experience and why you are a great fit..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-600 focus:bg-white"
                ></textarea>
              </div>

              {applySuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                  {applySuccess}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedPost(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={applying}
                  className="btn-brand-primary px-5 py-2 rounded-xl text-xs font-bold"
                >
                  {applying ? 'Submitting...' : 'Confirm Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
