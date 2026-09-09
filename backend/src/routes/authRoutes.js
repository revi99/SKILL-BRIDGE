const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Generate JWT Helper
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecret_sih26044_jwt_key_2026_antigravity', {
    expiresIn: '30d',
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      instituteName,
      companyName,
      department,
      designation,
      degree,
      graduationYear,
      companyWebsite,
      industrySector,
      bio,
    } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Please provide all required fields (name, email, password, role)' });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role,
      instituteName: instituteName || '',
      companyName: companyName || '',
      department: department || '',
      designation: designation || '',
      degree: degree || '',
      graduationYear: graduationYear || null,
      companyWebsite: companyWebsite || '',
      industrySector: industrySector || '',
      bio: bio || '',
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        instituteName: user.instituteName,
        companyName: user.companyName,
        department: user.department,
        designation: user.designation,
        degree: user.degree,
        graduationYear: user.graduationYear,
        bio: user.bio,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ message: error.message || 'Server error during registration' });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    return res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        instituteName: user.instituteName,
        companyName: user.companyName,
        department: user.department,
        designation: user.designation,
        degree: user.degree,
        graduationYear: user.graduationYear,
        bio: user.bio,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: error.message || 'Server error during login' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    return res.json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const allowedFields = [
      'name',
      'instituteName',
      'companyName',
      'department',
      'designation',
      'degree',
      'graduationYear',
      'companyWebsite',
      'industrySector',
      'bio',
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    await user.save();

    return res.json({
      success: true,
      user,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/auth/demo-accounts
// @desc    List demo accounts for instant hackathon access
// @access  Public
router.get('/demo-accounts', (req, res) => {
  return res.json({
    accounts: [
      {
        role: 'student',
        label: 'Student (Rahul Sharma)',
        email: 'student@demo.com',
        password: 'password123',
        institute: 'Indian Institute of Information Technology (IIIT)',
        details: 'Assessed in MERN & Full Stack, active applications ready to review',
      },
      {
        role: 'industry',
        label: 'Industry Recruiter (Karan Singhania - TechCorp)',
        email: 'industry@demo.com',
        password: 'password123',
        company: 'TechCorp Innovations',
        details: 'Active internship postings & applicant pipeline ranked by match %',
      },
      {
        role: 'academician',
        label: 'Academician (Dr. Aris Thorne - Dean)',
        email: 'academician@demo.com',
        password: 'password123',
        institute: 'ABC Institute of Technology',
        details: 'Live cohort skill-gap analytics charts & active FDP proposals',
      },
    ],
  });
});

module.exports = router;
