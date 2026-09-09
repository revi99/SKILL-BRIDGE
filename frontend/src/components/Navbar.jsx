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
      { name: 'Take Assessment', path: '/student/assessment', icon: Award },
      { name: 'Skill Profile', path: '/student/profile', icon: Layers },
      { name: 'Opportunities', path: '/student/opportunities', icon: Briefcase },
      { name: 'Document Vault', path: '/student/vault', icon: Lock },
      { name: 'Mentorship', path: '/mentorship', icon: Users },
      { name: 'Live Projects', path: '/projects', icon: FolderGit2 },
      { name: 'My Applications', path: '/student/applications', icon: FileCheck },
    ];
  } else if (user?.role === 'industry') {
    navItems = [
      { name: 'Dashboard', path: '/industry/dashboard', icon: Compass },
      { name: 'Postings Manager', path: '/industry/postings', icon: Briefcase },
      { name: 'Review Applicants', path: '/industry/applicants', icon: FileCheck },
      { name: 'Live Projects', path: '/projects', icon: FolderGit2 },
      { name: 'Mentorship', path: '/mentorship', icon: Users },
      { name: 'Academic Collaborations', path: '/industry/collaborations', icon: GraduationCap },
    ];
  } else if (user?.role === 'academician') {
    navItems = [
      { name: 'Dashboard & Gap Analytics', path: '/academician/dashboard', icon: BarChart3 },
      { name: 'Policy & NIRF Analytics', path: '/institution/analytics', icon: Award },
      { name: 'Collaboration Proposals', path: '/academician/collaborations', icon: GraduationCap },
      { name: 'Student Cohort', path: '/academician/cohort', icon: User },
      { name: 'Platform Integrations', path: '/integrations', icon: Zap },
    ];
  } else {
    navItems = [
      { name: 'Explore Opportunities', path: '/opportunities', icon: Briefcase },
      { name: 'Live Projects', path: '/projects', icon: FolderGit2 },
      { name: 'Industry Mentorship', path: '/mentorship', icon: Users },
      { name: 'Integrations', path: '/integrations', icon: Zap },
      { name: 'Policy Analytics', path: '/institution/analytics', icon: BarChart3 },
    ];
  }

  const getRoleBadge = (role) => {
    switch (role) {
      case 'student':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#71C9CE]/15 text-[#A6E3E9] border border-[#71C9CE]/30">
            <User className="w-3 h-3" /> Student
          </span>
        );
      case 'industry':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#A6E3E9]/15 text-[#CBF1F5] border border-[#A6E3E9]/30">
            <Building2 className="w-3 h-3" /> Industry Partner
          </span>
        );
      case 'academician':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#CBF1F5]/15 text-[#E3FDFD] border border-[#CBF1F5]/30">
            <GraduationCap className="w-3 h-3" /> Academician / Dean
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <nav className="glass-panel sticky top-[33px] z-40 border-b border-[#71C9CE]/20 bg-[#0a1b20]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#71C9CE] via-[#A6E3E9] to-[#CBF1F5] flex items-center justify-center shadow-lg shadow-[#71C9CE]/25 group-hover:scale-105 transition-transform text-[#08181c]">
                <Sparkles className="w-5 h-5 text-[#08181c]" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-extrabold tracking-tight text-white flex items-center gap-1">
                  Skill<span className="text-[#71C9CE]">Bridge</span>
                  <span className="text-[10px] uppercase tracking-widest font-mono bg-[#71C9CE]/20 text-[#CBF1F5] px-1.5 py-0.2 rounded ml-1 border border-[#71C9CE]/30 hidden sm:inline">
                    PRO
                  </span>
                </span>
                <span className="text-[10px] text-[#A6E3E9]/80 -mt-1 hidden lg:block">Academia–Industry Collaboration</span>
              </div>
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
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-[#71C9CE]/20 text-[#E3FDFD] border border-[#71C9CE]/40 shadow-sm shadow-[#71C9CE]/10 font-bold'
                        : 'text-[#CBF1F5]/80 hover:text-white hover:bg-[#14323a]/60'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#71C9CE]' : 'text-[#A6E3E9]/70'}`} />
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
                  className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-[#122e37] transition-colors border border-transparent hover:border-[#71C9CE]/30"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#71C9CE] to-[#A6E3E9] flex items-center justify-center text-[#08181c] font-bold text-sm shadow-md">
                    {user.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <div className="text-left hidden md:block">
                    <p className="text-xs font-semibold text-[#E3FDFD] line-clamp-1">{user.name}</p>
                    <div className="flex items-center gap-1.5">{getRoleBadge(user.role)}</div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-[#A6E3E9]" />
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 glass-panel bg-[#0d2228] rounded-xl shadow-2xl py-2 border border-[#71C9CE]/30 z-50 animate-in fade-in zoom-in-95 duration-100"
                    onMouseLeave={() => setProfileDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-[#71C9CE]/20">
                      <p className="text-sm font-semibold text-white">{user.name}</p>
                      <p className="text-xs text-[#CBF1F5]/80 truncate">{user.email}</p>
                      <p className="text-xs text-[#71C9CE] font-medium mt-1">
                        {user.instituteName || user.companyName || 'Member'}
                      </p>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
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
                  className="text-xs font-medium text-[#CBF1F5] hover:text-white px-3 py-1.5 rounded-lg hover:bg-[#122e37] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-xs font-bold bg-gradient-to-r from-[#71C9CE] to-[#A6E3E9] text-[#08181c] hover:brightness-110 px-3.5 py-1.5 rounded-lg shadow-md shadow-[#71C9CE]/25 transition-all"
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
              className="p-2 rounded-lg text-[#A6E3E9] hover:text-white hover:bg-[#122e37] focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden glass-panel bg-[#091b20] border-b border-[#71C9CE]/30 px-4 pt-2 pb-4 space-y-1 max-h-[80vh] overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive ? 'bg-[#71C9CE]/20 text-[#E3FDFD]' : 'text-[#CBF1F5] hover:bg-[#122e37]'
                }`}
              >
                <Icon className="w-4 h-4 text-[#71C9CE]" />
                <span>{item.name}</span>
              </Link>
            );
          })}

          {isAuthenticated ? (
            <div className="pt-3 border-t border-[#71C9CE]/20">
              <div className="px-3 py-2">
                <p className="text-sm font-bold text-white">{user.name}</p>
                <p className="text-xs text-[#CBF1F5]">{user.email}</p>
                <div className="mt-1">{getRoleBadge(user.role)}</div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-[#71C9CE]/20 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2 text-[#CBF1F5] hover:bg-[#122e37] rounded-lg text-sm font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2 bg-[#71C9CE] text-[#08181c] font-bold rounded-lg text-sm"
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
