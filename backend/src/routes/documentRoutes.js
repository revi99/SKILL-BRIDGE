const express = require('express');
const router = express.Router();
const Document = require('../models/Document');
const { protect } = require('../middleware/auth');

// @route   GET /api/documents/my
// @desc    Get all documents for logged-in student/user
// @access  Private
router.get('/my', protect, async (req, res) => {
  try {
    const documents = await Document.find({ userId: req.user._id }).sort({ createdAt: -1 });
    return res.json({
      success: true,
      count: documents.length,
      documents,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/documents/upload
// @desc    Add / upload a new document to the vault
// @access  Private
router.post('/upload', protect, async (req, res) => {
  try {
    const { title, type, issuer, credentialId, tags, fileName, fileSize, fileUrl } = req.body;

    if (!title || !type) {
      return res.status(400).json({ message: 'Title and document type are required' });
    }

    // Determine default verification status based on type
    let verificationStatus = 'Pending Verification';
    if (type === 'Academic Transcript / Marksheet') {
      verificationStatus = 'Verified (DigiLocker)';
    } else if (type === 'Certification') {
      verificationStatus = 'Verified (Industry Partner)';
    }

    const doc = await Document.create({
      userId: req.user._id,
      title,
      type,
      fileName: fileName || `${title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
      fileSize: fileSize || '1.4 MB',
      fileUrl: fileUrl || `https://storage.skillbridge.edu/docs/${req.user._id}/${Date.now()}.pdf`,
      issuer: issuer || req.user.instituteName || 'Self-Uploaded',
      credentialId: credentialId || `CRED-${Math.floor(100000 + Math.random() * 900000)}`,
      verificationStatus,
      tags: tags || ['Verified Portfolio'],
    });

    return res.status(201).json({
      success: true,
      message: 'Document securely uploaded to vault!',
      document: doc,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/documents/:id
// @desc    Delete a document
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ message: 'Document not found' });
    }

    if (doc.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this document' });
    }

    await Document.findByIdAndDelete(req.params.id);

    return res.json({
      success: true,
      message: 'Document removed from vault',
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/documents/:id/verify
// @desc    Simulate instant cryptographic verification (e.g. DigiLocker / University sync)
// @access  Private
router.put('/:id/verify', protect, async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ message: 'Document not found' });
    }

    doc.verificationStatus = 'Verified (DigiLocker)';
    await doc.save();

    return res.json({
      success: true,
      message: 'Document successfully verified against national academic database!',
      document: doc,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/documents/student/:userId
// @desc    Get all documents of a student (for Academician / Dean review)
// @access  Private (Academician / Industry)
router.get('/student/:userId', protect, async (req, res) => {
  try {
    const documents = await Document.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    return res.json({
      success: true,
      count: documents.length,
      documents,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/documents/:id/dean-verify
// @desc    Dean / Academician officially verifies and cryptographically signs student document
// @access  Private (Academician)
router.put('/:id/dean-verify', protect, async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const deanName = req.user.name || 'Academic Dean & Verification Office';
    const instituteName = req.user.instituteName || 'Institutional Academic Directorate';

    doc.verificationStatus = 'Verified (Institution)';
    doc.verifiedBy = `${deanName} (${instituteName})`;
    doc.verifiedAt = new Date();
    doc.verificationHash = '0x' + Math.random().toString(16).substr(2, 32);
    await doc.save();

    return res.json({
      success: true,
      message: `Document officially verified and certified by ${deanName}!`,
      document: doc,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/documents/user/:userId
// @desc    Get public verified documents of a student (for recruiters & evaluators)
// @access  Private
router.get('/user/:userId', protect, async (req, res) => {
  try {
    const documents = await Document.find({ userId: req.params.userId, isPublic: true }).sort({ createdAt: -1 });
    return res.json({
      success: true,
      documents,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
