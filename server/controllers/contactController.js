const emailService = require('../services/emailService');

const contactController = {
  async sendContactMessage(req, res) {
    try {
      const { name, email, phone, message } = req.body;

      if (!name || !email || !message) {
        return res.status(400).json({
          success: false,
          message: 'Name, email and message are required'
        });
      }

      await emailService.sendContactFormEmail({ name, email, phone, message });

      res.json({
        success: true,
        message: 'Message sent successfully'
      });
    } catch (error) {
      console.error('Contact form error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send message'
      });
    }
  }
};

module.exports = contactController;
