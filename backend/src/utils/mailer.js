const nodemailer = require('nodemailer');

// Initialize Transporter (uses environment variables if provided, otherwise creates a test/ethereal or standard SMTP transport)
let transporter;

const createTransporter = async () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // If using standard Gmail configuration
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    const cleanUser = process.env.EMAIL_USER.trim();
    const cleanPass = process.env.EMAIL_PASS.replace(/\s+/g, '').trim();
    console.log(`[Mailer] Initializing live Gmail SMTP transport with user: ${cleanUser}`);
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: cleanUser,
        pass: cleanPass,
      },
    });
  }

  // In development, create an Ethereal test account or fallback direct transporter
  try {
    const testAccount = await nodemailer.createTestAccount();
    console.log('[Mailer] Using Ethereal test account:', testAccount.user);
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  } catch (err) {
    console.warn('[Mailer] Could not create Ethereal account, falling back to JSON mock transport:', err.message);
    return nodemailer.createTransport({
      jsonTransport: true,
    });
  }
};

const sendCollaborationEmail = async ({ toEmail, coordinatorName, companyName, recruiterName, contactEmail, programTitle, programType, institution, message }) => {
  try {
    if (!transporter) {
      transporter = await createTransporter();
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
          .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
          .header { background: linear-gradient(135deg, #7c3aed, #4f46e5); color: #ffffff; padding: 28px 24px; }
          .badge { display: inline-block; padding: 4px 10px; border-radius: 9999px; background: rgba(255,255,255,0.2); font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
          .title { margin: 12px 0 4px; font-size: 22px; font-weight: 800; }
          .subtitle { margin: 0; opacity: 0.9; font-size: 14px; }
          .content { padding: 24px; }
          .info-box { background-color: #f1f5f9; border-radius: 12px; padding: 16px; margin: 16px 0; }
          .info-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px; }
          .info-row:last-child { margin-bottom: 0; }
          .label { color: #64748b; font-weight: 600; }
          .value { color: #0f172a; font-weight: 700; }
          .message-box { background-color: #faf5ff; border-left: 4px solid #7c3aed; padding: 14px 16px; border-radius: 8px; margin: 16px 0; font-size: 14px; line-height: 1.6; color: #334155; }
          .button { display: inline-block; background-color: #7c3aed; color: #ffffff !important; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-weight: 700; font-size: 14px; margin-top: 16px; }
          .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px 24px; font-size: 12px; color: #94a3b8; text-align: center; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <span class="badge">Industry Partnership Proposal</span>
            <h1 class="title">Collaboration Request Received</h1>
            <p class="subtitle">SkillBridge Academia-Industry Platform</p>
          </div>
          <div class="content">
            <p style="font-size: 15px;">Hello <strong>${coordinatorName || 'Coordinator'}</strong>,</p>
            <p style="font-size: 14px; color: #475569;">
              <strong>${companyName}</strong> has submitted an expression of interest to collaborate with <strong>${institution}</strong> on your academic program proposal.
            </p>

            <div class="info-box">
              <div class="info-row">
                <span class="label">Program Title:</span>
                <span class="value">${programTitle}</span>
              </div>
              <div class="info-row">
                <span class="label">Program Type:</span>
                <span class="value">${programType}</span>
              </div>
              <div class="info-row">
                <span class="label">Partner Organization:</span>
                <span class="value">${companyName}</span>
              </div>
              <div class="info-row">
                <span class="label">Recruiter / Representative:</span>
                <span class="value">${recruiterName}</span>
              </div>
              <div class="info-row">
                <span class="label">Contact Email:</span>
                <span class="value" style="color: #7c3aed;">${contactEmail}</span>
              </div>
            </div>

            <p style="font-size: 13px; font-weight: 700; color: #334155; margin-bottom: 6px;">Partnership Note & Proposed Topics:</p>
            <div class="message-box">
              "${message}"
            </div>

            <div style="text-align: center; margin: 24px 0 12px;">
              <a href="mailto:${contactEmail}?subject=Re: Collaboration on ${encodeURIComponent(programTitle)}" class="button">
                Reply to ${recruiterName} (${contactEmail})
              </a>
            </div>
          </div>
          <div class="footer">
            Sent in real time via SkillBridge Industry-Academia Collaborative Network • DigiLocker & AICTE / NEP Compliant
          </div>
        </div>
      </body>
      </html>
    `;

    const senderAddress = process.env.EMAIL_USER || 'no-reply@skillbridge.edu';
    const mailOptions = {
      from: `"SkillBridge Collaboration Portal" <${senderAddress}>`,
      to: toEmail,
      replyTo: contactEmail,
      subject: `🎓 New Industry Collaboration Request: ${programTitle} (${companyName})`,
      text: `Hello ${coordinatorName},\n\n${companyName} (${recruiterName}, ${contactEmail}) has expressed interest in collaborating on: ${programTitle}.\n\nNote:\n"${message}"\n\nYou can reply directly to: ${contactEmail}`,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Mailer] Real-time collaboration email sent to ${toEmail}: messageId=${info.messageId}`);
    
    // If ethereal, provide preview URL in logs
    if (nodemailer.getTestMessageUrl && info) {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        console.log(`[Mailer] Email Preview URL: ${previewUrl}`);
      }
    }

    return {
      success: true,
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl ? nodemailer.getTestMessageUrl(info) : null,
    };
  } catch (error) {
    console.error('[Mailer] Failed to send email:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

module.exports = {
  sendCollaborationEmail,
};
