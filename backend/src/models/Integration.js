const mongoose = require('mongoose');

const integrationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: String,
      enum: ['Credential & Identity Provider', 'Learning Platform', 'Assessment & Coding Platform', 'Institutional Database (SIS/ERP)'],
      required: true,
    },
    description: String,
    icon: String,
    status: {
      type: String,
      enum: ['Connected (Live Sync)', 'Active', 'Syncing', 'Disconnected'],
      default: 'Connected (Live Sync)',
    },
    lastSyncAt: {
      type: Date,
      default: Date.now,
    },
    recordsSynced: {
      type: Number,
      default: 0,
    },
    syncSummary: {
      type: String,
      default: 'All records up to date',
    },
    supportedDataTypes: [{ type: String }],
    syncLogs: [
      {
        timestamp: { type: Date, default: Date.now },
        event: String,
        status: String,
        recordsProcessed: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Integration', integrationSchema);
