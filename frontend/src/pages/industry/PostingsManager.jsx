import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import {
  Briefcase,
  PlusCircle,
  Trash2,
  Edit3,
  Users,
  CheckCircle2,
  X,
  AlertCircle,
  Tag,
} from 'lucide-react';

const COMMON_SKILLS = [
  'React',
  'Node.js',
  'MongoDB',
  'REST APIs',
  'Git',
  'Docker',
  'TypeScript',
  'Python',
  'SQL',
  'Kubernetes',
  'CI/CD',
  'Machine Learning',
];

export default function PostingsManager() {
  const [postings, setPostings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [tagInput, setTagInput] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'Internship',
    workMode: 'Hybrid',
    location: 'Bengaluru, India',
    stipend: '₹30,000 / month',
    duration: '6 Months',
    requiredSkills: ['React', 'Node.js', 'MongoDB'],
    deadline: new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0],
    openings: 2,
  });

  const fetchPostings = async () => {
    try {
      const res = await api.get('/postings/my/all');
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
  }, []);

  const handleAddSkill = (skill) => {
    if (!formData.requiredSkills.includes(skill)) {
      setFormData({
        ...formData,
        requiredSkills: [...formData.requiredSkills, skill],
      });
    }
  };

  const handleRemoveSkill = (skill) => {
    setFormData({
      ...formData,
      requiredSkills: formData.requiredSkills.filter((s) => s !== skill),
    });
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = tagInput.trim();
      if (val && !formData.requiredSkills.includes(val)) {
        setFormData({
          ...formData,
          requiredSkills: [...formData.requiredSkills, val],
        });
        setTagInput('');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await api.post('/postings', formData);
      if (res.data.success) {
        setShowModal(false);
        fetchPostings();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create posting');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this posting and its applications?')) {
      try {
        await api.delete(`/postings/${id}`);
        setPostings(postings.filter((p) => p._id !== id));
      } catch (err) {
        alert('Failed to delete posting');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Recruiter ATS
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Internship & Job Postings Manager
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Create skill-tagged opportunities to automatically rank incoming college candidates.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-md shadow-emerald-500/20 transition-all hover:scale-105 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Posting</span>
        </button>
      </div>

      {/* Postings List */}
      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : postings.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center space-y-3">
          <Briefcase className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No Openings Posted Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Publish your first internship or full-time opening with required skill tags.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold mt-2"
          >
            Create Opportunity
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {postings.map((post) => (
            <div
              key={post._id}
              className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h3 className="text-lg font-bold text-white">{post.title}</h3>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-medium">
                    {post.type} • {post.workMode}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-mono font-semibold border border-emerald-500/30">
                    {post.applicantCount || 0} Applicants
                  </span>
                </div>

                <p className="text-xs text-slate-400">
                  {post.location} • Stipend: <strong className="text-slate-200">{post.stipend}</strong> • Deadline:{' '}
                  {new Date(post.deadline).toLocaleDateString()}
                </p>

                {/* Required skill tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {post.requiredSkills?.map((s) => (
                    <span
                      key={s}
                      className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
                <Link
                  to={`/industry/applicants?postingId=${post._id}`}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all shadow-sm shadow-emerald-500/20"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Review Applicants</span>
                </Link>

                <button
                  onClick={() => handleDelete(post._id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Delete Posting"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Create Posting Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="glass-panel max-w-2xl w-full p-6 sm:p-8 rounded-3xl border border-slate-700 shadow-2xl max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Create New Opportunity</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Position Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Full Stack MERN Developer Intern"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Opportunity Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Internship">Internship</option>
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Work Mode</label>
                  <select
                    value={formData.workMode}
                    onChange={(e) => setFormData({ ...formData, workMode: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Application Deadline</label>
                  <input
                    type="date"
                    required
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Stipend / Compensation</label>
                  <input
                    type="text"
                    value={formData.stipend}
                    onChange={(e) => setFormData({ ...formData, stipend: e.target.value })}
                    placeholder="e.g. ₹25,000 / month"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Duration</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g. 6 Months"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Required Skill Tags Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Required Skill Tags (Rule-Matching Benchmark) *
                </label>
                <div className="p-3 bg-slate-900 border border-slate-700 rounded-xl space-y-2">
                  <div className="flex flex-wrap gap-1.5 min-h-[32px]">
                    {formData.requiredSkills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="hover:text-white"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagInputKeyDown}
                    placeholder="Type a skill tag and press Enter (or click suggestions below)..."
                    className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none pt-1"
                  />
                </div>

                {/* Common Skill Quick Tags */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <span className="text-[11px] text-slate-400">Add suggestion:</span>
                  {COMMON_SKILLS.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => handleAddSkill(skill)}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                    >
                      + {skill}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Role Description *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Outline responsibilities, project scope, and what the intern will learn..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold shadow-md shadow-emerald-500/20"
                >
                  {submitting ? 'Publishing...' : 'Publish Posting'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
