import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
import MatchBadge from '../../components/MatchBadge';
import {
  Briefcase,
  Search,
  Filter,
  Building2,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Send,
  X,
} from 'lucide-react';

export default function OpportunitiesPage() {
  const { user } = useAuth();
  const [postings, setPostings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [minMatch, setMinMatch] = useState('All');

  // Apply Modal State
  const [selectedPost, setSelectedPost] = useState(null);
  const [coverNote, setCoverNote] = useState('');
  const [applying, setApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState('');
  const [applyError, setApplyError] = useState('');

  const fetchPostings = async () => {
    setLoading(true);
    try {
      let query = `?search=${encodeURIComponent(search)}`;
      if (selectedType !== 'All') query += `&type=${selectedType}`;
      if (minMatch !== 'All') query += `&minMatch=${minMatch}`;

      const res = await api.get(`/postings${query}`);
      if (res.data.success) {
        setPostings(res.data.postings);
      }
    } catch (err) {
      console.error('Failed to fetch postings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostings();
  }, [selectedType, minMatch]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPostings();
  };

  const handleOpenApply = (post) => {
    setSelectedPost(post);
    setCoverNote(`I am excited to apply for the ${post.title} role at ${post.companyName}. Based on my assessed skill profile, I have hands-on experience in ${post.matchedSkills?.join(', ') || 'the required stack'}.`);
    setApplySuccess('');
    setApplyError('');
  };

  const handleApplySubmit = async () => {
    if (!selectedPost) return;
    setApplying(true);
    setApplyError('');
    try {
      const res = await api.post('/applications/apply', {
        postingId: selectedPost._id,
        coverNote,
      });

      if (res.data.success) {
        setApplySuccess('Application submitted successfully!');
        // Update local posting list state to reflect applied status
        setPostings((prev) =>
          prev.map((p) => (p._id === selectedPost._id ? { ...p, hasApplied: true } : p))
        );
        setTimeout(() => {
          setSelectedPost(null);
          setApplySuccess('');
        }, 1500);
      }
    } catch (err) {
      setApplyError(err.response?.data?.message || 'Application submission failed');
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#71C9CE]/15 text-[#CBF1F5] border border-[#71C9CE]/30">
              Rule-Based Match Engine
            </span>
            <span className="text-xs text-[#A6E3E9] font-mono">Live Openings</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Internship & Placement Opportunities
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Openings ranked dynamically according to your verified skill assessment tags.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by job title, company, or skill (e.g. React, Docker)..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Type Selector */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Types</option>
              <option value="Internship">Internship</option>
              <option value="Full-Time">Full-Time</option>
            </select>

            {/* Minimum Match Filter */}
            {user?.role === 'student' && (
              <select
                value={minMatch}
                onChange={(e) => setMinMatch(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-indigo-300 focus:outline-none focus:border-indigo-500"
              >
                <option value="All">All Match %</option>
                <option value="75">High Match (≥ 75%)</option>
                <option value="50">Moderate Match (≥ 50%)</option>
              </select>
            )}

            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors"
            >
              Filter
            </button>
          </div>
        </form>
      </div>

      {/* Postings Grid */}
      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : postings.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center space-y-3">
          <Briefcase className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No Matching Postings Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search query or match score filter to view all available opportunities.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {postings.map((post) => (
            <div
              key={post._id}
              className="glass-panel glass-panel-hover p-6 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-5"
            >
              <div>
                {/* Card Top: Type & Match Badge */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {post.type}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {post.workMode} • {post.location}
                    </span>
                  </div>

                  <MatchBadge percent={post.matchPercent || 0} size="md" />
                </div>

                {/* Title & Company */}
                <h3 className="text-lg font-bold text-white leading-snug">{post.title}</h3>
                <p className="text-xs font-semibold text-indigo-400 mt-0.5">{post.companyName}</p>

                <p className="text-xs text-slate-300 mt-3 line-clamp-3 leading-relaxed">
                  {post.description}
                </p>

                {/* Skill Breakdown */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Skill Tag Breakdown:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {post.requiredSkills?.map((skill) => {
                      const isMatched = post.matchedSkills?.includes(skill);
                      return (
                        <span
                          key={skill}
                          className={`text-xs px-2.5 py-0.5 rounded-md font-medium flex items-center gap-1 ${
                            isMatched
                              ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                              : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {isMatched ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <AlertCircle className="w-3 h-3 text-amber-400" />
                          )}
                          <span>{skill}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Card Bottom: Stipend & Action */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Compensation / Stipend</span>
                  <span className="font-bold text-white font-mono text-sm">{post.stipend}</span>
                </div>

                {post.hasApplied ? (
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-300 font-semibold border border-emerald-500/30">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Applied</span>
                  </span>
                ) : (
                  <button
                    onClick={() => handleOpenApply(post)}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all shadow-md shadow-indigo-600/20"
                  >
                    <span>One-Click Apply</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 1-Click Apply Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="glass-panel max-w-lg w-full p-6 sm:p-8 rounded-3xl border border-slate-700 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white">Confirm Application</h3>
                <p className="text-xs text-indigo-300">{selectedPost.title} • {selectedPost.companyName}</p>
              </div>
              <button
                onClick={() => setSelectedPost(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {applySuccess ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-center space-y-1">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="text-sm font-bold">{applySuccess}</p>
              </div>
            ) : (
              <>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400">Attached Skill Match</span>
                    <p className="text-sm font-bold text-white">{selectedPost.matchedSkills?.length} of {selectedPost.requiredSkills?.length} Skills Matched</p>
                  </div>
                  <MatchBadge percent={selectedPost.matchPercent || 0} size="md" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Cover Note to Recruiter (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={coverNote}
                    onChange={(e) => setCoverNote(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  ></textarea>
                </div>

                {applyError && (
                  <p className="text-xs text-rose-400 bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/30">
                    {applyError}
                  </p>
                )}

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedPost(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleApplySubmit}
                    disabled={applying}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold shadow-md shadow-indigo-600/30"
                  >
                    {applying ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Application</span>
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
