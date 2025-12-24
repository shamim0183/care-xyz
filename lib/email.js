import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)
export async function sendBookingConfirmationEmail({
  to,
  userName,
  bookingDetails,
}) {
  const {
    serviceName,
    duration,
    location,
    totalCost,
    bookingId,
    status,
    createdAt,
  } = bookingDetails

  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmation - Care.xyz</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f5f5f5;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #C92C5C 0%, #A82349 100%);
      color: white;
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 600;
    }
    .content {
      padding: 30px;
    }
    .greeting {
      font-size: 16px;
      margin-bottom: 20px;
      color: #555;
    }
    .invoice-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 20px;
      margin: 20px 0;
    }
    .invoice-title {
      font-size: 18px;
      font-weight: 600;
      color: #C92C5C;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 2px solid #C92C5C;
    }
    .invoice-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #e2e8f0;
    }
    .invoice-row:last-child {
      border-bottom: none;
    }
    .invoice-label {
      font-weight: 500;
      color: #64748b;
    }
    .invoice-value {
      font-weight: 600;
      color: #1e293b;
      text-align: right;
    }
    .total-row {
      background: white;
      margin-top: 10px;
      padding: 15px;
      border-radius: 4px;
      border: 2px solid #C92C5C;
    }
    .total-row .invoice-label {
      color: #C92C5C;
      font-size: 18px;
    }
    .total-row .invoice-value {
      color: #C92C5C;
      font-size: 24px;
    }
    .status-badge {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      background: #fef3c7;
      color: #92400e;
    }
    .footer {
      background: #f8fafc;
      padding: 20px 30px;
      text-align: center;
      color: #64748b;
      font-size: 14px;
      border-top: 1px solid #e2e8f0;
    }
    .footer a {
      color: #C92C5C;
      text-decoration: none;
    }
    .button {
      display: inline-block;
      padding: 12px 30px;
      background: #C92C5C;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      margin: 20px 0;
    }
    .location-details {
      font-size: 14px;
      color: #475569;
      line-height: 1.8;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🏥 Care.xyz</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">Booking Confirmation</p>
    </div>
    
    <div class="content">
      <p class="greeting">Dear ${userName},</p>
      
      <p>Thank you for booking with Care.xyz! Your booking has been confirmed and our team will contact you shortly.</p>
      
      <div class="invoice-box">
        <div class="invoice-title">📋 Booking Invoice</div>
        
        <div class="invoice-row">
          <span class="invoice-label">Service</span>
          <span class="invoice-value">${serviceName}</span>
        </div>
        
        <div class="invoice-row">
          <span class="invoice-label">Duration</span>
          <span class="invoice-value">${duration.value} ${duration.unit}</span>
        </div>
        
        <div class="invoice-row">
          <span class="invoice-label">Location</span>
          <span class="invoice-value location-details">
            ${location.area}, ${location.city}<br>
            ${location.district}, ${location.division}
          </span>
        </div>
        
        <div class="invoice-row">
          <span class="invoice-label">Address</span>
          <span class="invoice-value location-details">${
            location.address
          }</span>
        </div>
        
        <div class="invoice-row">
          <span class="invoice-label">Booking Date</span>
          <span class="invoice-value">${new Date(createdAt).toLocaleDateString(
            "en-US",
            { year: "numeric", month: "long", day: "numeric" }
          )}</span>
        </div>
        
        <div class="invoice-row">
          <span class="invoice-label">Booking ID</span>
          <span class="invoice-value">#${bookingId
            .slice(-8)
            .toUpperCase()}</span>
        </div>
        
        <div class="invoice-row">
          <span class="invoice-label">Status</span>
          <span class="invoice-value">
            <span class="status-badge">${status}</span>
          </span>
        </div>
        
        <div class="total-row invoice-row">
          <span class="invoice-label">Total Cost</span>
          <span class="invoice-value">৳${totalCost.toLocaleString()}</span>
        </div>
      </div>
      
      <p style="margin-top: 20px; color: #64748b; font-size: 14px;">
        <strong>What's Next?</strong><br>
        Our customer service team will reach out to you within 24 hours to confirm the details and schedule your care service.
      </p>
      
      <center>
        <a href="${
          process.env.NEXTAUTH_URL
        }/my-bookings" class="button" style="color: #ffffff !important; text-decoration: none;">View My Bookings</a>
      </center>
    </div>
    
    <div class="footer">
      <p>If you have any questions, please contact us at <a href="mailto:support@care.xyz">support@care.xyz</a></p>
      <p>&copy; ${new Date().getFullYear()} Care.xyz. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `

  try {
    const { data, error } = await resend.emails.send({
      from: "Care.xyz <onboarding@resend.dev>",
      to: [to],
      subject: `Booking Confirmation - ${serviceName} #${bookingId
        .slice(-8)
        .toUpperCase()}`,
      html: emailHtml,
    })

    if (error) {
      console.error("Email send error:", error)
      return { success: false, error }
    }

    console.log("Email sent successfully:", data)
    return { success: true, data }
  } catch (error) {
    console.error("Email service error:", error)
    return { success: false, error }
  }
}

/**
 * Send admin notification for new booking
 */
export async function sendAdminBookingNotification(bookingDetails) {
  // Implementation for admin notifications
  // Can be added later if needed
}
