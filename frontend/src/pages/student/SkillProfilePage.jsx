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
        <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4 bg-slate-50">
        <div className="w-16 h-16 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center mx-auto border border-violet-200">
          <Award className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">No Skill Profile Found</h2>
        <p className="text-sm text-slate-600">
          You haven't completed a skill assessment yet. Take a 5-minute technical quiz to generate your profile.
        </p>
        <Link
          to="/student/assessment"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl btn-brand-primary font-bold text-sm transition-all shadow-md shadow-violet-500/25"
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-slate-50">
      {/* Profile Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200">
                Verified Skill Profile
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {profile.readinessLevel}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {profile.domain} Competency Profile
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Last Assessed on {new Date(profile.lastAssessedAt).toLocaleDateString()} • {profile.skillScores.length} Skill Competencies Mapped
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/student/assessment"
              className="flex items-center gap-2 btn-brand-secondary text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition-all"
            >
              <RefreshCw className="w-4 h-4 text-violet-600" />
              <span>Retake Quiz</span>
            </Link>

            <Link
              to="/student/opportunities"
              className="flex items-center gap-2 btn-brand-primary text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl shadow-md transition-all"
            >
              <span>Explore Matched Jobs</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Comparison Chart: Student Score vs Industry Benchmark */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-violet-600" />
              <span>Competency vs. Industry Benchmark Comparison</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Target requirements defined by enterprise hiring partners
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-violet-700">
              <span className="w-3 h-3 rounded bg-violet-600"></span> Your Score
            </span>
            <span className="flex items-center gap-1.5 text-slate-500">
              <span className="w-3 h-3 rounded bg-slate-300"></span> Industry Benchmark
            </span>
          </div>
        </div>

        <div className="h-[320px] w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData} margin={{ top: 20, right: 20, left: -10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="skill" stroke="#94a3b8" tick={{ fill: '#475569', fontSize: 12, fontWeight: 500 }} />
              <YAxis stroke="#94a3b8" domain={[0, 100]} tick={{ fill: '#475569', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px', color: '#0f172a', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
              />
              <Bar dataKey="Your Score" fill="#7c3aed" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Industry Benchmark" fill="#cbd5e1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid: Skill Scores Breakdown & Gap Remediation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Assessed Skills Cards */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Layers className="w-5 h-5 text-violet-600" />
            <span>Assessed Skills Breakdown</span>
          </h2>

          <div className="space-y-3">
            {profile.skillScores.map((s) => {
              const isStrong = s.score >= 70;
              return (
                <div
                  key={s.skill}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{s.skill}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isStrong
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {s.level}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Accuracy: {s.questionsCorrect}/{s.questionsAttempted} Questions Correct
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-lg font-extrabold text-slate-900">{s.score}%</span>
                    <div className="w-20 bg-slate-200 h-2 rounded-full overflow-hidden mt-1">
                      <div
                        className={`h-full ${isStrong ? 'bg-violet-600' : 'bg-amber-500'}`}
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
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <span>Remedial Learning Pathways</span>
            </h2>
            <span className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-bold border border-amber-200">
              {profile.gaps?.length || 0} Gaps Detected
            </span>
          </div>

          {profile.gaps && profile.gaps.length > 0 ? (
            <div className="space-y-4">
              {profile.gaps.map((gap) => (
                <div
                  key={gap.skill}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-violet-300 transition-all space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900">{gap.skill}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-bold border border-rose-200">
                      Gap: -{gap.gapPercentage}%
                    </span>
                  </div>

                  <p className="text-xs text-slate-600">
                    Current score ({gap.currentScore}%) is below the industry entry benchmark of{' '}
                    {gap.benchmarkScore}%.
                  </p>

                  <a
                    href={gap.learningResourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-white hover:bg-violet-50 border border-slate-200 text-slate-700 hover:text-violet-700 text-xs transition-colors group shadow-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <BookOpen className="w-4 h-4 text-violet-600 shrink-0" />
                      <span className="truncate font-medium">{gap.resourceTitle}</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-violet-600 shrink-0" />
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 space-y-2">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <p className="text-sm font-semibold text-slate-900">All Tested Skills Met Standards!</p>
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
