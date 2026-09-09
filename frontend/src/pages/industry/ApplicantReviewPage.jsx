import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../../api/client';
import MatchBadge from '../../components/MatchBadge';
import {
  Users,
  Briefcase,
  CheckCircle2,
  Calendar,
  Layers,
  GraduationCap,
  MessageSquare,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight,
  Filter,
} from 'lucide-react';

export default function ApplicantReviewPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const postingIdParam = searchParams.get('postingId');

  const [myPostings, setMyPostings] = useState([]);
  const [selectedPostingId, setSelectedPostingId] = useState(postingIdParam || '');
  const [postingData, setPostingData] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [recruiterNotes, setRecruiterNotes] = useState({});

  // 1. Fetch recruiter postings
  useEffect(() => {
    const fetchPostings = async () => {
      try {
        const res = await api.get('/postings/my/all');
        if (res.data.success) {
          setMyPostings(res.data.postings);
          if (!selectedPostingId && res.data.postings.length > 0) {
            setSelectedPostingId(res.data.postings[0]._id);
          }
        }
      } catch (err) {
        console.error('Failed to load postings:', err);
      }
    };
    fetchPostings();
  }, []);

  // 2. Fetch applicants for selected posting
  useEffect(() => {
    if (!selectedPostingId) {
      setLoading(false);
      return;
    }

    const fetchApplicants = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/applications/posting/${selectedPostingId}`);
        if (res.data.success) {
          setPostingData(res.data.posting);
          setApplicants(res.data.applicants || []);
        }
      } catch (err) {
        console.error('Failed to load applicants:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [selectedPostingId]);

  const handlePostingChange = (id) => {
    setSelectedPostingId(id);
    setSearchParams({ postingId: id });
  };

  const handleStatusUpdate = async (appId, newStatus) => {
    setUpdatingId(appId);
    try {
      const note = recruiterNotes[appId] || '';
      const res = await api.put(`/applications/${appId}/status`, {
        status: newStatus,
        recruiterNotes: note,
      });

      if (res.data.success) {
        setApplicants((prev) =>
          prev.map((app) => (app._id === appId ? { ...app, status: newStatus, recruiterNotes: note } : app))
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Status update failed');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Ranked Candidate Pipeline
            </span>
            <span className="text-xs text-slate-400 font-mono">Sorted by Rule-Based Match %</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Applicant Screening & Shortlisting
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Candidates are ordered from highest skill-match to lowest based on assessed competency tests.
          </p>
        </div>

        {/* Opportunity Selector Dropdown */}
        {myPostings.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold shrink-0">Select Opening:</span>
            <select
              value={selectedPostingId}
              onChange={(e) => handlePostingChange(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-emerald-500 max-w-xs truncate"
            >
              {myPostings.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.title} ({p.applicantCount || 0} applicants)
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Selected Posting Overview Card */}
      {postingData && (
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">{postingData.title}</h2>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {postingData.type}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Required Tags: {postingData.requiredSkills?.join(', ')}
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="text-slate-400">
              Total Applicants: <strong className="text-emerald-400 text-sm font-bold">{applicants.length}</strong>
            </span>
          </div>
        </div>
      )}

      {/* Ranked Applicants List */}
      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : applicants.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center space-y-3">
          <Users className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No Applicants for this Posting Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            When students apply, their verified skill profiles will be evaluated and ranked here automatically.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {applicants.map((app, index) => {
            const student = app.studentId;
            const profile = app.skillProfile;

            return (
              <div
                key={app._id}
                className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 relative overflow-hidden"
              >
                {/* Ranking Ribbon */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center font-mono font-bold text-xs text-slate-300 border border-slate-700">
                      #{index + 1}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-white">{student?.name || 'Student Candidate'}</h3>
                        <span className="text-xs text-slate-400">({student?.email})</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {student?.degree} • {student?.instituteName || 'Engineering College'} (Class of{' '}
                        {student?.graduationYear || 2026})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MatchBadge percent={app.matchPercent} size="md" />
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-bold border ${
                        app.status === 'Shortlisted'
                          ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                          : app.status === 'Interview Scheduled'
                          ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                          : app.status === 'Accepted'
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          : app.status === 'Rejected'
                          ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                          : 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
                      }`}
                    >
                      Status: {app.status}
                    </span>
                  </div>
                </div>

                {/* Candidate Skill Breakdown vs Posting */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 font-semibold block mb-1">
                      Matched Skills (Scored ≥ 50%):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {app.matchedSkills?.map((s) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-medium"
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" /> {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 font-semibold block mb-1">
                      Missing Skills / Identified Gaps:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {app.missingSkills?.length > 0 ? (
                        app.missingSkills.map((s) => (
                          <span
                            key={s}
                            className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 font-medium"
                          >
                            ⚠ {s}
                          </span>
                        ))
                      ) : (
                        <span className="text-emerald-400 font-medium">None! 100% Required Skills Covered</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Cover Note */}
                {app.coverNote && (
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                    <span className="font-semibold text-slate-200">Candidate Note: </span>
                    <span>"{app.coverNote}"</span>
                  </div>
                )}

                {/* Recruiter Action Toolbar */}
                <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1 max-w-md">
                    <input
                      type="text"
                      placeholder="Add recruiter feedback or interview date..."
                      value={recruiterNotes[app._id] ?? (app.recruiterNotes || '')}
                      onChange={(e) =>
                        setRecruiterNotes({ ...recruiterNotes, [app._id]: e.target.value })
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleStatusUpdate(app._id, 'Shortlisted')}
                      disabled={updatingId === app._id}
                      className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-sm transition-all"
                    >
                      Shortlist
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(app._id, 'Interview Scheduled')}
                      disabled={updatingId === app._id}
                      className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-sm transition-all"
                    >
                      Interview
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(app._id, 'Accepted')}
                      disabled={updatingId === app._id}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-all"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(app._id, 'Rejected')}
                      disabled={updatingId === app._id}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 border border-slate-700 text-xs font-semibold transition-all"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
