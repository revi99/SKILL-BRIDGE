import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import {
  FileText,
  UploadCloud,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Download,
  ExternalLink,
  PlusCircle,
  X,
  AlertCircle,
  Clock,
  Sparkles,
  Lock,
  Award,
  GraduationCap,
  Briefcase,
} from 'lucide-react';

const DOC_TYPES = [
  'Resume / CV',
  'Certification',
  'Internship Completion Report',
  'Academic Transcript / Marksheet',
  'Research Paper / Publication',
];

export default function DocumentVaultPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [verifyingId, setVerifyingId] = useState(null);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    type: 'Resume / CV',
    issuer: '',
    credentialId: '',
    fileName: '',
    fileSize: '1.2 MB',
  });

  const fetchDocuments = async () => {
    try {
      const res = await api.get('/documents/my');
      if (res.data.success) {
        setDocuments(res.data.documents);
      }
    } catch (err) {
      console.error('Failed to load documents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await api.post('/documents/upload', {
        ...formData,
        fileName: formData.fileName || `${formData.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
      });

      if (res.data.success) {
        setShowUploadModal(false);
        setFormData({
          title: '',
          type: 'Resume / CV',
          issuer: '',
          credentialId: '',
          fileName: '',
          fileSize: '1.2 MB',
        });
        fetchDocuments();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload document');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerify = async (id) => {
    setVerifyingId(id);
    try {
      const res = await api.put(`/documents/${id}/verify`);
      if (res.data.success) {
        setDocuments((prev) =>
          prev.map((d) => (d._id === id ? { ...d, verificationStatus: 'Verified (DigiLocker)' } : d))
        );
      }
    } catch (err) {
      alert('Verification failed');
    } finally {
      setVerifyingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this verified document?')) {
      try {
        await api.delete(`/documents/${id}`);
        setDocuments(documents.filter((d) => d._id !== id));
      } catch (err) {
        alert('Failed to delete document');
      }
    }
  };

  const filteredDocs =
    activeTab === 'All' ? documents : documents.filter((d) => d.type === activeTab);

  const getStatusBadge = (status) => {
    if (status.includes('DigiLocker')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>DigiLocker Verified</span>
        </span>
      );
    } else if (status.includes('Verified')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
          <span>{status}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
        <Clock className="w-3.5 h-3.5 text-amber-400" />
        <span>Pending Verification</span>
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
              <Lock className="w-3 h-3" /> Secure Credential Vault
            </span>
            <span className="text-xs text-emerald-400 font-mono">DigiLocker / NAD Compliant</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Verified Digital Portfolio & Document Vault
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Store, manage, and attach cryptographically verified transcripts, certifications, and internship reports to corporate applications.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-md shadow-indigo-600/25 transition-all hover:scale-105 shrink-0"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="glass-panel p-1.5 rounded-2xl border border-slate-800 flex flex-wrap gap-2">
        {['All', ...DOC_TYPES].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === tab
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Documents Grid */}
      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredDocs.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center space-y-3">
          <FileText className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No Documents in this Category</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Upload your resume, DigiLocker marksheet, or course completion certificate to share with corporate recruiters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredDocs.map((doc) => (
            <div
              key={doc._id}
              className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-indigo-500/30 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {doc.type}
                  </span>
                  {getStatusBadge(doc.verificationStatus)}
                </div>

                <h3 className="text-base font-bold text-white leading-snug">{doc.title}</h3>
                <p className="text-xs text-indigo-400 mt-1">Issued by: {doc.issuer}</p>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-2 font-mono">
                  <span>File: {doc.fileName}</span>
                  <span>•</span>
                  <span>Size: {doc.fileSize}</span>
                </div>

                {doc.credentialId && (
                  <p className="text-[11px] text-slate-500 font-mono mt-2 bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                    Credential ID: <strong className="text-slate-300">{doc.credentialId}</strong>
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                {doc.verificationStatus === 'Pending Verification' ? (
                  <button
                    onClick={() => handleVerify(doc._id)}
                    disabled={verifyingId === doc._id}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600 hover:text-white transition-colors border border-emerald-500/30 font-semibold"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{verifyingId === doc._id ? 'Verifying...' : 'Verify via DigiLocker'}</span>
                  </button>
                ) : (
                  <span className="text-slate-400 font-mono text-[11px]">
                    Hash: {doc.verificationHash?.substring(0, 14)}...
                  </span>
                )}

                <div className="flex items-center gap-2">
                  <a
                    href={doc.fileUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                    title="Download / View Document"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => handleDelete(doc._id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Delete Document"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="glass-panel max-w-lg w-full p-6 sm:p-8 rounded-3xl border border-slate-700 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Upload to Secure Vault</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleUpload} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AWS Certified Solutions Architect Certificate"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Document Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    {DOC_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Issuing Authority</label>
                  <input
                    type="text"
                    placeholder="e.g. Amazon Web Services / IIIT"
                    value={formData.issuer}
                    onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Credential / Registration ID (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. CERT-AWS-889421"
                  value={formData.credentialId}
                  onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="p-4 border-2 border-dashed border-slate-700 rounded-2xl bg-slate-900/50 text-center space-y-1">
                <UploadCloud className="w-8 h-8 text-indigo-400 mx-auto" />
                <p className="text-xs font-medium text-slate-300">Choose PDF / Document File</p>
                <p className="text-[10px] text-slate-500">Supports PDF, DOCX, PNG up to 15 MB</p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold shadow-md shadow-indigo-600/30"
                >
                  {submitting ? 'Saving...' : 'Upload & Verify'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
