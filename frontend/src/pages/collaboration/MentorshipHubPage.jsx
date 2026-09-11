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
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200">
              Industry Mentorship Ecosystem
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            1-on-1 Industry Mentorship & Guidance
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Connect directly with verified tech leads and engineering hiring managers for portfolio reviews, system design mentoring, and mock interviews.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'browse'
                ? 'bg-violet-600 text-white shadow-sm shadow-violet-500/20'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Find Mentors ({mentors.length})
          </button>
          <button
            onClick={() => setActiveTab('sessions')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'sessions'
                ? 'bg-violet-600 text-white shadow-sm shadow-violet-500/20'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            My Sessions ({mySessions.length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : activeTab === 'browse' ? (
        /* Mentors Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mentors.map((mentor) => (
            <div
              key={mentor._id}
              className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-violet-300 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{mentor.mentorName}</h3>
                    <p className="text-xs font-semibold text-violet-600">
                      {mentor.mentorTitle} • {mentor.mentorCompany}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{mentor.rating}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mt-2">{mentor.bio}</p>

                {/* Expertise tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {mentor.expertise?.map((exp) => (
                    <span
                      key={exp}
                      className="text-xs px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-medium"
                    >
                      {exp}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  {mentor.totalSessionsConducted || 24}+ Sessions Conducted
                </span>

                <button
                  onClick={() => handleOpenBooking(mentor)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold transition-all shadow-sm shadow-violet-500/20"
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
            <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-sm text-center space-y-3">
              <Calendar className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">No Mentorship Sessions Booked</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Schedule a 1-on-1 mentoring round with verified industry leads to review your projects and practice mock interviews.
              </p>
              <button
                onClick={() => setActiveTab('browse')}
                className="px-4 py-2 bg-violet-600 text-white rounded-xl text-xs font-semibold mt-2"
              >
                Browse Mentors
              </button>
            </div>
          ) : (
            mySessions.map((s, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{s.topic}</h3>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {s.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500">
                    Mentor: <strong className="text-slate-800">{s.mentorName}</strong> ({s.mentorTitle} • {s.mentorCompany})
                  </p>

                  <div className="flex items-center gap-3 text-xs text-slate-500 font-mono pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-violet-600" /> {s.slotTime}
                    </span>
                    <span>•</span>
                    <span>Date: {new Date(s.scheduledDate).toLocaleDateString()}</span>
                  </div>

                  {s.notes && (
                    <p className="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-lg border border-slate-200 mt-2">
                      Notes: "{s.notes}"
                    </p>
                  )}
                </div>

                <div className="shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <a
                    href={s.meetLink || 'https://meet.google.com'}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold shadow-md shadow-violet-500/20 transition-all"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white max-w-lg w-full p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Book 1-on-1 Session</h3>
                <p className="text-xs text-violet-600 font-medium">
                  {selectedMentor.mentorName} • {selectedMentor.mentorCompany}
                </p>
              </div>
              <button
                onClick={() => setSelectedMentor(null)}
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
              <form onSubmit={handleBookSession} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Select Available Slot *
                  </label>
                  <select
                    value={selectedSlot}
                    onChange={(e) => setSelectedSlot(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-violet-500 focus:bg-white"
                  >
                    {selectedMentor.availableSlots?.map((slot, idx) => (
                      <option key={idx} value={`${slot.day} ${slot.time}`}>
                        {slot.day} - {slot.time}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Session Topic *</label>
                  <input
                    type="text"
                    required
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. MERN Architecture & Mock Interview"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Questions or Areas of Focus
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Describe specific questions or portfolio repositories you want to review..."
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
                    onClick={() => setSelectedMentor(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-xs font-semibold shadow-md shadow-violet-500/20"
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
