import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Mail, Lock, LogIn, UserCheck, Building2, GraduationCap, AlertCircle, Award } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, quickDemoLogin } = useAuth();
  const navigate = useNavigate();

  const handleRedirect = (role, userEmail) => {
    if (userEmail === 'institution@demo.com') navigate('/institution/analytics');
    else if (role === 'student') navigate('/student/dashboard');
    else if (role === 'industry') navigate('/industry/dashboard');
    else if (role === 'academician') navigate('/academician/dashboard');
    else navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res?.success) {
      handleRedirect(res.user.role, res.user.email);
    } else {
      setError(res?.error || 'Invalid credentials');
    }
  };

  const handleDemoClick = async (role) => {
    setError('');
    setLoading(true);
    const res = await quickDemoLogin(role);
    setLoading(false);
    if (res?.success) {
      handleRedirect(res.user.role, res.user.email);
    } else {
      setError(res?.error || 'Demo login failed');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 mb-4 shadow-lg shadow-indigo-500/10">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Welcome Back</h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-400">
            Sign in to access your customized portal or use a 1-click demo account.
          </p>
        </div>

        {/* 1-Click Fast Demo Logins */}
        <div className="glass-panel p-4 rounded-xl border border-indigo-500/30 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#CBF1F5] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#71C9CE]" /> 1-Click 4-Role Demo Accounts
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Instant Auth</span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <button
              type="button"
              onClick={() => handleDemoClick('student')}
              className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs font-medium transition-all group"
            >
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-indigo-400" />
                <div className="text-left">
                  <p className="font-semibold text-white">Student Account</p>
                  <p className="text-[10px] text-slate-400">Rahul Sharma (IIIT)</p>
                </div>
              </div>
              <span className="text-indigo-400 group-hover:translate-x-0.5 transition-transform">Login →</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoClick('industry')}
              className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs font-medium transition-all group"
            >
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-400" />
                <div className="text-left">
                  <p className="font-semibold text-white">Industry Recruiter</p>
                  <p className="text-[10px] text-slate-400">TechCorp Innovations</p>
                </div>
              </div>
              <span className="text-emerald-400 group-hover:translate-x-0.5 transition-transform">Login →</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoClick('academician')}
              className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs font-medium transition-all group"
            >
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-purple-400" />
                <div className="text-left">
                  <p className="font-semibold text-white">Academician Dean</p>
                  <p className="text-[10px] text-slate-400">Dr. Aris Thorne (ABC Tech)</p>
                </div>
              </div>
              <span className="text-purple-400 group-hover:translate-x-0.5 transition-transform">Login →</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoClick('institution')}
              className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs font-medium transition-all group"
            >
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-cyan-400" />
                <div className="text-left">
                  <p className="font-semibold text-white">Institution / NIRF Policy Lead</p>
                  <p className="text-[10px] text-slate-400">Dr. Vikram Sethi (NIRF Cell)</p>
                </div>
              </div>
              <span className="text-cyan-400 group-hover:translate-x-0.5 transition-transform">Login →</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@institution.edu"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg text-sm transition-all shadow-md shadow-indigo-600/25 mt-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </>
            )}
          </button>

          <p className="text-center text-xs text-slate-400 pt-2">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-400 hover:underline font-semibold">
              Create one here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
