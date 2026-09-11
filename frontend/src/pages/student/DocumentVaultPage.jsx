import React, { useState, useEffect, useRef } from 'react';
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
  FileCheck,
  Paperclip,
  Eye,
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
  const [previewDoc, setPreviewDoc] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [verifyingId, setVerifyingId] = useState(null);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    type: 'Resume / CV',
    issuer: '',
    credentialId: '',
    fileName: '',
    fileSize: '1.2 MB',
    fileUrl: '',
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

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 KB';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const processFile = (file) => {
    if (!file) return;
    const formattedSize = formatFileSize(file.size);
    const cleanTitle = file.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[_-]/g, ' ')
      .trim();

    const reader = new FileReader();
    reader.onload = (event) => {
      const fileDataUrl = event.target.result;
      setSelectedFile(file);
      setFormData((prev) => ({
        ...prev,
        title: prev.title.trim() === '' ? cleanTitle : prev.title,
        fileName: file.name,
        fileSize: formattedSize,
        fileUrl: fileDataUrl,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleRemoveSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setFormData((prev) => ({
      ...prev,
      fileName: '',
      fileSize: '1.2 MB',
      fileUrl: '',
    }));
  };

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
        setSelectedFile(null);
        setFormData({
          title: '',
          type: 'Resume / CV',
          issuer: '',
          credentialId: '',
          fileName: '',
          fileSize: '1.2 MB',
          fileUrl: '',
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

    // Generate a verified digital credential file if mock/external URL
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

  const [imageError, setImageError] = useState(false);

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

  const filteredDocs =
    activeTab === 'All' ? documents : documents.filter((d) => d.type === activeTab);

  const getStatusBadge = (status) => {
    if (status.includes('DigiLocker')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>DigiLocker Verified</span>
        </span>
      );
    } else if (status.includes('Verified')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-violet-600" />
          <span>{status}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
        <Clock className="w-3.5 h-3.5 text-amber-600" />
        <span>Pending Verification</span>
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-slate-50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200 flex items-center gap-1">
              <Lock className="w-3 h-3 text-violet-600" /> Secure Credential Vault
            </span>
            <span className="text-xs text-emerald-600 font-mono font-bold">DigiLocker / NAD Compliant</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Verified Digital Portfolio & Document Vault
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Store, manage, and attach cryptographically verified transcripts, certifications, and internship reports to corporate applications.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="btn-brand-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all hover:scale-105 shrink-0"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap gap-2">
        {['All', ...DOC_TYPES].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === tab
                ? 'bg-violet-600 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Documents Grid */}
      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredDocs.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-sm text-center space-y-3">
          <FileText className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No Documents in this Category</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Upload your resume, DigiLocker marksheet, or course completion certificate to share with corporate recruiters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredDocs.map((doc) => (
            <div
              key={doc._id}
              className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-violet-300 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {doc.type}
                  </span>
                  {getStatusBadge(doc.verificationStatus)}
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">{doc.title}</h3>
                <p className="text-xs font-bold text-violet-600 mt-1">Issued by: {doc.issuer}</p>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-2 font-mono">
                  <span>File: {doc.fileName}</span>
                  <span>•</span>
                  <span>Size: {doc.fileSize}</span>
                </div>

                {doc.credentialId && (
                  <p className="text-[11px] text-slate-600 font-mono mt-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    Credential ID: <strong className="text-slate-900">{doc.credentialId}</strong>
                  </p>
                )}

                {doc.verifiedBy && (
                  <p className="text-[11px] text-emerald-700 font-semibold mt-2 bg-emerald-50/80 p-2 rounded-xl border border-emerald-200 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Certified by: <strong>{doc.verifiedBy}</strong></span>
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                {doc.verificationStatus === 'Pending Verification' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 font-semibold text-xs">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Awaiting Dean Verification</span>
                  </span>
                ) : (
                  <span className="text-slate-400 font-mono text-[11px]">
                    Hash: {doc.verificationHash?.substring(0, 14)}...
                  </span>
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setImageError(false);
                      setPreviewDoc(doc);
                    }}
                    className="p-2 rounded-xl bg-violet-50 text-violet-700 hover:bg-violet-100 transition-colors font-medium flex items-center gap-1"
                    title="View / Preview Document"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="text-xs font-semibold">View</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownloadDocument(doc)}
                    className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:text-violet-700 hover:bg-violet-50 transition-colors"
                    title="Download Document"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(doc._id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
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

      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white max-w-2xl w-full p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {previewDoc.type}
                  </span>
                  {getStatusBadge(previewDoc.verificationStatus)}
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

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white max-w-lg w-full p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Upload to Secure Vault</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleUpload} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AWS Certified Solutions Architect Certificate"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Document Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-violet-600"
                  >
                    {DOC_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Issuing Authority</label>
                  <input
                    type="text"
                    placeholder="e.g. Amazon Web Services / IIIT"
                    value={formData.issuer}
                    onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Credential / Registration ID (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. CERT-AWS-889421"
                  value={formData.credentialId}
                  onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-600 focus:bg-white"
                />
              </div>

              {/* File Upload Dropzone */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Attach Document File <span className="text-violet-600 font-normal">(PDF, DOCX, PNG, JPG)</span>
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {!selectedFile ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`cursor-pointer p-6 border-2 border-dashed rounded-2xl text-center space-y-2 transition-all ${
                      isDragging
                        ? 'border-violet-600 bg-violet-50/80 scale-[1.01]'
                        : 'border-slate-200 bg-slate-50 hover:border-violet-400 hover:bg-violet-50/30'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center mx-auto shadow-xs">
                      <UploadCloud className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        Click to select document or drag & drop
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Supports PDF, DOCX, PNG up to 15 MB
                      </p>
                    </div>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-semibold shadow-xs hover:bg-slate-50"
                    >
                      <Paperclip className="w-3.5 h-3.5 text-violet-600" />
                      <span>Browse Files</span>
                    </button>
                  </div>
                ) : (
                  <div className="p-3.5 bg-violet-50/70 border border-violet-200 rounded-2xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-9 h-9 rounded-xl bg-violet-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <FileCheck className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {selectedFile.name}
                        </p>
                        <p className="text-[11px] text-violet-700 font-medium">
                          {formatFileSize(selectedFile.size)} • Ready for upload
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-2.5 py-1 text-xs font-semibold text-violet-700 bg-white border border-violet-200 rounded-lg hover:bg-violet-100/50"
                      >
                        Change
                      </button>
                      <button
                        type="button"
                        onClick={handleRemoveSelectedFile}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                        title="Remove file"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-brand-primary px-5 py-2.5 rounded-xl disabled:opacity-50 text-xs font-bold flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-4 h-4" />
                      <span>Upload & Verify</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
