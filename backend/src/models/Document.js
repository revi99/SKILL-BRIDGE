const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Document title is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['Resume / CV', 'Certification', 'Internship Completion Report', 'Academic Transcript / Marksheet', 'Research Paper / Publication'],
      required: true,
      default: 'Resume / CV',
    },
    fileName: {
      type: String,
      required: true,
    },
    fileSize: {
      type: String,
      default: '1.2 MB',
    },
    fileUrl: {
      type: String,
      default: '',
    },
    issuer: {
      type: String,
      default: 'Self-Uploaded',
    },
    issuedDate: {
      type: Date,
      default: Date.now,
    },
    credentialId: {
      type: String,
      default: '',
    },
    verificationStatus: {
      type: String,
      enum: ['Verified (DigiLocker)', 'Verified (Institution)', 'Verified (Industry Partner)', 'Pending Verification', 'Unverified'],
      default: 'Pending Verification',
    },
    verificationHash: {
      type: String,
      default: () => '0x' + Math.random().toString(16).substr(2, 32),
    },
    tags: [{ type: String }],
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Document', documentSchema);
