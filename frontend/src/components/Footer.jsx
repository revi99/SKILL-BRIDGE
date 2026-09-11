import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Code2, Database, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600 text-sm mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-3">
              <img
                src="/skillbridge-logo.png"
                alt="SkillBridge Logo"
                className="h-8 w-auto object-contain"
              />
              <span className="text-xs bg-blue-50 text-blue-700 font-semibold font-mono px-2 py-0.5 rounded-full border border-blue-200">
                Enterprise Production
              </span>
            </div>
            <p className="text-slate-500 text-xs sm:text-sm max-w-md leading-relaxed">
              Academia–Industry Collaboration Platform bridging higher education curriculums and corporate hiring demands through verified skill profiling, DigiLocker credentials, industry mentorship, and institutional policy analytics.
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5 font-medium"><Database className="w-3.5 h-3.5 text-violet-600" /> MongoDB Atlas</span>
              <span>•</span>
              <span className="flex items-center gap-1.5 font-medium"><Code2 className="w-3.5 h-3.5 text-indigo-600" /> React 19 + Vite</span>
              <span>•</span>
              <span className="flex items-center gap-1.5 font-medium text-emerald-600"><CheckCircle2 className="w-3.5 h-3.5" /> Production Ready</span>
            </div>
          </div>

          <div>
            <h4 className="text-slate-900 font-bold text-sm mb-3">Platform Portals</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/student/assessment" className="hover:text-violet-600 transition-colors">Student Skill Assessment</Link></li>
              <li><Link to="/student/vault" className="hover:text-violet-600 transition-colors">Verified Document Vault</Link></li>
              <li><Link to="/mentorship" className="hover:text-violet-600 transition-colors">Industry Mentorship Hub</Link></li>
              <li><Link to="/academician/dashboard" className="hover:text-violet-600 transition-colors">Faculty & Dean Portal</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 font-bold text-sm mb-3">Enterprise Core Features</h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-violet-600"></span> Rule-based Skill Gap Scoring</li>
              <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-violet-600"></span> DigiLocker & NAD Verified Credentials</li>
              <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-violet-600"></span> 1-on-1 Industry Video Mentorship</li>
              <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-violet-600"></span> Regional Skill Deficit Heatmaps</li>
              <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-violet-600"></span> Automated NIRF Compliance Reports</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 SkillBridge Inc. All rights reserved. Academia–Industry Collaboration Platform.</p>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              System Status: 100% Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
