const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../../.env') });

const User = require('../models/User');
const SkillProfile = require('../models/SkillProfile');
const Posting = require('../models/Posting');
const Application = require('../models/Application');
const CollaborationPost = require('../models/CollaborationPost');
const Document = require('../models/Document');
const Mentorship = require('../models/Mentorship');
const LiveProject = require('../models/LiveProject');
const Integration = require('../models/Integration');
const { calculateSkillMatch } = require('../utils/matchEngine');

const seedDB = async (shouldExit = true) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/collab_portal';
      await mongoose.connect(mongoUri);
      console.log('[Seed] Connected to MongoDB at', mongoUri);
    }
    // Clear existing collections
    await User.deleteMany({});
    await SkillProfile.deleteMany({});
    await Posting.deleteMany({});
    await Application.deleteMany({});
    await CollaborationPost.deleteMany({});
    await Document.deleteMany({});
    await Mentorship.deleteMany({});
    await LiveProject.deleteMany({});
    await Integration.deleteMany({});
    console.log('[Seed] Cleared existing data.');

    // 1. Create Users
    console.log('[Seed] Creating demo users for all 4 roles...');
    const student1 = await User.create({
      name: 'Rahul Sharma',
      email: 'student@demo.com',
      password: 'password123',
      role: 'student',
      instituteName: 'Indian Institute of Information Technology (IIIT)',
      department: 'Computer Science & Engineering',
      degree: 'B.Tech CSE',
      graduationYear: 2026,
      bio: 'Aspiring Full Stack Engineer passionate about React, Node.js, and high-performance cloud applications.',
    });

    const student2 = await User.create({
      name: 'Priya Patel',
      email: 'student2@demo.com',
      password: 'password123',
      role: 'student',
      instituteName: 'ABC Institute of Technology',
      department: 'Information Technology',
      degree: 'B.Tech IT',
      graduationYear: 2025,
      bio: 'Frontend enthusiast & open source contributor with strong React & TypeScript expertise.',
    });

    const student3 = await User.create({
      name: 'Amit Verma',
      email: 'student3@demo.com',
      password: 'password123',
      role: 'student',
      instituteName: 'ABC Institute of Technology',
      department: 'Data Science & AI',
      degree: 'B.Tech AI & Data Science',
      graduationYear: 2026,
      bio: 'Machine Learning learner building predictive algorithms and data visualisations.',
    });

    const industry1 = await User.create({
      name: 'Karan Singhania',
      email: 'industry@demo.com',
      password: 'password123',
      role: 'industry',
      companyName: 'TechCorp Innovations',
      companyWebsite: 'https://techcorp-innovations.io',
      industrySector: 'Enterprise SaaS & Cloud',
      designation: 'Head of Campus Talent & Engineering Hiring',
      bio: 'Leading hiring initiatives at TechCorp. Looking for skilled junior developers with solid foundations in modern web stacks.',
    });

    const industry2 = await User.create({
      name: 'Ananya Roy',
      email: 'industry2@demo.com',
      password: 'password123',
      role: 'industry',
      companyName: 'CloudScale Labs',
      companyWebsite: 'https://cloudscalelabs.tech',
      industrySector: 'DevOps & Distributed Systems',
      designation: 'Senior Director of Engineering Talent',
      bio: 'Passionate about building industry-academia pipelines for cloud engineering and microservices.',
    });

    const academician1 = await User.create({
      name: 'Dr. Aris Thorne',
      email: 'academician@demo.com',
      password: 'password123',
      role: 'academician',
      instituteName: 'ABC Institute of Technology',
      department: 'Computer Science & Engineering',
      designation: 'Dean of Academic Partnerships & Professor',
      bio: 'Focused on aligning curriculum with emerging industry demands, faculty upskilling, and joint R&D projects.',
    });

    const institution1 = await User.create({
      name: 'Dr. Vikram Sethi',
      email: 'institution@demo.com',
      password: 'password123',
      role: 'academician', // Uses institutional permissions
      instituteName: 'ABC Institute of Technology',
      department: 'Institutional Excellence & NIRF Cell',
      designation: 'Director of Academic Planning & Accreditation Lead',
      bio: 'Overseeing multi-department employability analytics, NIRF rank readiness, and national AICTE compliance metrics.',
    });

    console.log('[Seed] Users created successfully.');

    // 2. Create SkillProfiles
    console.log('[Seed] Creating skill profiles with realistic gaps...');
    const rahulProfile = await SkillProfile.create({
      userId: student1._id,
      domain: 'Full Stack Web Development',
      overallScore: 68,
      readinessLevel: 'Developing',
      skillScores: [
        { skill: 'React', score: 85, level: 'Expert', questionsAttempted: 2, questionsCorrect: 2 },
        { skill: 'Node.js', score: 75, level: 'Proficient', questionsAttempted: 2, questionsCorrect: 2 },
        { skill: 'MongoDB', score: 70, level: 'Proficient', questionsAttempted: 2, questionsCorrect: 1 },
        { skill: 'REST APIs', score: 85, level: 'Expert', questionsAttempted: 1, questionsCorrect: 1 },
        { skill: 'Git', score: 80, level: 'Proficient', questionsAttempted: 1, questionsCorrect: 1 },
        { skill: 'Docker', score: 35, level: 'Beginner', questionsAttempted: 1, questionsCorrect: 0 },
        { skill: 'TypeScript', score: 40, level: 'Beginner', questionsAttempted: 1, questionsCorrect: 0 },
      ],
      gaps: [
        {
          skill: 'Docker',
          currentScore: 35,
          benchmarkScore: 60,
          gapPercentage: 25,
          priority: 'High',
          learningResourceUrl: 'https://docs.docker.com/get-started/',
          resourceTitle: 'Docker for Developers: From Dockerfile to Multi-stage Builds',
        },
        {
          skill: 'TypeScript',
          currentScore: 40,
          benchmarkScore: 65,
          gapPercentage: 25,
          priority: 'High',
          learningResourceUrl: 'https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html',
          resourceTitle: 'TypeScript for JavaScript Programmers Handbook',
        },
      ],
      strengths: ['React', 'REST APIs', 'Git', 'Node.js', 'MongoDB'],
      assessmentsHistory: [
        { domain: 'Full Stack Web Development', score: 68, takenAt: new Date(Date.now() - 86400000 * 3) },
      ],
      lastAssessedAt: new Date(),
    });

    const priyaProfile = await SkillProfile.create({
      userId: student2._id,
      domain: 'Full Stack Web Development',
      overallScore: 84,
      readinessLevel: 'Industry-Ready',
      skillScores: [
        { skill: 'React', score: 95, level: 'Expert', questionsAttempted: 2, questionsCorrect: 2 },
        { skill: 'TypeScript', score: 85, level: 'Expert', questionsAttempted: 1, questionsCorrect: 1 },
        { skill: 'Git', score: 90, level: 'Expert', questionsAttempted: 1, questionsCorrect: 1 },
        { skill: 'REST APIs', score: 90, level: 'Expert', questionsAttempted: 1, questionsCorrect: 1 },
        { skill: 'Node.js', score: 75, level: 'Proficient', questionsAttempted: 2, questionsCorrect: 2 },
        { skill: 'MongoDB', score: 70, level: 'Proficient', questionsAttempted: 2, questionsCorrect: 1 },
        { skill: 'Docker', score: 65, level: 'Proficient', questionsAttempted: 1, questionsCorrect: 1 },
      ],
      gaps: [],
      strengths: ['React', 'TypeScript', 'Git', 'REST APIs', 'Node.js'],
      assessmentsHistory: [
        { domain: 'Full Stack Web Development', score: 84, takenAt: new Date(Date.now() - 86400000 * 2) },
      ],
      lastAssessedAt: new Date(),
    });

    const amitProfile = await SkillProfile.create({
      userId: student3._id,
      domain: 'AI & Data Science',
      overallScore: 62,
      readinessLevel: 'Developing',
      skillScores: [
        { skill: 'Python', score: 80, level: 'Proficient', questionsAttempted: 1, questionsCorrect: 1 },
        { skill: 'SQL', score: 70, level: 'Proficient', questionsAttempted: 1, questionsCorrect: 1 },
        { skill: 'Pandas', score: 65, level: 'Intermediate', questionsAttempted: 1, questionsCorrect: 1 },
        { skill: 'Machine Learning', score: 45, level: 'Beginner', questionsAttempted: 1, questionsCorrect: 0 },
        { skill: 'Deep Learning', score: 40, level: 'Beginner', questionsAttempted: 1, questionsCorrect: 0 },
      ],
      gaps: [
        {
          skill: 'Deep Learning',
          currentScore: 40,
          benchmarkScore: 65,
          gapPercentage: 25,
          priority: 'High',
          learningResourceUrl: 'https://realpython.com/',
          resourceTitle: 'Neural Networks & Deep Learning Essentials',
        },
        {
          skill: 'Machine Learning',
          currentScore: 45,
          benchmarkScore: 70,
          gapPercentage: 25,
          priority: 'High',
          learningResourceUrl: 'https://scikit-learn.org/stable/tutorial/index.html',
          resourceTitle: 'Scikit-Learn Machine Learning in Python Walkthrough',
        },
      ],
      strengths: ['Python', 'SQL'],
      assessmentsHistory: [
        { domain: 'AI & Data Science', score: 62, takenAt: new Date(Date.now() - 86400000 * 5) },
      ],
      lastAssessedAt: new Date(),
    });

    // 3. Create Industry Postings
    console.log('[Seed] Creating industry job & internship postings...');
    const posting1 = await Posting.create({
      industryId: industry1._id,
      companyName: 'TechCorp Innovations',
      title: 'Full Stack MERN Developer Intern',
      description:
        'Join TechCorp as a Full Stack Intern working on high-throughput microservices and responsive dashboard interfaces. You will build React frontends and Node/Express APIs connected to MongoDB.',
      type: 'Internship',
      workMode: 'Hybrid',
      location: 'Bengaluru, India (Hybrid)',
      stipend: '₹30,000 / month',
      duration: '6 Months',
      requiredSkills: ['React', 'Node.js', 'MongoDB', 'REST APIs', 'Git', 'Docker'],
      experienceLevel: 'Entry Level',
      deadline: new Date(Date.now() + 86400000 * 25),
      openings: 3,
      status: 'Active',
    });

    const posting2 = await Posting.create({
      industryId: industry1._id,
      companyName: 'TechCorp Innovations',
      title: 'Frontend React & UI/UX Engineer Intern',
      description:
        'We are looking for a creative and detail-oriented Frontend Intern to design and ship customer-facing web applications using React, modern CSS, and component libraries.',
      type: 'Internship',
      workMode: 'Remote',
      location: 'Remote (Pan India)',
      stipend: '₹25,000 / month',
      duration: '4 Months',
      requiredSkills: ['React', 'TypeScript', 'Git', 'REST APIs'],
      experienceLevel: 'Entry Level',
      deadline: new Date(Date.now() + 86400000 * 30),
      openings: 2,
      status: 'Active',
    });

    const posting3 = await Posting.create({
      industryId: industry2._id,
      companyName: 'CloudScale Labs',
      title: 'Junior Cloud & DevOps Engineer',
      description:
        'CloudScale Labs is seeking a motivated junior engineer to assist in containerizing services, managing CI/CD deployment pipelines, and monitoring infrastructure reliability.',
      type: 'Full-Time',
      workMode: 'Hybrid',
      location: 'Hyderabad, India',
      stipend: '₹8,50,000 - ₹11,00,000 / annum',
      duration: 'Permanent Full-time',
      requiredSkills: ['Docker', 'Kubernetes', 'CI/CD', 'Linux', 'Node.js'],
      experienceLevel: 'Entry Level',
      deadline: new Date(Date.now() + 86400000 * 40),
      openings: 2,
      status: 'Active',
    });

    // 4. Create Applications
    console.log('[Seed] Creating applications linking students to postings...');
    const rahulMatch = calculateSkillMatch(rahulProfile, posting1.requiredSkills);
    await Application.create({
      studentId: student1._id,
      postingId: posting1._id,
      matchPercent: rahulMatch.matchPercent,
      matchedSkills: rahulMatch.matchedSkills,
      missingSkills: rahulMatch.missingSkills,
      status: 'Shortlisted',
      coverNote: 'I have built multiple full stack projects with MERN and would love to contribute to TechCorp.',
      recruiterNotes: 'Solid React and API foundations; good culture fit candidate for interview round 1.',
      appliedAt: new Date(Date.now() - 86400000 * 1),
    });

    const priyaMatch = calculateSkillMatch(priyaProfile, posting1.requiredSkills);
    await Application.create({
      studentId: student2._id,
      postingId: posting1._id,
      matchPercent: priyaMatch.matchPercent,
      matchedSkills: priyaMatch.matchedSkills,
      missingSkills: priyaMatch.missingSkills,
      status: 'Interview Scheduled',
      coverNote: 'Experienced in TypeScript and React component architectures. Excited about TechCorp tech stack.',
      recruiterNotes: 'Top-tier skill match (90%+). Technical round scheduled for Tuesday.',
      appliedAt: new Date(Date.now() - 86400000 * 2),
    });

    // 5. Create Documents in Student Vault (Verified Resumes, Certs, Transcripts)
    console.log('[Seed] Creating verified student documents...');
    await Document.create({
      userId: student1._id,
      title: 'Official Academic Transcript (Semester I-VI)',
      type: 'Academic Transcript / Marksheet',
      fileName: 'Rahul_Sharma_Transcript_NAD.pdf',
      fileSize: '2.1 MB',
      fileUrl: 'https://nad.digitallocker.gov.in/doc/rahul_transcript.pdf',
      issuer: 'IIIT Examination Cell',
      issuedDate: new Date(Date.now() - 86400000 * 60),
      credentialId: 'NAD-IIIT-2026-88941',
      verificationStatus: 'Verified (DigiLocker)',
      tags: ['Verified CGPA 8.7', 'NAD Certified'],
    });

    await Document.create({
      userId: student1._id,
      title: 'Meta Certified Frontend Developer Professional Certificate',
      type: 'Certification',
      fileName: 'Meta_Frontend_Specialization_Coursera.pdf',
      fileSize: '1.4 MB',
      fileUrl: 'https://coursera.org/verify/meta-frontend-rahul',
      issuer: 'Coursera & Meta Open Source',
      issuedDate: new Date(Date.now() - 86400000 * 30),
      credentialId: 'COURSERA-META-782194',
      verificationStatus: 'Verified (Industry Partner)',
      tags: ['React', 'JavaScript', 'CSS Modules'],
    });

    await Document.create({
      userId: student1._id,
      title: 'Software Engineering Resume (2026 Graduate)',
      type: 'Resume / CV',
      fileName: 'Rahul_Sharma_FullStack_Resume.pdf',
      fileSize: '650 KB',
      fileUrl: 'https://storage.skillbridge.edu/resumes/rahul_cv.pdf',
      issuer: 'Self-Uploaded',
      issuedDate: new Date(),
      credentialId: 'RES-2026-001',
      verificationStatus: 'Verified (Institution)',
      tags: ['MERN Stack', 'REST APIs', 'Cloud'],
    });

    await Document.create({
      userId: student1._id,
      title: 'Summer Internship Completion Report & Letter of Recommendation',
      type: 'Internship Completion Report',
      fileName: 'Summer_Internship_Report_CloudScale.pdf',
      fileSize: '3.4 MB',
      fileUrl: 'https://storage.skillbridge.edu/internships/lor_cloudscale.pdf',
      issuer: 'CloudScale Labs Engineering',
      issuedDate: new Date(Date.now() - 86400000 * 90),
      credentialId: 'LOR-CSL-2025-042',
      verificationStatus: 'Verified (Industry Partner)',
      tags: ['Microservices', 'Docker', 'Performance'],
    });

    // 6. Create Industry Mentorship Profiles
    console.log('[Seed] Creating industry mentors...');
    await Mentorship.create({
      mentorId: industry1._id,
      mentorName: 'Karan Singhania',
      mentorTitle: 'Head of Engineering Talent',
      mentorCompany: 'TechCorp Innovations',
      bio: '12+ years in software engineering & campus hiring. Helping students crack product company interviews, master system design, and build resilient resumes.',
      expertise: ['Full Stack MERN', 'System Design', 'Resume Critique', 'Mock Technical Interviews'],
      experienceYears: 12,
      rating: 4.9,
      totalSessionsConducted: 42,
      availableSlots: [
        { slotId: 'slot_1', day: 'Wednesdays', time: '5:00 PM - 6:00 PM', isBooked: false },
        { slotId: 'slot_2', day: 'Saturdays', time: '11:00 AM - 12:00 PM', isBooked: false },
        { slotId: 'slot_3', day: 'Sundays', time: '4:00 PM - 5:00 PM', isBooked: true },
      ],
      bookings: [
        {
          studentId: student1._id,
          studentName: 'Rahul Sharma',
          studentEmail: 'student@demo.com',
          topic: 'Full-Stack Architecture & Mock Technical Interview',
          slotTime: 'Saturday, 11:00 AM',
          scheduledDate: new Date(Date.now() + 86400000 * 3),
          status: 'Confirmed',
          meetLink: 'https://meet.google.com/xyz-collab-mentor',
          notes: 'Reviewed student portfolio; scheduled 1-on-1 mock system design round.',
        },
      ],
    });

    await Mentorship.create({
      mentorId: industry2._id,
      mentorName: 'Ananya Roy',
      mentorTitle: 'Senior Director of Cloud Systems',
      mentorCompany: 'CloudScale Labs',
      bio: 'Ex-Amazon, AWS Certified Solutions Architect. Mentoring on Kubernetes, distributed cloud architectures, and open-source contributions.',
      expertise: ['Cloud & DevOps', 'Kubernetes', 'CI/CD Pipelines', 'Distributed Backend'],
      experienceYears: 14,
      rating: 5.0,
      totalSessionsConducted: 58,
      availableSlots: [
        { slotId: 'slot_4', day: 'Thursdays', time: '6:00 PM - 7:00 PM', isBooked: false },
        { slotId: 'slot_5', day: 'Saturdays', time: '2:00 PM - 3:00 PM', isBooked: false },
      ],
      bookings: [],
    });

    // 7. Create Live Industry Capstone Projects
    console.log('[Seed] Creating live industry projects...');
    await LiveProject.create({
      companyId: industry1._id,
      companyName: 'TechCorp Innovations',
      title: 'High-Throughput Distributed Telemetry & Logging Engine',
      domain: 'Cloud Systems & Microservices',
      problemStatement:
        'Design and implement a scalable log aggregation service capable of processing 10,000 event packets/sec, storing in partitioned indexes, and rendering real-time metrics charts.',
      techStack: ['Node.js', 'Redis Streams', 'Docker', 'MongoDB', 'WebSockets'],
      duration: '8 Weeks',
      grantAmount: '₹60,000 Project Grant + Direct PPO Evaluation',
      status: 'Open for Submissions',
      milestones: [
        { title: 'Milestone 1: Stream Ingestion Spec', deliverable: 'Architecture diagram & Redis ingestion broker', durationWeeks: 2 },
        { title: 'Milestone 2: Multi-Node Aggregator', deliverable: 'Docker Compose cluster with backpressure handling', durationWeeks: 4 },
        { title: 'Milestone 3: Dashboard & Benchmarking', deliverable: 'Live UI & load test report with Apache JMeter', durationWeeks: 2 },
      ],
      teams: [
        {
          teamLeaderId: student1._id,
          teamName: 'ByteCraft Engineering',
          leaderName: 'Rahul Sharma',
          leaderEmail: 'student@demo.com',
          institution: 'IIIT Bangalore',
          teamSize: 3,
          proposal: 'We propose a zero-loss streaming queue using Redis consumer groups and chunked MongoDB time-series collections.',
          status: 'Project Assigned',
          repoUrl: 'https://github.com/bytecraft/telemetry-engine',
        },
      ],
    });

    await LiveProject.create({
      companyId: industry2._id,
      companyName: 'CloudScale Labs',
      title: 'Automated Kubernetes Vulnerability Scanner & Policy Enforcer',
      domain: 'Cloud Security & DevOps',
      problemStatement:
        'Develop an automated webhook controller that inspects container images before deployment into Kubernetes clusters, rejecting images with CVE score > 7.0.',
      techStack: ['Go / Node.js', 'Docker', 'Kubernetes Admission Controllers', 'Trivy'],
      duration: '6 Weeks',
      grantAmount: '₹45,000 Grant + Summer Internship',
      status: 'Open for Submissions',
      milestones: [
        { title: 'Milestone 1: Webhook Controller', deliverable: 'Validating Admission Webhook skeleton', durationWeeks: 2 },
        { title: 'Milestone 2: Scanner Integration', deliverable: 'Static analysis pipeline with Trivy engine', durationWeeks: 3 },
        { title: 'Milestone 3: Audit Dashboard', deliverable: 'Security compliance dashboard with exportable PDF', durationWeeks: 1 },
      ],
      teams: [],
    });

    // 8. Create Academician Collaboration Proposals
    console.log('[Seed] Creating academician collaboration posts...');
    await CollaborationPost.create({
      academicianId: academician1._id,
      institution: 'ABC Institute of Technology',
      department: 'Computer Science & Engineering',
      title: 'Faculty Development Program (FDP): Cloud Native & Microservice Architectures',
      type: 'Faculty Development Program',
      description:
        'Seeking senior industry architects to deliver hands-on sessions on Kubernetes, Docker, and event-driven microservices to upskill 45+ faculty members from engineering institutions.',
      targetDomain: 'Cloud & Distributed Systems',
      proposedDuration: '2 Weeks (Virtual & Hybrid)',
      status: 'Open',
      interests: [
        {
          companyId: industry2._id,
          companyName: 'CloudScale Labs',
          recruiterName: 'Ananya Roy',
          contactEmail: 'ananya@cloudscalelabs.tech',
          message: 'Our principal architects would be thrilled to conduct sessions on Kubernetes container orchestration.',
          createdAt: new Date(),
        },
      ],
    });

    // 9. Create Integrations
    console.log('[Seed] Initializing external integrations...');
    await Integration.create([
      {
        name: 'DigiLocker National Academic Depository (NAD)',
        category: 'Credential & Identity Provider',
        description: 'Cryptographically verified degree certificates, marksheets, and Government-verified student IDs.',
        icon: 'ShieldCheck',
        status: 'Connected (Live Sync)',
        recordsSynced: 1240,
        syncSummary: 'Active webhook: Automated verification of student transcript hashes',
        supportedDataTypes: ['B.Tech Marksheets', 'Degree Certificates', 'Aadhaar / Student Identity'],
      },
      {
        name: 'NPTEL & SWAYAM Platform',
        category: 'Learning Platform',
        description: 'Official IIT/IISc online course completions, proctored exam scores, and Elite certification badges.',
        icon: 'GraduationCap',
        status: 'Connected (Live Sync)',
        recordsSynced: 480,
        syncSummary: 'Synchronized course scores for Data Structures, Cloud, and VLSI',
        supportedDataTypes: ['Proctored Exam Scores', 'Elite + Gold Badges', 'Faculty FDP Certificates'],
      },
      {
        name: 'Coursera & edX for Campus',
        category: 'Learning Platform',
        description: 'Corporate-guided specialization tracks from Google, Meta, AWS, and IBM mapped to student skill profiles.',
        icon: 'BookOpen',
        status: 'Connected (Live Sync)',
        recordsSynced: 890,
        syncSummary: 'Automatic skill profile boosting upon course completion verification',
        supportedDataTypes: ['Specialization Certificates', 'Course Completion Badges', 'Guided Project Hours'],
      },
      {
        name: 'HackerRank & LeetCode Assessment Bridge',
        category: 'Assessment & Coding Platform',
        description: 'Synchronizes algorithmic problem solving ratings, contest ranks, and verified skill badges.',
        icon: 'Code2',
        status: 'Connected (Live Sync)',
        recordsSynced: 620,
        syncSummary: 'Live rating sync: Data Structures, Algorithms, SQL, and Full Stack',
        supportedDataTypes: ['Contest Rating', 'Problem Solving Star Rating', 'Verified Skill Badges'],
      },
      {
        name: 'Institutional SIS / Campus ERP (SAP / Peoplesoft)',
        category: 'Institutional Database (SIS/ERP)',
        description: 'Real-time student enrollment roster, CGPA academic records, and departmental batch data sync.',
        icon: 'Database',
        status: 'Connected (Live Sync)',
        recordsSynced: 3450,
        syncSummary: 'Nightly batch sync: Student enrollment, GPA updates, and placement status',
        supportedDataTypes: ['Student Cohort Roster', 'Semester CGPA', 'Departmental Enrollment'],
      },
    ]);

    console.log('[Seed] Database seeding completed successfully with all Enterprise Modules! ✨');
    if (shouldExit) process.exit(0);
    return { success: true, message: 'Database seeded successfully' };
  } catch (error) {
    console.error('[Seed] Seeding failed with error:', error);
    if (shouldExit) process.exit(1);
    throw error;
  }
};

const autoSeedIfEmpty = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[AutoSeed] Empty database detected. Automatically seeding demo dataset...');
      await seedDB(false);
      console.log('[AutoSeed] Auto-seed finished! All demo accounts are active.');
    }
  } catch (err) {
    console.error('[AutoSeed] Error checking or seeding initial dataset:', err.message);
  }
};

if (require.main === module) {
  seedDB(true);
}

module.exports = { seedDB, autoSeedIfEmpty };
