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
        <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200">
            Live Student Roster from DB
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Student Cohort Competency Mapping</h1>
        <p className="text-sm text-slate-600 mt-1">
          Real-time student readiness levels and identified syllabus gaps across technical departments.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {students.map((st) => (
          <div
            key={st.email}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-violet-300 transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  {st.degree}
                </span>
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                    st.readinessLevel === 'Industry-Ready'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : st.readinessLevel === 'Developing'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  {st.readinessLevel}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900">{st.name}</h3>
              <p className="text-xs text-slate-500">{st.email}</p>
              <p className="text-xs text-violet-600 font-semibold mt-1">Domain: {st.domain}</p>
              <p className="text-xs text-slate-400">{st.instituteName}</p>

              {/* Strengths */}
              <div className="mt-3 pt-3 border-t border-slate-100 text-xs">
                <span className="text-slate-500 block mb-1">Verified Strengths:</span>
                <div className="flex flex-wrap gap-1">
                  {st.strengths?.length > 0 ? (
                    st.strengths.map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px]">
                        ✓ {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 text-[11px]">Pending Assessment</span>
                  )}
                </div>
              </div>

              {/* Gaps */}
              <div className="mt-2 text-xs">
                <span className="text-slate-500 block mb-1">Identified Gaps:</span>
                <div className="flex flex-wrap gap-1">
                  {st.gaps?.length > 0 ? (
                    st.gaps.map((g) => (
                      <span key={g} className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 text-[11px]">
                        ⚠ {g}
                      </span>
                    ))
                  ) : (
                    <span className="text-emerald-700 text-[11px] font-medium">No Gaps Detected</span>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Readiness Score:</span>
              <span className="font-extrabold text-violet-700 text-base">{st.overallScore}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
