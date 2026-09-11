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
  Mail,
} from 'lucide-react';

export default function CollaborationsBrowse() {
  const [collaborations, setCollaborations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCollab, setSelectedCollab] = useState(null);
  const [message, setMessage] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);
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
    setSuccessData(null);
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
        setSuccessData({
          message: res.data.message || 'Collaboration interest submitted successfully!',
          email: contactEmail,
          previewUrl: res.data.previewUrl,
        });
        fetchCollaborations();
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
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200">
            Academic Partnerships
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Faculty Development & Campus Collaborations
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Engage with academic faculty on FDPs, sponsored capstone projects, and industry guest lecture series.
        </p>
      </div>

      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {collaborations.map((collab) => (
            <div
              key={collab._id}
              className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-violet-300 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200">
                    {collab.type}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">{collab.proposedDuration}</span>
                </div>

                <h3 className="text-lg font-bold text-slate-900">{collab.title}</h3>
                <p className="text-xs font-medium text-slate-600 mt-1">
                  {collab.institution} • {collab.department}
                </p>

                <p className="text-xs text-slate-600 mt-3 leading-relaxed">{collab.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  Coordinator: <strong className="text-slate-800">{collab.academicianId?.name || 'Faculty Dean'}</strong>
                </span>

                <button
                  onClick={() => handleOpenInterest(collab)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold transition-all shadow-sm shadow-violet-500/20"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white max-w-lg w-full p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Partner with Institution</h3>
                <p className="text-xs text-violet-600 font-medium">{selectedCollab.institution}</p>
              </div>
              <button
                onClick={() => setSelectedCollab(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {successData ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3 animate-in fade-in">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-emerald-950">Proposal Dispatched in Real Time!</h4>
                  <p className="text-xs text-emerald-700 mt-1 max-w-sm mx-auto leading-relaxed">
                    {successData.message}
                  </p>
                </div>
                <div className="p-3 bg-white/90 rounded-xl border border-emerald-200 text-xs font-mono text-emerald-900 inline-flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-600" />
                  <span>Delivered to: <strong>{successData.email}</strong></span>
                </div>
                {successData.previewUrl && (
                  <div>
                    <a
                      href={successData.previewUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-violet-700 underline font-semibold hover:text-violet-900"
                    >
                      View Live Email Web Preview ↗
                    </a>
                  </div>
                )}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCollab(null);
                      setSuccessData(null);
                    }}
                    className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-xs hover:bg-emerald-700 transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitInterest} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Contact Email for Coordinator <span className="text-violet-600 font-normal">(Receives real-time notification)</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="recruiter@company.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Partnership Note & Proposed Topics
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
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
                    onClick={() => setSelectedCollab(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-xs font-semibold shadow-md shadow-violet-500/20"
                  >
                    {submitting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending in Real Time...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Proposal</span>
                      </>
                    )}
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
