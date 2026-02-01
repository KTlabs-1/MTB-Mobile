import { useState } from 'react';
import { Link } from 'react-router-dom';
import bannerImage from '../assets/images/Bannar1.jpg';

/**
 * Services Page
 *
 * Clean, minimal design following MTB branding.
 * Sections:
 * 1. Hero - Page title with background
 * 2. Main Services - Barber & Hairstylist tabs
 * 3. How Payment Works - Step by step
 * 4. Special Services - Care home services info
 * 5. Final CTA - Booking prompt
 */
const ServicesPage = () => {
  const [activeTab, setActiveTab] = useState('barber');

  // Barber Services
  const barberServices = [
    {
      id: 'adult-haircut',
      name: 'Adult Haircut (18+)',
      price: '€30',
      duration: '30 min',
      description: 'Classic cut tailored to your style'
    },
    {
      id: 'adult-haircut-beard',
      name: 'Adult Haircut + Beard Sculpt (18+)',
      price: '€35',
      duration: '30 min',
      description: 'Full cut with beard sculpting'
    },
    {
      id: 'teens-haircut',
      name: 'Teens Haircut (13-17)',
      price: '€25',
      duration: '30 min',
      description: 'Fresh cuts for teens'
    },
    {
      id: 'teens-haircut-beard',
      name: 'Teens Haircut + Beard Sculpt (13-17)',
      price: '€30',
      duration: '30 min',
      description: 'Teen cut with beard styling'
    },
    {
      id: 'kids-haircut',
      name: 'Kids Haircut',
      price: '€20',
      duration: '30 min',
      description: 'For ages 12 and under'
    },
    {
      id: 'shape-up',
      name: 'Shape Up',
      price: '€15',
      duration: '15 min',
      description: 'Clean up your edges and line'
    },
    {
      id: 'beard-sculpting',
      name: 'Beard Sculpting',
      price: '€15',
      duration: '10 min',
      description: 'Precision beard trimming and shaping'
    }
  ];

  // Hairstylist Services
  const hairstylistServices = [
    {
      id: 'barrel-twists',
      name: 'Barrel Twists',
      price: '€50',
      duration: '2h',
      description: 'Stylish barrel twist look'
    },
    {
      id: 'loc-retwist',
      name: 'Loc Retwist',
      price: '€60',
      duration: '1h',
      description: 'Maintain your locs with a fresh retwist'
    },
    {
      id: 'loc-retwist-style',
      name: 'Loc Retwist & Style',
      price: '€75',
      duration: '2h',
      description: 'Retwist with styling included'
    },
    {
      id: 'starter-locs',
      name: 'Starter Locs (No Style)',
      price: '€80',
      duration: '2h',
      description: 'Begin your loc journey'
    },
    {
      id: 'starter-locs-style',
      name: 'Starter Locs + Style',
      price: '€100',
      duration: '2h 30min',
      description: 'Starter locs with styling'
    },
    {
      id: 'basic-twists',
      name: 'Basic Twists',
      price: '€40',
      duration: '1h',
      description: 'Classic two-strand twists'
    },
    {
      id: 'off-white-twists',
      name: 'Off White Twists',
      price: '€50',
      duration: '1h 30min',
      description: 'Trendy off-white twist style'
    },
    {
      id: 'cornrows-twists-braids',
      name: 'Cornrows into Twists/Braids',
      price: '€50',
      duration: '1h 45min',
      description: 'Cornrow base with twist or braid ends'
    },
    {
      id: 'plug-twists',
      name: 'Plug Twists',
      price: '€45',
      duration: '1h 45min',
      description: 'Plug-style twist look'
    },
    {
      id: 'basic-cornrows',
      name: 'Basic Cornrows',
      price: '€30',
      duration: '30 min',
      description: 'Simple straight-back cornrows'
    },
    {
      id: 'stitch-cornrows',
      name: 'Stitch Cornrows',
      price: '€35',
      duration: '45 min',
      description: 'Detailed stitch braiding'
    },
    {
      id: 'minimum-design-cornrows',
      name: 'Minimum Design Cornrows',
      price: '€40',
      duration: '45 min',
      description: 'Cornrows with simple design'
    },
    {
      id: 'premium-cornrows',
      name: 'Premium Cornrows',
      price: '€50',
      duration: '1h',
      description: 'Complex patterns and designs'
    },
    {
      id: 'flat-twists',
      name: 'Flat Twists',
      price: '€50',
      duration: '1h 45min',
      description: 'Sleek flat twist styling'
    }
  ];

  const currentServices = activeTab === 'barber' ? barberServices : hairstylistServices;

  return (
    <main>
      {/* ==================== HERO SECTION ==================== */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${bannerImage})` }}
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/70" />

        {/* Hero Content */}
        <div className="relative z-10 section-container text-center py-20">
          <p className="text-brand-red uppercase tracking-[0.3em] text-sm md:text-base font-medium mb-4 animate-fade-in">
            What We Offer
          </p>
          <h1 className="font-heading text-5xl md:text-7xl text-white leading-none mb-6 animate-slide-up">
            OUR <span className="text-brand-red">SERVICES</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Premium mobile barbering tailored to you. Select a service to get started.
          </p>
        </div>
      </section>

      {/* ==================== SERVICES SECTION ==================== */}
      <section className="py-20 md:py-28 bg-brand-dark">
        <div className="section-container">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl md:text-5xl text-white mb-4">
              CHOOSE YOUR <span className="text-brand-red">SERVICE</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              From fresh cuts to intricate styles — we've got you covered.
            </p>
          </div>

          {/* Tab Buttons */}
          <div className="flex justify-center gap-4 mb-12">
            <button
              onClick={() => setActiveTab('barber')}
              className={`px-6 sm:px-8 py-3 rounded-sm font-semibold uppercase tracking-wider text-sm transition-all duration-300
                ${activeTab === 'barber'
                  ? 'bg-brand-red text-white'
                  : 'bg-brand-surface text-gray-400 hover:text-white border border-white/10'
                }`}
            >
              Barber Services
            </button>
            <button
              onClick={() => setActiveTab('hairstylist')}
              className={`px-6 sm:px-8 py-3 rounded-sm font-semibold uppercase tracking-wider text-sm transition-all duration-300
                ${activeTab === 'hairstylist'
                  ? 'bg-brand-red text-white'
                  : 'bg-brand-surface text-gray-400 hover:text-white border border-white/10'
                }`}
            >
              Hairstylist Services
            </button>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {currentServices.map((service) => (
              <Link
                key={service.id}
                to={`/book?service=${service.id}`}
                className="bg-brand-surface border border-white/5 rounded-sm p-6 transition-all duration-300
                           hover:border-brand-red/50 hover:bg-brand-surface/80 group"
              >
                {/* Service Name */}
                <h3 className="font-heading text-xl text-white mb-2 group-hover:text-brand-red transition-colors">
                  {service.name}
                </h3>

                {/* Description */}
                <p className="text-gray-500 text-sm mb-4">{service.description}</p>

                {/* Price & Duration */}
                <div className="flex items-center justify-between">
                  <span className="font-heading text-2xl text-brand-red">{service.price}</span>
                  <span className="text-gray-500 text-sm flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {service.duration}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== HOW PAYMENT WORKS ==================== */}
      <section className="py-20 md:py-28 bg-brand-black">
        <div className="section-container">
          <div className="max-w-4xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="font-heading text-4xl md:text-5xl text-white mb-4">
                HOW <span className="text-brand-red">PAYMENT</span> WORKS
              </h2>
              <p className="text-gray-400 max-w-xl mx-auto">
                Simple, secure, and flexible. Here's how it goes.
              </p>
            </div>

            {/* Payment Steps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-brand-red/10 border border-brand-red/30
                                flex items-center justify-center">
                  <svg className="w-8 h-8 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h3 className="font-heading text-xl text-white mb-3">PAY DEPOSIT</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Secure your booking with a deposit to confirm your appointment.
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-brand-red/10 border border-brand-red/30
                                flex items-center justify-center">
                  <svg className="w-8 h-8 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="font-heading text-xl text-white mb-3">GET YOUR CUT</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Your barber arrives and delivers the service at your location.
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-brand-red/10 border border-brand-red/30
                                flex items-center justify-center">
                  <svg className="w-8 h-8 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="font-heading text-xl text-white mb-3">PAY THE REST</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Pay the remaining balance after your cut — cash or transfer, your choice.
                </p>
              </div>
            </div>

            {/* Cancellation Note */}
            <div className="mt-16 bg-brand-surface border border-white/5 rounded-sm p-6 md:p-8">
              <div className="flex items-start gap-4">
                <svg className="w-6 h-6 text-brand-red flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="font-heading text-lg text-white mb-2">CANCELLATION POLICY</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Need to cancel? No problem — just let us know at least 24 hours before your appointment
                    for a full deposit refund. Cancellations within 24 hours are non-refundable.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SPECIAL SERVICES ==================== */}
      <section className="py-20 md:py-28 bg-brand-dark">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Image */}
            <div className="relative order-2 lg:order-1">
              <div
                className="aspect-[4/3] bg-cover bg-center bg-no-repeat rounded-sm"
                style={{ backgroundImage: `url(${bannerImage})` }}
              />
              {/* Decorative corner accent */}
              <div className="absolute -bottom-4 -left-4 w-24 h-24 border-l-2 border-b-2 border-brand-red/30" />
            </div>

            {/* Text Content */}
            <div className="order-1 lg:order-2">
              <p className="text-brand-red uppercase tracking-[0.3em] text-sm font-medium mb-4">
                Special Services
              </p>
              <h2 className="font-heading text-4xl md:text-5xl text-white mb-6">
                CARE HOME <span className="text-brand-red">SERVICES</span>
              </h2>
              <p className="text-gray-400 mb-6 leading-relaxed">
                We offer dedicated barbering services for care homes and individuals with disabilities.
                Our barber comes equipped to provide comfortable, professional grooming in a familiar environment.
              </p>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Pricing is customised based on your specific needs and requirements.
                Get in touch to discuss how we can help.
              </p>

              {/* Contact CTA */}
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 text-brand-red hover:text-brand-red-light
                           transition-colors font-medium uppercase tracking-wider text-sm"
              >
                Contact for Custom Pricing
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FINAL CTA ==================== */}
      <section className="py-20 md:py-28 bg-brand-black relative overflow-hidden">
        {/* Background accent */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-red/5 via-transparent to-brand-red/5" />

        <div className="section-container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-heading text-4xl md:text-6xl text-white mb-6">
              READY TO<br />
              <span className="text-brand-red">BOOK?</span>
            </h2>
            <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
              Choose your service and pick a time that works for you.
              We'll come to you, wherever you are.
            </p>
            <Link to="/book" className="btn-primary text-lg px-12">
              Book Now
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ServicesPage;
