const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingRef: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    eircode: { type: String, required: true, uppercase: true, trim: true },
    address: { type: String, required: true, trim: true },
    notes: { type: String, default: '' }
  },
  service: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: String, required: true },
    deposit: { type: Number, required: true }
  },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  location: {
    type: String,
    enum: ['Dundalk', 'Drogheda', 'Dublin', 'Belfast'],
    default: null
  },
  isVIP: { type: Boolean, default: false },
  isAfterHours: { type: Boolean, default: false },
  afterHoursLocation: {
    type: String,
    enum: ['Dundalk', 'Drogheda', 'Dublin', 'Belfast', null],
    default: null
  },
  afterHoursPrice: { type: Number, default: null },
  payment: {
    depositAmount: { type: Number, required: true },
    depositPaid: { type: Boolean, default: false },
    remainingAmount: { type: Number, required: true }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'confirmed'
  },
  cancellationReason: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

// Static method to generate unique booking reference
bookingSchema.statics.generateBookingRef = function() {
  return 'MTB-' + Math.random().toString(36).substring(2, 8).toUpperCase();
};

module.exports = mongoose.model('Booking', bookingSchema);
