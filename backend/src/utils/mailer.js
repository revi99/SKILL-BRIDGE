const nodemailer = require('nodemailer');
const dns = require('dns');

// Initialize Transporter with pooled connection and fast timeouts
let transporter = null;

const resolveIPv4 = async (hostname) => {
  try {
    const res = await dns.promises.lookup(hostname, { family: 4 });
    return res.address;
  } catch (e) {
    return '142.250.190.108'; // Reliable Google Gmail SMTP IPv4 fallback
  }
};

const getTransporter = async () => {
  if (transporter) return transporter;

  const user = (process.env.EMAIL_USER || 'ravi11teja67@gmail.com').trim();
  const pass = (process.env.EMAIL_PASS || 'xwkidehukffiynfw').replace(/\s+/g, '').trim();

  if (user && pass) {
    const smtpIp = await resolveIPv4('smtp.gmail.com');
    console.log(`[Mailer] Initializing live Gmail SMTP transport on IPv4 ${smtpIp}:587 with user: ${user}`);
    transporter = nodemailer.createTransport({
      host: smtpIp, // Passing literal IPv4 string prevents any IPv6 socket attempt
      port: 587,
      secure: false, // Port 587 uses STARTTLS
      requireTLS: true,
      auth: {
        user: user,
        pass: pass,
      },
      tls: {
        servername: 'smtp.gmail.com', // Keeps SSL certificate validation matching smtp.gmail.com
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });
    return transporter;
  }

  // Fallback to fast JSON transport if no credentials are provided to prevent server lag
  console.log('[Mailer] No live SMTP credentials provided in environment, using fast JSON transport.');
  transporter = nodemailer.createTransport({
    jsonTransport: true,
  });
  return transporter;
};

const sendCollaborationEmail = async ({ toEmail, coordinatorName, companyName, recruiterName, contactEmail, programTitle, programType, institution, message }) => {
  try {
    const activeTransporter = await getTransporter();

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

    const senderAddress = (process.env.EMAIL_USER || 'ravi11teja67@gmail.com').trim();
    const mailOptions = {
      from: `"SkillBridge Collaboration Portal" <${senderAddress}>`,
      to: toEmail,
      replyTo: contactEmail,
      subject: `🎓 New Industry Collaboration Request: ${programTitle} (${companyName})`,
      text: `Hello ${coordinatorName},\n\n${companyName} (${recruiterName}, ${contactEmail}) has expressed interest in collaborating on: ${programTitle}.\n\nNote:\n"${message}"\n\nYou can reply directly to: ${contactEmail}`,
      html: htmlContent,
    };

    const info = await activeTransporter.sendMail(mailOptions);
    console.log(`[Mailer] Real-time collaboration email sent to ${toEmail}: messageId=${info?.messageId}`);
    
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
