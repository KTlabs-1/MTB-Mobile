import { useState, useEffect } from 'react';
import api from '../../services/api';

const cancellationReasons = [
  'Customer requested cancellation',
  'Customer no-show',
  'Barber unavailable',
  'Weather conditions',
  'Emergency',
  'Other',
];

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('upcoming');
  const [searchTerm, setSearchTerm] = useState('');

  // Cancel modal state
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancellingBooking, setCancellingBooking] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);

  // Result modal state
  const [resultModal, setResultModal] = useState({ show: false, type: '', message: '' });

  useEffect(() => {
    fetchBookings();
  }, [filter]);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const result = await api.getAdminBookings(filter);
      if (result.success) {
        setBookings(result.bookings || []);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openCancelModal = (booking) => {
    setCancellingBooking(booking);
    setCancelReason('');
    setShowCancelModal(true);
  };

  const handleCancelBooking = async () => {
    if (!cancelReason) {
      alert('Please select a cancellation reason');
      return;
    }

    setIsCancelling(true);
    try {
      const result = await api.cancelBooking(cancellingBooking._id, cancelReason);
      if (result.success) {
        setShowCancelModal(false);
        setCancellingBooking(null);
        fetchBookings();
        setResultModal({
          show: true,
          type: 'success',
          message: result.refunded
            ? 'Booking cancelled and deposit refunded successfully'
            : 'Booking cancelled successfully',
        });
      } else {
        setResultModal({
          show: true,
          type: 'error',
          message: result.message || 'Failed to cancel booking',
        });
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      setResultModal({ show: true, type: 'error', message: 'Failed to cancel booking' });
    } finally {
      setIsCancelling(false);
    }
  };

  const handleStatusChange = async (bookingRef, status) => {
    try {
      const result = await api.adminUpdateBookingStatus(bookingRef, status);
      if (result.success) {
        fetchBookings();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      booking.customer?.name?.toLowerCase().includes(search) ||
      booking.customer?.email?.toLowerCase().includes(search) ||
      booking.customer?.phone?.includes(search) ||
      booking.bookingRef?.toLowerCase().includes(search)
    );
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IE', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-yellow-500/20 text-yellow-500';
      case 'completed': return 'bg-green-500/20 text-green-500';
      case 'cancelled': return 'bg-red-500/20 text-red-500';
      case 'pending':   return 'bg-blue-500/20 text-blue-500';
      default:          return 'bg-gray-500/20 text-gray-500';
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl text-white">Bookings</h1>
          <p className="text-gray-400 mt-1">Manage all customer bookings</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by name, email, phone, or reference..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-brand-surface border border-white/10 rounded-sm px-4 py-3 text-white placeholder-gray-500 focus:border-brand-red focus:outline-none"
          />
        </div>
        <div className="flex bg-brand-surface border border-white/10 rounded-sm overflow-hidden">
          {['upcoming', 'past', 'all'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-3 text-sm font-medium transition-colors capitalize ${
                filter === f ? 'bg-brand-red text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      {!isLoading && (
        <p className="text-gray-500 text-sm mb-4">
          {filteredBookings.length} booking{filteredBookings.length !== 1 ? 's' : ''} found
        </p>
      )}

      {/* Bookings List */}
      {isLoading ? (
        <div className="bg-brand-surface border border-white/10 rounded-sm p-8 text-center">
          <div className="w-8 h-8 border-2 border-brand-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading bookings...</p>
        </div>
      ) : filteredBookings.length > 0 ? (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-brand-surface border border-white/10 rounded-sm p-4 md:p-6"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">

                {/* Customer Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-white font-medium">{booking.customer?.name}</h3>
                    <span className={`px-2 py-0.5 rounded-sm text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                    {booking.isAfterHours && (
                      <span className="px-2 py-0.5 rounded-sm text-xs font-medium bg-purple-500/20 text-purple-400">
                        After Hours
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500 text-sm">{booking.customer?.email}</p>
                  <p className="text-gray-500 text-sm">{booking.customer?.phone}</p>
                  <p className="text-gray-500 text-xs mt-1 truncate">{booking.customer?.address}</p>
                </div>

                {/* Booking Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium">{booking.service?.name}</p>
                  <p className="text-gray-400 text-sm">
                    {formatDate(booking.date)} at {booking.time}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {booking.isAfterHours ? booking.afterHoursLocation : booking.location}
                  </p>
                  <p className="text-brand-red text-xs font-mono mt-1">{booking.bookingRef}</p>
                </div>

                {/* Payment + Actions */}
                <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
                  <div className="md:text-right">
                    <p className="text-white font-heading text-lg">€{booking.service?.price}</p>
                    <p className="text-gray-500 text-xs">
                      Deposit €{booking.payment?.depositAmount}
                      {' — '}
                      {booking.payment?.depositPaid
                        ? <span className="text-green-500">Paid</span>
                        : <span className="text-yellow-500">Pending</span>
                      }
                    </p>
                    <p className="text-gray-500 text-xs">
                      Remaining €{booking.payment?.remainingAmount}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {booking.status === 'confirmed' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(booking.bookingRef, 'completed')}
                          className="px-3 py-1.5 bg-green-500/20 text-green-500 text-xs rounded-sm hover:bg-green-500/30 transition-colors"
                        >
                          Complete
                        </button>
                        <button
                          onClick={() => openCancelModal(booking)}
                          className="px-3 py-1.5 bg-red-500/20 text-red-500 text-xs rounded-sm hover:bg-red-500/30 transition-colors"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    {booking.status === 'pending' && (
                      <button
                        onClick={() => handleStatusChange(booking.bookingRef, 'confirmed')}
                        className="px-3 py-1.5 bg-yellow-500/20 text-yellow-500 text-xs rounded-sm hover:bg-yellow-500/30 transition-colors"
                      >
                        Confirm
                      </button>
                    )}
                    <a
                      href={`tel:${booking.customer?.phone}`}
                      className="px-3 py-1.5 bg-brand-dark border border-white/10 text-gray-400 text-xs rounded-sm hover:text-white transition-colors"
                    >
                      Call
                    </a>
                  </div>
                </div>

              </div>

              {/* Notes if present */}
              {booking.customer?.notes && (
                <div className="mt-4 pt-4 border-t border-white/5">
                  <p className="text-gray-500 text-xs">
                    <span className="text-gray-400 font-medium">Note: </span>
                    {booking.customer.notes}
                  </p>
                </div>
              )}

              {/* Cancellation info if cancelled */}
              {booking.status === 'cancelled' && booking.cancellation?.reason && (
                <div className="mt-4 pt-4 border-t border-white/5">
                  <p className="text-gray-500 text-xs">
                    <span className="text-gray-400 font-medium">Cancelled by {booking.cancellation.cancelledBy}: </span>
                    {booking.cancellation.reason}
                    {booking.cancellation.refunded && (
                      <span className="ml-2 text-green-500">• Refunded</span>
                    )}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-brand-surface border border-white/10 rounded-sm p-12 text-center">
          <svg className="w-12 h-12 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-gray-500">No bookings found</p>
        </div>
      )}

      {/* Result Modal */}
      {resultModal.show && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-brand-surface border border-white/10 rounded-sm p-6 max-w-sm w-full text-center">
            {resultModal.type === 'success' ? (
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            ) : (
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            )}

            <h3 className={`font-heading text-xl mb-2 ${resultModal.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
              {resultModal.type === 'success' ? 'Success!' : 'Error'}
            </h3>

            <p className="text-gray-400 mb-6">{resultModal.message}</p>

            <button
              onClick={() => setResultModal({ show: false, type: '', message: '' })}
              className="px-8 py-3 bg-brand-red text-white rounded-sm font-heading hover:bg-red-700 transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-brand-surface border border-white/10 rounded-sm p-6 max-w-md w-full">
            <h3 className="font-heading text-xl text-white mb-4">Cancel Booking</h3>

            <div className="mb-4">
              <p className="text-gray-400 text-sm mb-1">
                Cancelling booking for <span className="text-white">{cancellingBooking?.customer?.name}</span>
              </p>
              <p className="text-gray-400 text-sm">
                {cancellingBooking?.time} on {formatDate(cancellingBooking?.date)}
              </p>
              <p className="text-brand-red text-xs font-mono mt-1">{cancellingBooking?.bookingRef}</p>
            </div>

            <div className="mb-6">
              <label className="block text-gray-400 text-sm mb-2">Reason for cancellation *</label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full bg-brand-dark border border-white/10 rounded-sm px-4 py-3 text-white focus:border-brand-red focus:outline-none"
              >
                <option value="">-- Select reason --</option>
                {cancellationReasons.map((reason) => (
                  <option key={reason} value={reason}>{reason}</option>
                ))}
              </select>
            </div>

            {cancellingBooking?.payment?.depositPaid && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-sm p-3 mb-6">
                <p className="text-yellow-500 text-sm">
                  The customer's deposit (€{cancellingBooking?.payment?.depositAmount}) will be automatically refunded via Stripe.
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-3 bg-brand-dark border border-white/10 rounded-sm text-white hover:border-white/30 transition-colors"
              >
                Go Back
              </button>
              <button
                onClick={handleCancelBooking}
                disabled={isCancelling || !cancelReason}
                className={`flex-1 py-3 rounded-sm font-medium transition-colors ${
                  isCancelling || !cancelReason
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-red-500 text-white hover:bg-red-600'
                }`}
              >
                {isCancelling ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
