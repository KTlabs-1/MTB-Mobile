import { useState } from 'react';
import api from '../services/api';

const CancelBookingPage = () => {
  const [bookingReference, setBookingReference] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!bookingReference.trim() || !email.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await api.customerCancelBooking(bookingReference.trim().toUpperCase(), email.trim().toLowerCase());
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.message || 'Failed to cancel booking. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-heading text-3xl text-white mb-3">Booking Cancelled</h1>
          <p className="text-gray-400 mb-2">
            Your booking has been successfully cancelled.
          </p>
          <p className="text-gray-500 text-sm">
            If a deposit was paid, your refund will appear within 5–10 business days.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full">
        <div className="mb-8">
          <h1 className="font-heading text-3xl md:text-4xl text-white mb-2">Cancel Booking</h1>
          <p className="text-gray-400">Enter your booking reference and email to cancel your appointment.</p>
        </div>

        {/* 24hr warning */}
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-sm p-4 mb-6">
          <p className="text-yellow-500 text-sm">
            Cancellations must be made at least <strong>24 hours</strong> before your appointment.
            For last-minute cancellations, please contact us directly.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Booking Reference</label>
            <input
              type="text"
              value={bookingReference}
              onChange={(e) => setBookingReference(e.target.value)}
              placeholder="e.g. MTB-123456"
              className="w-full bg-brand-surface border border-white/10 rounded-sm px-4 py-3 text-white placeholder-gray-500 focus:border-brand-red focus:outline-none uppercase"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full bg-brand-surface border border-white/10 rounded-sm px-4 py-3 text-white placeholder-gray-500 focus:border-brand-red focus:outline-none"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-sm p-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-sm font-medium transition-colors ${
              isSubmitting
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-brand-red text-white hover:bg-red-700'
            }`}
          >
            {isSubmitting ? 'Cancelling...' : 'Cancel My Booking'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CancelBookingPage;
