import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import {
  FolderGit2,
  Users,
  Award,
  Calendar,
  CheckCircle2,
  Send,
  X,
  AlertCircle,
  Clock,
  Sparkles,
  ExternalLink,
  Code2,
  Layers,
} from 'lucide-react';

export default function LiveProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [teamName, setTeamName] = useState('');
  const [teamSize, setTeamSize] = useState(3);
  const [proposal, setProposal] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      if (res.data.success) {
        setProjects(res.data.projects);
      }
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleOpenApply = (proj) => {
    setSelectedProject(proj);
    setTeamName(`DevTeam Alpha`);
    setProposal(`We plan to implement this using clean modular architecture, Docker containerization, and unit tests.`);
    setRepoUrl(`https://github.com/myteam/capstone-${proj.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`);
    setSuccess('');
    setError('');
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!selectedProject) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await api.post(`/projects/${selectedProject._id}/apply`, {
        teamName,
        teamSize,
        proposal,
        repoUrl,
      });

      if (res.data.success) {
        setSuccess('Team application submitted successfully to corporate project lead!');
        fetchProjects();
        setTimeout(() => {
          setSelectedProject(null);
          setSuccess('');
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Application submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200">
            Corporate Capstone Sandbox
          </span>
          <span className="text-xs text-emerald-600 font-medium">Industry-Sponsored Grants</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Live Industry Projects & Capstone Challenges
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Solve real production problem statements provided by enterprise engineering teams. Compete in teams for project grants and direct Pre-Placement Offers (PPOs).
        </p>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-sm text-center space-y-3">
          <FolderGit2 className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No Live Projects Posted Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Check back soon for new capstone challenges from corporate partners.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {projects.map((proj) => (
            <div
              key={proj._id}
              className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 hover:border-violet-300 shadow-sm hover:shadow-md transition-all space-y-5"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {proj.domain}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {proj.status}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900">{proj.title}</h3>
                  <p className="text-xs font-semibold text-violet-600 mt-0.5">
                    Sponsored by {proj.companyName} • Duration: {proj.duration}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-500 block font-mono">Grant / Award</span>
                  <span className="text-base font-bold text-emerald-600 font-mono">{proj.grantAmount}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Problem Statement:
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {proj.problemStatement}
                </p>
              </div>

              {/* Milestones Roadmap */}
              {proj.milestones?.length > 0 && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-violet-700 uppercase tracking-wider block">
                    Milestone Roadmap:
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                    {proj.milestones.map((m, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs text-xs">
                        <span className="text-slate-400 font-mono text-[10px] block">Stage {idx + 1} ({m.durationWeeks} wks)</span>
                        <strong className="text-slate-900 block mt-0.5">{m.title}</strong>
                        <p className="text-slate-500 text-[11px] mt-1">{m.deliverable}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tech Stack & Action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                <div className="flex flex-wrap gap-1.5">
                  {proj.techStack?.map((t) => (
                    <span
                      key={t}
                      className="text-xs px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 font-mono">
                    {proj.teams?.length || 0} Teams Enrolled
                  </span>
                  <button
                    onClick={() => handleOpenApply(proj)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-violet-500/20 transition-all hover:scale-[1.02]"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Apply with Team</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Team Application Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white max-w-lg w-full p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Apply for Live Project</h3>
                <p className="text-xs text-violet-600 font-medium">{selectedProject.title}</p>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {success ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center space-y-1">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="text-sm font-bold">{success}</p>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Team Name *</label>
                    <input
                      type="text"
                      required
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      placeholder="e.g. ByteCraft Alpha"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Team Size</label>
                    <select
                      value={teamSize}
                      onChange={(e) => setTeamSize(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-violet-500 focus:bg-white"
                    >
                      <option value={2}>2 Members</option>
                      <option value={3}>3 Members</option>
                      <option value={4}>4 Members</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    GitHub / Project Architecture Repo
                  </label>
                  <input
                    type="url"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    placeholder="https://github.com/team/capstone-repo"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Architecture Proposal & Technical Approach *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={proposal}
                    onChange={(e) => setProposal(e.target.value)}
                    placeholder="Describe how your team intends to solve the problem, tech stack choices, and testing strategy..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-500 focus:bg-white"
                  ></textarea>
                </div>

                {error && (
                  <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                    {error}
                  </p>
                )}

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedProject(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-xs font-semibold shadow-md shadow-violet-500/20"
                  >
                    {submitting ? 'Submitting...' : 'Submit Proposal'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
