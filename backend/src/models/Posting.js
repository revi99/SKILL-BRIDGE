const mongoose = require('mongoose');

const postingSchema = new mongoose.Schema(
  {
    industryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    companyLogo: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      required: [true, 'Opportunity title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    type: {
      type: String,
      enum: ['Internship', 'Full-Time', 'Part-Time', 'Contract'],
      default: 'Internship',
      required: true,
    },
    workMode: {
      type: String,
      enum: ['Remote', 'On-site', 'Hybrid'],
      default: 'Hybrid',
    },
    location: {
      type: String,
      default: 'Bengaluru, India',
    },
    stipend: {
      type: String,
      default: '₹25,000 / month',
    },
    duration: {
      type: String,
      default: '6 Months',
    },
    requiredSkills: [
      {
        type: String,
        trim: true,
      },
    ],
    experienceLevel: {
      type: String,
      enum: ['Entry Level', 'Intermediate', 'Senior'],
      default: 'Entry Level',
    },
    deadline: {
      type: Date,
      required: true,
    },
    openings: {
      type: Number,
      default: 2,
    },
    status: {
      type: String,
      enum: ['Active', 'Closed'],
      default: 'Active',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Posting', postingSchema);
