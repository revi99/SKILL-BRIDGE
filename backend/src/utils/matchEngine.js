/**
 * Calculates rule-based match percentage between student skill profile and posting requirements
 * @param {Object} skillProfile - Student's SkillProfile document
 * @param {Array<string>} requiredSkills - Array of skill tags required by posting
 * @returns {Object} { matchPercent, matchedSkills, missingSkills, details }
 */
function calculateSkillMatch(skillProfile, requiredSkills = []) {
  if (!requiredSkills || requiredSkills.length === 0) {
    return {
      matchPercent: 100,
      matchedSkills: [],
      missingSkills: [],
      details: [],
    };
  }

  if (!skillProfile || !skillProfile.skillScores || skillProfile.skillScores.length === 0) {
    return {
      matchPercent: 0,
      matchedSkills: [],
      missingSkills: [...requiredSkills],
      details: requiredSkills.map((s) => ({ skill: s, score: 0, status: 'Missing' })),
    };
  }

  // Create lookup map of student's skills (case-insensitive)
  const studentSkillMap = new Map();
  skillProfile.skillScores.forEach((item) => {
    studentSkillMap.set(item.skill.toLowerCase().trim(), {
      skill: item.skill,
      score: item.score,
      level: item.level,
    });
  });

  const matchedSkills = [];
  const missingSkills = [];
  const details = [];
  let totalMatchedScore = 0;

  requiredSkills.forEach((reqSkill) => {
    const key = reqSkill.toLowerCase().trim();
    if (studentSkillMap.has(key)) {
      const match = studentSkillMap.get(key);
      if (match.score >= 50) {
        matchedSkills.push(reqSkill);
        totalMatchedScore += match.score;
        details.push({
          skill: reqSkill,
          score: match.score,
          status: 'Matched',
        });
      } else {
        // Below passing threshold
        missingSkills.push(reqSkill);
        details.push({
          skill: reqSkill,
          score: match.score,
          status: 'Under-skilled',
        });
      }
    } else {
      missingSkills.push(reqSkill);
      details.push({
        skill: reqSkill,
        score: 0,
        status: 'Missing',
      });
    }
  });

  const totalRequired = requiredSkills.length;
  const coverageRatio = matchedSkills.length / totalRequired; // 0.0 to 1.0
  const avgCompetency = matchedSkills.length > 0 ? totalMatchedScore / matchedSkills.length : 0; // 0 to 100

  // 70% weight on having the skills, 30% weight on proficiency in those skills
  const calculatedPercent = Math.round(coverageRatio * 70 + (avgCompetency / 100) * 30);
  const matchPercent = Math.min(100, Math.max(0, calculatedPercent));

  return {
    matchPercent,
    matchedSkills,
    missingSkills,
    details,
  };
}

module.exports = { calculateSkillMatch };
