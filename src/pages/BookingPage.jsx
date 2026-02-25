import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';

const allServices = [
  // Barber
  { id: 'adult-haircut', name: 'Adult Haircut (18+)', price: 30, duration: '30 min', deposit: 15, category: 'barber' },
  { id: 'adult-haircut-beard', name: 'Adult Haircut + Beard Sculpt', price: 35, duration: '30 min', deposit: 15, category: 'barber' },
  { id: 'teen-haircut', name: 'Teens Haircut (13-17)', price: 25, duration: '30 min', deposit: 15, category: 'barber' },
  { id: 'teen-haircut-beard', name: 'Teens Haircut + Beard Sculpt', price: 30, duration: '30 min', deposit: 15, category: 'barber' },
  { id: 'kids-haircut', name: 'Kids Haircut', price: 20, duration: '30 min', deposit: 15, category: 'barber' },
  { id: 'shape-up', name: 'Shape Up', price: 15, duration: '15 min', deposit: 15, category: 'barber' },
  { id: 'beard-sculpt', name: 'Beard Sculpting', price: 15, duration: '10 min', deposit: 15, category: 'barber' },
  // Hairstylist
  { id: 'barrel-twists', name: 'Barrel Twists', price: 50, duration: '2h', deposit: 15, category: 'hairstylist' },
  { id: 'loc-retwist', name: 'Loc Retwist', price: 60, duration: '1h', deposit: 15, category: 'hairstylist' },
  { id: 'loc-retwist-style', name: 'Loc Retwist & Style', price: 75, duration: '2h', deposit: 15, category: 'hairstylist' },
  { id: 'starter-locs', name: 'Starter Locs (No Style)', price: 80, duration: '2h', deposit: 15, category: 'hairstylist' },
  { id: 'starter-locs-style', name: 'Starter Locs + Style', price: 100, duration: '2h 30min', deposit: 50, category: 'hairstylist' },
  { id: 'basic-twists', name: 'Basic Twists', price: 40, duration: '1h', deposit: 15, category: 'hairstylist' },
  { id: 'off-white-twists', name: 'Off White Twists', price: 50, duration: '1h 30min', deposit: 15, category: 'hairstylist' },
  { id: 'cornrows-to-twists', name: 'Cornrows into Twists/Braids', price: 50, duration: '1h 45min', deposit: 15, category: 'hairstylist' },
  { id: 'plug-twists', name: 'Plug Twists', price: 45, duration: '1h 45min', deposit: 15, category: 'hairstylist' },
  { id: 'basic-cornrows', name: 'Basic Cornrows', price: 30, duration: '30 min', deposit: 15, category: 'hairstylist' },
  { id: 'stitch-cornrows', name: 'Stitch Cornrows', price: 35, duration: '45 min', deposit: 15, category: 'hairstylist' },
  { id: 'design-cornrows', name: 'Minimum Design Cornrows', price: 40, duration: '45 min', deposit: 15, category: 'hairstylist' },
  { id: 'premium-cornrows', name: 'Premium Cornrows', price: 50, duration: '1h', deposit: 15, category: 'hairstylist' },
  { id: 'flat-twists', name: 'Flat Twists', price: 50, duration: '1h 45min', deposit: 15, category: 'hairstylist' },
  // VIP
  { id: 'vip-trimmer', name: 'VIP Trimmer', price: 100, duration: '1hr 15min', deposit: 50, category: 'vip' },
  { id: 'vip-service', name: 'VIP Service', price: 100, duration: '1hr 15min', deposit: 50, category: 'vip' },
];

const timeSlots = [
  { time: '08:00', label: '8:00 AM' },
  { time: '09:00', label: '9:00 AM' },
  { time: '10:00', label: '10:00 AM' },
  { time: '11:00', label: '11:00 AM' },
  { time: '12:00', label: '12:00 PM' },
  { time: '13:00', label: '1:00 PM' },
  { time: '14:00', label: '2:00 PM' },
  { time: '15:00', label: '3:00 PM' },
  { time: '16:00', label: '4:00 PM' },
  { time: '17:00', label: '5:00 PM' },
];

const afterHoursLocations = [
  { id: 'dundalk', name: 'Dundalk', price: 80, deposit: 40 },
  { id: 'drogheda', name: 'Drogheda', price: 100, deposit: 50 },
  { id: 'dublin', name: 'Dublin', price: 120, deposit: 60 },
  { id: 'belfast', name: 'Belfast', price: 150, deposit: 75 },
];

