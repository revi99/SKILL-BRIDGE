import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Compass,
  FileCheck,
  Briefcase,
  Layers,
  BarChart3,
  GraduationCap,
  Building2,
  User,
  LogOut,
  Menu,
  X,
  Sparkles,
  ChevronDown,
  Award,
  FolderGit2,
  Lock,
  Zap,
  Users,
} from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  let navItems = [];

  if (user?.role === 'student') {
    navItems = [
      { name: 'Dashboard', path: '/student/dashboard', icon: Compass },
      { name: 'Assessment', path: '/student/assessment', icon: Award },
      { name: 'Skill Profile', path: '/student/profile', icon: Layers },
      { name: 'Opportunities', path: '/student/opportunities', icon: Briefcase },
      { name: 'Vault', path: '/student/vault', icon: Lock },
      { name: 'Mentorship', path: '/mentorship', icon: Users },
      { name: 'Live Projects', path: '/projects', icon: FolderGit2 },
      { name: 'Applications', path: '/student/applications', icon: FileCheck },
    ];
  } else if (user?.role === 'industry') {
    navItems = [
      { name: 'Dashboard', path: '/industry/dashboard', icon: Compass },
      { name: 'Postings Manager', path: '/industry/postings', icon: Briefcase },
      { name: 'Review Applicants', path: '/industry/applicants', icon: FileCheck },
      { name: 'Collaborations', path: '/industry/collaborations', icon: GraduationCap },
    ];
  } else if (user?.role === 'academician') {
    navItems = [
      { name: 'Dashboard & Gap Analytics', path: '/academician/dashboard', icon: BarChart3 },
      { name: 'Research Calls', path: '/academician/collaborations', icon: GraduationCap },
      { name: 'Student Cohort', path: '/academician/cohort', icon: User },
      { name: 'Integrations', path: '/integrations', icon: Zap },
    ];
  } else {
    navItems = [
      { name: 'Explore Opportunities', path: '/opportunities', icon: Briefcase },
      { name: 'Live Projects', path: '/projects', icon: FolderGit2 },
      { name: 'Mentorship', path: '/mentorship', icon: Users },
      { name: 'Integrations', path: '/integrations', icon: Zap },
    ];
  }

  const getRoleBadge = (role) => {
    switch (role) {
      case 'student':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-200">
            <User className="w-3 h-3 text-violet-600" /> Student
          </span>
        );
      case 'industry':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Building2 className="w-3 h-3 text-indigo-600" /> Industry Partner
          </span>
        );
      case 'academician':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            <GraduationCap className="w-3 h-3 text-purple-600" /> Academician / Dean
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <nav className="sticky top-[33px] z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 group shrink-0">
              <img
                src="/skillbridge-logo.png"
                alt="SkillBridge"
                className="h-8 sm:h-9 w-auto object-contain group-hover:scale-105 transition-transform"
              />
              <span className="text-[10px] uppercase tracking-widest font-mono bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-bold border border-blue-200 hidden sm:inline">
                PRO
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden xl:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-violet-50 text-violet-700 border border-violet-200 shadow-xs font-bold'
                        : 'text-slate-600 hover:text-violet-700 hover:bg-slate-100/80'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-violet-600' : 'text-slate-400'}`} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Action Menu */}
          <div className="hidden sm:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200/60 shadow-xs"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-xs">
                    {user.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <div className="text-left hidden md:block">
                    <p className="text-xs font-bold text-slate-800 line-clamp-1">{user.name}</p>
                    <div className="flex items-center gap-1.5">{getRoleBadge(user.role)}</div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl py-2 border border-slate-200 z-50 animate-in fade-in zoom-in-95 duration-100"
                    onMouseLeave={() => setProfileDropdownOpen(false)}
                  >
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-sm font-bold text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      <p className="text-xs text-violet-600 font-semibold mt-1">
                        {user.instituteName || user.companyName || 'Verified Member'}
                      </p>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-xs font-semibold text-slate-700 hover:text-violet-600 px-3.5 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn-brand-primary text-xs font-bold px-4 py-2 rounded-xl"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex xl:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-1 max-h-[80vh] overflow-y-auto shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive ? 'bg-violet-50 text-violet-700 font-bold' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4 text-violet-600" />
                <span>{item.name}</span>
              </Link>
            );
          })}

          {isAuthenticated ? (
            <div className="pt-3 border-t border-slate-200">
              <div className="px-3 py-2">
                <p className="text-sm font-bold text-slate-900">{user.name}</p>
                <p className="text-xs text-slate-500">{user.email}</p>
                <div className="mt-1">{getRoleBadge(user.role)}</div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-lg"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2 text-slate-700 hover:bg-slate-100 rounded-lg text-sm font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-brand-primary text-center py-2.5 rounded-lg text-sm font-bold"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
