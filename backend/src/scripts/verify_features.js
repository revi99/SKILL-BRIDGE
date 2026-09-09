const http = require('http');

const BASE_URL = 'http://localhost:5000/api';

async function request(endpoint, method = 'GET', body = null, token = null) {
  const url = new URL(BASE_URL + endpoint);
  const options = {
    hostname: url.hostname,
    port: url.port,
    path: url.pathname + url.search,
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runComprehensiveTests() {
  console.log('================================================================');
  console.log('🚀 SIH 26044 ENTERPRISE 5-PILLAR FEATURE VERIFICATION SUITE');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${message}`);
      failed++;
    }
  }

  try {
    // 1. Health & Demo Accounts for 4 Roles
    console.log('1. Health Check & 4-Role Authentication');
    const health = await request('/health');
    assert(health.status === 200 && health.body.status === 'online', 'Server health check returns online with all enterprise modules');

    const studentLogin = await request('/auth/login', 'POST', { email: 'student@demo.com', password: 'password123' });
    assert(studentLogin.status === 200 && studentLogin.body.user.role === 'student', 'Student (Rahul) authenticated successfully');
    const studentToken = studentLogin.body.token;

    const industryLogin = await request('/auth/login', 'POST', { email: 'industry@demo.com', password: 'password123' });
    assert(industryLogin.status === 200 && industryLogin.body.user.role === 'industry', 'Industry Recruiter (TechCorp) authenticated successfully');
    const industryToken = industryLogin.body.token;

    const academicianLogin = await request('/auth/login', 'POST', { email: 'academician@demo.com', password: 'password123' });
    assert(academicianLogin.status === 200 && academicianLogin.body.user.role === 'academician', 'Academician Dean (Dr. Thorne) authenticated successfully');
    const academicianToken = academicianLogin.body.token;

    const institutionLogin = await request('/auth/login', 'POST', { email: 'institution@demo.com', password: 'password123' });
    assert(institutionLogin.status === 200, 'Institution / NIRF Policy Lead (Dr. Sethi) authenticated successfully');
    const institutionToken = institutionLogin.body.token;

    // 2. Document Vault & Verification
    console.log('\n2. Secure Document Management (Resumes, Certs, Transcripts, Reports)');
    const myDocs = await request('/documents/my', 'GET', null, studentToken);
    assert(myDocs.status === 200 && myDocs.body.documents.length >= 4, 'Student retrieves documents from vault (transcripts, certificates, resumes, reports)');
    
    // Upload a new certificate
    const uploadDoc = await request('/documents/upload', 'POST', {
      title: 'Certified Kubernetes Administrator (CKA)',
      type: 'Certification',
      issuer: 'Cloud Native Computing Foundation (CNCF)',
      credentialId: 'CKA-994821',
      fileSize: '1.8 MB',
    }, studentToken);
    assert(uploadDoc.status === 201 && uploadDoc.body.document._id, 'Student uploads new certificate to vault');
    const docId = uploadDoc.body.document._id;

    // Verify document via DigiLocker / Institution
    const verifyDoc = await request(`/documents/${docId}/verify`, 'PUT', null, studentToken);
    assert(verifyDoc.status === 200 && verifyDoc.body.document.verificationStatus === 'Verified (DigiLocker)', 'Cryptographic DigiLocker verification simulated successfully');

    // 3. Collaboration Ecosystem: Mentorship & Live Projects
    console.log('\n3. Collaboration Ecosystem: 1-on-1 Mentorship & Live Projects');
    const mentors = await request('/mentorship/mentors');
    assert(mentors.status === 200 && mentors.body.mentors.length >= 2, 'Retrieved verified industry mentors with ratings and slots');
    const mentorId = mentors.body.mentors[0]._id;

    // Book mentorship session
    const bookRes = await request('/mentorship/book', 'POST', {
      mentorId,
      slotTime: 'Saturday 11:00 AM',
      topic: 'Full Stack Microservices Architecture & Mock System Design',
      notes: 'Please review my Redis caching layer.',
    }, studentToken);
    assert(bookRes.status === 201 && bookRes.body.booking.meetLink, 'Mentorship session booked with generated Google Meet video link');

    // View booked sessions
    const mySessions = await request('/mentorship/my-sessions', 'GET', null, studentToken);
    assert(mySessions.status === 200 && mySessions.body.sessions.length >= 1, 'Student views active mentorship sessions');

    // Live Corporate Capstone Challenges
    const projects = await request('/projects');
    assert(projects.status === 200 && projects.body.projects.length >= 2, 'Retrieved active corporate live projects with grant awards and milestones');
    const projId = projects.body.projects[0]._id;

    // Student team applies for live project
    const projApply = await request(`/projects/${projId}/apply`, 'POST', {
      teamName: 'ByteCraft Innovators',
      teamSize: 3,
      proposal: 'We will implement high-speed ingestion with Redis Streams and Docker clusters.',
      repoUrl: 'https://github.com/bytecraft/telemetry-solution',
    }, studentToken);
    assert(projApply.status === 201, 'Student team submitted capstone proposal to corporate sponsor');

    // 4. Learning Platforms & Institutional ERP Integrations
    console.log('\n4. External Integrations Hub (DigiLocker, NPTEL, Coursera, HackerRank, SIS)');
    const integrations = await request('/integrations');
    assert(integrations.status === 200 && integrations.body.integrations.length >= 5, 'Retrieved 5 external connectors (DigiLocker, NPTEL, Coursera, HackerRank, SIS/ERP)');
    const intId = integrations.body.integrations[0]._id;

    // Trigger real-time sync
    const syncRes = await request(`/integrations/${intId}/trigger-sync`, 'POST', null, institutionToken);
    assert(syncRes.status === 200 && syncRes.body.integration.recordsSynced > 0, 'Real-time synchronization triggered with external credential provider');

    // 5. Policymaker & Institutional Decision Analytics
    console.log('\n5. Comprehensive Decision Analytics for Institutions & Policymakers');
    const policyData = await request('/analytics/policy-decision-suite', 'GET', null, institutionToken);
    assert(policyData.status === 200 && policyData.body.regionalSkillDeficits.length > 0, 'Regional Skill Deficit Heatmap generated (Tier 1 vs Tier 2/3 comparison)');
    assert(policyData.body.placementVelocityTrends.length > 0, 'Placement & hiring velocity trend metrics computed');
    assert(policyData.body.nirfComplianceScores.overallAccreditationIndex, `NIRF Accreditation readiness computed: ${policyData.body.nirfComplianceScores.overallAccreditationIndex}`);

    console.log('\n================================================================');
    console.log(`🎉 ALL 5 ENTERPRISE PILLARS TESTED: ${passed} PASSED, ${failed} FAILED`);
    console.log('================================================================\n');

    process.exit(failed > 0 ? 1 : 0);
  } catch (error) {
    console.error('Fatal test error:', error);
    process.exit(1);
  }
}

runComprehensiveTests();
