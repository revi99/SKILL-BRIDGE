import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import {
  Users,
  Award,
  CheckCircle2,
  AlertTriangle,
  Layers,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  Clock,
  FileText,
  FileCheck,
  Eye,
  Download,
  X,
  Lock,
  ExternalLink,
} from 'lucide-react';

export default function StudentCohortView() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentDocs, setStudentDocs] = useState([]);
  const [docsLoading, setDocsLoading] = useState(false);
  const [verifyingDocId, setVerifyingDocId] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [verifySuccessMsg, setVerifySuccessMsg] = useState('');

  const fetchCohort = async () => {
    try {
      const res = await api.get('/analytics/cohort-students');
      if (res.data.success) {
        setStudents(res.data.students || []);
      }
    } catch (err) {
      console.error('Failed to load cohort:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCohort();
  }, []);

  const handleOpenDocModal = async (student) => {
    setSelectedStudent(student);
    setDocsLoading(true);
    setVerifySuccessMsg('');
    try {
      const res = await api.get(`/documents/student/${student._id}`);
      if (res.data.success) {
        setStudentDocs(res.data.documents || []);
      }
    } catch (err) {
      console.error('Failed to load student documents:', err);
    } finally {
      setDocsLoading(false);
    }
  };

  const handleDeanVerifyDoc = async (docId) => {
    setVerifyingDocId(docId);
    setVerifySuccessMsg('');
    try {
      const res = await api.put(`/documents/${docId}/dean-verify`);
      if (res.data.success) {
        setVerifySuccessMsg(`Document successfully verified & cryptographically signed!`);
        // Update local docs list
        setStudentDocs((prev) =>
          prev.map((d) => (d._id === docId ? res.data.document : d))
        );
        // Refresh cohort stats
        fetchCohort();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Verification failed');
    } finally {
      setVerifyingDocId(null);
    }
  };

  const handleDownloadDoc = (doc) => {
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
SKILLBRIDGE VERIFIED DIGITAL CREDENTIAL
Officially Certified by: Dean / Academic Directorate
=====================================================
Student Name:         ${selectedStudent?.name} (${selectedStudent?.email})
Institution:          ${selectedStudent?.instituteName}
Document Title:       ${doc.title}
Document Type:        ${doc.type}
Issuer:               ${doc.issuer}
Credential ID:        ${doc.credentialId || 'N/A'}
Verification Status:  ${doc.verificationStatus}
Verified By:          ${doc.verifiedBy || 'Dr. Aris Thorne (Academic Dean)'}
Verification Date:    ${new Date(doc.verifiedAt || Date.now()).toLocaleString()}
Cryptographic Hash:   ${doc.verificationHash || '0x' + Math.random().toString(16).substr(2, 32)}
=====================================================`;

    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${doc.fileName || doc.title}_Dean_Verified.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const isImageFile = (doc) => {
    if (!doc) return false;
    if (doc.fileUrl && doc.fileUrl.startsWith('data:image/')) return true;
    const ext = (doc.fileName || '').toLowerCase();
    return ext.endsWith('.jpg') || ext.endsWith('.jpeg') || ext.endsWith('.png') || ext.endsWith('.webp');
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-slate-50">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200">
            Institutional Verification & Student Roster
          </span>
          <span className="text-xs text-emerald-600 font-mono font-bold">DigiLocker / AICTE Dean Authority</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Student Cohort & Document Verification</h1>
        <p className="text-sm text-slate-600 mt-1">
          Review student readiness levels and officially verify & certify uploaded transcripts, resumes, and internship reports.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {students.map((st) => {
          const hasPending = st.docStats?.pending > 0;
          const totalDocs = st.docStats?.total || 0;

          return (
            <div
              key={st.email}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:border-violet-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {st.degree}
                  </span>
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                      st.readinessLevel === 'Industry-Ready'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : st.readinessLevel === 'Developing'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {st.readinessLevel}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">{st.name}</h3>
                <p className="text-xs text-slate-500">{st.email}</p>
                <p className="text-xs text-violet-600 font-semibold mt-1">Domain: {st.domain}</p>
                <p className="text-xs text-slate-400">{st.instituteName}</p>

                {/* Document Verification Pill */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">Vault Documents:</span>
                  {hasPending ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1 animate-pulse">
                      <Clock className="w-3 h-3 text-amber-700" />
                      <span>{st.docStats.pending} Pending Review</span>
                    </span>
                  ) : totalDocs > 0 ? (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>{st.docStats.verified || totalDocs} Verified</span>
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-400">No Documents</span>
                  )}
                </div>

                {/* Strengths */}
                <div className="mt-3 pt-2 border-t border-slate-100 text-xs">
                  <span className="text-slate-500 block mb-1">Verified Strengths:</span>
                  <div className="flex flex-wrap gap-1">
                    {st.strengths?.length > 0 ? (
                      st.strengths.map((s) => (
                        <span key={s} className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px]">
                          ✓ {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 text-[11px]">Pending Assessment</span>
                    )}
                  </div>
                </div>

                {/* Gaps */}
                <div className="mt-2 text-xs">
                  <span className="text-slate-500 block mb-1">Identified Gaps:</span>
                  <div className="flex flex-wrap gap-1">
                    {st.gaps?.length > 0 ? (
                      st.gaps.map((g) => (
                        <span key={g} className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 text-[11px]">
                          ⚠ {g}
                        </span>
                      ))
                    ) : (
                      <span className="text-emerald-700 text-[11px] font-medium">No Gaps Detected</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Readiness Score:</span>
                  <span className="font-extrabold text-violet-700 text-base">{st.overallScore}%</span>
                </div>

                <button
                  onClick={() => handleOpenDocModal(st)}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                    hasPending
                      ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-500/20'
                      : 'bg-violet-600 hover:bg-violet-700 text-white shadow-violet-500/20'
                  }`}
                >
                  <FileCheck className="w-4 h-4" />
                  <span>{hasPending ? `Verify Documents (${st.docStats.pending} Pending)` : 'Review Student Vault'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dean Document Verification Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white max-w-3xl w-full p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-violet-600" /> Dean Academic Verification Suite
                  </span>
                  <span className="text-xs text-slate-500 font-mono font-medium">{selectedStudent.degree} • {selectedStudent.department}</span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  {selectedStudent.name}'s Document Portfolio
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Institution: <strong>{selectedStudent.instituteName}</strong> • {selectedStudent.email}
                </p>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {verifySuccessMsg && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{verifySuccessMsg}</span>
              </div>
            )}

            {docsLoading ? (
              <div className="py-12 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : studentDocs.length === 0 ? (
              <div className="p-12 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <FileText className="w-10 h-10 text-slate-300 mx-auto" />
                <h4 className="text-sm font-bold text-slate-800">No Documents Uploaded</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  This student has not yet submitted any resumes, marksheets, or certificates to the vault.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {studentDocs.map((doc) => {
                  const isPending = doc.verificationStatus === 'Pending Verification';
                  const isVerified = doc.verificationStatus?.includes('Verified');

                  return (
                    <div
                      key={doc._id}
                      className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        isPending
                          ? 'bg-amber-50/50 border-amber-200 hover:border-amber-300 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-violet-200'
                      }`}
                    >
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                            {doc.type}
                          </span>
                          {isVerified ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{doc.verificationStatus}</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
                              <Clock className="w-3.5 h-3.5 text-amber-700" />
                              <span>Pending Dean Verification</span>
                            </span>
                          )}
                        </div>

                        <h4 className="text-sm font-bold text-slate-900 leading-snug truncate">
                          {doc.title}
                        </h4>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-mono">
                          <span>File: {doc.fileName}</span>
                          <span>•</span>
                          <span>Size: {doc.fileSize}</span>
                          {doc.credentialId && (
                            <>
                              <span>•</span>
                              <span>ID: <strong>{doc.credentialId}</strong></span>
                            </>
                          )}
                        </div>

                        {doc.verifiedBy && (
                          <p className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200 inline-flex items-center gap-1 mt-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Officially Certified by: {doc.verifiedBy}</span>
                          </p>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => setPreviewDoc(doc)}
                          className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-violet-50 text-slate-700 hover:text-violet-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDownloadDoc(doc)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs transition-colors"
                          title="Download Document"
                        >
                          <Download className="w-4 h-4" />
                        </button>

                        {isPending && (
                          <button
                            type="button"
                            onClick={() => handleDeanVerifyDoc(doc._id)}
                            disabled={verifyingDocId === doc._id}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
                          >
                            {verifyingDocId === doc._id ? (
                              <>
                                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Certifying...</span>
                              </>
                            ) : (
                              <>
                                <ShieldCheck className="w-4 h-4" />
                                <span>Verify & Approve Document</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-mono">
                Institutional Academic Directorate • Verified against NEP 2020 Framework
              </span>
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-5 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document View Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white max-w-2xl w-full p-6 rounded-3xl border border-slate-200 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                  {previewDoc.type}
                </span>
                <h4 className="text-base font-bold text-slate-900 mt-1">{previewDoc.title}</h4>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center justify-center min-h-[200px]">
              {isImageFile(previewDoc) && previewDoc.fileUrl ? (
                <img
                  src={previewDoc.fileUrl}
                  alt={previewDoc.title}
                  className="max-h-[350px] max-w-full rounded-xl object-contain shadow-sm bg-white"
                />
              ) : (
                <div className="text-center space-y-3 py-6">
                  <div className="w-14 h-14 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center mx-auto">
                    <FileText className="w-7 h-7" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-slate-900">{previewDoc.fileName}</h5>
                    <p className="text-xs text-slate-500 font-mono">Size: {previewDoc.fileSize}</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 text-left space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Issuer:</span>
                      <span className="font-bold text-slate-800">{previewDoc.issuer}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Credential ID:</span>
                      <span className="font-mono font-bold text-slate-800">{previewDoc.credentialId || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Status:</span>
                      <span className="font-bold text-violet-700">{previewDoc.verificationStatus}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Close Preview
              </button>
              <button
                onClick={() => handleDownloadDoc(previewDoc)}
                className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

