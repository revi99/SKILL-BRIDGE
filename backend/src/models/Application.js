const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    postingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Posting',
      required: true,
    },
    matchPercent: {
      type: Number,
      default: 0,
    },
    matchedSkills: [
      {
        type: String,
      },
    ],
    missingSkills: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Accepted', 'Rejected'],
      default: 'Applied',
    },
    coverNote: {
      type: String,
      default: '',
    },
    recruiterNotes: {
      type: String,
      default: '',
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure a student applies only once to a particular posting
applicationSchema.index({ studentId: 1, postingId: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
