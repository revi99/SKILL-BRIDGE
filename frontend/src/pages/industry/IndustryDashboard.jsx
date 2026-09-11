import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
import MatchBadge from '../../components/MatchBadge';
import {
  Building2,
  Briefcase,
  Users,
  Sparkles,
  ArrowRight,
  PlusCircle,
  CheckCircle2,
  Clock,
  ChevronRight,
  Target,
  GraduationCap,
  Layers,
  FileText,
  UserCheck,
  Calendar,
  Filter,
  Send,
  X,
  Lock,
  Plus,
  Rocket,
  Compass,
} from 'lucide-react';

export default function IndustryDashboard() {
  const { user } = useAuth();
  const [postings, setPostings] = useState([]);
  const [selectedPostingId, setSelectedPostingId] = useState('');
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingApplicants, setLoadingApplicants] = useState(false);

  // Modals state
  const [showJobModal, setShowJobModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showMentorModal, setShowMentorModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // Job Form State
  const [jobForm, setJobForm] = useState({
    title: '',
    type: 'Internship',
    domain: 'Full Stack Web Development',
    location: 'Bangalore, India (Hybrid)',
    stipend: '₹25,000/month',
    requiredSkills: 'React, Node.js, MongoDB, REST APIs',
    description: '',
  });

  // Project Form State
  const [projectForm, setProjectForm] = useState({
    title: '',
    domain: 'Full Stack Web Development',
    problemStatement: '',
    durationWeeks: 8,
    requiredSkills: 'Python, FastAPI, Docker',
    maxTeams: 5,
  });

  // Fetch postings
  useEffect(() => {
    const fetchPostings = async () => {
      try {
        const res = await api.get('/postings/my/all');
        if (res.data.success) {
          const list = res.data.postings || [];
          setPostings(list);
          if (list.length > 0 && !selectedPostingId) {
            setSelectedPostingId(list[0]._id);
          }
        }
      } catch (err) {
        console.error('Failed to load industry postings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPostings();
  }, []);

  // Fetch applicants when selected posting changes
  useEffect(() => {
    if (!selectedPostingId) return;

    const fetchApplicants = async () => {
      setLoadingApplicants(true);
      try {
        const res = await api.get(`/applications/posting/${selectedPostingId}`);
        if (res.data.success) {
          setApplicants(res.data.applicants || []);
        }
      } catch (err) {
        console.error('Failed to load applicants:', err);
      } finally {
        setLoadingApplicants(false);
      }
    };

    fetchApplicants();
  }, [selectedPostingId]);

  const handleStatusUpdate = async (appId, newStatus) => {
    try {
      const res = await api.put(`/applications/${appId}/status`, {
        status: newStatus,
        recruiterNotes: `Status changed to ${newStatus}`,
      });
      if (res.data.success) {
        setApplicants((prev) =>
          prev.map((app) => (app._id === appId ? { ...app, status: newStatus } : app))
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update candidate stage');
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      const skillsArray = jobForm.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean);
      const res = await api.post('/postings', {
        ...jobForm,
        requiredSkills: skillsArray,
      });
      if (res.data.success) {
        setPostings((prev) => [res.data.posting, ...prev]);
        setSelectedPostingId(res.data.posting._id);
        setShowJobModal(false);
        setJobForm({
          title: '',
          type: 'Internship',
          domain: 'Full Stack Web Development',
          location: 'Bangalore, India (Hybrid)',
          stipend: '₹25,000/month',
          requiredSkills: 'React, Node.js, MongoDB, REST APIs',
          description: '',
        });
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to publish posting');
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const skillsArray = projectForm.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean);
      const res = await api.post('/projects', {
        ...projectForm,
        requiredSkills: skillsArray,
      });
      if (res.data.success) {
        alert('Live Capstone Project challenge published successfully!');
        setShowProjectModal(false);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to publish capstone project');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const totalApplicants = postings.reduce((sum, p) => sum + (p.applicantCount || 0), 0);
  const totalShortlisted = applicants.filter((a) => a.status === 'Shortlisted').length;
  const totalInterviewed = applicants.filter((a) => a.status === 'Interview Scheduled').length;

  const kanbanColumns = [
    { key: 'Applied', title: 'Applied / Screening', border: 'border-slate-200', badge: 'bg-slate-100 text-slate-700' },
    { key: 'Shortlisted', title: 'Shortlisted (Matched)', border: 'border-violet-200', badge: 'bg-violet-50 text-violet-700' },
    { key: 'Interview Scheduled', title: 'Interviewing', border: 'border-indigo-200', badge: 'bg-indigo-50 text-indigo-700' },
    { key: 'Offer Extended', title: 'Offer Extended', border: 'border-emerald-200', badge: 'bg-emerald-50 text-emerald-700' },
    { key: 'Rejected', title: 'Archived / Rejected', border: 'border-rose-200', badge: 'bg-rose-50 text-rose-700' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-slate-50">
      {/* 1. Recruiter Enterprise Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200">
                Industry ATS & Talent Suite
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                {user?.companyName || 'Corporate Partner'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Recruiter Hub: {user?.name}
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-2xl">
              Automated skill-matching ATS pipeline. Filter verified student applicants by assessed proficiency, host capstone projects, and schedule mentorship.
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowJobModal(true)}
              className="btn-brand-primary px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-transform hover:scale-105"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post Internship / Job</span>
            </button>

            <button
              onClick={() => setShowProjectModal(true)}
              className="btn-brand-secondary text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all"
            >
              <Rocket className="w-4 h-4 text-violet-600" />
              <span>Launch Capstone</span>
            </button>

            <Link
              to="/mentorship"
              className="btn-brand-secondary text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all"
            >
              <Users className="w-4 h-4 text-indigo-600" />
              <span>Mentorship Programs</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Top ATS Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Active Openings</span>
            <Briefcase className="w-4 h-4 text-violet-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{postings.length}</span>
            <span className="text-xs text-violet-600 font-semibold">Live on Portal</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Total Applicants</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{totalApplicants}</span>
            <span className="text-xs text-slate-500">Verified Profiles</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Shortlisted</span>
            <UserCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600">{totalShortlisted}</span>
            <span className="text-xs text-emerald-700 font-medium">High Match</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">In Interview Stage</span>
            <Calendar className="w-4 h-4 text-purple-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-violet-600">{totalInterviewed}</span>
            <span className="text-xs text-slate-500 font-medium">Scheduled</span>
          </div>
        </div>
      </div>

      {/* 3. Opening Selector & ATS Board Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center border border-violet-200">
            <Filter className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Select Hiring Opportunity:</h2>
            <p className="text-xs text-slate-500">Candidates ranked automatically by real assessed skill compatibility.</p>
          </div>
        </div>

        {postings.length > 0 && (
          <select
            value={selectedPostingId}
            onChange={(e) => setSelectedPostingId(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-violet-600 max-w-sm"
          >
            {postings.map((p) => (
              <option key={p._id} value={p._id}>
                {p.title} ({p.applicantCount || 0} applicants)
              </option>
            ))}
          </select>
        )}
      </div>

      {/* 4. Kanban-Style Applicant Tracking Board */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-violet-600" />
            <span>Interactive ATS Kanban Pipeline</span>
          </h3>
          <span className="text-xs text-slate-500">
            Click stage dropdown on candidate cards to move across hiring stages
          </span>
        </div>

        {loadingApplicants ? (
          <div className="min-h-[30vh] flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : applicants.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-sm text-center space-y-3">
            <Users className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="text-base font-bold text-slate-900">No Applicants for this Opening Yet</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              When students apply, their verified profiles, skill radar charts, and match badges will populate this Kanban board.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
            {kanbanColumns.map((col) => {
              const colApplicants = applicants.filter((a) => (a.status || 'Applied') === col.key);

              return (
                <div
                  key={col.key}
                  className={`bg-white p-4 rounded-2xl border ${col.border} shadow-sm flex flex-col space-y-3 min-w-[220px]`}
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <span className="text-xs font-bold text-slate-900 truncate">{col.title}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${col.badge}`}>
                      {colApplicants.length}
                    </span>
                  </div>

                  <div className="space-y-3 flex-1">
                    {colApplicants.map((app) => {
                      const student = app.studentId;
                      const profile = app.skillProfile;

                      return (
                        <div
                          key={app._id}
                          className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-violet-300 transition-all space-y-2.5 shadow-xs"
                        >
                          <div className="flex items-start justify-between gap-1.5">
                            <div>
                              <h5 className="text-xs font-bold text-slate-900 line-clamp-1">
                                {student?.name || 'Student'}
                              </h5>
                              <p className="text-[10px] text-slate-500 truncate">{student?.instituteName || 'College'}</p>
                            </div>
                            <MatchBadge percent={app.matchScore || profile?.overallScore || 85} size="sm" />
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {profile?.strengths?.slice(0, 2).map((s) => (
                              <span
                                key={s}
                                className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-white text-violet-700 border border-slate-200"
                              >
                                {s}
                              </span>
                            ))}
                          </div>

                          {/* 1-Click Move dropdown */}
                          <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[10px]">
                            <button
                              onClick={() => setSelectedCandidate(app)}
                              className="text-violet-600 hover:text-violet-800 font-bold underline"
                            >
                              Details
                            </button>

                            <select
                              value={app.status || 'Applied'}
                              onChange={(e) => handleStatusUpdate(app._id, e.target.value)}
                              className="bg-white border border-slate-200 rounded-lg px-1.5 py-1 text-[10px] text-slate-700 font-medium focus:outline-none focus:border-violet-600"
                            >
                              <option value="Applied">Applied</option>
                              <option value="Shortlisted">Shortlist</option>
                              <option value="Interview Scheduled">Interview</option>
                              <option value="Offer Extended">Offer</option>
                              <option value="Rejected">Reject</option>
                            </select>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Publish Internship Modal */}
      {showJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-extrabold text-slate-900">Publish New Opportunity</h3>
              <button onClick={() => setShowJobModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Role Title:</label>
                <input
                  type="text"
                  required
                  value={jobForm.title}
                  onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                  placeholder="e.g., Full Stack Engineering Intern"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-violet-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Type:</label>
                  <select
                    value={jobForm.type}
                    onChange={(e) => setJobForm({ ...jobForm, type: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-violet-600"
                  >
                    <option value="Internship">Internship</option>
                    <option value="Full-Time">Full-Time</option>
                    <option value="Apprenticeship">Apprenticeship</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Monthly Stipend:</label>
                  <input
                    type="text"
                    value={jobForm.stipend}
                    onChange={(e) => setJobForm({ ...jobForm, stipend: e.target.value })}
                    placeholder="₹25,000/mo"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-violet-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Required Skill Tags (comma-separated for auto-matching):
                </label>
                <input
                  type="text"
                  required
                  value={jobForm.requiredSkills}
                  onChange={(e) => setJobForm({ ...jobForm, requiredSkills: e.target.value })}
                  placeholder="React, Node.js, MongoDB, REST APIs"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-violet-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Job Description:</label>
                <textarea
                  rows={3}
                  required
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  placeholder="Describe the responsibilities and project scope..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-violet-600 focus:bg-white"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowJobModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-brand-primary px-5 py-2 rounded-xl font-bold">
                  Publish to Student Portal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Launch Live Capstone Challenge Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-extrabold text-slate-900">Launch Live Capstone Challenge</h3>
              <button onClick={() => setShowProjectModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Challenge Title:</label>
                <input
                  type="text"
                  required
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  placeholder="e.g., Enterprise Microservices Architecture with Kubernetes"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-violet-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Problem Statement:</label>
                <textarea
                  rows={3}
                  required
                  value={projectForm.problemStatement}
                  onChange={(e) => setProjectForm({ ...projectForm, problemStatement: e.target.value })}
                  placeholder="Explain the real-world industry problem college student teams will solve..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-violet-600 focus:bg-white"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Duration (Weeks):</label>
                  <input
                    type="number"
                    value={projectForm.durationWeeks}
                    onChange={(e) => setProjectForm({ ...projectForm, durationWeeks: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-violet-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Max Student Teams:</label>
                  <input
                    type="number"
                    value={projectForm.maxTeams}
                    onChange={(e) => setProjectForm({ ...projectForm, maxTeams: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-violet-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Required Skills:</label>
                <input
                  type="text"
                  required
                  value={projectForm.requiredSkills}
                  onChange={(e) => setProjectForm({ ...projectForm, requiredSkills: e.target.value })}
                  placeholder="Python, FastAPI, Docker, Kubernetes"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-violet-600 focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowProjectModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-brand-primary px-5 py-2 rounded-xl font-bold">
                  Publish Capstone Challenge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Candidate Details Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-violet-600 uppercase">Applicant Dossier</span>
                <h3 className="text-xl font-extrabold text-slate-900">
                  {selectedCandidate.studentId?.name || 'Student Candidate'}
                </h3>
                <p className="text-xs text-slate-500">{selectedCandidate.studentId?.email}</p>
              </div>
              <button onClick={() => setSelectedCandidate(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <p>Institute: <strong className="text-slate-900">{selectedCandidate.studentId?.instituteName || 'College'}</strong></p>
                <p>Degree: <strong className="text-slate-900">{selectedCandidate.studentId?.degree || 'Engineering'}</strong></p>
                <p>Overall Readiness: <strong className="text-emerald-600 font-bold">{selectedCandidate.skillProfile?.overallScore || 85}%</strong></p>
              </div>

              {selectedCandidate.coverNote && (
                <div>
                  <span className="font-semibold text-slate-900 block mb-1">Candidate Statement:</span>
                  <p className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs italic text-slate-700">
                    "{selectedCandidate.coverNote}"
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end pt-2">
              <button
                onClick={() => setSelectedCandidate(null)}
                className="btn-brand-primary px-5 py-2 rounded-xl text-xs font-bold"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
