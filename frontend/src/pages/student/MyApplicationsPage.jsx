import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import MatchBadge from '../../components/MatchBadge';
import {
  FileCheck,
  Building2,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  ArrowRight,
  MessageSquare,
} from 'lucide-react';

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get('/applications/my');
        if (res.data.success) {
          setApplications(res.data.applications);
        }
      } catch (err) {
        console.error('Failed to load applications:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Shortlisted':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            Shortlisted for Interview
          </span>
        );
      case 'Interview Scheduled':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-400"></span>
            Interview Scheduled
          </span>
        );
      case 'Accepted':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Offer Extended
          </span>
        );
      case 'Rejected':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">
            Application Closed
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            Under Review
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            Application Pipeline
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">My Applications & Status Tracker</h1>
        <p className="text-sm text-slate-400 mt-1">
          Track real-time responses and recruiter shortlisting decisions for your submitted profiles.
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center space-y-3">
          <FileCheck className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No Applications Submitted Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Browse matched opportunities tailored to your skill competencies and apply with one click.
          </p>
          <Link
            to="/student/opportunities"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold mt-2"
          >
            <span>Explore Opportunities</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app._id}
              className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {app.postingId?.title || 'Position Title'}
                  </h3>
                  {getStatusBadge(app.status)}
                </div>

                <p className="text-xs font-semibold text-indigo-400">
                  {app.postingId?.companyName || 'Corporate Partner'} • {app.postingId?.type || 'Internship'}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                  <span className="flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    Applied: {new Date(app.appliedAt).toLocaleDateString()}
                  </span>
                  <span>•</span>
                  <span className="font-mono text-slate-300">Stipend: {app.postingId?.stipend}</span>
                </div>

                {app.recruiterNotes && (
                  <div className="mt-3 p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs flex items-start gap-2 text-slate-300">
                    <MessageSquare className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-white">Recruiter Feedback: </span>
                      <span>"{app.recruiterNotes}"</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
                <MatchBadge percent={app.matchPercent} size="md" />
                <span className="text-[11px] text-slate-400">
                  {app.matchedSkills?.length || 0} Matched Skills Attached
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
