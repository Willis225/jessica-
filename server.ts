import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse JSON bodies
  app.use(express.json());

  // API Route: Send Welcome Email
  app.post("/api/send-welcome-email", async (req, res) => {
    const { email, fullName } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }

    const recipientName = fullName || "New Investor";

    // SMTP configuration check
    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = parseInt(process.env.SMTP_PORT || "465", 10);
    const smtpSecure = process.env.SMTP_SECURE === "false" ? false : true;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const fromName = process.env.SMTP_FROM_NAME || "INVEST EMPOWERMENT";
    const fromEmail = process.env.SMTP_FROM_EMAIL || "no-reply@investempowerment.com";

    console.log(`[Email Service] Attempting to send welcome email to: ${email} (${recipientName})`);

    // Guard: Check if SMTP details are actually set or if they are still defaults
    const isMock = !smtpUser || smtpUser === "your_email@gmail.com" || !smtpPass || smtpPass === "your_app_password";

    const appUrl = process.env.NODE_ENV === "production"
      ? "https://ais-pre-fy4jhyypsy7n3gxmcqt4ti-421115220013.europe-west2.run.app"
      : "http://localhost:3000";

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Welcome to INVEST EMPOWERMENT</title>
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background-color: #f8fafc;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #f8fafc;
      padding: 40px 20px;
      box-sizing: border-box;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      border: 1px solid #e2e8f0;
    }
    .header {
      background-color: #1e3a8a;
      background-image: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
      padding: 40px 30px;
      text-align: center;
      color: #ffffff;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 800;
      letter-spacing: -0.025em;
    }
    .header p {
      margin: 10px 0 0 0;
      font-size: 16px;
      color: #bfdbfe;
      font-weight: 500;
    }
    .content {
      padding: 40px 30px;
      color: #334155;
      line-height: 1.6;
    }
    .content h2 {
      color: #0f172a;
      font-size: 20px;
      font-weight: 700;
      margin-top: 0;
      margin-bottom: 16px;
    }
    .content p {
      margin-top: 0;
      margin-bottom: 20px;
      font-size: 15px;
    }
    .button-container {
      text-align: center;
      margin: 30px 0;
    }
    .btn {
      display: inline-block;
      background-color: #2563eb;
      color: #ffffff !important;
      font-weight: 700;
      font-size: 15px;
      padding: 14px 28px;
      text-decoration: none;
      border-radius: 8px;
      box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2), 0 2px 4px -1px rgba(37, 99, 235, 0.1);
    }
    .features {
      background-color: #f1f5f9;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 30px;
    }
    .feature-item {
      display: flex;
      margin-bottom: 16px;
    }
    .feature-item:last-child {
      margin-bottom: 0;
    }
    .feature-icon {
      font-size: 20px;
      margin-right: 12px;
    }
    .feature-text h3 {
      margin: 0 0 4px 0;
      font-size: 15px;
      font-weight: 700;
      color: #0f172a;
    }
    .feature-text p {
      margin: 0;
      font-size: 13px;
      color: #64748b;
    }
    .footer {
      background-color: #0f172a;
      padding: 30px;
      text-align: center;
      color: #94a3b8;
      font-size: 13px;
      border-top: 1px solid #e2e8f0;
    }
    .footer p {
      margin: 0 0 10px 0;
    }
    .footer p:last-child {
      margin: 0;
    }
    .footer a {
      color: #3b82f6;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1>INVEST EMPOWERMENT</h1>
        <p>Empowering Your Financial Future</p>
      </div>
      <div class="content">
        <h2>Welcome to the Platform, ${recipientName}!</h2>
        <p>We are absolutely thrilled to welcome you to <strong>INVEST EMPOWERMENT</strong>. Your journey towards financial growth, structural portfolio management, and dynamic asset security starts today.</p>
        
        <p>Our platform is custom-built to help you navigate and optimize your assets securely. Here are some of the key features at your fingertips:</p>
        
        <div class="features">
          <div class="feature-item">
            <span class="feature-icon">📈</span>
            <div class="feature-text">
              <h3>Real-Time Portfolio Tracking</h3>
              <p>Monitor and update your asset balances instantly with an intuitive, responsive dashboard designed for desktop and mobile.</p>
            </div>
          </div>
          <div class="feature-item">
            <span class="feature-icon">🔔</span>
            <div class="feature-text">
              <h3>Dynamic Price Alerts</h3>
              <p>Set custom threshold alerts for any of your target assets. Receive instant system notifications when prices go above or below your target.</p>
            </div>
          </div>
          <div class="feature-item">
            <span class="feature-icon">💵</span>
            <div class="feature-text">
              <h3>Streamlined Withdrawals</h3>
              <p>Process your withdrawals quickly with customized local receipts, exchange rates, and transparent bank verification details.</p>
            </div>
          </div>
        </div>

        <p>To access your dashboard, review your current holdings, or adjust your settings, simply click the button below to sign in:</p>
        
        <div class="button-container">
          <a href="${appUrl}" class="btn">Launch Dashboard</a>
        </div>
        
        <p>If you have any questions or require assistance setting up your portfolio, our support team is always ready to guide you. Simply reply directly to this email or reach out through the dashboard.</p>
        
        <p>To your ultimate success,<br><strong>The Invest Empowerment Team</strong></p>
      </div>
      <div class="footer">
        <p>&copy; 2026 INVEST EMPOWERMENT. All rights reserved.</p>
        <p>This is an automated message sent to <a href="mailto:${email}">${email}</a>. Please do not reply to this email directly unless requesting support.</p>
      </div>
    </div>
  </div>
</body>
</html>
    `;

    if (isMock) {
      console.warn("[Email Service] SMTP credentials not set or still default templates. Simulating email send (No-Op mode).");
      return res.status(200).json({
        success: true,
        message: "Email simulated successfully (Mock mode). Config SMTP to send live emails.",
        recipient: email,
        recipientName
      });
    }

    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const mailOptions = {
        from: `"${fromName}" <${fromEmail}>`,
        to: email,
        subject: `Welcome to INVEST EMPOWERMENT, ${recipientName}!`,
        html: emailHtml,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`[Email Service] Live welcome email sent to ${email}: ${info.messageId}`);
      
      return res.status(200).json({
        success: true,
        message: "Welcome email sent successfully.",
        messageId: info.messageId
      });
    } catch (sendError) {
      console.error("[Email Service] Failed to send live welcome email:", sendError);
      return res.status(500).json({
        error: "Failed to send welcome email.",
        details: sendError instanceof Error ? sendError.message : String(sendError)
      });
    }
  });

  // Serve static client assets and handle routing
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
