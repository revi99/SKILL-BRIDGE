import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Sparkles, UserCheck, Building2, GraduationCap, User, Award } from 'lucide-react';

export default function DemoBar() {
  const { user, quickDemoLogin, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [switchingRole, setSwitchingRole] = React.useState(null);

  const handleSwitch = async (role) => {
    try {
      setSwitchingRole(role);
      const res = await quickDemoLogin(role);
      if (res?.success) {
        if (role === 'student') navigate('/student/dashboard');
        else if (role === 'industry') navigate('/industry/dashboard');
        else if (role === 'academician') navigate('/academician/dashboard');
      } else {
        alert(res?.error || 'Failed to switch demo account. Please ensure the backend is running.');
      }
    } catch (err) {
      console.error('Role switch failed:', err);
    } finally {
      setSwitchingRole(null);
    }
  };

  return (
    <div className="bg-slate-900 border-b border-slate-800 px-4 py-1.5 text-xs text-slate-200 sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
        {/* Left: Active User Indicator */}
        <div className="flex items-center gap-2 text-violet-400 font-medium">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          <span className="font-bold text-white tracking-wide">SkillBridge Live Environment</span>
          
          {isAuthenticated && user && (
            <div className="hidden sm:flex items-center gap-1.5 ml-2 pl-2 border-l border-slate-700">
              <span className="text-slate-400 text-[11px]">Active Persona:</span>
              <span className="text-white font-bold bg-violet-600/90 px-2 py-0.5 rounded-md text-[11px] flex items-center gap-1">
                <User className="w-3 h-3 text-violet-200" />
                {user.name} ({user.role})
              </span>
            </div>
          )}
        </div>

        {/* Right: Instant 1-Click Role Switcher */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-slate-400 hidden xl:inline font-medium">Switch Demo Role:</span>

          {/* Student Button */}
          <button
            onClick={() => handleSwitch('student')}
            disabled={!!switchingRole}
            title="Switch to Demo Student account (Rahul Sharma)"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] transition-all font-semibold ${
              switchingRole === 'student' ? 'opacity-70 animate-pulse' : ''
            } ${
              user?.role === 'student' && user?.email === 'student@demo.com'
                ? 'bg-violet-600 text-white shadow-sm ring-1 ring-violet-400'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700'
            }`}
          >
            <UserCheck className="w-3 h-3 text-violet-400" />
            <span>{switchingRole === 'student' ? 'Switching...' : 'Student (Rahul)'}</span>
          </button>

          {/* Industry Button */}
          <button
            onClick={() => handleSwitch('industry')}
            disabled={!!switchingRole}
            title="Switch to Demo Industry Recruiter account (TechCorp)"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] transition-all font-semibold ${
              switchingRole === 'industry' ? 'opacity-70 animate-pulse' : ''
            } ${
              user?.role === 'industry' && user?.email === 'industry@demo.com'
                ? 'bg-violet-600 text-white shadow-sm ring-1 ring-violet-400'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700'
            }`}
          >
            <Building2 className="w-3 h-3 text-indigo-400" />
            <span>{switchingRole === 'industry' ? 'Switching...' : 'Industry (TechCorp)'}</span>
          </button>

          {/* Academician Button */}
          <button
            onClick={() => handleSwitch('academician')}
            disabled={!!switchingRole}
            title="Switch to Demo Academician Dean account (Dr. Thorne)"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] transition-all font-semibold ${
              switchingRole === 'academician' ? 'opacity-70 animate-pulse' : ''
            } ${
              user?.role === 'academician' && user?.email === 'academician@demo.com'
                ? 'bg-violet-600 text-white shadow-sm ring-1 ring-violet-400'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700'
            }`}
          >
            <GraduationCap className="w-3 h-3 text-purple-400" />
            <span>{switchingRole === 'academician' ? 'Switching...' : 'Academician (Dean)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
