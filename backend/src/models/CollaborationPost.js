const mongoose = require('mongoose');

const collaborationPostSchema = new mongoose.Schema(
  {
    academicianId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    institution: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Collaboration title is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['Faculty Development Program', 'Guest Lecture / Workshop', 'Joint Research Project', 'Curriculum Review', 'Capstone Sponsorship'],
      default: 'Faculty Development Program',
      required: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    targetDomain: {
      type: String,
      default: 'Emerging Technologies',
    },
    proposedDuration: {
      type: String,
      default: '2-4 Weeks',
    },
    status: {
      type: String,
      enum: ['Open', 'In Discussion', 'Partnered', 'Closed'],
      default: 'Open',
    },
    interests: [
      {
        companyId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        companyName: String,
        recruiterName: String,
        contactEmail: String,
        message: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('CollaborationPost', collaborationPostSchema);
