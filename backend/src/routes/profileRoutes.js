const express = require('express');
const router = express.Router();
const SkillProfile = require('../models/SkillProfile');
const { protect, authorize } = require('../middleware/auth');
const { domains, questionBank } = require('../data/assessmentData');
const { skillBenchmarks } = require('../data/benchmarkData');
const { learningResources } = require('../data/resourcesData');

// @route   GET /api/profile/domains
// @desc    Get all available assessment domains
// @access  Public
router.get('/domains', (req, res) => {
  return res.json({ success: true, domains });
});

// @route   GET /api/profile/questions/:domain
// @desc    Get questions for a specific domain (without revealing correct answers)
// @access  Private (Student)
router.get('/questions/:domain', protect, (req, res) => {
  const domainName = decodeURIComponent(req.params.domain);
  const questions = questionBank[domainName];

  if (!questions || questions.length === 0) {
    return res.status(404).json({ message: `No questions found for domain: ${domainName}` });
  }

  // Strip correct answers before sending to client
  const clientQuestions = questions.map((q) => ({
    id: q.id,
    skill: q.skill,
    question: q.question,
    options: q.options,
    difficulty: q.difficulty,
  }));

  return res.json({
    success: true,
    domain: domainName,
    totalQuestions: clientQuestions.length,
    questions: clientQuestions,
  });
});

// @route   POST /api/profile/submit-assessment
// @desc    Grade assessment, compute skill scores, calculate gap analysis vs benchmarks
// @access  Private (Student)
router.post('/submit-assessment', protect, authorize('student'), async (req, res) => {
  try {
    const { domain, answers } = req.body;
    // answers format: { [questionId]: selectedOptionIndex }

    if (!domain || !answers) {
      return res.status(400).json({ message: 'Domain and answers are required' });
    }

    const domainQuestions = questionBank[domain];
    if (!domainQuestions) {
      return res.status(404).json({ message: `Invalid domain: ${domain}` });
    }

    // Tally questions attempted and correct per skill
    const skillStats = {};

    domainQuestions.forEach((q) => {
      if (!skillStats[q.skill]) {
        skillStats[q.skill] = { attempted: 0, correct: 0 };
      }

      const userAnswer = answers[q.id];
      if (userAnswer !== undefined && userAnswer !== null) {
        skillStats[q.skill].attempted += 1;
        if (Number(userAnswer) === q.correctAnswer) {
          skillStats[q.skill].correct += 1;
        }
      }
    });

    // Compute score per skill tag
    const skillScores = [];
    const gaps = [];
    const strengths = [];
    let totalScoreSum = 0;
    let totalSkillsCount = 0;

    Object.keys(skillStats).forEach((skill) => {
      const stats = skillStats[skill];
      const score = stats.attempted > 0 ? Math.round((stats.correct / stats.attempted) * 100) : 0;
      totalScoreSum += score;
      totalSkillsCount += 1;

      let level = 'Beginner';
      if (score >= 85) level = 'Expert';
      else if (score >= 70) level = 'Proficient';
      else if (score >= 50) level = 'Intermediate';
      else if (score > 0) level = 'Beginner';
      else level = 'Novice';

      skillScores.push({
        skill,
        score,
        level,
        questionsAttempted: stats.attempted,
        questionsCorrect: stats.correct,
      });

      // Benchmark gap calculation
      const benchmark = skillBenchmarks[skill] || 70;
      const resource = learningResources[skill] || {
        title: `${skill} Official Learning Path`,
        url: `https://www.google.com/search?q=${encodeURIComponent(skill)}+tutorial+for+developers`,
      };

      if (score < benchmark) {
        const gapPercentage = benchmark - score;
        let priority = 'Low';
        if (gapPercentage >= 40) priority = 'Critical';
        else if (gapPercentage >= 20) priority = 'High';
        else priority = 'Medium';

        gaps.push({
          skill,
          currentScore: score,
          benchmarkScore: benchmark,
          gapPercentage,
          priority,
          learningResourceUrl: resource.url,
          resourceTitle: resource.title,
        });
      } else {
        strengths.push(skill);
      }
    });

    // Sort gaps by priority/gap size
    gaps.sort((a, b) => b.gapPercentage - a.gapPercentage);

    const overallScore = totalSkillsCount > 0 ? Math.round(totalScoreSum / totalSkillsCount) : 0;

    let readinessLevel = 'Exploring';
    if (overallScore >= 80) readinessLevel = 'Industry-Ready';
    else if (overallScore >= 55) readinessLevel = 'Developing';

    // Upsert SkillProfile in MongoDB
    let profile = await SkillProfile.findOne({ userId: req.user._id });

    if (!profile) {
      profile = new SkillProfile({
        userId: req.user._id,
        domain,
        overallScore,
        readinessLevel,
        skillScores,
        gaps,
        strengths,
        assessmentsHistory: [{ domain, score: overallScore, takenAt: new Date() }],
        lastAssessedAt: new Date(),
      });
    } else {
      profile.domain = domain;
      profile.overallScore = overallScore;
      profile.readinessLevel = readinessLevel;
      profile.skillScores = skillScores;
      profile.gaps = gaps;
      profile.strengths = strengths;
      profile.assessmentsHistory.push({ domain, score: overallScore, takenAt: new Date() });
      profile.lastAssessedAt = new Date();
    }

    await profile.save();

    return res.json({
      success: true,
      message: 'Assessment completed and Skill Profile updated!',
      profile,
    });
  } catch (error) {
    console.error('Submit assessment error:', error);
    return res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/profile/me
// @desc    Get current student's skill profile
// @access  Private (Student)
router.get('/me', protect, async (req, res) => {
  try {
    const profile = await SkillProfile.findOne({ userId: req.user._id }).populate('userId', 'name email instituteName degree department');

    if (!profile) {
      return res.status(200).json({
        success: true,
        profile: null,
        message: 'No skill assessment completed yet',
      });
    }

    return res.json({
      success: true,
      profile,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
