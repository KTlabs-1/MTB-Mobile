const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/**
 * Get Stripe publishable key for the frontend
 */
const getPublishableKey = (req, res) => {
  res.json({ success: true, publishableKey: process.env.STRIPE_PUBLISHABLE_KEY });
};

/**
 * Create a Stripe PaymentIntent for a booking deposit
 */
const createPaymentIntent = async (req, res) => {
  try {
    console.log('Creating payment intent:', req.body);
    const { amount, bookingDetails } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert euros to cents
      currency: 'eur',
      metadata: {
        customerName: bookingDetails?.customer?.name || '',
        customerEmail: bookingDetails?.customer?.email || '',
        service: bookingDetails?.service?.name || '',
      },
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Payment intent creation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Verify a PaymentIntent was successful
 */
const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ success: false, message: 'Payment intent ID required' });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      res.json({ success: true, status: paymentIntent.status });
    } else {
      res.status(400).json({
        success: false,
        status: paymentIntent.status,
        message: 'Payment not completed',
      });
    }
  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getPublishableKey, createPaymentIntent, confirmPayment };
