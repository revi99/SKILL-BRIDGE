import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import {
  GraduationCap,
  Building2,
  Calendar,
  Send,
  CheckCircle2,
  X,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export default function CollaborationsBrowse() {
  const [collaborations, setCollaborations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCollab, setSelectedCollab] = useState(null);
  const [message, setMessage] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const fetchCollaborations = async () => {
    try {
      const res = await api.get('/collaborations');
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
    fetchCollaborations();
  }, []);

  const handleOpenInterest = (collab) => {
    setSelectedCollab(collab);
    setMessage(`Hello, our engineering team would be glad to partner on this ${collab.type} proposal.`);
    setSuccess('');
    setError('');
  };

  const handleSubmitInterest = async (e) => {
    e.preventDefault();
    if (!selectedCollab) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await api.post(`/collaborations/${selectedCollab._id}/interest`, {
        message,
        contactEmail,
      });

      if (res.data.success) {
        setSuccess('Collaboration interest submitted to academic coordinator!');
        fetchCollaborations();
        setTimeout(() => {
          setSelectedCollab(null);
          setSuccess('');
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit interest');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
            Academic Partnerships
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Faculty Development & Campus Collaborations
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Engage with academic faculty on FDPs, sponsored capstone projects, and industry guest lecture series.
        </p>
      </div>

      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {collaborations.map((collab) => (
            <div
              key={collab._id}
              className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
                    {collab.type}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{collab.proposedDuration}</span>
                </div>

                <h3 className="text-lg font-bold text-white">{collab.title}</h3>
                <p className="text-xs font-medium text-slate-300 mt-1">
                  {collab.institution} • {collab.department}
                </p>

                <p className="text-xs text-slate-400 mt-3 leading-relaxed">{collab.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  Coordinator: <strong className="text-white">{collab.academicianId?.name || 'Faculty Dean'}</strong>
                </span>

                <button
                  onClick={() => handleOpenInterest(collab)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-all shadow-sm shadow-purple-500/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Express Interest</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Express Interest Modal */}
      {selectedCollab && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="glass-panel max-w-lg w-full p-6 sm:p-8 rounded-3xl border border-slate-700 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white">Partner with Institution</h3>
                <p className="text-xs text-purple-300">{selectedCollab.institution}</p>
              </div>
              <button
                onClick={() => setSelectedCollab(null)}
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
              <form onSubmit={handleSubmitInterest} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Contact Email for Coordinator
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="recruiter@company.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Partnership Note & Proposed Topics
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
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
                    onClick={() => setSelectedCollab(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-semibold shadow-md shadow-purple-600/30"
                  >
                    {submitting ? 'Submitting...' : 'Send Proposal'}
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
