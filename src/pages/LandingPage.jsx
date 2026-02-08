import { Link } from 'react-router-dom';
import bannerImage from '../assets/images/Bannar1.jpg';
import CoverageMap from '../components/CoverageMap';

/**
 * Landing Page (Home)
 * 
 * Clean, minimal design following MTB branding.
 * Sections:
 * 1. Hero - Big headline + CTA
 * 2. How It Works - 3-step process
 * 3. Services Preview - Popular services with prices
 * 4. Service Areas - Regions covered
 * 5. Final CTA - Booking prompt
 */
const LandingPage = () => {
  return (
    <main>
      {/* ==================== HERO SECTION ==================== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${bannerImage})` }}
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Hero Content */}
        <div className="relative z-10 section-container text-center py-20">
          <div className="max-w-4xl mx-auto">
            {/* Tagline */}
            <p className="text-brand-red uppercase tracking-[0.3em] text-sm md:text-base font-medium mb-6 animate-fade-in">
              Mobile Barber Service
            </p>
            
            {/* Main Headline */}
            <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl text-white leading-none mb-6 animate-slide-up">
              FRESH CUTS<br />
              <span className="text-brand-red">AT YOUR DOOR</span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Premium barbering services that come to you. 
              No travel, no waiting — just quality cuts, wherever you are in Ireland.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Link to="/book" className="btn-primary text-lg">
                Book Your Cut
              </Link>
              <Link to="/services" className="btn-secondary text-lg">
                View Services
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* ==================== HOW IT WORKS ==================== */}
      <section className="py-20 md:py-28 bg-brand-dark">
        <div className="section-container">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl text-white mb-4">
              HOW IT <span className="text-brand-red">WORKS</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Getting a fresh cut has never been easier. Three simple steps.
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {/* Step 1 */}
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-brand-red/10 border border-brand-red/30 
                              flex items-center justify-center group-hover:bg-brand-red/20 transition-colors duration-300">
                <span className="font-heading text-3xl text-brand-red">1</span>
              </div>
              <h3 className="font-heading text-2xl text-white mb-3">BOOK ONLINE</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Pick your service, choose a time that suits you, and enter your location. 
                Secure your slot with a small deposit.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-brand-red/10 border border-brand-red/30 
                              flex items-center justify-center group-hover:bg-brand-red/20 transition-colors duration-300">
                <span className="font-heading text-3xl text-brand-red">2</span>
              </div>
              <h3 className="font-heading text-2xl text-white mb-3">WELCOME TO YOU</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                On the day, your barber arrives at your door — fully equipped and ready to deliver.
                Home, office, or event — we've got you.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-brand-red/10 border border-brand-red/30 
                              flex items-center justify-center group-hover:bg-brand-red/20 transition-colors duration-300">
                <span className="font-heading text-3xl text-brand-red">3</span>
              </div>
              <h3 className="font-heading text-2xl text-white mb-3">FRESH CUT, DONE</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Sit back, relax, and leave looking sharp. Pay the remainder after your cut.
                No travel, no queues, just quality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SERVICES PREVIEW ==================== */}
      <section className="py-20 md:py-28 bg-brand-black">
        <div className="section-container">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl text-white mb-4">
              OUR <span className="text-brand-red">SERVICES</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Quality cuts at fair prices. Here's what we offer.
            </p>
          </div>

          {/* Services Grid - Placeholder prices, update with real ones */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Service Card Template */}
            {[
              { name: 'Adult Haircut', price: '€30', duration: '30 min', desc: 'Classic cut tailored to your style' },
              { name: 'Haircut + Beard', price: '€35', duration: '45 min', desc: 'Full cut with beard sculpting' },
              { name: 'Teen Haircut', price: '€25', duration: '30 min', desc: 'For ages 13-17' },
              { name: 'Kids Haircut', price: '€20', duration: '25 min', desc: 'For ages 12 and under' },
            ].map((service, index) => (
              <div 
                key={index}
                className="bg-brand-surface border border-white/5 rounded-sm p-6
                           hover:border-brand-red/30 transition-all duration-300 group"
              >
                <h3 className="font-heading text-xl text-white mb-2 group-hover:text-brand-red transition-colors">
                  {service.name}
                </h3>
                <p className="text-gray-500 text-sm mb-4">{service.desc}</p>
                <div className="flex items-end justify-between">
                  <span className="font-heading text-3xl text-brand-red">{service.price}</span>
                  <span className="text-gray-500 text-xs uppercase">{service.duration}</span>
                </div>
              </div>
            ))}
          </div>

          {/* View All Link */}
          <div className="text-center mt-10">
            <Link 
              to="/services" 
              className="inline-flex items-center gap-2 text-brand-red hover:text-brand-red-light 
                         transition-colors font-medium uppercase tracking-wider text-sm"
            >
              View All Services
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== SERVICE AREAS ==================== */}
      <section className="py-20 md:py-28 bg-brand-dark">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div>
              <h2 className="font-heading text-4xl md:text-5xl text-white mb-6">
                WHERE WE <span className="text-brand-red">OPERATE</span>
              </h2>
              <p className="text-gray-400 mb-8 leading-relaxed">
                We cover a wide area across Ireland, bringing premium barbering services 
                to your doorstep. Whether you're in the city or surrounding areas, we'll come to you.
              </p>
              
              {/* Areas List - Update with real locations */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {['Dublin', 'Drogheda', 'Dundalk', 'Navan', 'Meath', 'Louth'].map((area, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-brand-red flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-300">{area}</span>
                  </div>
                ))}
              </div>

              <p className="text-gray-500 text-sm">
                Don't see your area? <Link to="/contact" className="text-brand-red hover:underline">Get in touch</Link> — we may still be able to help.
              </p>
            </div>

            {/* Coverage Map */}
            <div className="relative">
              <div className="aspect-square rounded-sm overflow-hidden border border-white/5">
                <CoverageMap />
              </div>

              {/* Decorative corner accent */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 border-r-2 border-b-2 border-brand-red/30" />
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
              READY FOR A<br />
              <span className="text-brand-red">FRESH CUT?</span>
            </h2>
            <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
              Book your appointment now and experience premium barbering at your convenience. 
              We bring the skills — you bring the location.
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

export default LandingPage;
