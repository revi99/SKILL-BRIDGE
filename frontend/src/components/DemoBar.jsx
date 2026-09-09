import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Sparkles, UserCheck, Building2, GraduationCap, User, Award } from 'lucide-react';

export default function DemoBar() {
  const { user, quickDemoLogin, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSwitch = async (role) => {
    const res = await quickDemoLogin(role);
    if (res?.success) {
      if (role === 'student') navigate('/student/dashboard');
      else if (role === 'industry') navigate('/industry/dashboard');
      else if (role === 'academician') navigate('/academician/dashboard');
      else if (role === 'institution') navigate('/institution/analytics');
    }
  };

  return (
    <div className="bg-gradient-to-r from-[#0d262d]/95 via-[#0a1b20]/95 to-[#0d262d]/95 border-b border-[#71C9CE]/25 px-4 py-2 text-xs backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Active User Indicator */}
        <div className="flex items-center gap-2 text-[#A6E3E9] font-medium">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#71C9CE] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#71C9CE]"></span>
          </span>
          <Sparkles className="w-3.5 h-3.5 text-[#71C9CE]" />
          <span className="font-semibold text-[#E3FDFD]">SkillBridge Enterprise Suite</span>
          
          {isAuthenticated && user && (
            <div className="hidden sm:flex items-center gap-1.5 ml-2 pl-2 border-l border-[#71C9CE]/30">
              <span className="text-[#CBF1F5]/70 text-[11px]">Active Session:</span>
              <span className="text-[#08181c] font-bold bg-[#A6E3E9] px-2 py-0.5 rounded border border-[#71C9CE] flex items-center gap-1">
                <User className="w-3 h-3 text-[#08181c]" />
                {user.name} ({user.role})
              </span>
            </div>
          )}
        </div>

        {/* Right: Instant 1-Click Role Switcher for 4 Roles */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-[#CBF1F5]/70 hidden xl:inline">Role Switcher:</span>

          {/* Student Button */}
          <button
            onClick={() => handleSwitch('student')}
            title="Switch to Demo Student account (Rahul Sharma)"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all font-semibold ${
              user?.role === 'student' && user?.email === 'student@demo.com'
                ? 'bg-[#71C9CE] text-[#08181c] shadow-sm shadow-[#71C9CE]/50 ring-1 ring-[#A6E3E9]'
                : 'bg-[#122e37]/80 hover:bg-[#183d49] text-[#CBF1F5] hover:text-white border border-[#71C9CE]/30'
            }`}
          >
            <UserCheck className="w-3 h-3 text-[#71C9CE]" />
            <span>Student (Rahul)</span>
          </button>

          {/* Industry Button */}
          <button
            onClick={() => handleSwitch('industry')}
            title="Switch to Demo Industry Recruiter account (TechCorp)"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all font-semibold ${
              user?.role === 'industry' && user?.email === 'industry@demo.com'
                ? 'bg-[#71C9CE] text-[#08181c] shadow-sm shadow-[#71C9CE]/50 ring-1 ring-[#A6E3E9]'
                : 'bg-[#122e37]/80 hover:bg-[#183d49] text-[#CBF1F5] hover:text-white border border-[#71C9CE]/30'
            }`}
          >
            <Building2 className="w-3 h-3 text-[#A6E3E9]" />
            <span>Industry (TechCorp)</span>
          </button>

          {/* Academician Button */}
          <button
            onClick={() => handleSwitch('academician')}
            title="Switch to Demo Academician Dean account (Dr. Thorne)"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all font-semibold ${
              user?.role === 'academician' && user?.email === 'academician@demo.com'
                ? 'bg-[#71C9CE] text-[#08181c] shadow-sm shadow-[#71C9CE]/50 ring-1 ring-[#A6E3E9]'
                : 'bg-[#122e37]/80 hover:bg-[#183d49] text-[#CBF1F5] hover:text-white border border-[#71C9CE]/30'
            }`}
          >
            <GraduationCap className="w-3 h-3 text-[#CBF1F5]" />
            <span>Academician (Dean)</span>
          </button>

          {/* Institution / Policymaker Button */}
          <button
            onClick={() => handleSwitch('institution')}
            title="Switch to Demo Institution / Policy Director (Dr. Sethi)"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all font-semibold ${
              user?.email === 'institution@demo.com'
                ? 'bg-[#71C9CE] text-[#08181c] shadow-sm shadow-[#71C9CE]/50 ring-1 ring-[#A6E3E9]'
                : 'bg-[#122e37]/80 hover:bg-[#183d49] text-[#CBF1F5] hover:text-white border border-[#71C9CE]/30'
            }`}
          >
            <Award className="w-3 h-3 text-[#A6E3E9]" />
            <span>Institution / NIRF Lead</span>
          </button>
        </div>
      </div>
    </div>
  );
}
