import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import {
  GraduationCap,
  PlusCircle,
  Building2,
  Calendar,
  CheckCircle2,
  MessageSquare,
  Mail,
  X,
  AlertCircle,
  Briefcase,
} from 'lucide-react';

const COLLAB_TYPES = [
  'Faculty Development Program',
  'Guest Lecture / Workshop',
  'Joint Research Project',
  'Curriculum Review',
  'Capstone Sponsorship',
];

export default function CollaborationManager() {
  const [collaborations, setCollaborations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    type: 'Faculty Development Program',
    description: '',
    targetDomain: 'Cloud & Distributed Systems',
    proposedDuration: '2 Weeks (Hybrid)',
  });

  const fetchMyCollaborations = async () => {
    try {
      const res = await api.get('/collaborations/my');
      if (res.data.success) {
        setCollaborations(res.data.collaborations);
      }
    } catch (err) {
      console.error('Failed to load collaborations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyCollaborations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await api.post('/collaborations', formData);
      if (res.data.success) {
        setShowModal(false);
        fetchMyCollaborations();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create proposal');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200">
              Industry Collaboration Board
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Academic-Industry Collaboration Proposals
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Publish FDPs, guest lecture requests, and capstone sponsorships to recruit corporate partners.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-md shadow-violet-500/20 transition-all hover:scale-105 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Proposal</span>
        </button>
      </div>

      {/* Proposals List */}
      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : collaborations.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-sm text-center space-y-3">
          <GraduationCap className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No Proposals Published Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Create an FDP or research call to invite industry experts to your department.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-violet-600 text-white rounded-xl text-xs font-semibold mt-2"
          >
            Create Proposal
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {collaborations.map((collab) => (
            <div
              key={collab._id}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-violet-300 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200">
                      {collab.type}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">{collab.proposedDuration}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-1.5">{collab.title}</h3>
                </div>

                <div className="text-xs">
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" />
                    {collab.interests?.length || 0} Corporate Responses
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{collab.description}</p>

              {/* Inbound Industry Responses */}
              {collab.interests && collab.interests.length > 0 && (
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
                    Corporate Partner Responses:
                  </span>
                  <div className="space-y-2">
                    {collab.interests.map((interest, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-50 border border-emerald-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <strong className="text-slate-900">{interest.companyName}</strong>
                            <span className="text-slate-500">({interest.recruiterName})</span>
                          </div>
                          <p className="text-slate-600 italic">"{interest.message}"</p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <a
                            href={`mailto:${interest.contactEmail}`}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-colors border border-emerald-300 font-semibold"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            <span>Contact Partner</span>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create Proposal Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white max-w-lg w-full p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Post Collaboration Proposal</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Proposal Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Faculty Development Program on Microservices & Cloud Architectures"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-violet-500 focus:bg-white"
                  >
                    {COLLAB_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={formData.proposedDuration}
                    onChange={(e) => setFormData({ ...formData, proposedDuration: e.target.value })}
                    placeholder="e.g. 2 Weeks"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Tech Domain</label>
                <input
                  type="text"
                  value={formData.targetDomain}
                  onChange={(e) => setFormData({ ...formData, targetDomain: e.target.value })}
                  placeholder="e.g. Cloud & DevOps"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description & Scope *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe program objectives, number of faculty/students participating, and expected industry speaker expertise..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-500 focus:bg-white"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-xs font-semibold shadow-md shadow-violet-500/20"
                >
                  {submitting ? 'Publishing...' : 'Publish Call'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
