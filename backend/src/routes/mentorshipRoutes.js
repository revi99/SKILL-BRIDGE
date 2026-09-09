const express = require('express');
const router = express.Router();
const Mentorship = require('../models/Mentorship');
const { protect } = require('../middleware/auth');

// @route   GET /api/mentorship/mentors
// @desc    Get all available industry mentors
// @access  Public / Authenticated
router.get('/mentors', async (req, res) => {
  try {
    const { domain } = req.query;
    let filter = {};
    if (domain && domain !== 'All') {
      filter.expertise = { $regex: domain, $options: 'i' };
    }
    const mentors = await Mentorship.find(filter).sort({ rating: -1 });
    return res.json({
      success: true,
      count: mentors.length,
      mentors,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/mentorship/book
// @desc    Student books a 1-on-1 mentorship session
// @access  Private (Student)
router.post('/book', protect, async (req, res) => {
  try {
    const { mentorId, slotTime, topic, notes } = req.body;

    if (!mentorId || !slotTime || !topic) {
      return res.status(400).json({ message: 'Mentor, slot time, and topic are required' });
    }

    const mentor = await Mentorship.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor profile not found' });
    }

    const newBooking = {
      studentId: req.user._id,
      studentName: req.user.name,
      studentEmail: req.user.email,
      topic,
      slotTime,
      scheduledDate: new Date(Date.now() + 86400000 * 2), // 2 days from now
      status: 'Confirmed',
      meetLink: `https://meet.google.com/collab-${Math.random().toString(36).substring(7)}`,
      notes: notes || 'Looking for resume review and career roadmap advice.',
      createdAt: new Date(),
    };

    mentor.bookings.push(newBooking);
    await mentor.save();

    return res.status(201).json({
      success: true,
      message: 'Mentorship session booked successfully!',
      booking: newBooking,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/mentorship/my-sessions
// @desc    Get user mentorship sessions (student or mentor)
// @access  Private
router.get('/my-sessions', protect, async (req, res) => {
  try {
    const mentors = await Mentorship.find({
      $or: [{ 'bookings.studentId': req.user._id }, { mentorId: req.user._id }],
    });

    const mySessions = [];
    mentors.forEach((m) => {
      m.bookings.forEach((b) => {
        if (
          (b.studentId && b.studentId.toString() === req.user._id.toString()) ||
          (m.mentorId && m.mentorId.toString() === req.user._id.toString())
        ) {
          mySessions.push({
            bookingId: b._id,
            mentorName: m.mentorName,
            mentorCompany: m.mentorCompany,
            mentorTitle: m.mentorTitle,
            studentName: b.studentName,
            topic: b.topic,
            slotTime: b.slotTime,
            scheduledDate: b.scheduledDate,
            status: b.status,
            meetLink: b.meetLink,
            notes: b.notes,
          });
        }
      });
    });

    return res.json({
      success: true,
      sessions: mySessions,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
