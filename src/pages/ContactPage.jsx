import { useState } from 'react';
import { Link } from 'react-router-dom';
import bannerImage from '../assets/images/Bannar1.jpg';

/**
 * Contact Page
 *
 * Clean, minimal design following MTB branding.
 * Sections:
 * 1. Hero - Title and description
 * 2. Contact Options - WhatsApp, Instagram, TikTok, Email cards
 * 3. FAQ - Common questions
 * 4. Business Hours & Info
 * 5. Booking CTA
 * 6. MTB Family link
 */
const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' or 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // FAQ data
  const faqs = [
    {
      question: 'How do I book?',
      answer: "Simply click 'Book Now', choose your service, pick a date and time, enter your location, and pay a small deposit to secure your slot.",
    },
    {
      question: 'Where do you cover?',
      answer: "We cover Dundalk, Drogheda, Dublin, and surrounding areas in Louth and Meath. Not sure if we reach you? Just ask!",
    },
    {
      question: 'How does payment work?',
      answer: "Pay a deposit online when booking, then pay the rest after your cut — cash or transfer, your choice.",
    },
    {
      question: 'Can I cancel or reschedule?',
      answer: "Yes! Cancel at least 24 hours before for a full refund. Need to reschedule? Just get in touch.",
    },
    {
      question: 'What if I need a specific style?',
      answer: "Bring reference photos! We love working with inspiration pics to get your cut just right.",
    },
    {
      question: 'Do you do group bookings?',
      answer: "Absolutely — weddings, events, care homes. Contact us to arrange.",
    },
  ];

  // Business info data
  const businessInfo = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: 'Hours',
      value: '9am - 9pm',
      subValue: '7 days a week',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      label: 'Coverage',
      value: '50km radius',
      subValue: 'Dundalk to Dublin',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      label: 'Booking',
      value: 'Online 24/7',
      subValue: 'Book anytime',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      label: 'Response',
      value: 'Within 1 hour',
      subValue: 'Usually faster',
    },
  ];

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
          <div className="max-w-3xl mx-auto">
            <p className="text-brand-red uppercase tracking-[0.3em] text-sm font-medium mb-4">
              Get In Touch
            </p>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white mb-6">
              CONTACT <span className="text-brand-red">US</span>
            </h1>
            <p className="text-gray-300 text-lg max-w-xl mx-auto">
              Questions, bookings, or just want to say hello? We're here to help.
            </p>
          </div>
        </div>
      </section>

      {/* ==================== CONTACT SECTION ==================== */}
      <section className="py-16 md:py-24 bg-brand-dark">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl md:text-5xl text-white mb-4">
              REACH <span className="text-brand-red">OUT</span>
            </h2>
            <p className="text-gray-400">Send us a message or connect directly</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">

            {/* Left: Contact Form */}
            <div className="bg-brand-surface border border-white/10 rounded-sm p-6 md:p-8">
              <h3 className="font-heading text-xl text-white mb-6">Send a Message</h3>

              {submitStatus === 'success' && (
                <div className="bg-green-500/20 border border-green-500/30 rounded-sm p-4 mb-6">
                  <p className="text-green-500">Message sent successfully! We'll get back to you soon.</p>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-sm p-4 mb-6">
                  <p className="text-red-500">Something went wrong. Please try again or contact us directly.</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-brand-dark border border-white/10 rounded-sm p-3 text-white placeholder-gray-500 focus:border-brand-red focus:outline-none"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-brand-dark border border-white/10 rounded-sm p-3 text-white placeholder-gray-500 focus:border-brand-red focus:outline-none"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Phone (optional)</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-brand-dark border border-white/10 rounded-sm p-3 text-white placeholder-gray-500 focus:border-brand-red focus:outline-none"
                    placeholder="+353 85 123 4567"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full bg-brand-dark border border-white/10 rounded-sm p-3 text-white placeholder-gray-500 focus:border-brand-red focus:outline-none resize-none"
                    placeholder="How can we help you?"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full btn-primary py-3 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            {/* Right: Social Icons */}
            <div>
              <div className="bg-brand-surface border border-white/10 rounded-sm p-6 md:p-8">
                <h3 className="font-heading text-xl text-white mb-6 text-center">Or Connect Directly</h3>

                <div className="grid grid-cols-4 gap-4">
                  {/* WhatsApp */}
                  <a
                    href="https://wa.me/353851234567"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center text-center group"
                  >
                    <div className="w-14 h-14 bg-brand-dark border border-white/10 rounded-full flex items-center justify-center mb-3 group-hover:border-brand-red group-hover:bg-brand-red/10 transition-all">
                      <svg className="w-6 h-6 text-brand-red" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    </div>
                    <span className="text-white text-sm font-medium group-hover:text-brand-red transition-colors">WhatsApp</span>
                  </a>

                  {/* Instagram */}
                  <a
                    href="https://instagram.com/the_hoodbarber1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center text-center group"
                  >
                    <div className="w-14 h-14 bg-brand-dark border border-white/10 rounded-full flex items-center justify-center mb-3 group-hover:border-brand-red group-hover:bg-brand-red/10 transition-all">
                      <svg className="w-6 h-6 text-brand-red" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </div>
                    <span className="text-white text-sm font-medium group-hover:text-brand-red transition-colors">Instagram</span>
                  </a>

                  {/* TikTok */}
                  <a
                    href="https://tiktok.com/@mtbcutz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center text-center group"
                  >
                    <div className="w-14 h-14 bg-brand-dark border border-white/10 rounded-full flex items-center justify-center mb-3 group-hover:border-brand-red group-hover:bg-brand-red/10 transition-all">
                      <svg className="w-6 h-6 text-brand-red" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
                      </svg>
                    </div>
                    <span className="text-white text-sm font-medium group-hover:text-brand-red transition-colors">TikTok</span>
                  </a>

                  {/* Email */}
                  <a
                    href="mailto:info@mtbcutz.com"
                    className="flex flex-col items-center text-center group"
                  >
                    <div className="w-14 h-14 bg-brand-dark border border-white/10 rounded-full flex items-center justify-center mb-3 group-hover:border-brand-red group-hover:bg-brand-red/10 transition-all">
                      <svg className="w-6 h-6 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-white text-sm font-medium group-hover:text-brand-red transition-colors">Email</span>
                  </a>
                </div>

                <p className="text-gray-500 text-sm text-center mt-6">Quick replies, usually within minutes</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ==================== FAQ SECTION ==================== */}
      <section className="py-20 md:py-28 bg-brand-black">
        <div className="section-container">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl text-white mb-4">
              COMMON <span className="text-brand-red">QUESTIONS</span>
            </h2>
          </div>

          {/* FAQ Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border-l-2 border-brand-red/30 pl-6 hover:border-brand-red transition-colors"
              >
                <h3 className="font-heading text-lg text-white mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== BUSINESS HOURS & INFO SECTION ==================== */}
      <section className="py-20 md:py-28 bg-brand-dark">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            {/* Image */}
            <div className="relative">
              <div
                className="aspect-[4/3] bg-cover bg-center bg-no-repeat rounded-sm"
                style={{ backgroundImage: `url(${bannerImage})` }}
              />
              {/* Decorative corner accent */}
              <div className="absolute -bottom-4 -left-4 w-24 h-24 border-l-2 border-b-2 border-brand-red/30" />
            </div>

            {/* Info Content */}
            <div>
              <h2 className="font-heading text-3xl md:text-4xl text-white mb-4">
                WHEN & <span className="text-brand-red">WHERE</span>
              </h2>
              <p className="text-gray-400 mb-8">
                We come to you — here's how it works
              </p>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-6">
                {businessInfo.map((info, index) => (
                  <div key={index}>
                    <div className="text-brand-red mb-2">
                      {info.icon}
                    </div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">
                      {info.label}
                    </p>
                    <p className="font-heading text-xl text-white">
                      {info.value}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {info.subValue}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== BOOKING CTA SECTION ==================== */}
      <section className="py-20 md:py-28 bg-brand-black">
        <div className="section-container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-heading text-4xl md:text-5xl text-white mb-6">
              READY TO BOOK YOUR <span className="text-brand-red">CUT</span>?
            </h2>
            <p className="text-gray-400 mb-8">
              Skip the back-and-forth. Book online in under 2 minutes and we'll see you at your door.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/services" className="btn-primary">
                Book Now
              </Link>
              <Link
                to="/services"
                className="px-6 py-3 border-2 border-white text-white font-medium uppercase tracking-wider text-sm
                           hover:bg-white hover:text-brand-black transition-all duration-300 rounded-sm text-center"
              >
                View Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== MTB FAMILY SECTION ==================== */}
      <section className="py-12 bg-brand-dark">
        <div className="section-container">
          <div className="text-center">
            <p className="text-gray-500 text-sm mb-2">
              Part of Ireland's fastest growing multicultural barber brand
            </p>
            <a
              href="https://mtbcutz.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-red hover:text-brand-red-light transition-colors font-medium"
            >
              Visit MTB Cutz →
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ContactPage;
