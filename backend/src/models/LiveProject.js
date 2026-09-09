const mongoose = require('mongoose');

const liveProjectSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Project title is required'],
    },
    domain: {
      type: String,
      default: 'Full Stack & Cloud',
    },
    problemStatement: {
      type: String,
      required: true,
    },
    techStack: [{ type: String }],
    duration: {
      type: String,
      default: '8 Weeks',
    },
    maxTeams: {
      type: Number,
      default: 5,
    },
    grantAmount: {
      type: String,
      default: '₹50,000 Project Grant + PPO Opportunity',
    },
    status: {
      type: String,
      enum: ['Open for Submissions', 'In Progress', 'Evaluation Phase', 'Completed'],
      default: 'Open for Submissions',
    },
    milestones: [
      {
        title: String,
        deliverable: String,
        durationWeeks: Number,
      },
    ],
    teams: [
      {
        teamLeaderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        teamName: String,
        leaderName: String,
        leaderEmail: String,
        institution: String,
        teamSize: Number,
        proposal: String,
        status: {
          type: String,
          enum: ['Applied', 'Shortlisted', 'Project Assigned', 'Milestone 1 Submitted', 'Completed', 'Rejected'],
          default: 'Applied',
        },
        repoUrl: { type: String, default: '' },
        appliedAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('LiveProject', liveProjectSchema);
