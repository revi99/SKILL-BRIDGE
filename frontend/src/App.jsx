import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import DemoBar from './components/DemoBar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OpportunitiesPage from './pages/student/OpportunitiesPage';
import CollaborationsBrowse from './pages/industry/CollaborationsBrowse';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import AssessmentPage from './pages/student/AssessmentPage';
import SkillProfilePage from './pages/student/SkillProfilePage';
import MyApplicationsPage from './pages/student/MyApplicationsPage';
import DocumentVaultPage from './pages/student/DocumentVaultPage';

// Industry Pages
import IndustryDashboard from './pages/industry/IndustryDashboard';
import PostingsManager from './pages/industry/PostingsManager';
import ApplicantReviewPage from './pages/industry/ApplicantReviewPage';

// Academician Pages
import AcademicianDashboard from './pages/academician/AcademicianDashboard';
import CollaborationManager from './pages/academician/CollaborationManager';
import StudentCohortView from './pages/academician/StudentCohortView';

// Enterprise Collaboration & Integrations Pages
import MentorshipHubPage from './pages/collaboration/MentorshipHubPage';
import LiveProjectsPage from './pages/collaboration/LiveProjectsPage';
import IntegrationsHubPage from './pages/integrations/IntegrationsHubPage';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* 1-Click Instant 3-Role Switcher Banner */}
      <DemoBar />

      {/* Main Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/opportunities" element={<OpportunitiesPage />} />
          <Route path="/collaborations" element={<CollaborationsBrowse />} />
          <Route path="/mentorship" element={<MentorshipHubPage />} />
          <Route path="/projects" element={<LiveProjectsPage />} />
          <Route path="/integrations" element={<IntegrationsHubPage />} />

          {/* Student Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['student']} />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/assessment" element={<AssessmentPage />} />
            <Route path="/student/profile" element={<SkillProfilePage />} />
            <Route path="/student/opportunities" element={<OpportunitiesPage />} />
            <Route path="/student/applications" element={<MyApplicationsPage />} />
            <Route path="/student/vault" element={<DocumentVaultPage />} />
          </Route>

          {/* Industry Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['industry']} />}>
            <Route path="/industry/dashboard" element={<IndustryDashboard />} />
            <Route path="/industry/postings" element={<PostingsManager />} />
            <Route path="/industry/applicants" element={<ApplicantReviewPage />} />
            <Route path="/industry/collaborations" element={<CollaborationsBrowse />} />
          </Route>

          {/* Academician Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['academician']} />}>
            <Route path="/academician/dashboard" element={<AcademicianDashboard />} />
            <Route path="/academician/analytics" element={<AcademicianDashboard />} />
            <Route path="/academician/collaborations" element={<CollaborationManager />} />
            <Route path="/academician/cohort" element={<StudentCohortView />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
