const mongoose = require('mongoose');

const mentorshipSchema = new mongoose.Schema(
  {
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    mentorName: {
      type: String,
      required: true,
    },
    mentorTitle: {
      type: String,
      required: true,
    },
    mentorCompany: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      default: '',
    },
    expertise: [{ type: String }],
    experienceYears: {
      type: Number,
      default: 5,
    },
    rating: {
      type: Number,
      default: 4.9,
    },
    totalSessionsConducted: {
      type: Number,
      default: 24,
    },
    availableSlots: [
      {
        slotId: String,
        day: String,
        time: String,
        isBooked: { type: Boolean, default: false },
      },
    ],
    bookings: [
      {
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        studentName: String,
        studentEmail: String,
        topic: String,
        slotTime: String,
        scheduledDate: Date,
        status: {
          type: String,
          enum: ['Requested', 'Confirmed', 'Completed', 'Cancelled'],
          default: 'Requested',
        },
        meetLink: {
          type: String,
          default: 'https://meet.google.com/xyz-collab-mentor',
        },
        notes: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Mentorship', mentorshipSchema);
