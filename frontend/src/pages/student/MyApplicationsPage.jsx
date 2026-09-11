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
        <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Shortlisted':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            Shortlisted for Interview
          </span>
        );
      case 'Interview Scheduled':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-600"></span>
            Interview Scheduled
          </span>
        );
      case 'Accepted':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Offer Extended
          </span>
        );
      case 'Rejected':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            Application Closed
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-violet-50 text-violet-700 border border-violet-200 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-violet-600" />
            Under Review
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-slate-50">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200">
            Application Pipeline
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">My Applications & Status Tracker</h1>
        <p className="text-sm text-slate-500 mt-1">
          Track real-time responses and recruiter shortlisting decisions for your submitted profiles.
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-sm text-center space-y-3">
          <FileCheck className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No Applications Submitted Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Browse matched opportunities tailored to your skill competencies and apply with one click.
          </p>
          <Link
            to="/student/opportunities"
            className="inline-flex items-center gap-2 px-5 py-2.5 btn-brand-primary rounded-xl text-xs font-bold mt-2"
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
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    {app.postingId?.title || 'Position Title'}
                  </h3>
                  {getStatusBadge(app.status)}
                </div>

                <p className="text-xs font-semibold text-violet-600">
                  {app.postingId?.companyName || 'Corporate Partner'} • {app.postingId?.type || 'Internship'}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Applied: {new Date(app.appliedAt).toLocaleDateString()}
                  </span>
                  <span>•</span>
                  <span className="font-mono text-slate-700 font-bold">Stipend: {app.postingId?.stipend}</span>
                </div>

                {app.recruiterNotes && (
                  <div className="mt-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex items-start gap-2 text-slate-700">
                    <MessageSquare className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900">Recruiter Feedback: </span>
                      <span className="italic">"{app.recruiterNotes}"</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
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
