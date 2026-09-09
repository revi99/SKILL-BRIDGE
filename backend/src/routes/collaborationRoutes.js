const express = require('express');
const router = express.Router();
const CollaborationPost = require('../models/CollaborationPost');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/collaborations
// @desc    Get all active collaboration opportunities (FDPs, Research, Guest Lectures)
// @access  Public / Authenticated
router.get('/', async (req, res) => {
  try {
    const { type, search } = req.query;
    const query = {};

    if (type && type !== 'All') {
      query.type = type;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { institution: { $regex: search, $options: 'i' } },
        { targetDomain: { $regex: search, $options: 'i' } },
      ];
    }

    const posts = await CollaborationPost.find(query)
      .populate('academicianId', 'name email department designation instituteName')
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: posts.length,
      collaborations: posts,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/collaborations/my
// @desc    Get collaboration proposals created by logged-in academician
// @access  Private (Academician)
router.get('/my', protect, authorize('academician'), async (req, res) => {
  try {
    const myPosts = await CollaborationPost.find({ academicianId: req.user._id }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      collaborations: myPosts,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/collaborations
// @desc    Create new collaboration opportunity proposal
// @access  Private (Academician)
router.post('/', protect, authorize('academician'), async (req, res) => {
  try {
    const { title, type, description, targetDomain, proposedDuration } = req.body;

    if (!title || !type || !description) {
      return res.status(400).json({ message: 'Title, type, and description are required' });
    }

    const newPost = await CollaborationPost.create({
      academicianId: req.user._id,
      institution: req.user.instituteName || 'Leading Technical Institute',
      department: req.user.department || 'Computer Science & Engineering',
      title,
      type,
      description,
      targetDomain: targetDomain || 'Cloud & Full Stack Engineering',
      proposedDuration: proposedDuration || '2-4 Weeks',
    });

    return res.status(201).json({
      success: true,
      message: 'Collaboration proposal published successfully',
      collaboration: newPost,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/collaborations/:id/interest
// @desc    Industry partner expresses interest in academic collaboration
// @access  Private (Industry)
router.post('/:id/interest', protect, authorize('industry'), async (req, res) => {
  try {
    const { message, contactEmail } = req.body;
    const post = await CollaborationPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Collaboration proposal not found' });
    }

    post.interests.push({
      companyId: req.user._id,
      companyName: req.user.companyName || req.user.name,
      recruiterName: req.user.name,
      contactEmail: contactEmail || req.user.email,
      message: message || 'We are interested in collaborating on this program.',
      createdAt: new Date(),
    });

    await post.save();

    return res.json({
      success: true,
      message: 'Interest submitted to academic coordinator successfully!',
      collaboration: post,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
