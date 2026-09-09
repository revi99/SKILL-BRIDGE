import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/client';
import {
  Award,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Layers,
  Clock,
  Send,
  AlertCircle,
} from 'lucide-react';

export default function AssessmentPage() {
  const [domains, setDomains] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState('Full Stack Web Development');
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [questionId]: optionIndex }
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // Load available domains on mount
  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const res = await api.get('/profile/domains');
        if (res.data.success) {
          setDomains(res.data.domains);
        }
      } catch (err) {
        console.error('Failed to load domains:', err);
      }
    };
    fetchDomains();
  }, []);

  // Fetch questions whenever selected domain changes
  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get(`/profile/questions/${encodeURIComponent(selectedDomain)}`);
        if (res.data.success) {
          setQuestions(res.data.questions);
          setCurrentIndex(0);
          setAnswers({});
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load domain questions');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [selectedDomain]);

  const handleSelectOption = (optionIndex) => {
    if (!questions[currentIndex]) return;
    setAnswers({
      ...answers,
      [questions[currentIndex].id]: optionIndex,
    });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const res = await api.post('/profile/submit-assessment', {
        domain: selectedDomain,
        answers,
      });

      if (res.data.success) {
        navigate('/student/profile');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to grade assessment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const currentQ = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const progressPercent = questions.length > 0 ? Math.round((answeredCount / questions.length) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#71C9CE]/15 text-[#CBF1F5] border border-[#71C9CE]/30 text-xs font-semibold">
          <Award className="w-3.5 h-3.5 text-[#71C9CE]" /> Technical Skill Assessment
        </div>
        <h1 className="text-3xl font-extrabold text-white">Map Your Industry Competencies</h1>
        <p className="text-sm text-slate-400">
          Answer multiple-choice and scenario questions to generate your verified skill profile and calculate matching scores with corporate openings.
        </p>
      </div>

      {/* Domain Selection Tabs */}
      <div className="glass-panel p-2 rounded-2xl border border-slate-800">
        <div className="flex flex-wrap gap-2">
          {domains.map((dom) => (
            <button
              key={dom}
              onClick={() => setSelectedDomain(dom)}
              className={`flex-1 min-w-[160px] py-2.5 px-3 rounded-xl text-xs font-semibold transition-all ${
                selectedDomain === dom
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {dom}
            </button>
          ))}
        </div>
      </div>

      {/* Assessment Question Card */}
      {loading ? (
        <div className="min-h-[300px] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="p-6 glass-panel rounded-2xl border border-rose-500/30 text-rose-300 text-center space-y-2">
          <AlertCircle className="w-8 h-8 mx-auto" />
          <p className="text-sm font-semibold">{error}</p>
        </div>
      ) : currentQ ? (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          {/* Progress Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span className="text-xs font-semibold text-slate-400">
                Skill Tag: <strong className="text-slate-200">{currentQ.skill}</strong>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-slate-400">
                Answered: {answeredCount}/{questions.length} ({progressPercent}%)
              </span>
              <div className="w-24 bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-500 h-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Question Text */}
          <div className="py-2">
            <h2 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
              {currentQ.question}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((option, idx) => {
              const isSelected = answers[currentQ.id] === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3 ${
                    isSelected
                      ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm shadow-indigo-500/20'
                      : 'bg-slate-900/80 hover:bg-slate-800/80 border-slate-800 text-slate-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs shrink-0 mt-0.5 ${
                      isSelected
                        ? 'border-indigo-400 bg-indigo-600 text-white'
                        : 'border-slate-600 text-slate-400'
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className="text-sm font-medium">{option}</span>
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-800">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="flex items-center gap-3">
              {currentIndex < questions.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition-all"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitting || answeredCount === 0}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50"
                >
                  {submitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit & Generate Profile</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
