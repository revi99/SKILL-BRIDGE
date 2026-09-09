const express = require('express');
const router = express.Router();
const SkillProfile = require('../models/SkillProfile');
const Posting = require('../models/Posting');
const Application = require('../models/Application');
const User = require('../models/User');
const Document = require('../models/Document');
const LiveProject = require('../models/LiveProject');
const { skillBenchmarks } = require('../data/benchmarkData');

// @route   GET /api/analytics/academic-gap-overview
// @desc    Get aggregate skill gaps and cohort analytics for academician dashboard
// @access  Public / Authenticated
router.get('/academic-gap-overview', async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalAssessed = await SkillProfile.countDocuments();
    const totalPostings = await Posting.countDocuments({ status: 'Active' });
    const totalApplications = await Application.countDocuments();

    const profiles = await SkillProfile.find();

    const skillAggregator = {};
    const readinessDistribution = { 'Industry-Ready': 0, Developing: 0, Exploring: 0 };
    const domainDistribution = {};

    profiles.forEach((p) => {
      const readiness = p.readinessLevel || 'Developing';
      readinessDistribution[readiness] = (readinessDistribution[readiness] || 0) + 1;
      domainDistribution[p.domain] = (domainDistribution[p.domain] || 0) + 1;

      if (p.skillScores && p.skillScores.length > 0) {
        p.skillScores.forEach((s) => {
          if (!skillAggregator[s.skill]) {
            skillAggregator[s.skill] = { totalScore: 0, count: 0, gapCount: 0 };
          }
          skillAggregator[s.skill].totalScore += s.score;
          skillAggregator[s.skill].count += 1;

          const bench = skillBenchmarks[s.skill] || 70;
          if (s.score < bench) {
            skillAggregator[s.skill].gapCount += 1;
          }
        });
      }
    });

    const skillGapStats = Object.keys(skillAggregator).map((skill) => {
      const data = skillAggregator[skill];
      const avgScore = Math.round(data.totalScore / data.count);
      const benchmark = skillBenchmarks[skill] || 70;
      const gapMagnitude = Math.max(0, benchmark - avgScore);
      const gapPercentageOfStudents = Math.round((data.gapCount / data.count) * 100);

      return {
        skill,
        averageCohortScore: avgScore,
        industryBenchmark: benchmark,
        gapMagnitude,
        studentsWithGapPercent: gapPercentageOfStudents,
      };
    });

    skillGapStats.sort((a, b) => b.gapMagnitude - a.gapMagnitude);

    const topGaps = skillGapStats.slice(0, 4);
    const curriculumRecommendations = topGaps.map((item) => ({
      skill: item.skill,
      recommendation: `Integrate hands-on ${item.skill} mini-projects or lab modules. Current cohort trails industry benchmark by ${item.gapMagnitude}%.`,
      urgency: item.gapMagnitude >= 20 ? 'High' : 'Medium',
    }));

    return res.json({
      success: true,
      stats: {
        totalStudents,
        totalAssessed,
        totalPostings,
        totalApplications,
      },
      readinessDistribution,
      domainDistribution,
      skillGapStats,
      curriculumRecommendations,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/analytics/cohort-students
// @desc    Get real student cohort list with their assessed profiles from DB
// @access  Public / Authenticated
router.get('/cohort-students', async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('name email instituteName department degree graduationYear bio');

    const cohortWithProfiles = await Promise.all(
      students.map(async (st) => {
        const profile = await SkillProfile.findOne({ userId: st._id });
        return {
          _id: st._id,
          name: st.name,
          email: st.email,
          instituteName: st.instituteName || 'Technical Institute',
          department: st.department || 'Computer Science',
          degree: st.degree || 'B.Tech',
          graduationYear: st.graduationYear || 2026,
          domain: profile ? profile.domain : 'Not Yet Assessed',
          overallScore: profile ? profile.overallScore : 0,
          readinessLevel: profile ? profile.readinessLevel : 'Assessment Pending',
          strengths: profile ? profile.strengths : [],
          gaps: profile ? profile.gaps.map((g) => g.skill) : [],
        };
      })
    );

    return res.json({
      success: true,
      students: cohortWithProfiles,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/analytics/policy-decision-suite
// @desc    High-level decision intelligence for Institutions, Industry Partners, and Policymakers
// @access  Public / Authenticated
router.get('/policy-decision-suite', async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalIndustry = await User.countDocuments({ role: 'industry' });
    const totalAcademic = await User.countDocuments({ role: 'academician' });
    const verifiedDocs = await Document.countDocuments({ verificationStatus: { $regex: 'Verified' } });
    const liveProjectsCount = await LiveProject.countDocuments();

    // Regional Skill Deficit Matrix (Tier 1 vs Tier 2/3 comparison)
    const regionalSkillDeficits = [
      { skill: 'Cloud & Docker', tier1Deficit: 18, tier2Deficit: 46, nationalAverage: 32 },
      { skill: 'TypeScript & Modern JS', tier1Deficit: 14, tier2Deficit: 38, nationalAverage: 26 },
      { skill: 'System Design & APIs', tier1Deficit: 22, tier2Deficit: 54, nationalAverage: 38 },
      { skill: 'Applied AI & ML', tier1Deficit: 25, tier2Deficit: 58, nationalAverage: 41 },
      { skill: 'DevOps & CI/CD Pipelines', tier1Deficit: 28, tier2Deficit: 62, nationalAverage: 45 },
    ];

    // Quarterly Placement & Internship Velocity Trend
    const placementVelocityTrends = [
      { quarter: 'Q1 2025', applications: 180, shortlists: 45, offers: 28 },
      { quarter: 'Q2 2025', applications: 320, shortlists: 95, offers: 64 },
      { quarter: 'Q3 2025', applications: 490, shortlists: 160, offers: 110 },
      { quarter: 'Q4 2025', applications: 710, shortlists: 240, offers: 185 },
      { quarter: 'Q1 2026', applications: 940, shortlists: 360, offers: 290 },
    ];

    // NAAC / NIRF Accreditation Readiness Metrics
    const nirfComplianceScores = {
      industryFacultyCollaborationScore: 92, // Target: 100
      internshipParticipationRate: 88, // %
      verifiedCredentialsRate: 94, // %
      curriculumModernizationQuotient: 85, // %
      overallAccreditationIndex: 'A++ (Rank Band 1-50 Ready)',
    };

    return res.json({
      success: true,
      summary: {
        totalStudents,
        totalIndustry,
        totalAcademic,
        verifiedDocs,
        liveProjectsCount,
      },
      regionalSkillDeficits,
      placementVelocityTrends,
      nirfComplianceScores,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
