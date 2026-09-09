const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Posting = require('../models/Posting');
const SkillProfile = require('../models/SkillProfile');
const { protect, authorize } = require('../middleware/auth');
const { calculateSkillMatch } = require('../utils/matchEngine');

// @route   POST /api/applications/apply
// @desc    Apply to an opportunity posting
// @access  Private (Student)
router.post('/apply', protect, authorize('student'), async (req, res) => {
  try {
    const { postingId, coverNote } = req.body;

    if (!postingId) {
      return res.status(400).json({ message: 'Posting ID is required' });
    }

    const post = await Posting.findById(postingId);
    if (!post) {
      return res.status(404).json({ message: 'Opportunity posting not found' });
    }

    if (post.status !== 'Active') {
      return res.status(400).json({ message: 'This posting is no longer active' });
    }

    // Check if already applied
    const existing = await Application.findOne({ studentId: req.user._id, postingId });
    if (existing) {
      return res.status(400).json({ message: 'You have already applied for this opportunity' });
    }

    // Fetch student's skill profile
    const profile = await SkillProfile.findOne({ userId: req.user._id });
    const matchData = calculateSkillMatch(profile, post.requiredSkills);

    const application = await Application.create({
      studentId: req.user._id,
      postingId: post._id,
      matchPercent: matchData.matchPercent,
      matchedSkills: matchData.matchedSkills,
      missingSkills: matchData.missingSkills,
      status: 'Applied',
      coverNote: coverNote || '',
    });

    return res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      application,
    });
  } catch (error) {
    console.error('Apply error:', error);
    return res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/applications/my
// @desc    Get all applications submitted by logged-in student
// @access  Private (Student)
router.get('/my', protect, authorize('student'), async (req, res) => {
  try {
    const applications = await Application.find({ studentId: req.user._id })
      .populate({
        path: 'postingId',
        select: 'title companyName type workMode location stipend duration requiredSkills deadline status',
      })
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      applications,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/applications/posting/:postingId
// @desc    Get applicants for a specific posting, sorted by Match % (descending)
// @access  Private (Industry)
router.get('/posting/:postingId', protect, authorize('industry'), async (req, res) => {
  try {
    const post = await Posting.findById(req.params.postingId);
    if (!post) {
      return res.status(404).json({ message: 'Posting not found' });
    }

    if (post.industryId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view applicants for this posting' });
    }

    const applications = await Application.find({ postingId: req.params.postingId })
      .populate('studentId', 'name email instituteName department degree graduationYear bio')
      .sort({ matchPercent: -1, createdAt: -1 });

    // Also attach the student's full skill profile for recruiter deep-dive
    const enriched = await Promise.all(
      applications.map(async (app) => {
        const studentProfile = await SkillProfile.findOne({ userId: app.studentId._id });
        return {
          ...app.toObject(),
          skillProfile: studentProfile,
        };
      })
    );

    return res.json({
      success: true,
      posting: post,
      applicantCount: enriched.length,
      applicants: enriched,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/applications/:id/status
// @desc    Update application status (Shortlist / Interview / Accept / Reject)
// @access  Private (Industry)
router.put('/:id/status', protect, authorize('industry'), async (req, res) => {
  try {
    const { status, recruiterNotes } = req.body;

    const validStatuses = ['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Accepted', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status: ${status}` });
    }

    const application = await Application.findById(req.params.id).populate('postingId');
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.postingId.industryId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this application' });
    }

    application.status = status;
    if (recruiterNotes !== undefined) {
      application.recruiterNotes = recruiterNotes;
    }

    await application.save();

    return res.json({
      success: true,
      message: `Applicant status updated to '${status}'`,
      application,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
