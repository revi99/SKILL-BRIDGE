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
    if (role === 'student') navigate('/student/dashboard');
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
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <img
            src="/skillbridge-logo.png"
            alt="SkillBridge Logo"
            className="h-10 w-auto object-contain mx-auto mb-3"
          />
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Welcome Back</h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600">
            Sign in to access your customized portal or use a 1-click demo account.
          </p>
        </div>

        {/* 1-Click Fast Demo Logins */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-violet-600" /> 1-Click Fast Demo Accounts
            </span>
            <span className="text-[10px] text-violet-600 font-bold bg-violet-50 px-2 py-0.5 rounded-full border border-violet-200">
              Instant Access
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <button
              type="button"
              onClick={() => handleDemoClick('student')}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-violet-50 border border-slate-200 hover:border-violet-300 text-slate-800 text-xs font-medium transition-all group shadow-xs"
            >
              <div className="flex items-center gap-2.5">
                <UserCheck className="w-4 h-4 text-violet-600" />
                <div className="text-left">
                  <p className="font-bold text-slate-900">Student Account</p>
                  <p className="text-[11px] text-slate-500">Rahul Sharma (IIIT Delhi)</p>
                </div>
              </div>
              <span className="text-violet-600 font-bold group-hover:translate-x-0.5 transition-transform">Login →</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoClick('industry')}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-violet-50 border border-slate-200 hover:border-violet-300 text-slate-800 text-xs font-medium transition-all group shadow-xs"
            >
              <div className="flex items-center gap-2.5">
                <Building2 className="w-4 h-4 text-indigo-600" />
                <div className="text-left">
                  <p className="font-bold text-slate-900">Industry Recruiter</p>
                  <p className="text-[11px] text-slate-500">TechCorp Innovations</p>
                </div>
              </div>
              <span className="text-indigo-600 font-bold group-hover:translate-x-0.5 transition-transform">Login →</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoClick('academician')}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-violet-50 border border-slate-200 hover:border-violet-300 text-slate-800 text-xs font-medium transition-all group shadow-xs"
            >
              <div className="flex items-center gap-2.5">
                <GraduationCap className="w-4 h-4 text-purple-600" />
                <div className="text-left">
                  <p className="font-bold text-slate-900">Academician Dean</p>
                  <p className="text-[11px] text-slate-500">Dr. Aris Thorne (Dean CS)</p>
                </div>
              </div>
              <span className="text-purple-600 font-bold group-hover:translate-x-0.5 transition-transform">Login →</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-md space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@organization.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-600 focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-600 focus:bg-white transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-brand-primary font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
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

          <p className="text-center text-xs text-slate-500 pt-2">
            Don't have an account?{' '}
            <Link to="/register" className="text-violet-600 hover:underline font-bold">
              Create one here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
