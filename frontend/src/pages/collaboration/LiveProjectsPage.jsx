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
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            Corporate Capstone Sandbox
          </span>
          <span className="text-xs text-emerald-400 font-mono">Industry-Sponsored Grants</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Live Industry Projects & Capstone Challenges
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Solve real production problem statements provided by enterprise engineering teams. Compete in teams for project grants and direct Pre-Placement Offers (PPOs).
        </p>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : projects.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center space-y-3">
          <FolderGit2 className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No Live Projects Posted Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Check back soon for new capstone challenges from corporate partners.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {projects.map((proj) => (
            <div
              key={proj._id}
              className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 hover:border-indigo-500/40 transition-all space-y-5"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {proj.domain}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      {proj.status}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white">{proj.title}</h3>
                  <p className="text-xs font-semibold text-indigo-400 mt-0.5">
                    Sponsored by {proj.companyName} • Duration: {proj.duration}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400 block font-mono">Grant / Award</span>
                  <span className="text-base font-bold text-emerald-300 font-mono">{proj.grantAmount}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Problem Statement:
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {proj.problemStatement}
                </p>
              </div>

              {/* Milestones Roadmap */}
              {proj.milestones?.length > 0 && (
                <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider block">
                    Milestone Roadmap:
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                    {proj.milestones.map((m, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                        <span className="text-slate-400 font-mono text-[10px] block">Stage {idx + 1} ({m.durationWeeks} wks)</span>
                        <strong className="text-white block mt-0.5">{m.title}</strong>
                        <p className="text-slate-400 text-[11px] mt-1">{m.deliverable}</p>
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
                      className="text-xs px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 font-mono">
                    {proj.teams?.length || 0} Teams Enrolled
                  </span>
                  <button
                    onClick={() => handleOpenApply(proj)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/25 transition-all hover:scale-105"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="glass-panel max-w-lg w-full p-6 sm:p-8 rounded-3xl border border-slate-700 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white">Apply for Live Project</h3>
                <p className="text-xs text-indigo-300">{selectedProject.title}</p>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {success ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-center space-y-1">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="text-sm font-bold">{success}</p>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Team Name *</label>
                    <input
                      type="text"
                      required
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      placeholder="e.g. ByteCraft Alpha"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Team Size</label>
                    <select
                      value={teamSize}
                      onChange={(e) => setTeamSize(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value={2}>2 Members</option>
                      <option value={3}>3 Members</option>
                      <option value={4}>4 Members</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    GitHub / Project Architecture Repo
                  </label>
                  <input
                    type="url"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    placeholder="https://github.com/team/capstone-repo"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Architecture Proposal & Technical Approach *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={proposal}
                    onChange={(e) => setProposal(e.target.value)}
                    placeholder="Describe how your team intends to solve the problem, tech stack choices, and testing strategy..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  ></textarea>
                </div>

                {error && (
                  <p className="text-xs text-rose-400 bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/30">
                    {error}
                  </p>
                )}

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedProject(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold shadow-md shadow-indigo-600/30"
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
