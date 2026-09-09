const express = require('express');
const router = express.Router();
const LiveProject = require('../models/LiveProject');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/projects
// @desc    Get all active industry live capstone projects
// @access  Public / Authenticated
router.get('/', async (req, res) => {
  try {
    const projects = await LiveProject.find().sort({ createdAt: -1 });
    return res.json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/projects
// @desc    Industry recruiter posts a live corporate project
// @access  Private (Industry)
router.post('/', protect, authorize('industry'), async (req, res) => {
  try {
    const { title, domain, problemStatement, techStack, duration, grantAmount, milestones } = req.body;

    if (!title || !problemStatement) {
      return res.status(400).json({ message: 'Title and problem statement are required' });
    }

    const project = await LiveProject.create({
      companyId: req.user._id,
      companyName: req.user.companyName || req.user.name,
      title,
      domain: domain || 'Full Stack & Distributed Systems',
      problemStatement,
      techStack: Array.isArray(techStack) ? techStack : ['React', 'Node.js', 'MongoDB', 'Docker'],
      duration: duration || '8 Weeks',
      grantAmount: grantAmount || '₹50,000 Project Grant + PPO',
      milestones: milestones || [
        { title: 'Milestone 1: Architecture & DB Schema', deliverable: 'System Design Spec & ER Diagram', durationWeeks: 2 },
        { title: 'Milestone 2: MVP Core Services', deliverable: 'REST API & Working Container Image', durationWeeks: 4 },
        { title: 'Milestone 3: Final Demo & Benchmarks', deliverable: 'Production Deployment & Load Test Report', durationWeeks: 2 },
      ],
    });

    return res.status(201).json({
      success: true,
      message: 'Live project challenge published successfully!',
      project,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/projects/:id/apply
// @desc    Student team applies to work on a live project
// @access  Private (Student)
router.post('/:id/apply', protect, authorize('student'), async (req, res) => {
  try {
    const { teamName, teamSize, proposal, repoUrl } = req.body;
    const project = await LiveProject.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if team already applied
    const existing = project.teams.find((t) => t.teamLeaderId?.toString() === req.user._id.toString());
    if (existing) {
      return res.status(400).json({ message: 'Your team has already applied for this live project' });
    }

    project.teams.push({
      teamLeaderId: req.user._id,
      teamName: teamName || `${req.user.name}'s Engineering Team`,
      leaderName: req.user.name,
      leaderEmail: req.user.email,
      institution: req.user.instituteName || 'Technical Institute',
      teamSize: teamSize || 3,
      proposal: proposal || 'We propose a microservices architecture utilizing Docker and Redis for caching.',
      repoUrl: repoUrl || 'https://github.com/team-repo/capstone-challenge',
      status: 'Applied',
    });

    await project.save();

    return res.status(201).json({
      success: true,
      message: 'Team application submitted successfully!',
      project,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
