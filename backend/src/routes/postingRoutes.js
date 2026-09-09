const express = require('express');
const router = express.Router();
const Posting = require('../models/Posting');
const Application = require('../models/Application');
const SkillProfile = require('../models/SkillProfile');
const { protect, authorize } = require('../middleware/auth');
const { calculateSkillMatch } = require('../utils/matchEngine');

// Optional auth helper middleware for public browsing with student personalization
const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const jwt = require('jsonwebtoken');
      const User = require('../models/User');
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret_sih26044_jwt_key_2026_antigravity');
      req.user = await User.findById(decoded.id).select('-password');
    } catch (e) {
      // Ignore token errors for optional auth
    }
  }
  next();
};

// @route   GET /api/postings
// @desc    Get all active postings (personalized with skill match % if student is logged in)
// @access  Public / Optional Auth
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { search, type, workMode, minMatch } = req.query;

    const query = { status: 'Active' };

    if (type && type !== 'All') {
      query.type = type;
    }
    if (workMode && workMode !== 'All') {
      query.workMode = workMode;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
        { requiredSkills: { $regex: search, $options: 'i' } },
      ];
    }

    const postings = await Posting.find(query)
      .populate('industryId', 'name companyName companyWebsite industrySector')
      .sort({ createdAt: -1 });

    // If user is logged in as a student, compute dynamic match scores and applied status
    let studentProfile = null;
    let appliedPostingIds = new Set();

    if (req.user && req.user.role === 'student') {
      studentProfile = await SkillProfile.findOne({ userId: req.user._id });
      const myApplications = await Application.find({ studentId: req.user._id }).select('postingId status');
      myApplications.forEach((app) => appliedPostingIds.add(app.postingId.toString()));
    }

    let results = postings.map((post) => {
      const postObj = post.toObject();
      const matchResult = calculateSkillMatch(studentProfile, post.requiredSkills);

      return {
        ...postObj,
        matchPercent: matchResult.matchPercent,
        matchedSkills: matchResult.matchedSkills,
        missingSkills: matchResult.missingSkills,
        matchDetails: matchResult.details,
        hasApplied: appliedPostingIds.has(post._id.toString()),
      };
    });

    // Optional filter by minimum match score
    if (minMatch && req.user && req.user.role === 'student') {
      const threshold = Number(minMatch);
      results = results.filter((item) => item.matchPercent >= threshold);
    }

    // Sort by matchPercent descending if student, else newest
    if (req.user && req.user.role === 'student' && studentProfile) {
      results.sort((a, b) => b.matchPercent - a.matchPercent);
    }

    return res.json({
      success: true,
      count: results.length,
      postings: results,
    });
  } catch (error) {
    console.error('Fetch postings error:', error);
    return res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/postings/my/all
// @desc    Get all postings by logged-in industry user with applicant counts
// @access  Private (Industry)
router.get('/my/all', protect, authorize('industry'), async (req, res) => {
  try {
    const postings = await Posting.find({ industryId: req.user._id }).sort({ createdAt: -1 });

    const postingsWithCounts = await Promise.all(
      postings.map(async (post) => {
        const applicantCount = await Application.countDocuments({ postingId: post._id });
        const shortlistedCount = await Application.countDocuments({ postingId: post._id, status: 'Shortlisted' });
        return {
          ...post.toObject(),
          applicantCount,
          shortlistedCount,
        };
      })
    );

    return res.json({
      success: true,
      postings: postingsWithCounts,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/postings/:id
// @desc    Get single posting with match details
// @access  Public / Optional Auth
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const post = await Posting.findById(req.params.id).populate(
      'industryId',
      'name companyName companyWebsite industrySector designation email'
    );

    if (!post) {
      return res.status(404).json({ message: 'Opportunity posting not found' });
    }

    let matchPercent = 0;
    let matchedSkills = [];
    let missingSkills = [...post.requiredSkills];
    let matchDetails = [];
    let hasApplied = false;

    if (req.user && req.user.role === 'student') {
      const studentProfile = await SkillProfile.findOne({ userId: req.user._id });
      const matchResult = calculateSkillMatch(studentProfile, post.requiredSkills);
      matchPercent = matchResult.matchPercent;
      matchedSkills = matchResult.matchedSkills;
      missingSkills = matchResult.missingSkills;
      matchDetails = matchResult.details;

      const existingApp = await Application.findOne({ studentId: req.user._id, postingId: post._id });
      hasApplied = !!existingApp;
    }

    return res.json({
      success: true,
      posting: {
        ...post.toObject(),
        matchPercent,
        matchedSkills,
        missingSkills,
        matchDetails,
        hasApplied,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/postings
// @desc    Create a new internship/job posting
// @access  Private (Industry)
router.post('/', protect, authorize('industry'), async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      workMode,
      location,
      stipend,
      duration,
      requiredSkills,
      experienceLevel,
      deadline,
      openings,
    } = req.body;

    if (!title || !description || !deadline) {
      return res.status(400).json({ message: 'Title, description, and deadline are required' });
    }

    // Clean skill tags
    const skillsArray = Array.isArray(requiredSkills)
      ? requiredSkills.map((s) => s.trim()).filter(Boolean)
      : typeof requiredSkills === 'string'
      ? requiredSkills.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const newPosting = await Posting.create({
      industryId: req.user._id,
      companyName: req.user.companyName || req.user.name,
      title,
      description,
      type: type || 'Internship',
      workMode: workMode || 'Hybrid',
      location: location || 'Remote / Hybrid',
      stipend: stipend || 'Competitive Stipend',
      duration: duration || '3-6 Months',
      requiredSkills: skillsArray,
      experienceLevel: experienceLevel || 'Entry Level',
      deadline: new Date(deadline),
      openings: openings || 1,
    });

    return res.status(201).json({
      success: true,
      message: 'Opportunity posting created successfully',
      posting: newPosting,
    });
  } catch (error) {
    console.error('Create posting error:', error);
    return res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/postings/:id
// @desc    Update a posting
// @access  Private (Industry)
router.put('/:id', protect, authorize('industry'), async (req, res) => {
  try {
    const post = await Posting.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Posting not found' });
    }

    if (post.industryId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this posting' });
    }

    Object.assign(post, req.body);
    await post.save();

    return res.json({
      success: true,
      message: 'Posting updated successfully',
      posting: post,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/postings/:id
// @desc    Delete / Close a posting
// @access  Private (Industry)
router.delete('/:id', protect, authorize('industry'), async (req, res) => {
  try {
    const post = await Posting.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Posting not found' });
    }

    if (post.industryId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this posting' });
    }

    await Posting.findByIdAndDelete(req.params.id);
    await Application.deleteMany({ postingId: req.params.id });

    return res.json({
      success: true,
      message: 'Posting and associated applications removed',
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
