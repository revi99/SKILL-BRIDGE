import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import {
  Users,
  Calendar,
  Clock,
  Star,
  Video,
  CheckCircle2,
  X,
  AlertCircle,
  Building2,
  Briefcase,
  Sparkles,
  Search,
  MessageSquare,
  ArrowRight,
} from 'lucide-react';

export default function MentorshipHubPage() {
  const [mentors, setMentors] = useState([]);
  const [mySessions, setMySessions] = useState([]);
  const [activeTab, setActiveTab] = useState('browse');
  const [loading, setLoading] = useState(true);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [topic, setTopic] = useState('Career Roadmap & Full-Stack System Design');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const [mentorRes, sessionRes] = await Promise.all([
        api.get('/mentorship/mentors'),
        api.get('/mentorship/my-sessions'),
      ]);

      if (mentorRes.data.success) setMentors(mentorRes.data.mentors || []);
      if (sessionRes.data.success) setMySessions(sessionRes.data.sessions || []);
    } catch (err) {
      console.error('Failed to load mentorship data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenBooking = (mentor) => {
    setSelectedMentor(mentor);
    setSelectedSlot(mentor.availableSlots?.[0]?.time || 'Wednesday 5:00 PM');
    setSuccess('');
    setError('');
  };

  const handleBookSession = async (e) => {
    e.preventDefault();
    if (!selectedMentor) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await api.post('/mentorship/book', {
        mentorId: selectedMentor._id,
        slotTime: selectedSlot,
        topic,
        notes,
      });

      if (res.data.success) {
        setSuccess('Mentorship session confirmed! Google Meet link generated.');
        fetchData();
        setTimeout(() => {
          setSelectedMentor(null);
          setSuccess('');
          setActiveTab('sessions');
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Industry Mentorship Ecosystem
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            1-on-1 Industry Mentorship & Guidance
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Connect directly with verified tech leads and engineering hiring managers for portfolio reviews, system design mentoring, and mock interviews.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="glass-panel p-1.5 rounded-2xl border border-slate-800 flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'browse'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Find Mentors ({mentors.length})
          </button>
          <button
            onClick={() => setActiveTab('sessions')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'sessions'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            My Sessions ({mySessions.length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : activeTab === 'browse' ? (
        /* Mentors Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mentors.map((mentor) => (
            <div
              key={mentor._id}
              className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-emerald-500/30 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-white">{mentor.mentorName}</h3>
                    <p className="text-xs font-semibold text-emerald-400">
                      {mentor.mentorTitle} • {mentor.mentorCompany}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{mentor.rating}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mt-2">{mentor.bio}</p>

                {/* Expertise tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {mentor.expertise?.map((exp) => (
                    <span
                      key={exp}
                      className="text-xs px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 font-medium"
                    >
                      {exp}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  {mentor.totalSessionsConducted || 24}+ Sessions Conducted
                </span>

                <button
                  onClick={() => handleOpenBooking(mentor)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all shadow-sm shadow-emerald-500/20"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book 1-on-1</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* My Sessions List */
        <div className="space-y-4">
          {mySessions.length === 0 ? (
            <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center space-y-3">
              <Calendar className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No Mentorship Sessions Booked</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Schedule a 1-on-1 mentoring round with verified industry leads to review your projects and practice mock interviews.
              </p>
              <button
                onClick={() => setActiveTab('browse')}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold mt-2"
              >
                Browse Mentors
              </button>
            </div>
          ) : (
            mySessions.map((s, idx) => (
              <div
                key={idx}
                className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">{s.topic}</h3>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" /> {s.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400">
                    Mentor: <strong className="text-white">{s.mentorName}</strong> ({s.mentorTitle} • {s.mentorCompany})
                  </p>

                  <div className="flex items-center gap-3 text-xs text-slate-400 font-mono pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" /> {s.slotTime}
                    </span>
                    <span>•</span>
                    <span>Date: {new Date(s.scheduledDate).toLocaleDateString()}</span>
                  </div>

                  {s.notes && (
                    <p className="text-xs text-slate-300 italic bg-slate-900 p-2.5 rounded-lg border border-slate-800 mt-2">
                      Notes: "{s.notes}"
                    </p>
                  )}
                </div>

                <div className="shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
                  <a
                    href={s.meetLink || 'https://meet.google.com'}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all"
                  >
                    <Video className="w-4 h-4" />
                    <span>Join Google Meet</span>
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Booking Modal */}
      {selectedMentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="glass-panel max-w-lg w-full p-6 sm:p-8 rounded-3xl border border-slate-700 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white">Book 1-on-1 Session</h3>
                <p className="text-xs text-emerald-400">
                  {selectedMentor.mentorName} • {selectedMentor.mentorCompany}
                </p>
              </div>
              <button
                onClick={() => setSelectedMentor(null)}
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
              <form onSubmit={handleBookSession} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Select Available Slot *
                  </label>
                  <select
                    value={selectedSlot}
                    onChange={(e) => setSelectedSlot(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    {selectedMentor.availableSlots?.map((slot, idx) => (
                      <option key={idx} value={`${slot.day} ${slot.time}`}>
                        {slot.day} - {slot.time}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Session Topic *</label>
                  <input
                    type="text"
                    required
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. MERN Architecture & Mock Interview"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Questions or Areas of Focus
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Describe specific questions or portfolio repositories you want to review..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
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
                    onClick={() => setSelectedMentor(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold shadow-md shadow-emerald-500/30"
                  >
                    {submitting ? 'Confirming...' : 'Confirm Booking'}
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
