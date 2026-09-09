import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import {
  Users,
  Award,
  CheckCircle2,
  AlertTriangle,
  Layers,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

export default function StudentCohortView() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCohort = async () => {
      try {
        const res = await api.get('/analytics/cohort-students');
        if (res.data.success) {
          setStudents(res.data.students || []);
        }
      } catch (err) {
        console.error('Failed to load cohort:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCohort();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
            Live Student Roster from DB
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Student Cohort Competency Mapping</h1>
        <p className="text-sm text-slate-400 mt-1">
          Real-time student readiness levels and identified syllabus gaps across technical departments.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {students.map((st) => (
          <div
            key={st.email}
            className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {st.degree}
                </span>
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                    st.readinessLevel === 'Industry-Ready'
                      ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                      : st.readinessLevel === 'Developing'
                      ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {st.readinessLevel}
                </span>
              </div>

              <h3 className="text-base font-bold text-white">{st.name}</h3>
              <p className="text-xs text-slate-400">{st.email}</p>
              <p className="text-xs text-indigo-400 font-semibold mt-1">Domain: {st.domain}</p>
              <p className="text-xs text-slate-500">{st.instituteName}</p>

              {/* Strengths */}
              <div className="mt-3 pt-3 border-t border-slate-800/80 text-xs">
                <span className="text-slate-400 block mb-1">Verified Strengths:</span>
                <div className="flex flex-wrap gap-1">
                  {st.strengths?.length > 0 ? (
                    st.strengths.map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 text-[11px]">
                        ✓ {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-500 text-[11px]">Pending Assessment</span>
                  )}
                </div>
              </div>

              {/* Gaps */}
              <div className="mt-2 text-xs">
                <span className="text-slate-400 block mb-1">Identified Gaps:</span>
                <div className="flex flex-wrap gap-1">
                  {st.gaps?.length > 0 ? (
                    st.gaps.map((g) => (
                      <span key={g} className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 text-[11px]">
                        ⚠ {g}
                      </span>
                    ))
                  ) : (
                    <span className="text-emerald-400 text-[11px]">No Gaps Detected</span>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Readiness Score:</span>
              <span className="font-extrabold text-white text-base">{st.overallScore}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
