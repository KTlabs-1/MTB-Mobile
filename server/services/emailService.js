const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const emailService = {
  /**
   * Send booking confirmation email to customer
   */
  async sendBookingConfirmation(booking) {
    try {
      if (!process.env.RESEND_API_KEY) {
        console.log('⚠️  No Resend API key - skipping customer confirmation email');
        return { success: false, message: 'No API key configured' };
      }

      const { data, error } = await resend.emails.send({
        from: process.env.EMAIL_FROM || 'MTB Mobile <onboarding@resend.dev>',
        to: booking.customer.email,
        subject: `Booking Confirmed - ${booking.bookingRef}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #000; color: #fff; padding: 20px; text-align: center; }
              .header h1 { margin: 0; color: #DC2626; }
              .content { padding: 20px; background: #f9f9f9; }
              .booking-details { background: #fff; padding: 15px; margin: 15px 0; border-left: 3px solid #DC2626; }
              .booking-details p { margin: 8px 0; }
              .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>MTB<span style="color: #DC2626;">CUTZ</span></h1>
                <p>Mobile Barber Service</p>
              </div>

              <div class="content">
                <h2>Booking Confirmed! ✅</h2>
                <p>Hi <strong>${booking.customer.name}</strong>,</p>
                <p>Your booking has been confirmed. We'll see you soon!</p>

                <div class="booking-details">
                  <p><strong>Reference Number:</strong> ${booking.bookingRef}</p>
                  <p><strong>Service:</strong> ${booking.service.name}</p>
                  <p><strong>Date:</strong> ${new Date(booking.date).toLocaleDateString('en-IE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  <p><strong>Time:</strong> ${booking.time}</p>
                  <p><strong>Location:</strong> ${booking.customer.address}</p>
                  <hr style="border: none; border-top: 1px solid #ddd; margin: 10px 0;">
                  <p><strong>Deposit Paid:</strong> €${booking.payment.depositAmount}</p>
                  <p><strong>Remaining Balance:</strong> €${booking.payment.remainingAmount}</p>
                  <p style="color: #666; font-size: 12px;">Remaining balance to be paid after service</p>
                </div>

                ${booking.customer.notes ? `<p><strong>Your Notes:</strong><br>${booking.customer.notes}</p>` : ''}

                <p>If you need to make any changes or cancel your booking, please contact us as soon as possible.</p>
              </div>

              <div class="footer">
                <p>Thanks for choosing MTB Mobile!</p>
                <p>Instagram: @the_hoodbarber1 | TikTok: @mtbcutz</p>
              </div>
            </div>
          </body>
          </html>
        `
      });

      if (error) {
        console.error('❌ Resend error (customer):', error);
        return { success: false, error };
      }

      console.log('✅ Confirmation email sent to:', booking.customer.email);
      return { success: true, data };
    } catch (error) {
      console.error('❌ Email error (customer):', error);
      return { success: false, error };
    }
  },

  /**
   * Send new booking alert to admin
   */
  async sendNewBookingAlert(booking) {
    try {
      if (!process.env.RESEND_API_KEY || !process.env.ADMIN_EMAIL) {
        console.log('⚠️  No Resend API key or admin email - skipping admin alert');
        return { success: false, message: 'No API key or admin email configured' };
      }

      const { data, error } = await resend.emails.send({
        from: process.env.EMAIL_FROM || 'MTB Mobile <onboarding@resend.dev>',
        to: process.env.ADMIN_EMAIL,
        subject: `🔔 New Booking - ${booking.bookingRef}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #DC2626; color: #fff; padding: 20px; text-align: center; }
              .content { padding: 20px; background: #f9f9f9; }
              .booking-info { background: #fff; padding: 15px; margin: 10px 0; }
              .booking-info p { margin: 8px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🔔 New Booking Received!</h1>
              </div>

              <div class="content">
                <div class="booking-info">
                  <h3>Booking Details</h3>
                  <p><strong>Reference:</strong> ${booking.bookingRef}</p>
                  <p><strong>Service:</strong> ${booking.service.name} - €${booking.service.price}</p>
                  <p><strong>Date:</strong> ${new Date(booking.date).toLocaleDateString('en-IE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  <p><strong>Time:</strong> ${booking.time}</p>
                  <p><strong>Duration:</strong> ${booking.service.duration}</p>
                </div>

                <div class="booking-info">
                  <h3>Customer Information</h3>
                  <p><strong>Name:</strong> ${booking.customer.name}</p>
                  <p><strong>Email:</strong> ${booking.customer.email}</p>
                  <p><strong>Phone:</strong> ${booking.customer.phone}</p>
                  <p><strong>Address:</strong> ${booking.customer.address}</p>
                  ${booking.customer.notes ? `<p><strong>Notes:</strong> ${booking.customer.notes}</p>` : ''}
                </div>

                <div class="booking-info">
                  <h3>Payment</h3>
                  <p><strong>Deposit Paid:</strong> €${booking.payment.depositAmount}</p>
                  <p><strong>Remaining:</strong> €${booking.payment.remainingAmount}</p>
                  <p><strong>Total:</strong> €${booking.service.price}</p>
                </div>
              </div>
            </div>
          </body>
          </html>
        `
      });

      if (error) {
        console.error('❌ Resend error (admin):', error);
        return { success: false, error };
      }

      console.log('✅ Admin alert sent to:', process.env.ADMIN_EMAIL);
      return { success: true, data };
    } catch (error) {
      console.error('❌ Email error (admin):', error);
      return { success: false, error };
    }
  },

  /**
   * Send contact form message to admin
   */
  async sendContactFormEmail({ name, email, phone, message }) {
    try {
      if (!process.env.RESEND_API_KEY || !process.env.ADMIN_EMAIL) {
        console.log('⚠️  No Resend API key or admin email - skipping contact email');
        return { success: false };
      }

      const { data, error } = await resend.emails.send({
        from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
        to: process.env.ADMIN_EMAIL,
        subject: `New Contact Form Message from ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #1a1a1a; color: #fff; padding: 40px;">
            <h2 style="color: #DC2626; margin-bottom: 20px;">New Contact Form Submission</h2>

            <div style="background-color: #252525; padding: 20px; margin-bottom: 20px; border-left: 4px solid #DC2626;">
              <p style="margin: 0 0 10px 0;"><strong style="color: #999;">Name:</strong> <span style="color: #fff;">${name}</span></p>
              <p style="margin: 0 0 10px 0;"><strong style="color: #999;">Email:</strong> <span style="color: #fff;">${email}</span></p>
              <p style="margin: 0;"><strong style="color: #999;">Phone:</strong> <span style="color: #fff;">${phone || 'Not provided'}</span></p>
            </div>

            <div style="background-color: #252525; padding: 20px;">
              <p style="color: #999; margin: 0 0 10px 0;"><strong>Message:</strong></p>
              <p style="color: #fff; margin: 0; white-space: pre-wrap;">${message}</p>
            </div>

            <p style="color: #666; font-size: 12px; margin-top: 30px;">
              This message was sent from the MTB Cutz contact form.
            </p>
          </div>
        `
      });

      if (error) {
        console.error('❌ Resend error (contact form):', error);
        return { success: false, error };
      }

      console.log('✅ Contact form email sent to admin');
      return { success: true, data };
    } catch (error) {
      console.error('❌ Email error (contact form):', error);
      return { success: false, error };
    }
  },

  /**
   * Send location change notification to customer
   */
  async sendLocationChangeNotification(booking, oldLocation, newLocation) {
    try {
      if (!process.env.RESEND_API_KEY) {
        console.log('⚠️  No Resend API key - skipping location change email');
        return { success: false };
      }

      const { data, error } = await resend.emails.send({
        from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
        to: booking.customer.email,
        subject: `Booking Cancelled - Location Change - ${booking.bookingRef}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #000; color: #fff; padding: 20px; text-align: center; }
              .header h1 { margin: 0; color: #DC2626; }
              .content { padding: 20px; background: #f9f9f9; }
              .alert { background: #fff; padding: 15px; margin: 15px 0; border-left: 4px solid #DC2626; }
              .refund { background: #22c55e; color: #fff; padding: 15px; margin: 15px 0; }
              .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>MTB<span style="color: #DC2626;">CUTZ</span></h1>
                <p>Important Update</p>
              </div>

              <div class="content">
                <h2 style="color: #DC2626;">Your Booking Has Been Cancelled</h2>
                <p>Hi <strong>${booking.customer.name}</strong>,</p>
                <p>We're sorry, but your booking has been cancelled because our schedule has changed.</p>

                <div class="alert">
                  <p><strong>Original Location:</strong> ${oldLocation}</p>
                  <p><strong>New Location:</strong> ${newLocation}</p>
                </div>

                <p><strong>Booking Reference:</strong> ${booking.bookingRef}</p>
                <p><strong>Original Date:</strong> ${new Date(booking.date).toLocaleDateString('en-IE', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                <p><strong>Time:</strong> ${booking.time}</p>

                <div class="refund">
                  <p style="margin: 0;"><strong>Your deposit of &euro;${booking.payment.depositAmount} will be refunded within 5-10 business days.</strong></p>
                </div>

                <p>We apologise for any inconvenience. Please rebook for a week when we're in your area, or consider our VIP service for a custom visit.</p>
              </div>

              <div class="footer">
                <p>Thanks for understanding,<br>MTB Mobile Team</p>
                <p>Instagram: @the_hoodbarber1 | TikTok: @mtbcutz</p>
              </div>
            </div>
          </body>
          </html>
        `
      });

      if (error) {
        console.error('❌ Resend error (location change):', error);
        return { success: false, error };
      }

      console.log('✅ Location change notification sent to:', booking.customer.email);
      return { success: true, data };
    } catch (error) {
      console.error('❌ Email error (location change):', error);
      return { success: false, error };
    }
  }
};

module.exports = emailService;
