const dotenv = require('dotenv');
dotenv.config();

const emailService = require('./services/emailService');

console.log('🧪 Testing Email Configuration\n');

// Show configuration (hiding most of API key for security)
const apiKey = process.env.RESEND_API_KEY;
const apiKeyPreview = apiKey ? apiKey.substring(0, 8) + '...' : 'NOT SET';

console.log('Configuration:');
console.log('  RESEND_API_KEY:', apiKeyPreview);
console.log('  EMAIL_FROM:', process.env.EMAIL_FROM);
console.log('  ADMIN_EMAIL:', process.env.ADMIN_EMAIL);
console.log('');

if (!process.env.RESEND_API_KEY) {
  console.error('❌ RESEND_API_KEY is not set!');
  process.exit(1);
}

if (process.env.EMAIL_FROM !== 'onboarding@resend.dev') {
  console.warn('⚠️  WARNING: EMAIL_FROM should be "onboarding@resend.dev" for Resend free tier');
  console.warn('   Current value:', process.env.EMAIL_FROM);
}

// Create a test booking
const testBooking = {
  bookingRef: 'MTB-TEST123',
  customer: {
    name: 'Test Customer',
    email: process.env.ADMIN_EMAIL || 'test@example.com',
    phone: '+353 12 345 6789',
    address: '123 Test Street, Dublin, Ireland',
    notes: 'This is a test booking'
  },
  service: {
    id: 'adult-haircut',
    name: 'Adult Haircut (18+)',
    price: 30,
    duration: '30 min',
    deposit: 15
  },
  date: new Date(),
  time: '2:00 PM',
  payment: {
    depositAmount: 15,
    depositPaid: true,
    remainingAmount: 15
  },
  status: 'confirmed'
};

console.log('📧 Sending test booking confirmation email...\n');

emailService.sendBookingConfirmation(testBooking)
  .then(result => {
    if (result.success) {
      console.log('✅ Email sent successfully!');
      console.log('   Email ID:', result.data?.id);
      console.log('\n✨ Check your inbox at:', testBooking.customer.email);
    } else {
      console.error('❌ Email failed:', result.error || result.message);
    }
    process.exit(result.success ? 0 : 1);
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
