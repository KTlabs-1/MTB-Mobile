import { Link } from 'react-router-dom';
import aboutImage from '../assets/images/About.jpg';

/**
 * About Page
 *
 * Clean, minimal design following MTB branding.
 * Sections:
 * 1. Our Story - MTB Journey
 * 2. Why Choose Us - Feature cards
 * 3. Portfolio - Work showcase
 * 4. CTA - Booking prompt
 */
const AboutPage = () => {
  // Why Choose Us features
  const features = [
    {
      icon: (
        <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: 'We Come To You',
      description: 'Barbershop quality at your door'
    },
    {
      icon: (
        <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      title: 'Top Quality',
      description: 'Premium tools and products'
    },
    {
      icon: (
        <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Flexible Times',
      description: 'Book when it suits you'
    },
    {
      icon: (
        <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Trusted',
      description: 'Part of the MTB Cutz family'
    }
  ];

  // Portfolio images (placeholders)
  const portfolioImages = [1, 2, 3, 4, 5, 6];

  return (
    <main>
      {/* ==================== OUR STORY SECTION ==================== */}
      <section className="py-20 md:py-28 bg-brand-dark">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Text Content */}
            <div>
              <p className="text-brand-red uppercase tracking-[0.3em] text-sm font-medium mb-4">
                Our Story
              </p>
              <h1 className="font-heading text-4xl md:text-5xl text-white mb-6">
                THE MTB <span className="text-brand-red">JOURNEY</span>
              </h1>
              <p className="text-gray-400 leading-relaxed mb-4">
                What started as a single chair has grown into Ireland's fastest growing
                multicultural barber brand with 6 locations across the country.
              </p>
              <p className="text-gray-400 leading-relaxed mb-4">
                The mobile service takes it further — bringing the full MTB experience
                to your doorstep. No travel, no waiting, just quality.
              </p>
              <p className="text-gray-400 leading-relaxed mb-8">
                From classic cuts to locs, fades to cornrows — every cut is delivered
                with precision and care by The Hood Barber.
              </p>

              {/* Stats */}
              <div className="flex gap-8 mt-8">
                <div>
                  <span className="font-heading text-2xl text-brand-red">500+</span>
                  <p className="text-gray-500 text-sm">Clients</p>
                </div>
                <div>
                  <span className="font-heading text-2xl text-brand-red">5+</span>
                  <p className="text-gray-500 text-sm">Years</p>
                </div>
                <div>
                  <span className="font-heading text-2xl text-brand-red">6</span>
                  <p className="text-gray-500 text-sm">Locations</p>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-4 mt-6">
                <a
                  href="https://instagram.com/the_hoodbarber1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-brand-red transition-colors"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="https://tiktok.com/@mtbcutz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-brand-red transition-colors"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
                  </svg>
                </a>
                <a
                  href="https://wa.me/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-brand-red transition-colors"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Image */}
            <div className="relative">
              <div
                className="aspect-[4/5] bg-cover bg-center bg-no-repeat rounded-sm"
                style={{ backgroundImage: `url(${aboutImage})` }}
              />
              {/* Decorative corner accent */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 border-r-2 border-b-2 border-brand-red/30" />
            </div>
          </div>
        </div>
      </section>

      {/* ==================== WHY CHOOSE US SECTION ==================== */}
      <section className="py-20 md:py-28 bg-brand-black">
        <div className="section-container">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl text-white mb-4">
              WHY <span className="text-brand-red">US</span>
            </h2>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-brand-surface border border-white/5 rounded-sm p-6 text-center
                           transition-all duration-300 hover:border-brand-red/30"
              >
                <div className="flex justify-center mb-6 text-brand-red">
                  {feature.icon}
                </div>
                <h3 className="font-heading text-lg text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== PORTFOLIO SECTION ==================== */}
      <section className="py-20 md:py-28 bg-brand-dark">
        <div className="section-container">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl text-white mb-4">
              THE <span className="text-brand-red">WORK</span>
            </h2>
            <p className="text-gray-400">
              Fresh cuts, delivered daily
            </p>
          </div>

          {/* Portfolio Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {portfolioImages.map((_, index) => (
              <div
                key={index}
                className="relative aspect-square overflow-hidden rounded-sm group cursor-pointer"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-500
                             group-hover:scale-105"
                  style={{ backgroundImage: `url(${aboutImage})` }}
                />
                {/* Border on hover */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-brand-red
                                transition-all duration-300 rounded-sm" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CTA SECTION ==================== */}
      <section className="py-20 md:py-28 bg-brand-black relative overflow-hidden">
        {/* Background accent */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-red/5 via-transparent to-brand-red/5" />

        <div className="section-container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-heading text-4xl md:text-5xl text-white mb-8">
              READY FOR A <span className="text-brand-red">FRESH CUT?</span>
            </h2>
            <Link to="/book" className="btn-primary text-lg px-12">
              Book Now
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
