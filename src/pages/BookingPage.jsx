import { useState, useEffect } from 'react';
import { Link, useSearchParams, Navigate } from 'react-router-dom';

const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
  });
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [bookingRef, setBookingRef] = useState('');

  const barberServices = [
    { id: 'adult-haircut', name: 'Adult Haircut (18+)', price: 30, duration: '30 min', deposit: 15 },
    { id: 'adult-haircut-beard', name: 'Adult Haircut + Beard Sculpt (18+)', price: 35, duration: '30 min', deposit: 15 },
    { id: 'teens-haircut', name: 'Teens Haircut (13-17)', price: 25, duration: '30 min', deposit: 15 },
    { id: 'teens-haircut-beard', name: 'Teens Haircut + Beard Sculpt (13-17)', price: 30, duration: '30 min', deposit: 15 },
    { id: 'kids-haircut', name: 'Kids Haircut', price: 20, duration: '30 min', deposit: 15 },
    { id: 'shape-up', name: 'Shape Up', price: 15, duration: '15 min', deposit: 15 },
    { id: 'beard-sculpting', name: 'Beard Sculpting', price: 15, duration: '10 min', deposit: 15 },
    { id: 'vip-trimmer', name: 'VIP Trimmer', price: 100, duration: '1hr 15min', deposit: 50, isVip: true },
  ];

  const hairstylistServices = [
    { id: 'barrel-twists', name: 'Barrel Twists', price: 50, duration: '2h', deposit: 15 },
    { id: 'loc-retwist', name: 'Loc Retwist', price: 60, duration: '1h', deposit: 15 },
    { id: 'loc-retwist-style', name: 'Loc Retwist & Style', price: 75, duration: '2h', deposit: 15 },
    { id: 'starter-locs', name: 'Starter Locs (No Style)', price: 80, duration: '2h', deposit: 15 },
    { id: 'starter-locs-style', name: 'Starter Locs + Style', price: 100, duration: '2h 30min', deposit: 15 },
    { id: 'basic-twists', name: 'Basic Twists', price: 40, duration: '1h', deposit: 15 },
    { id: 'off-white-twists', name: 'Off White Twists', price: 50, duration: '1h 30min', deposit: 15 },
    { id: 'cornrows-twists-braids', name: 'Cornrows into Twists/Braids', price: 50, duration: '1h 45min', deposit: 15 },
    { id: 'plug-twists', name: 'Plug Twists', price: 45, duration: '1h 45min', deposit: 15 },
    { id: 'basic-cornrows', name: 'Basic Cornrows', price: 30, duration: '30 min', deposit: 15 },
    { id: 'stitch-cornrows', name: 'Stitch Cornrows', price: 35, duration: '45 min', deposit: 15 },
    { id: 'minimum-design-cornrows', name: 'Minimum Design Cornrows', price: 40, duration: '45 min', deposit: 15 },
    { id: 'premium-cornrows', name: 'Premium Cornrows', price: 50, duration: '1h', deposit: 15 },
    { id: 'flat-twists', name: 'Flat Twists', price: 50, duration: '1h 45min', deposit: 15 },
  ];

  const allServices = [...barberServices, ...hairstylistServices];

  // Read service from URL param
  useEffect(() => {
    const serviceParam = searchParams.get('service');
    if (serviceParam) {
      const found = allServices.find(s => s.id === serviceParam);
      if (found) setSelectedService(found);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Redirect to /services if no service selected
  if (!searchParams.get('service')) {
    return <Navigate to="/services" replace />;
  }

  const formatDate = (date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 20; hour++) {
      for (let min = 0; min < 60; min += 30) {
        if (hour === 20 && min > 0) break;
        const h = hour > 12 ? hour - 12 : hour;
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const display = `${h}:${min === 0 ? '00' : '30'} ${ampm}`;
        slots.push({ time: display, available: true });
      }
    }
    // Mark a few as unavailable for demo
    [2, 5, 10, 15, 19].forEach(i => {
      if (slots[i]) slots[i].available = false;
    });
    return slots;
  };

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const isDateInPast = (year, month, day) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const check = new Date(year, month, day);
    return check < today;
  };

  const isSameDate = (year, month, day) => {
    if (!selectedDate) return false;
    const sel = new Date(selectedDate);
    return sel.getFullYear() === year && sel.getMonth() === month && sel.getDate() === day;
  };

  const handleDetailChange = (e) => {
    const { name, value } = e.target;
    setCustomerDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitBooking = () => {
    const ref = 'MTB-' + Math.floor(100000 + Math.random() * 900000);
    setBookingRef(ref);
    setCurrentStep(5);
  };

  const goToStep = (step) => {
    setCurrentStep(step);
    window.scrollTo(0, 0);
  };

  const canContinueStep3 = customerDetails.name && customerDetails.email && customerDetails.phone && customerDetails.address;

  const timeSlots = generateTimeSlots();

  const calYear = calendarDate.getFullYear();
  const calMonth = calendarDate.getMonth();
  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = getFirstDayOfMonth(calYear, calMonth);
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  // ==================== STEP 5: BOOKING CONFIRMED ====================
  if (currentStep === 5) {
    return (
      <main className="min-h-screen bg-brand-black">
        <div className="section-container py-20 md:py-28">
          <div className="max-w-lg mx-auto text-center">
            {/* Checkmark */}
            <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-brand-red/10 border-2 border-brand-red
                            flex items-center justify-center">
              <svg className="w-10 h-10 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="font-heading text-4xl md:text-5xl text-white mb-4">
              BOOKING <span className="text-brand-red">CONFIRMED!</span>
            </h1>

            <p className="text-gray-400 mb-2">Your booking reference</p>
            <p className="font-heading text-2xl text-brand-red mb-8">{bookingRef}</p>

            {/* Summary Card */}
            <div className="bg-brand-surface border border-white/10 rounded-sm p-6 text-left mb-8">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Service</span>
                  <span className="text-white text-sm">{selectedService?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Date</span>
                  <span className="text-white text-sm">{selectedDate && formatDate(new Date(selectedDate))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Time</span>
                  <span className="text-white text-sm">{selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Location</span>
                  <span className="text-white text-sm text-right max-w-[200px]">{customerDetails.address}</span>
                </div>
                <div className="border-t border-white/10 pt-3 flex justify-between">
                  <span className="text-gray-400 text-sm">Deposit Paid</span>
                  <span className="text-brand-red font-heading text-lg">&euro;{selectedService?.deposit}</span>
                </div>
              </div>
            </div>

            <p className="text-gray-500 text-sm mb-8">
              A confirmation email has been sent to <span className="text-white">{customerDetails.email}</span>
            </p>

            <div className="flex flex-col gap-3">
              <button className="btn-primary w-full py-3">
                Add to Calendar
              </button>
              <Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-brand-black">
      {/* ==================== HEADER ==================== */}
      <div className="sticky top-0 z-40 bg-brand-dark/95 backdrop-blur-sm border-b border-white/10">
        <div className="section-container py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/services"
              className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline text-sm">Services</span>
            </Link>

            <h1 className="font-heading text-lg sm:text-xl text-white">
              Book Your <span className="text-brand-red">Appointment</span>
            </h1>

            <div className="w-16" />
          </div>
        </div>
      </div>

      {/* ==================== STEP PROGRESS ==================== */}
      <div className="bg-brand-dark border-b border-white/10">
        <div className="section-container">
          <div className="flex items-center justify-center py-6 md:py-8">
            {[
              {
                num: 1,
                label: 'DATE',
                icon: (
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                ),
              },
              {
                num: 2,
                label: 'TIME',
                icon: (
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
              {
                num: 3,
                label: 'DETAILS',
                icon: (
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                ),
              },
              {
                num: 4,
                label: 'CONFIRM',
                icon: (
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
            ].map((step, index) => {
              const isCompleted = currentStep > step.num;
              const isCurrent = currentStep === step.num;

              return (
                <div key={step.num} className="flex items-center">
                  {/* Step */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-11 h-11 md:w-14 md:h-14 rounded-sm flex items-center justify-center transition-all duration-300
                        ${isCompleted
                          ? 'bg-brand-red text-white'
                          : isCurrent
                            ? 'border-2 border-brand-red text-brand-red bg-brand-red/10'
                            : 'border border-white/20 text-gray-500'
                        }`}
                    >
                      {isCompleted ? (
                        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        step.icon
                      )}
                    </div>
                    <span
                      className={`mt-2 text-[10px] md:text-xs uppercase tracking-wider font-medium transition-colors duration-300
                        ${isCompleted || isCurrent ? 'text-brand-red' : 'text-gray-500'}`}
                    >
                      {step.label}
                    </span>
                  </div>

                  {/* Connector Line */}
                  {index < 3 && (
                    <div
                      className={`w-10 sm:w-16 md:w-24 lg:w-32 h-0.5 mx-1.5 sm:mx-2 md:mx-3 mb-6 transition-colors duration-300
                        ${currentStep > step.num ? 'bg-brand-red' : 'bg-white/10'}`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ==================== SELECTED SERVICE BAR ==================== */}
      {selectedService && (
        <div className="bg-brand-surface border-b border-white/10">
          <div className="section-container py-3">
            <div className="flex items-center justify-between max-w-3xl mx-auto">
              <div>
                <p className="text-white font-medium text-sm">{selectedService.name}</p>
                <p className="text-gray-500 text-xs">
                  &euro;{selectedService.price} &middot; {selectedService.duration}
                </p>
              </div>
              <Link
                to="/services"
                className="text-brand-red text-sm hover:text-brand-red-light transition-colors"
              >
                Change
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MAIN CONTENT ==================== */}
      <div className="section-container py-8 md:py-12">
        <div className="max-w-3xl mx-auto">

          {/* ==================== STEP 1: SELECT DATE ==================== */}
          {currentStep === 1 && (
            <div>
              <h2 className="font-heading text-2xl md:text-3xl text-white mb-8 text-center">
                Pick a <span className="text-brand-red">Date</span>
              </h2>

              {/* Calendar */}
              <div className="bg-brand-surface border border-white/10 rounded-sm p-4 sm:p-6 mb-8">
                {/* Month Navigation */}
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={() => setCalendarDate(new Date(calYear, calMonth - 1, 1))}
                    className="text-gray-400 hover:text-white transition-colors p-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <h3 className="font-heading text-lg text-white">
                    {monthNames[calMonth]} {calYear}
                  </h3>
                  <button
                    onClick={() => setCalendarDate(new Date(calYear, calMonth + 1, 1))}
                    className="text-gray-400 hover:text-white transition-colors p-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="text-center text-gray-500 text-xs uppercase py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: firstDay }, (_, i) => (
                    <div key={`empty-${i}`} />
                  ))}

                  {Array.from({ length: daysInMonth }, (_, i) => {
                    const day = i + 1;
                    const past = isDateInPast(calYear, calMonth, day);
                    const selected = isSameDate(calYear, calMonth, day);

                    return (
                      <button
                        key={day}
                        onClick={() => {
                          if (!past) {
                            setSelectedDate(new Date(calYear, calMonth, day).toISOString());
                          }
                        }}
                        disabled={past}
                        className={`aspect-square flex items-center justify-center rounded-sm text-sm transition-all duration-200
                          ${past
                            ? 'text-gray-600 cursor-not-allowed'
                            : selected
                              ? 'bg-brand-red text-white font-semibold'
                              : 'text-gray-300 hover:bg-white/10 cursor-pointer'
                          }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Date Display */}
              {selectedDate && (
                <p className="text-center text-gray-400 text-sm mb-6">
                  Selected: <span className="text-white">{formatDate(new Date(selectedDate))}</span>
                </p>
              )}

              {/* Continue Button */}
              <button
                onClick={() => goToStep(2)}
                disabled={!selectedDate}
                className={`w-full py-4 rounded-sm font-semibold uppercase tracking-wider text-sm transition-all duration-300
                  ${selectedDate
                    ? 'btn-primary'
                    : 'bg-brand-surface text-gray-500 cursor-not-allowed border border-white/10'
                  }`}
              >
                Continue
              </button>
            </div>
          )}

          {/* ==================== STEP 2: SELECT TIME ==================== */}
          {currentStep === 2 && (
            <div>
              <h2 className="font-heading text-2xl md:text-3xl text-white mb-2 text-center">
                Pick a <span className="text-brand-red">Time</span>
              </h2>
              <p className="text-gray-400 text-center text-sm mb-8">
                Available times for {selectedDate && formatDate(new Date(selectedDate))}
              </p>

              {/* Time Slots Grid */}
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mb-8">
                {timeSlots.map((slot) => (
                  <button
                    key={slot.time}
                    onClick={() => slot.available && setSelectedTime(slot.time)}
                    disabled={!slot.available}
                    className={`py-3 text-center rounded-sm text-sm transition-all duration-200
                      ${!slot.available
                        ? 'bg-brand-surface border border-white/5 text-gray-600 opacity-50 cursor-not-allowed line-through'
                        : selectedTime === slot.time
                          ? 'bg-brand-red border border-brand-red text-white font-semibold'
                          : 'bg-brand-surface border border-white/10 text-gray-300 hover:border-brand-red/50 cursor-pointer'
                      }`}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => goToStep(1)}
                  className="flex-1 py-4 rounded-sm font-semibold uppercase tracking-wider text-sm
                             bg-brand-surface text-gray-400 hover:text-white border border-white/10
                             transition-all duration-300"
                >
                  Back
                </button>
                <button
                  onClick={() => goToStep(3)}
                  disabled={!selectedTime}
                  className={`flex-1 py-4 rounded-sm font-semibold uppercase tracking-wider text-sm transition-all duration-300
                    ${selectedTime
                      ? 'btn-primary'
                      : 'bg-brand-surface text-gray-500 cursor-not-allowed border border-white/10'
                    }`}
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* ==================== STEP 3: YOUR DETAILS ==================== */}
          {currentStep === 3 && (
            <div>
              <h2 className="font-heading text-2xl md:text-3xl text-white mb-8 text-center">
                Your <span className="text-brand-red">Details</span>
              </h2>

              <div className="space-y-5 mb-8">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={customerDetails.name}
                    onChange={handleDetailChange}
                    className="w-full bg-brand-surface border border-white/10 rounded-sm p-3
                               text-sm text-white placeholder-gray-500
                               focus:outline-none focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/50
                               transition-colors duration-200"
                    placeholder="John Doe"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={customerDetails.email}
                    onChange={handleDetailChange}
                    className="w-full bg-brand-surface border border-white/10 rounded-sm p-3
                               text-sm text-white placeholder-gray-500
                               focus:outline-none focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/50
                               transition-colors duration-200"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={customerDetails.phone}
                    onChange={handleDetailChange}
                    className="w-full bg-brand-surface border border-white/10 rounded-sm p-3
                               text-sm text-white placeholder-gray-500
                               focus:outline-none focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/50
                               transition-colors duration-200"
                    placeholder="+353 XX XXX XXXX"
                    required
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Address — where should we come?
                  </label>
                  <textarea
                    name="address"
                    value={customerDetails.address}
                    onChange={handleDetailChange}
                    rows={3}
                    className="w-full bg-brand-surface border border-white/10 rounded-sm p-3
                               text-sm text-white placeholder-gray-500 resize-none
                               focus:outline-none focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/50
                               transition-colors duration-200"
                    placeholder="Your full address"
                    required
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Additional Notes <span className="text-gray-500">(optional)</span>
                  </label>
                  <textarea
                    name="notes"
                    value={customerDetails.notes}
                    onChange={handleDetailChange}
                    rows={3}
                    className="w-full bg-brand-surface border border-white/10 rounded-sm p-3
                               text-sm text-white placeholder-gray-500 resize-none
                               focus:outline-none focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/50
                               transition-colors duration-200"
                    placeholder="Any special requests or instructions..."
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => goToStep(2)}
                  className="flex-1 py-4 rounded-sm font-semibold uppercase tracking-wider text-sm
                             bg-brand-surface text-gray-400 hover:text-white border border-white/10
                             transition-all duration-300"
                >
                  Back
                </button>
                <button
                  onClick={() => goToStep(4)}
                  disabled={!canContinueStep3}
                  className={`flex-1 py-4 rounded-sm font-semibold uppercase tracking-wider text-sm transition-all duration-300
                    ${canContinueStep3
                      ? 'btn-primary'
                      : 'bg-brand-surface text-gray-500 cursor-not-allowed border border-white/10'
                    }`}
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* ==================== STEP 4: REVIEW & PAY ==================== */}
          {currentStep === 4 && (
            <div>
              <h2 className="font-heading text-2xl md:text-3xl text-white mb-8 text-center">
                Review Your <span className="text-brand-red">Booking</span>
              </h2>

              {/* Summary Card */}
              <div className="bg-brand-surface border border-white/10 rounded-sm p-6 mb-6">
                {/* Service */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Service</p>
                    <p className="text-white">{selectedService?.name}</p>
                    <p className="text-gray-400 text-sm">{selectedService?.duration}</p>
                  </div>
                  <Link to="/services" className="text-brand-red text-sm hover:text-brand-red-light transition-colors">
                    Edit
                  </Link>
                </div>

                <div className="border-t border-white/10 my-4" />

                {/* Date & Time */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Date & Time</p>
                    <p className="text-white">{selectedDate && formatDate(new Date(selectedDate))}</p>
                    <p className="text-gray-400 text-sm">{selectedTime}</p>
                  </div>
                  <button onClick={() => goToStep(1)} className="text-brand-red text-sm hover:text-brand-red-light transition-colors">
                    Edit
                  </button>
                </div>

                <div className="border-t border-white/10 my-4" />

                {/* Customer Details */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Your Details</p>
                    <p className="text-white">{customerDetails.name}</p>
                    <p className="text-gray-400 text-sm">{customerDetails.email}</p>
                    <p className="text-gray-400 text-sm">{customerDetails.phone}</p>
                  </div>
                  <button onClick={() => goToStep(3)} className="text-brand-red text-sm hover:text-brand-red-light transition-colors">
                    Edit
                  </button>
                </div>

                <div className="border-t border-white/10 my-4" />

                {/* Location */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Location</p>
                    <p className="text-white text-sm">{customerDetails.address}</p>
                    {customerDetails.notes && (
                      <p className="text-gray-400 text-sm mt-1">Notes: {customerDetails.notes}</p>
                    )}
                  </div>
                  <button onClick={() => goToStep(3)} className="text-brand-red text-sm hover:text-brand-red-light transition-colors">
                    Edit
                  </button>
                </div>
              </div>

              {/* Payment Breakdown */}
              <div className="bg-brand-surface border border-white/10 rounded-sm p-6 mb-6">
                <h3 className="font-heading text-lg text-white mb-4">Payment Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Total</span>
                    <span className="text-white">&euro;{selectedService?.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Deposit (due now)</span>
                    <span className="text-brand-red font-heading text-lg">&euro;{selectedService?.deposit}</span>
                  </div>
                  <div className="border-t border-white/10 pt-3 flex justify-between">
                    <span className="text-gray-400 text-sm">Remaining (pay after)</span>
                    <span className="text-white">&euro;{selectedService ? selectedService.price - selectedService.deposit : 0}</span>
                  </div>
                </div>
              </div>

              {/* Cancellation Policy Checkbox */}
              <label className="flex items-start gap-3 cursor-pointer group mb-8">
                <div className="relative mt-0.5">
                  <input
                    type="checkbox"
                    checked={agreedToPolicy}
                    onChange={(e) => setAgreedToPolicy(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-5 h-5 border border-white/20 rounded-sm bg-brand-dark
                                  peer-checked:bg-brand-red peer-checked:border-brand-red
                                  transition-colors duration-200 flex-shrink-0" />
                  <svg
                    className="absolute top-0.5 left-0.5 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-xs sm:text-sm text-gray-400 group-hover:text-gray-300 transition-colors leading-relaxed">
                  I agree to the cancellation policy. Cancellations within 24 hours of the appointment are non-refundable.
                </span>
              </label>

              {/* Buttons */}
              <div className="flex gap-4 mb-4">
                <button
                  onClick={() => goToStep(3)}
                  className="flex-1 py-4 rounded-sm font-semibold uppercase tracking-wider text-sm
                             bg-brand-surface text-gray-400 hover:text-white border border-white/10
                             transition-all duration-300"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmitBooking}
                  disabled={!agreedToPolicy}
                  className={`flex-1 py-4 rounded-sm font-semibold uppercase tracking-wider text-sm transition-all duration-300
                    ${agreedToPolicy
                      ? 'btn-primary'
                      : 'bg-brand-surface text-gray-500 cursor-not-allowed border border-white/10'
                    }`}
                >
                  Pay Deposit &euro;{selectedService?.deposit}
                </button>
              </div>

              <p className="text-center text-gray-500 text-xs">
                You'll be redirected to secure payment
              </p>
            </div>
          )}

        </div>
      </div>
    </main>
  );
};

export default BookingPage;
