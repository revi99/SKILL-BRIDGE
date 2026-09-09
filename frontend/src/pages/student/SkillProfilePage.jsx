import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import {
  Award,
  Layers,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  BookOpen,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  Clock,
  ShieldCheck,
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
} from 'recharts';

export default function SkillProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profile/me');
        if (res.data.success) {
          setProfile(res.data.profile);
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto border border-indigo-500/30">
          <Award className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white">No Skill Profile Found</h2>
        <p className="text-sm text-slate-400">
          You haven't completed a skill assessment yet. Take a 5-minute technical quiz to generate your profile.
        </p>
        <Link
          to="/student/assessment"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-md shadow-indigo-600/30"
        >
          <span>Take Assessment</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  // Format data for Recharts Bar comparison
  const comparisonData = profile.skillScores.map((s) => {
    const matchingGap = profile.gaps?.find((g) => g.skill === s.skill);
    const benchmark = matchingGap ? matchingGap.benchmarkScore : 75;
    return {
      skill: s.skill,
      'Your Score': s.score,
      'Industry Benchmark': benchmark,
    };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/20 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Verified Skill Profile
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {profile.readinessLevel}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {profile.domain} Competency Profile
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Last Assessed on {new Date(profile.lastAssessedAt).toLocaleDateString()} • {profile.skillScores.length} Skill Competencies Mapped
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/student/assessment"
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retake Quiz</span>
            </Link>

            <Link
              to="/student/opportunities"
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-indigo-600/30 transition-all"
            >
              <span>Explore Matched Jobs</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Comparison Chart: Student Score vs Industry Benchmark */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              <span>Competency vs. Industry Benchmark Comparison</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Target requirements defined by enterprise hiring partners
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-indigo-300">
              <span className="w-3 h-3 rounded bg-indigo-500"></span> Your Score
            </span>
            <span className="flex items-center gap-1.5 text-emerald-300">
              <span className="w-3 h-3 rounded bg-emerald-500"></span> Industry Benchmark
            </span>
          </div>
        </div>

        <div className="h-[320px] w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData} margin={{ top: 20, right: 20, left: -10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="skill" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis stroke="#94a3b8" domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
              />
              <Bar dataKey="Your Score" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Industry Benchmark" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid: Skill Scores Breakdown & Gap Remediation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Assessed Skills Cards */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Layers className="w-5 h-5 text-indigo-400" />
            <span>Assessed Skills Breakdown</span>
          </h2>

          <div className="space-y-3">
            {profile.skillScores.map((s) => {
              const isStrong = s.score >= 70;
              return (
                <div
                  key={s.skill}
                  className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{s.skill}</span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.2 rounded-full ${
                          isStrong
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {s.level}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Accuracy: {s.questionsCorrect}/{s.questionsAttempted} Questions Correct
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-lg font-extrabold text-white">{s.score}%</span>
                    <div className="w-20 bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                      <div
                        className={`h-full ${isStrong ? 'bg-emerald-500' : 'bg-amber-500'}`}
                        style={{ width: `${s.score}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Identified Gaps & Free Remedial Resources */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span>Remedial Learning Pathways</span>
            </h2>
            <span className="text-xs text-amber-400 font-mono font-semibold">
              {profile.gaps?.length || 0} Gaps Detected
            </span>
          </div>

          {profile.gaps && profile.gaps.length > 0 ? (
            <div className="space-y-4">
              {profile.gaps.map((gap) => (
                <div
                  key={gap.skill}
                  className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition-all space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">{gap.skill}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 font-semibold border border-rose-500/30">
                      Gap: -{gap.gapPercentage}%
                    </span>
                  </div>

                  <p className="text-xs text-slate-400">
                    Current score ({gap.currentScore}%) is below the industry entry benchmark of{' '}
                    {gap.benchmarkScore}%.
                  </p>

                  <a
                    href={gap.learningResourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-indigo-950/40 hover:bg-indigo-900/60 border border-indigo-500/25 text-indigo-300 text-xs transition-colors group"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <BookOpen className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span className="truncate font-medium">{gap.resourceTitle}</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-white shrink-0" />
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <p className="text-sm font-semibold text-white">All Tested Skills Met Standards!</p>
              <p className="text-xs text-slate-500">
                You are ready to apply for positions requiring these technical tags.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
