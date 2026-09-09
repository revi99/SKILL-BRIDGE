const mongoose = require('mongoose');

const skillScoreSchema = new mongoose.Schema({
  skill: { type: String, required: true },
  score: { type: Number, required: true }, // percentage 0-100
  level: {
    type: String,
    enum: ['Novice', 'Beginner', 'Intermediate', 'Proficient', 'Expert'],
    default: 'Beginner',
  },
  questionsAttempted: { type: Number, default: 0 },
  questionsCorrect: { type: Number, default: 0 },
});

const skillGapSchema = new mongoose.Schema({
  skill: { type: String, required: true },
  currentScore: { type: Number, required: true },
  benchmarkScore: { type: Number, required: true },
  gapPercentage: { type: Number, required: true },
  priority: {
    type: String,
    enum: ['Critical', 'High', 'Medium', 'Low'],
    default: 'Medium',
  },
  learningResourceUrl: { type: String, default: '' },
  resourceTitle: { type: String, default: '' },
});

const skillProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    domain: {
      type: String,
      required: true,
      default: 'Full Stack Web Development',
    },
    overallScore: {
      type: Number,
      default: 0,
    },
    readinessLevel: {
      type: String,
      enum: ['Exploring', 'Developing', 'Industry-Ready', 'Advanced'],
      default: 'Developing',
    },
    skillScores: [skillScoreSchema],
    gaps: [skillGapSchema],
    strengths: [{ type: String }],
    assessmentsHistory: [
      {
        domain: String,
        score: Number,
        takenAt: { type: Date, default: Date.now },
      },
    ],
    lastAssessedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('SkillProfile', skillProfileSchema);