const afterHoursTimeSlots = [
  { time: '18:00', label: '6:00 PM' },
  { time: '19:00', label: '7:00 PM' },
  { time: '20:00', label: '8:00 PM' },
  { time: '21:00', label: '9:00 PM' },
  { time: '22:00', label: '10:00 PM' },
];

const BookingPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // 3 Steps: 1=Date, 2=Time, 3=Confirm
  const [currentStep, setCurrentStep] = useState(1);

  // Schedule data
  const [schedules, setSchedules] = useState([]);
  const [isLoadingSchedules, setIsLoadingSchedules] = useState(true);

  // Booking selections
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [unavailableTimes, setUnavailableTimes] = useState([]);

  // Customer details
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    email: '',
    phone: '',
    eircode: '',
    address: '',
    notes: ''
  });
  const [policyAccepted, setPolicyAccepted] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [formTouched, setFormTouched] = useState({});

  // After Hours
  const [isAfterHours, setIsAfterHours] = useState(false);
  const [afterHoursLocation, setAfterHoursLocation] = useState(null);
  const [afterHoursDate, setAfterHoursDate] = useState(null);

  // UI State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingRef, setBookingRef] = useState('');

  // Get service from URL params
  useEffect(() => {
    const serviceId = searchParams.get('service');
    if (serviceId) {
      const service = allServices.find(s => s.id === serviceId);
      if (service) {
        setSelectedService(service);
      } else {
        navigate('/services');
      }
    } else {
      navigate('/services');
    }
  }, [searchParams, navigate]);

  // Fetch schedules on mount
  useEffect(() => {
    const fetchSchedules = async () => {
      setIsLoadingSchedules(true);
      try {
        const result = await api.getAvailableSchedules();
        if (result.success) {
          setSchedules(result.schedules);
        }
      } catch (error) {
        console.error('Error fetching schedules:', error);
      } finally {
        setIsLoadingSchedules(false);
      }
    };
    fetchSchedules();
  }, []);

  // Fetch available times when date changes
  useEffect(() => {
    if (selectedDate) {
      const fetchAvailableTimes = async () => {
        try {
          const result = await api.getAvailableSlots(selectedDate.toISOString());
          if (result.success) {
            setUnavailableTimes(result.bookedTimes || []);
          }
        } catch (error) {
          console.error('Error fetching times:', error);
        }
      };
      fetchAvailableTimes();
    }
  }, [selectedDate]);


  // Validation helpers
  const validateEircode = (eircode) => {
    const cleaned = eircode.replace(/\s/g, '').toUpperCase();
    const eircodeRegex = /^[A-Z]\d[0-9A-Z][0-9A-Z]{4}$/;
    return eircodeRegex.test(cleaned);
  };

  const formatEircode = (eircode) => {
    const cleaned = eircode.replace(/\s/g, '').toUpperCase();
    if (cleaned.length >= 3) {
      return cleaned.slice(0, 3) + ' ' + cleaned.slice(3);
    }
    return cleaned.toUpperCase();
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const cleaned = phone.replace(/[\s\-\(\)]/g, '');
    const phoneRegex = /^(\+353|0)[1-9]\d{7,9}$/;
    return phoneRegex.test(cleaned);
  };

  const validateForm = () => {
    const errors = {};

    if (!customerDetails.name.trim()) {
      errors.name = 'Name is required';
    } else if (customerDetails.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    if (!customerDetails.email.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(customerDetails.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!customerDetails.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!validatePhone(customerDetails.phone)) {
      errors.phone = 'Please enter a valid Irish phone number';
    }

    if (!customerDetails.eircode.trim()) {
      errors.eircode = 'Eircode is required';
    } else if (!validateEircode(customerDetails.eircode)) {
      errors.eircode = 'Please enter a valid Eircode (e.g., D02 X285)';
    }

    if (!customerDetails.address.trim()) {
      errors.address = 'Address is required';
    } else if (customerDetails.address.trim().length < 10) {
      errors.address = 'Please enter your full address';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputBlur = (field) => {
    setFormTouched(prev => ({ ...prev, [field]: true }));
    validateForm();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    let formattedValue = value;

    if (name === 'eircode') {
      formattedValue = formatEircode(value);
    }

    setCustomerDetails(prev => ({
      ...prev,
      [name]: formattedValue
    }));

    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Handle booking submission
  const handleSubmitBooking = async () => {
    if (!validateForm()) {
      setFormTouched({
        name: true,
        email: true,
        phone: true,
        eircode: true,
        address: true
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const bookingDate = isAfterHours ? afterHoursDate : selectedDate;
      const bookingLocation = isAfterHours ? afterHoursLocation?.name : selectedLocation;

      const bookingData = {
        customer: {
          name: customerDetails.name,
          email: customerDetails.email,
          phone: customerDetails.phone,
          eircode: customerDetails.eircode,
          address: customerDetails.address,
          notes: customerDetails.notes || ''
        },
        service: {
          id: selectedService.id,
          name: selectedService.name,
          price: getCurrentPrice(),
          duration: selectedService.duration,
          deposit: getCurrentDeposit()
        },
        date: bookingDate.toISOString(),
        time: selectedTime,
        location: bookingLocation,
        isAfterHours: isAfterHours,
        afterHoursLocation: afterHoursLocation?.name,
      };

      const result = await api.createBooking(bookingData);

      if (result.success) {
        setBookingRef(result.booking.bookingRef);
        setBookingComplete(true);
      } else {
        alert(result.message || 'Error creating booking. Please try again.');
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Error creating booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Pricing helpers
  const getCurrentPrice = () => {
    if (isAfterHours && afterHoursLocation) return afterHoursLocation.price;
    return selectedService?.price || 0;
  };

  const getCurrentDeposit = () => {
    if (isAfterHours && afterHoursLocation) return afterHoursLocation.deposit;
    return selectedService?.deposit || 15;
  };

  const getRemainingBalance = () => getCurrentPrice() - getCurrentDeposit();

  // Progress steps
  const steps = isAfterHours
    ? [
        { id: 1, name: 'DATE', icon: 'calendar' },
        { id: 2, name: 'LOCATION', icon: 'location' },
        { id: 3, name: 'TIME', icon: 'clock' },
        { id: 4, name: 'CONFIRM', icon: 'check' },
      ]
    : [
        { id: 1, name: 'DATE', icon: 'calendar' },
        { id: 2, name: 'TIME', icon: 'clock' },
        { id: 3, name: 'CONFIRM', icon: 'check' },
      ];

  // Step Icon Component
  const StepIcon = ({ step, isActive, isComplete }) => {
    const icons = {
      calendar: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      clock: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      location: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      check: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
    };

    return (
      <div className={`${isComplete ? 'text-white' : isActive ? 'text-brand-red' : 'text-gray-500'}`}>
        {isComplete ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          icons[step]
        )}
      </div>
    );
  };

  // If no service selected yet (waiting for redirect), show nothing
  if (!selectedService) {
    return null;
  }

  // If booking is complete, show confirmation
  if (bookingComplete) {
    return (
      <main className="min-h-screen bg-brand-black pt-20">
        <div className="section-container py-12">
          <div className="max-w-xl mx-auto text-center">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-brand-red rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 className="font-heading text-4xl text-white mb-2">BOOKING CONFIRMED!</h2>
            <p className="text-gray-400 mb-6">We'll see you soon</p>

            {/* Booking Reference */}
            <div className="bg-brand-surface border border-white/10 rounded-sm p-6 mb-6">
              <p className="text-gray-500 text-sm mb-1">Booking Reference</p>
              <p className="font-heading text-3xl text-brand-red">{bookingRef}</p>
            </div>

            {/* Booking Summary */}
            <div className="bg-brand-surface border border-white/10 rounded-sm p-6 mb-6 text-left">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Service</span>
                  <span className="text-white">{isAfterHours ? 'After Hours Service' : selectedService.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Location</span>
                  <span className="text-white">{isAfterHours ? afterHoursLocation?.name : selectedLocation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Date</span>
                  <span className="text-white">
                    {(isAfterHours ? afterHoursDate : selectedDate)?.toLocaleDateString('en-IE', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Time</span>
                  <span className="text-white">{selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Address</span>
                  <span className="text-white text-right max-w-[200px]">{customerDetails.address}</span>
                </div>
                <div className="border-t border-white/10 pt-4 flex justify-between">
                  <span className="text-gray-500">Deposit Paid</span>
                  <span className="text-brand-red font-heading">&euro;{getCurrentDeposit()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Remaining</span>
                  <span className="text-white">&euro;{getRemainingBalance()}</span>
                </div>
              </div>
            </div>

            <p className="text-gray-400 mb-8">
              Confirmation sent to <span className="text-white">{customerDetails.email}</span>
            </p>

            <Link to="/" className="btn-primary px-8 py-3">
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-brand-black pt-20">
      {/* Header */}
      <div className="bg-brand-dark border-b border-white/10 py-6">
        <div className="section-container">
          <h1 className="font-heading text-2xl md:text-3xl text-center text-white">
            Book Your <span className="text-brand-red">Appointment</span>
          </h1>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-brand-dark border-b border-white/10 py-4">
        <div className="section-container">
          <div className="flex items-center justify-center max-w-md mx-auto">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                {/* Step Circle */}
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all
                    ${currentStep > step.id
                      ? 'bg-brand-red'
                      : currentStep === step.id
                        ? 'border-2 border-brand-red bg-transparent'
                        : 'border border-white/20 bg-transparent'
                    }`}
                  >
                    <StepIcon
                      step={step.icon}
                      isActive={currentStep === step.id}
                      isComplete={currentStep > step.id}
                    />
                  </div>
                  <span className={`mt-2 text-xs uppercase tracking-wider
                    ${currentStep >= step.id ? 'text-brand-red' : 'text-gray-500'}`}
                  >
                    {step.name}
                  </span>
                </div>

                {/* Connector Line - Fixed positioning */}
                {index < steps.length - 1 && (
                  <div className={`w-8 md:w-16 h-0.5 mx-1 md:mx-3 -mt-6 ${currentStep > step.id ? 'bg-brand-red' : 'bg-white/20'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="section-container py-8 md:py-12">

        {/* STEP 1: SELECT DATE */}
        {currentStep === 1 && (
          <div className="max-w-4xl mx-auto">
            {/* Selected Service Banner */}
            {selectedService && (
              <div className="bg-brand-surface border border-white/10 rounded-sm p-4 mb-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-brand-red/20 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-medium">{selectedService.name}</p>
                      <p className="text-gray-500 text-sm">{selectedService.duration}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-brand-red font-heading text-xl">&euro;{selectedService.price}</p>
                    <Link to="/services" className="text-gray-400 text-xs hover:text-brand-red">Change</Link>
                  </div>
                </div>
              </div>
            )}

            <h2 className="font-heading text-2xl md:text-3xl text-white mb-2 text-center">
              Select a <span className="text-brand-red">Date</span>
            </h2>
            <p className="text-gray-400 text-center mb-8">Choose from available days</p>

            {isLoadingSchedules ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-2 border-brand-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-400">Loading available dates...</p>
              </div>
            ) : schedules.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
                {schedules.map((schedule) => {
                  const scheduleDate = new Date(schedule.date);
                  const isSelected = selectedDate && selectedDate.toDateString() === scheduleDate.toDateString();
                  const isPast = scheduleDate < new Date(new Date().setHours(0, 0, 0, 0));

                  return (
                    <button
                      key={schedule._id}
                      onClick={() => {
                        if (!isPast) {
                          setSelectedDate(scheduleDate);
                          setSelectedLocation(schedule.location);
                          setSelectedTime(null);
                          setIsAfterHours(false);
                          setAfterHoursDate(null);
                        }
                      }}
                      disabled={isPast}
                      className={`p-4 rounded-sm border text-center transition-all ${
                        isPast
                          ? 'bg-brand-dark/50 border-white/5 opacity-50 cursor-not-allowed'
                          : isSelected
                          ? 'bg-brand-red border-brand-red'
                          : 'bg-brand-surface border-white/10 hover:border-brand-red/50'
                      }`}
                    >
                      <p className={`text-xs uppercase tracking-wider mb-1 ${isSelected ? 'text-white' : 'text-gray-500'}`}>
                        {schedule.dayName}
                      </p>
                      <p className={`font-heading text-2xl mb-1 ${isSelected ? 'text-white' : 'text-white'}`}>
                        {schedule.dayNumber}
                      </p>
                      <p className={`text-xs mb-2 ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                        {schedule.month}
                      </p>
                      <p className={`text-xs font-medium ${isSelected ? 'text-white' : 'text-brand-red'}`}>
                        {schedule.location}
                      </p>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="bg-brand-surface border border-white/10 rounded-sm p-8 text-center">
                <svg className="w-12 h-12 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-400 mb-2">No schedule available yet</p>
                <p className="text-gray-500 text-sm">Please check back soon or contact us for a booking</p>
              </div>
            )}

            {/* After Hours Option */}
            <div className="mt-8 pt-8 border-t border-white/10">
              <h3 className="text-center text-gray-400 mb-4">Need a later appointment?</h3>
              <button
                onClick={() => {
                  setIsAfterHours(true);
                  setSelectedDate(null);
                  setSelectedLocation(null);
                  setCurrentStep(1);
                }}
                className={`w-full p-6 rounded-sm border text-center transition-all ${
                  isAfterHours
                    ? 'bg-brand-red border-brand-red'
                    : 'bg-brand-surface border-white/10 hover:border-brand-red/50'
                }`}
              >
                <div className="flex items-center justify-center gap-3">
                  <svg className="w-6 h-6 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                  <div className="text-left">
                    <p className="font-heading text-lg text-white">After Hours Service</p>
                    <p className={`text-sm ${isAfterHours ? 'text-white/80' : 'text-gray-500'}`}>6pm - 10pm &bull; Any location &bull; Premium rates</p>
                  </div>
                </div>
              </button>
            </div>

            {/* After Hours date picker */}
            {isAfterHours && (
              <div className="mt-6">
                <p className="text-gray-400 text-center mb-4">Select a date for your after hours appointment</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
                  {Array.from({ length: 7 }, (_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() + i);
                    date.setHours(0, 0, 0, 0);
                    const isSelected = afterHoursDate && afterHoursDate.toDateString() === date.toDateString();
                    return (
                      <button
                        key={i}
                        onClick={() => setAfterHoursDate(new Date(date))}
                        className={`p-4 rounded-sm border text-center transition-all ${
                          isSelected
                            ? 'bg-brand-red border-brand-red'
                            : 'bg-brand-surface border-white/10 hover:border-brand-red/50'
                        }`}
                      >
                        <p className={`text-xs uppercase tracking-wider mb-1 ${isSelected ? 'text-white' : 'text-gray-500'}`}>
                          {date.toLocaleDateString('en-IE', { weekday: 'short' })}
                        </p>
                        <p className="font-heading text-2xl mb-1 text-white">
                          {date.getDate()}
                        </p>
                        <p className={`text-xs ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                          {date.toLocaleDateString('en-IE', { month: 'short' })}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {selectedDate && !isAfterHours && (
              <div className="flex justify-center mt-8">
                <button onClick={() => setCurrentStep(2)} className="btn-primary px-8 py-3">
                  Continue to Select Time
                </button>
              </div>
            )}

            {isAfterHours && afterHoursDate && (
              <div className="flex justify-center mt-8">
                <button onClick={() => setCurrentStep(2)} className="btn-primary px-8 py-3">
                  Continue to Select Location
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: LOCATION (After Hours only) */}
        {currentStep === 2 && isAfterHours && (
          <div className="max-w-3xl mx-auto">
            <h2 className="font-heading text-2xl md:text-3xl text-white mb-2 text-center">
              Select Your <span className="text-brand-red">Location</span>
            </h2>
            <p className="text-gray-400 text-center mb-8">Where should we come to you?</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {afterHoursLocations.map((location) => {
                const isSelected = afterHoursLocation?.id === location.id;
                return (
                  <button
                    key={location.id}
                    onClick={() => setAfterHoursLocation(location)}
                    className={`p-6 rounded-sm border text-left transition-all ${
                      isSelected
                        ? 'bg-brand-red border-brand-red'
                        : 'bg-brand-surface border-white/10 hover:border-brand-red/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-heading text-xl text-white mb-1">{location.name}</p>
                        <p className={`text-sm ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>After hours service</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-heading text-2xl ${isSelected ? 'text-white' : 'text-brand-red'}`}>
                          &euro;{location.price}
                        </p>
                        <p className={`text-xs ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                          &euro;{location.deposit} deposit
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between">
              <button onClick={() => setCurrentStep(1)} className="text-gray-400 hover:text-white transition-colors">
                &larr; Back
              </button>
              {afterHoursLocation && (
                <button onClick={() => setCurrentStep(3)} className="btn-primary px-8 py-3">
                  Continue to Select Time
                </button>
              )}
            </div>
          </div>
        )}

        {/* STEP 2/3: SELECT TIME */}
        {((currentStep === 2 && !isAfterHours) || (currentStep === 3 && isAfterHours)) && (
          <div className="max-w-3xl mx-auto">
            {/* Selection Summary */}
            <div className="bg-brand-surface border border-white/10 rounded-sm p-4 mb-8">
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-white">{isAfterHours ? afterHoursLocation?.name : selectedLocation}</span>
                </div>
                <span className="text-gray-600">&bull;</span>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-white">
                    {(isAfterHours ? afterHoursDate : selectedDate)?.toLocaleDateString('en-IE', { weekday: 'short', day: 'numeric', month: 'short' })}
                  </span>
                </div>
                {isAfterHours && (
                  <>
                    <span className="text-gray-600">&bull;</span>
                    <span className="text-brand-red font-medium">After Hours</span>
                  </>
                )}
                <button onClick={() => setCurrentStep(1)} className="ml-auto text-gray-400 hover:text-brand-red text-xs">
                  Change
                </button>
              </div>
            </div>

            <h2 className="font-heading text-2xl md:text-3xl text-white mb-2 text-center">
              Select a <span className="text-brand-red">Time</span>
            </h2>
            <p className="text-gray-400 text-center mb-8">
              {isAfterHours ? 'After hours slots (6pm - 10pm)' : 'Regular hours (8am - 5pm)'}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-8">
              {(isAfterHours ? afterHoursTimeSlots : timeSlots).map((slot) => {
                const isBooked = unavailableTimes.includes(slot.time);
                const isSelected = selectedTime === slot.time;
                return (
                  <button
                    key={slot.time}
                    onClick={() => !isBooked && setSelectedTime(slot.time)}
                    disabled={isBooked}
                    className={`p-4 rounded-sm border text-center transition-all ${
                      isBooked
                        ? 'bg-brand-dark/50 border-white/5 opacity-50 cursor-not-allowed line-through'
                        : isSelected
                        ? 'bg-brand-red border-brand-red'
                        : 'bg-brand-surface border-white/10 hover:border-brand-red/50'
                    }`}
                  >
                    <p className="font-medium text-white">{slot.label}</p>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep(isAfterHours ? 2 : 1)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                &larr; Back
              </button>
              {selectedTime && (
                <button
                  onClick={() => setCurrentStep(isAfterHours ? 4 : 3)}
                  className="btn-primary px-8 py-3"
                >
                  Continue to Confirm
                </button>
              )}
            </div>
          </div>
        )}

        {/* STEP 3/4: CONFIRM & PAY */}
        {((currentStep === 3 && !isAfterHours) || (currentStep === 4 && isAfterHours)) && (
          <div className="max-w-2xl mx-auto">
            <h2 className="font-heading text-2xl md:text-3xl text-white mb-2 text-center">
              Confirm &amp; <span className="text-brand-red">Pay</span>
            </h2>
            <p className="text-gray-400 text-center mb-8">Enter your details to complete booking</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left: Customer Details Form */}
              <div className="space-y-4">
                <h3 className="font-heading text-lg text-white mb-4">Your Details</h3>

                {/* Name */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={customerDetails.name}
                    onChange={handleInputChange}
                    onBlur={() => handleInputBlur('name')}
                    placeholder="John Smith"
                    className={`w-full bg-brand-dark border rounded-sm p-3 text-white placeholder-gray-500 focus:outline-none transition-colors ${
                      formErrors.name && formTouched.name
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-white/10 focus:border-brand-red'
                    }`}
                  />
                  {formErrors.name && formTouched.name && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={customerDetails.email}
                    onChange={handleInputChange}
                    onBlur={() => handleInputBlur('email')}
                    placeholder="john@example.com"
                    className={`w-full bg-brand-dark border rounded-sm p-3 text-white placeholder-gray-500 focus:outline-none transition-colors ${
                      formErrors.email && formTouched.email
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-white/10 focus:border-brand-red'
                    }`}
                  />
                  {formErrors.email && formTouched.email && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={customerDetails.phone}
                    onChange={handleInputChange}
                    onBlur={() => handleInputBlur('phone')}
                    placeholder="085 123 4567"
                    className={`w-full bg-brand-dark border rounded-sm p-3 text-white placeholder-gray-500 focus:outline-none transition-colors ${
                      formErrors.phone && formTouched.phone
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-white/10 focus:border-brand-red'
                    }`}
                  />
                  {formErrors.phone && formTouched.phone && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
                  )}
                </div>

                {/* Eircode */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Eircode *</label>
                  <input
                    type="text"
                    name="eircode"
                    value={customerDetails.eircode}
                    onChange={handleInputChange}
                    onBlur={() => handleInputBlur('eircode')}
                    placeholder="D02 X285"
                    maxLength={8}
                    className={`w-full bg-brand-dark border rounded-sm p-3 text-white placeholder-gray-500 focus:outline-none transition-colors uppercase ${
                      formErrors.eircode && formTouched.eircode
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-white/10 focus:border-brand-red'
                    }`}
                  />
                  {formErrors.eircode && formTouched.eircode && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.eircode}</p>
                  )}
                  <p className="text-gray-500 text-xs mt-1">Irish postcode (e.g., D02 X285)</p>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Full Address *</label>
                  <textarea
                    name="address"
                    value={customerDetails.address}
                    onChange={handleInputChange}
                    onBlur={() => handleInputBlur('address')}
                    placeholder="123 Main Street, Apartment 4B, Dublin 2"
                    rows={2}
                    className={`w-full bg-brand-dark border rounded-sm p-3 text-white placeholder-gray-500 focus:outline-none transition-colors resize-none ${
                      formErrors.address && formTouched.address
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-white/10 focus:border-brand-red'
                    }`}
                  />
                  {formErrors.address && formTouched.address && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>
                  )}
                </div>

                {/* Notes (optional) */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Additional Notes (optional)</label>
                  <textarea
                    name="notes"
                    value={customerDetails.notes}
                    onChange={handleInputChange}
                    placeholder="Any special requests or instructions..."
                    rows={2}
                    className="w-full bg-brand-dark border border-white/10 rounded-sm p-3 text-white placeholder-gray-500 focus:border-brand-red focus:outline-none resize-none"
                  />
                </div>
              </div>

              {/* Right: Booking Summary */}
              <div>
                <h3 className="font-heading text-lg text-white mb-4">Booking Summary</h3>

                <div className="bg-brand-surface border border-white/10 rounded-sm overflow-hidden">
                  <div className="p-4 border-b border-white/10">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">Service</span>
                      <span className="text-white">{isAfterHours ? 'After Hours Service' : selectedService?.name}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">Location</span>
                      <span className="text-white">{isAfterHours ? afterHoursLocation?.name : selectedLocation}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">Date</span>
                      <span className="text-white">
                        {(isAfterHours ? afterHoursDate : selectedDate)?.toLocaleDateString('en-IE', { weekday: 'short', day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Time</span>
                      <span className="text-white">{selectedTime}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-brand-dark">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">Total</span>
                      <span className="text-white">&euro;{getCurrentPrice()}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">Deposit (now)</span>
                      <span className="text-brand-red font-heading text-xl">&euro;{getCurrentDeposit()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Remaining (after)</span>
                      <span className="text-gray-400">&euro;{getRemainingBalance()}</span>
                    </div>
                  </div>
                </div>

                {/* Policy Checkbox */}
                <label className="flex items-start gap-3 mt-6 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={policyAccepted}
                    onChange={(e) => setPolicyAccepted(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-white/20 bg-brand-surface text-brand-red focus:ring-brand-red"
                  />
                  <span className="text-gray-400 text-sm">
                    I agree to the cancellation policy. Cancellations within 24 hours are non-refundable.
                  </span>
                </label>

                {/* Pay Button */}
                <button
                  onClick={handleSubmitBooking}
                  disabled={isSubmitting || !policyAccepted}
                  className={`w-full py-4 rounded-sm font-heading text-lg transition-all mt-6 ${
                    isSubmitting || !policyAccepted
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-brand-red text-white hover:bg-red-700'
                  }`}
                >
                  {isSubmitting ? 'Processing...' : `Pay €${getCurrentDeposit()} Deposit`}
                </button>

                <p className="text-gray-500 text-xs text-center mt-3">
                  Secure payment powered by Stripe
                </p>
              </div>
            </div>

            {/* Back Button */}
            <div className="mt-8">
              <button
                onClick={() => setCurrentStep(isAfterHours ? 3 : 2)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                &larr; Back to time selection
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default BookingPage;
