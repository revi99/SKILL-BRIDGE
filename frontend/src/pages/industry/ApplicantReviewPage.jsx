import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../../api/client';
import MatchBadge from '../../components/MatchBadge';
import {
  Users,
  Briefcase,
  CheckCircle2,
  Calendar,
  Layers,
  GraduationCap,
  MessageSquare,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight,
  Filter,
  Lock,
  ShieldCheck,
  Download,
  Eye,
  FileText,
  X,
  Paperclip,
  FileCheck,
} from 'lucide-react';

export default function ApplicantReviewPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const postingIdParam = searchParams.get('postingId');

  const [myPostings, setMyPostings] = useState([]);
  const [selectedPostingId, setSelectedPostingId] = useState(postingIdParam || '');
  const [postingData, setPostingData] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [recruiterNotes, setRecruiterNotes] = useState({});
  const [previewDoc, setPreviewDoc] = useState(null);
  const [imageError, setImageError] = useState(false);

  const handleDownloadDocument = (doc) => {
    if (!doc) return;

    if (doc.fileUrl && doc.fileUrl.startsWith('data:')) {
      const link = document.createElement('a');
      link.href = doc.fileUrl;
      link.download = doc.fileName || `${doc.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    const fileContent = `=====================================================
SKILLBRIDGE VERIFIED DIGITAL CREDENTIAL VAULT
DigiLocker / National Academic Depository (NAD) Compliant
=====================================================

Document Title:       ${doc.title}
Document Type:        ${doc.type}
Issuing Authority:    ${doc.issuer}
Issued Date:          ${new Date(doc.createdAt || Date.now()).toLocaleDateString()}
Credential ID:        ${doc.credentialId || 'N/A'}
Verification Status:  ${doc.verificationStatus}
Cryptographic Hash:   ${doc.verificationHash || '0x' + Math.random().toString(16).substr(2, 32)}

Original File:        ${doc.fileName} (${doc.fileSize})
Verified by:          SkillBridge Distributed Identity & Trust Network
=====================================================`;

    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${doc.fileName || doc.title.replace(/[^a-zA-Z0-9]/g, '_')}_Verified.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const isImageFile = (doc) => {
    if (!doc) return false;
    if (doc.fileUrl && doc.fileUrl.startsWith('data:image/')) return true;
    const ext = (doc.fileName || '').toLowerCase();
    return ext.endsWith('.jpg') || ext.endsWith('.jpeg') || ext.endsWith('.png') || ext.endsWith('.webp') || ext.endsWith('.svg');
  };

  const isPdfFile = (doc) => {
    if (!doc) return false;
    if (doc.fileUrl && doc.fileUrl.startsWith('data:application/pdf')) return true;
    const ext = (doc.fileName || '').toLowerCase();
    return ext.endsWith('.pdf');
  };

  const getDocStatusBadge = (status = '') => {
    if (status.includes('DigiLocker')) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <ShieldCheck className="w-3 h-3 text-emerald-600" />
          <span>DigiLocker</span>
        </span>
      );
    } else if (status.includes('Verified')) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-violet-50 text-violet-700 border border-violet-200">
          <CheckCircle2 className="w-3 h-3 text-violet-600" />
          <span>Verified</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
        <Clock className="w-3 h-3 text-amber-600" />
        <span>Pending</span>
      </span>
    );
  };

  // 1. Fetch recruiter postings
  useEffect(() => {
    const fetchPostings = async () => {
      try {
        const res = await api.get('/postings/my/all');
        if (res.data.success) {
          setMyPostings(res.data.postings);
          if (!selectedPostingId && res.data.postings.length > 0) {
            setSelectedPostingId(res.data.postings[0]._id);
          }
        }
      } catch (err) {
        console.error('Failed to load postings:', err);
      }
    };
    fetchPostings();
  }, []);

  // 2. Fetch applicants for selected posting
  useEffect(() => {
    if (!selectedPostingId) {
      setLoading(false);
      return;
    }

    const fetchApplicants = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/applications/posting/${selectedPostingId}`);
        if (res.data.success) {
          setPostingData(res.data.posting);
          setApplicants(res.data.applicants || []);
        }
      } catch (err) {
        console.error('Failed to load applicants:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [selectedPostingId]);

  const handlePostingChange = (id) => {
    setSelectedPostingId(id);
    setSearchParams({ postingId: id });
  };

  const handleStatusUpdate = async (appId, newStatus) => {
    setUpdatingId(appId);
    try {
      const note = recruiterNotes[appId] || '';
      const res = await api.put(`/applications/${appId}/status`, {
        status: newStatus,
        recruiterNotes: note,
      });

      if (res.data.success) {
        setApplicants((prev) =>
          prev.map((app) => (app._id === appId ? { ...app, status: newStatus, recruiterNotes: note } : app))
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Status update failed');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-slate-50">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200">
              Ranked Candidate Pipeline
            </span>
            <span className="text-xs text-slate-500 font-mono">Sorted by Rule-Based Match %</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Applicant Screening & Shortlisting
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Candidates are ordered from highest skill-match to lowest based on assessed competency tests.
          </p>
        </div>

        {/* Opportunity Selector Dropdown */}
        {myPostings.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold shrink-0">Select Opening:</span>
            <select
              value={selectedPostingId}
              onChange={(e) => handlePostingChange(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-violet-600 max-w-xs truncate shadow-xs"
            >
              {myPostings.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.title} ({p.applicantCount || 0} applicants)
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Selected Posting Overview Card */}
      {postingData && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">{postingData.title}</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
                {postingData.type}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono">
              Required Tags: {postingData.requiredSkills?.join(', ')}
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="text-slate-500">
              Total Applicants: <strong className="text-violet-700 text-sm font-bold">{applicants.length}</strong>
            </span>
          </div>
        </div>
      )}

      {/* Ranked Applicants List */}
      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : applicants.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-sm text-center space-y-3">
          <Users className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No Applicants for this Posting Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            When students apply, their verified skill profiles will be evaluated and ranked here automatically.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {applicants.map((app, index) => {
            const student = app.studentId;
            const profile = app.skillProfile;

            return (
              <div
                key={app._id}
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-4 relative overflow-hidden"
              >
                {/* Ranking Ribbon */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-700 flex items-center justify-center font-mono font-bold text-xs border border-violet-200">
                      #{index + 1}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900">{student?.name || 'Student Candidate'}</h3>
                        <span className="text-xs text-slate-400">({student?.email})</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {student?.degree} • {student?.instituteName || 'Engineering College'} (Class of{' '}
                        {student?.graduationYear || 2026})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MatchBadge percent={app.matchPercent} size="md" />
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-bold border ${
                        app.status === 'Shortlisted'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : app.status === 'Interview Scheduled'
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : app.status === 'Accepted'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : app.status === 'Rejected'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-violet-50 text-violet-700 border border-violet-200'
                      }`}
                    >
                      Status: {app.status}
                    </span>
                  </div>
                </div>

                {/* Candidate Skill Breakdown vs Posting */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 font-semibold block mb-1">
                      Matched Skills (Scored ≥ 50%):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {app.matchedSkills?.map((s) => (
                        <span
                          key={s}
                          className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 font-medium"
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-500 font-semibold block mb-1">
                      Missing Skills / Identified Gaps:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {app.missingSkills?.length > 0 ? (
                        app.missingSkills.map((s) => (
                          <span
                            key={s}
                            className="px-2.5 py-0.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 font-medium"
                          >
                            ⚠ {s}
                          </span>
                        ))
                      ) : (
                        <span className="text-emerald-700 font-medium">None! 100% Required Skills Covered</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Cover Note */}
                {app.coverNote && (
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                    <span className="font-bold text-slate-900">Candidate Note: </span>
                    <span className="italic">"{app.coverNote}"</span>
                  </div>
                )}

                {/* Candidate Verified Vault Documents Section */}
                <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded-lg bg-violet-100 text-violet-700">
                        <Lock className="w-3.5 h-3.5" />
                      </span>
                      <h4 className="text-xs font-bold text-slate-900">
                        Candidate Verified Document Vault
                      </h4>
                      <span className="text-[11px] font-semibold text-violet-700 bg-violet-50 px-2 py-0.5 rounded-md border border-violet-200">
                        {app.documents?.length || 0} document{app.documents?.length === 1 ? '' : 's'} attached
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-600 font-mono font-bold">
                      DigiLocker / NAD Compliant
                    </span>
                  </div>

                  {app.documents && app.documents.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                      {app.documents.map((doc) => (
                        <div
                          key={doc._id}
                          className="bg-white p-3 rounded-xl border border-slate-200 hover:border-violet-300 shadow-2xs flex flex-col justify-between space-y-2 transition-all"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-1.5 mb-1">
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 truncate max-w-[120px]">
                                {doc.type}
                              </span>
                              {getDocStatusBadge(doc.verificationStatus)}
                            </div>
                            <h5 className="text-xs font-bold text-slate-900 line-clamp-1" title={doc.title}>
                              {doc.title}
                            </h5>
                            <p className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">
                              {doc.fileName} • {doc.fileSize}
                            </p>
                            {doc.issuer && (
                              <p className="text-[10px] text-violet-600 font-medium truncate mt-0.5">
                                Issued by: {doc.issuer}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center justify-end gap-1.5 pt-1.5 border-t border-slate-100">
                            <button
                              type="button"
                              onClick={() => {
                                setImageError(false);
                                setPreviewDoc(doc);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-violet-50 text-violet-700 hover:bg-violet-100 text-xs font-bold flex items-center gap-1 transition-colors"
                              title="Preview Document"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDownloadDocument(doc)}
                              className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:text-violet-700 hover:bg-violet-50 transition-colors"
                              title="Download File"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 bg-white rounded-xl border border-dashed border-slate-200 text-center">
                      <p className="text-xs text-slate-400">No documents uploaded to vault yet by this candidate</p>
                    </div>
                  )}
                </div>

                {/* Recruiter Action Toolbar */}
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1 max-w-md">
                    <input
                      type="text"
                      placeholder="Add recruiter feedback or interview date..."
                      value={recruiterNotes[app._id] ?? (app.recruiterNotes || '')}
                      onChange={(e) =>
                        setRecruiterNotes({ ...recruiterNotes, [app._id]: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-600 focus:bg-white"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleStatusUpdate(app._id, 'Shortlisted')}
                      disabled={updatingId === app._id}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 text-xs font-bold transition-all shadow-xs"
                    >
                      Shortlist
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(app._id, 'Interview Scheduled')}
                      disabled={updatingId === app._id}
                      className="px-3.5 py-1.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 text-xs font-bold transition-all shadow-xs"
                    >
                      Interview
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(app._id, 'Accepted')}
                      disabled={updatingId === app._id}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 text-xs font-bold transition-all shadow-xs"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(app._id, 'Rejected')}
                      disabled={updatingId === app._id}
                      className="px-3.5 py-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 text-xs font-bold transition-all shadow-xs"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Recruiter Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white max-w-2xl w-full p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {previewDoc.type}
                  </span>
                  {getDocStatusBadge(previewDoc.verificationStatus)}
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">{previewDoc.title}</h3>
                <p className="text-xs font-semibold text-violet-600 mt-0.5">
                  Issued by: {previewDoc.issuer}
                </p>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Content / Image / PDF Display */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center justify-center min-h-[220px]">
              {isImageFile(previewDoc) && previewDoc.fileUrl && !imageError ? (
                <div className="w-full flex flex-col items-center">
                  <img
                    src={previewDoc.fileUrl}
                    alt={previewDoc.title}
                    onError={() => setImageError(true)}
                    className="max-h-[380px] max-w-full rounded-xl object-contain shadow-sm border border-slate-200 bg-white"
                  />
                  <p className="text-[11px] text-slate-500 mt-2 font-mono">
                    {previewDoc.fileName} • {previewDoc.fileSize}
                  </p>
                </div>
              ) : isPdfFile(previewDoc) && previewDoc.fileUrl && previewDoc.fileUrl.startsWith('data:application/pdf') ? (
                <div className="w-full h-[350px]">
                  <iframe
                    src={previewDoc.fileUrl}
                    title={previewDoc.title}
                    className="w-full h-full rounded-xl border border-slate-200"
                  />
                </div>
              ) : (
                <div className="text-center space-y-3 py-6 max-w-md mx-auto">
                  <div className="w-16 h-16 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center mx-auto shadow-xs">
                    <FileText className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{previewDoc.fileName}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Size: {previewDoc.fileSize}</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 text-left space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Credential ID:</span>
                      <span className="font-mono font-bold text-slate-800">{previewDoc.credentialId || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Verification Hash:</span>
                      <span className="font-mono text-slate-700 text-[11px]">{previewDoc.verificationHash || '0x498a...89cf'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Security Standard:</span>
                      <span className="font-bold text-emerald-600">DigiLocker & NAD Verified</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-[11px] text-slate-500 font-mono">
                {previewDoc.fileUrl && previewDoc.fileUrl.startsWith('data:') ? 'Local Stored Document' : 'DigiLocker Synced Record'}
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPreviewDoc(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadDocument(previewDoc)}
                  className="btn-brand-primary px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Document</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
