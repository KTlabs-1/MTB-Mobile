const express = require('express');
const router = express.Router();
const { getPublishableKey, createPaymentIntent, confirmPayment } = require('../controllers/paymentController');

// GET /api/payment/test - verify routes are mounted
router.get('/test', (req, res) => {
  res.json({ success: true, message: 'Payment routes working' });
});

// GET /api/payment/config - returns Stripe publishable key
router.get('/config', getPublishableKey);

// POST /api/payment/create-intent - creates a PaymentIntent
router.post('/create-intent', createPaymentIntent);

// POST /api/payment/confirm - verifies a PaymentIntent succeeded
router.post('/confirm', confirmPayment);

module.exports = router;
