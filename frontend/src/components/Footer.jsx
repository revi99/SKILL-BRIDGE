import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Code2, Database, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-[#71C9CE]/20 bg-[#061215] text-[#CBF1F5]/70 text-sm mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#71C9CE] flex items-center justify-center text-[#061519] font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Skill<span className="text-[#71C9CE]">Bridge</span>
              </span>
              <span className="text-xs bg-[#71C9CE]/20 text-[#CBF1F5] font-mono px-2 py-0.5 rounded border border-[#71C9CE]/30">
                Enterprise Suite
              </span>
            </div>
            <p className="text-[#CBF1F5]/80 text-xs sm:text-sm max-w-md leading-relaxed">
              Academia–Industry Collaboration Portal bridging higher education curriculums and corporate hiring demands through data-driven skill profiling, document vault, mentorship, live capstones, and institutional analytics.
            </p>
            <div className="flex items-center gap-3 mt-4 text-xs font-mono text-[#A6E3E9]">
              <span className="flex items-center gap-1"><Database className="w-3.5 h-3.5 text-[#71C9CE]" /> MongoDB</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Code2 className="w-3.5 h-3.5 text-[#A6E3E9]" /> React 19 + Vite</span>
              <span>•</span>
              <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-[#CBF1F5]" /> JWT Auth</span>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Platform Portals</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/student/assessment" className="hover:text-[#71C9CE] transition-colors">Student Skill Assessment</Link></li>
              <li><Link to="/student/vault" className="hover:text-[#71C9CE] transition-colors">Verified Document Vault</Link></li>
              <li><Link to="/mentorship" className="hover:text-[#71C9CE] transition-colors">Industry Mentorship Hub</Link></li>
              <li><Link to="/projects" className="hover:text-[#71C9CE] transition-colors">Live Corporate Projects</Link></li>
              <li><Link to="/institution/analytics" className="hover:text-[#71C9CE] transition-colors">Policy & NIRF Analytics</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Enterprise Suite</h4>
            <ul className="space-y-2 text-xs text-[#CBF1F5]/70">
              <li>• Rule-based Skill Gap Scoring</li>
              <li>• DigiLocker & NAD Verified Credentials</li>
              <li>• 1-on-1 Industry Video Mentorship</li>
              <li>• Regional Skill Deficit Heatmaps</li>
              <li>• Automated NIRF Audit Reports</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#71C9CE]/15 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A6E3E9]/60">
          <p>© 2026 SkillBridge. Academia–Industry Collaboration Enterprise Portal.</p>
          <div className="flex items-center gap-1 text-[#CBF1F5]">
            <span>Engineered with MERN Stack • Palette: #E3FDFD, #CBF1F5, #A6E3E9, #71C9CE</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
