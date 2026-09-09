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
        <div className="w-8 h-8 border-4 border-[#71C9CE] border-t-transparent rounded-full animate-spin"></div>
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Welcome Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#71C9CE]/30 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-[#71C9CE]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#71C9CE]/15 text-[#CBF1F5] border border-[#A6E3E9]/30">
                Student Enterprise Portal
              </span>
              {profile ? (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> {profile.readinessLevel}
                </span>
              ) : (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Assessment Pending
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#E3FDFD]">
              Welcome back, {user?.name || 'Student'} 👋
            </h1>
            <p className="text-[#CBF1F5]/70 text-sm mt-1 max-w-xl">
              {user?.instituteName || 'College of Engineering'} • {user?.degree || 'B.Tech Computer Science'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/student/assessment"
              className="flex items-center gap-2 btn-brand-primary text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl shadow-lg transition-all hover:scale-105"
            >
              <Award className="w-4 h-4" />
              <span>{profile ? 'Retake Competency Test' : 'Take Skill Assessment'}</span>
            </Link>

            <Link
              to="/vault"
              className="flex items-center gap-2 glass-panel hover:bg-[#122d36] text-[#CBF1F5] text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl border border-[#A6E3E9]/30 transition-all"
            >
              <Lock className="w-4 h-4 text-[#71C9CE]" />
              <span>DigiLocker Vault</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Stat Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="glass-panel p-5 rounded-2xl border border-[#A6E3E9]/15">
          <div className="flex items-center justify-between text-[#CBF1F5]/70 mb-2">
            <span className="text-xs font-medium">Readiness Index</span>
            <TrendingUp className="w-4 h-4 text-[#71C9CE]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#E3FDFD]">
              {profile ? `${profile.overallScore}%` : 'N/A'}
            </span>
            <span className="text-xs text-[#A6E3E9] font-semibold">{profile?.readinessLevel || 'Pending'}</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-[#A6E3E9]/15">
          <div className="flex items-center justify-between text-[#CBF1F5]/70 mb-2">
            <span className="text-xs font-medium">Assessed Skills</span>
            <Layers className="w-4 h-4 text-[#A6E3E9]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#E3FDFD]">
              {profile?.skillScores?.length || 0}
            </span>
            <span className="text-xs text-[#CBF1F5]/60">Competencies</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-[#A6E3E9]/15">
          <div className="flex items-center justify-between text-[#CBF1F5]/70 mb-2">
            <span className="text-xs font-medium">Active Applications</span>
            <Briefcase className="w-4 h-4 text-[#71C9CE]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#E3FDFD]">{applications.length}</span>
            <span className="text-xs text-[#CBF1F5]/60">Submitted</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-[#A6E3E9]/15">
          <div className="flex items-center justify-between text-[#CBF1F5]/70 mb-2">
            <span className="text-xs font-medium">Shortlisted</span>
            <Sparkles className="w-4 h-4 text-[#A6E3E9]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#71C9CE]">{shortlistedCount}</span>
            <span className="text-xs text-[#CBF1F5]/70 font-medium">Opportunities</span>
          </div>
        </div>
      </div>

      {/* 3. Tab Navigation Bar */}
      <div className="flex items-center gap-2 border-b border-[#71C9CE]/20 pb-2">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'profile'
              ? 'bg-[#71C9CE] text-[#061519] shadow-md shadow-[#71C9CE]/20'
              : 'text-[#CBF1F5] hover:bg-[#0e242b]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Skill Profile & Gap Radar</span>
        </button>

        <button
          onClick={() => setActiveTab('portfolio')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'portfolio'
              ? 'bg-[#71C9CE] text-[#061519] shadow-md shadow-[#71C9CE]/20'
              : 'text-[#CBF1F5] hover:bg-[#0e242b]'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Digital Portfolio ({documents.length} Verified)</span>
        </button>

        <button
          onClick={() => setActiveTab('feed')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'feed'
              ? 'bg-[#71C9CE] text-[#061519] shadow-md shadow-[#71C9CE]/20'
              : 'text-[#CBF1F5] hover:bg-[#0e242b]'
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
          <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border border-[#A6E3E9]/20 space-y-6">
            <div className="flex items-center justify-between border-b border-[#A6E3E9]/15 pb-4">
              <div>
                <h2 className="text-lg font-bold text-[#E3FDFD] flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#71C9CE]" />
                  <span>Skill Competency Profile</span>
                </h2>
                <p className="text-xs text-[#CBF1F5]/70 mt-0.5">
                  Domain: <strong className="text-[#E3FDFD]">{profile?.domain || 'Full Stack Web Development'}</strong>
                </p>
              </div>
              <Link to="/student/profile" className="text-xs text-[#71C9CE] hover:text-[#A6E3E9] hover:underline flex items-center gap-1">
                Full Details <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {profile && radarData.length > 0 ? (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#1a424e" />
                    <PolarAngleAxis dataKey="skill" stroke="#A6E3E9" tick={{ fill: '#CBF1F5', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#173843" />
                    <Radar name="Student Score" dataKey="score" stroke="#71C9CE" fill="#71C9CE" fillOpacity={0.4} />
                    <Radar name="Industry Benchmark" dataKey="benchmark" stroke="#A6E3E9" fill="#A6E3E9" fillOpacity={0.15} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0e242b', borderColor: '#71C9CE', borderRadius: '8px', fontSize: '12px', color: '#E3FDFD' }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-12 px-4 space-y-3">
                <Award className="w-12 h-12 text-[#71C9CE]/40 mx-auto" />
                <p className="text-sm text-[#E3FDFD] font-semibold">No skill assessment taken yet</p>
                <p className="text-xs text-[#CBF1F5]/70 max-w-sm mx-auto">
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
              <div className="pt-2 border-t border-[#A6E3E9]/15">
                <span className="text-xs font-semibold text-[#CBF1F5]/70 uppercase tracking-wider block mb-2">
                  Verified Technical Strengths:
                </span>
                <div className="flex flex-wrap gap-2">
                  {profile.strengths.map((str) => (
                    <span
                      key={str}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-[#71C9CE]/15 text-[#CBF1F5] border border-[#71C9CE]/30"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#71C9CE]" />
                      <span>{str}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Col: Identified Gaps & Remedial Action */}
          <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-[#A6E3E9]/20 space-y-4">
            <div className="flex items-center justify-between border-b border-[#A6E3E9]/15 pb-4">
              <div>
                <h2 className="text-lg font-bold text-[#E3FDFD] flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  <span>Identified Skill Gaps</span>
                </h2>
                <p className="text-xs text-[#CBF1F5]/70 mt-0.5">Recommended remedial learning paths</p>
              </div>
              <span className="text-xs font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                {profile?.gaps?.length || 0} Gaps
              </span>
            </div>

            {profile?.gaps?.length > 0 ? (
              <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
                {profile.gaps.map((gap) => (
                  <div
                    key={gap.skill}
                    className="p-3.5 rounded-xl bg-[#081418]/80 border border-[#A6E3E9]/15 hover:border-[#71C9CE]/40 transition-all space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-xs font-bold text-[#E3FDFD]">{gap.skill}</span>
                        <p className="text-[11px] text-[#CBF1F5]/70 mt-0.5">
                          Current: <strong className="text-rose-400">{gap.currentScore}%</strong> • Target:{' '}
                          <strong className="text-[#71C9CE]">{gap.benchmarkScore}%</strong>
                        </p>
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
                        -{gap.gapPercentage}% Gap
                      </span>
                    </div>

                    {gap.learningResourceUrl && (
                      <a
                        href={gap.learningResourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2.5 flex items-center justify-between gap-2 p-2 rounded-lg bg-[#0e242b] hover:bg-[#122d36] border border-[#71C9CE]/20 text-[#CBF1F5] text-xs transition-colors group"
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          <BookOpen className="w-3.5 h-3.5 text-[#71C9CE] shrink-0" />
                          <span className="truncate">{gap.resourceTitle || 'Curated NPTEL / Coursera Course'}</span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-[#71C9CE] group-hover:text-[#E3FDFD] shrink-0" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-[#CBF1F5]/70 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-[#71C9CE] mx-auto" />
                <p className="text-sm font-semibold text-[#E3FDFD]">No Critical Skill Gaps!</p>
                <p className="text-xs text-[#CBF1F5]/60">Your competencies meet current industry benchmarks.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Digital Portfolio & Verified Credentials */}
      {activeTab === 'portfolio' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-[#71C9CE]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="w-5 h-5 text-[#71C9CE]" />
                <h2 className="text-lg font-bold text-[#E3FDFD]">Digital Portfolio & Verified Vault</h2>
              </div>
              <p className="text-xs text-[#CBF1F5]/70">
                Credentials synced directly with DigiLocker NAD, NPTEL, and University Academic Records.
              </p>
            </div>

            <Link
              to="/vault"
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
                className="glass-panel p-5 rounded-2xl border border-[#A6E3E9]/20 hover:border-[#71C9CE]/40 transition-all space-y-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-[#71C9CE]/15 text-[#71C9CE] flex items-center justify-center border border-[#71C9CE]/30">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#E3FDFD] line-clamp-1">{doc.title}</h3>
                      <span className="text-[11px] text-[#A6E3E9] uppercase font-semibold">{doc.category}</span>
                    </div>
                  </div>

                  {doc.isVerified && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Verified
                    </span>
                  )}
                </div>

                <div className="text-xs text-[#CBF1F5]/70 space-y-1">
                  <p>Issuer: <strong className="text-[#E3FDFD]">{doc.issuingAuthority || 'University / Provider'}</strong></p>
                  <p>Sync Engine: <strong className="text-[#A6E3E9]">{doc.verificationSource || 'DigiLocker NAD'}</strong></p>
                </div>

                <div className="pt-3 border-t border-[#A6E3E9]/15 flex items-center justify-between text-xs">
                  <span className="text-[#CBF1F5]/60 text-[11px]">Attached to ATS applications</span>
                  <a
                    href={doc.fileUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#71C9CE] hover:text-[#E3FDFD] font-semibold flex items-center gap-1"
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
          <div className="glass-panel p-6 rounded-3xl border border-[#71C9CE]/30 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#E3FDFD] flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[#71C9CE]" />
                <span>Personalized Opportunity Feed</span>
              </h2>
              <p className="text-xs text-[#CBF1F5]/70 mt-0.5">
                Automatically ranked by your assessed skill match percentage
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#71C9CE]/15 text-[#CBF1F5]">
              {postings.length} Live Openings
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {postings.map((post) => (
              <div
                key={post._id}
                className="glass-panel p-5 rounded-2xl border border-[#A6E3E9]/20 hover:border-[#71C9CE]/40 transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#71C9CE]/15 text-[#CBF1F5] border border-[#71C9CE]/30 uppercase">
                      {post.type}
                    </span>
                    <MatchBadge percent={post.matchPercent || 88} size="sm" />
                  </div>

                  <h3 className="text-base font-bold text-[#E3FDFD] line-clamp-1">{post.title}</h3>
                  <p className="text-xs text-[#A6E3E9] font-medium mt-0.5">{post.companyName}</p>
                  <p className="text-xs text-[#CBF1F5]/70 mt-2 line-clamp-2">{post.description}</p>
                </div>

                <div>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {post.requiredSkills?.map((skill) => (
                      <span
                        key={skill}
                        className="text-[10px] px-2 py-0.5 rounded bg-[#122d36] text-[#CBF1F5] border border-[#A6E3E9]/20"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#A6E3E9]/15 text-xs">
                    <span className="text-[#CBF1F5]/70 font-mono font-semibold">{post.stipend || 'Competitive'}</span>
                    <button
                      onClick={() => setSelectedPost(post)}
                      className="px-4 py-1.5 btn-brand-primary rounded-xl text-xs font-bold transition-transform hover:scale-105"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#71C9CE]/50 max-w-lg w-full space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#71C9CE]">Apply to Opening</span>
                <h3 className="text-xl font-extrabold text-[#E3FDFD]">{selectedPost.title}</h3>
                <p className="text-xs text-[#A6E3E9] mt-0.5">{selectedPost.companyName}</p>
              </div>
              <MatchBadge percent={selectedPost.matchPercent || 88} size="md" />
            </div>

            <div className="p-3.5 rounded-xl bg-[#081418]/90 border border-[#71C9CE]/20 space-y-2 text-xs text-[#CBF1F5]/80">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#71C9CE]" />
                <span>Verified Digital Portfolio & Skill Radar will be automatically shared with recruiter.</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#71C9CE]" />
                <span>DigiLocker credential hash attached to submission.</span>
              </div>
            </div>

            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#CBF1F5] mb-1.5">
                  Candidate Note / Statement of Interest:
                </label>
                <textarea
                  rows={3}
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                  placeholder="Explain your relevant project experience and why you are a great fit..."
                  className="w-full bg-[#0e242b] border border-[#71C9CE]/30 rounded-xl p-3 text-xs text-[#E3FDFD] placeholder-[#CBF1F5]/50 focus:outline-none focus:border-[#71C9CE]"
                ></textarea>
              </div>

              {applySuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
                  {applySuccess}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedPost(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#CBF1F5] hover:bg-[#0e242b]"
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
