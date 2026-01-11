import { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * Navbar Component
 * 
 * Responsive navigation bar with:
 * - Logo/brand name on the left
 * - Navigation links (desktop)
 * - Mobile hamburger menu
 * - "Book Now" CTA button
 */
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Navigation links - easy to update as we add more pages
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md border-b border-white/5">
      <div className="section-container">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo / Brand Name */}
          <Link to="/" className="flex items-center gap-2">
            <span className="font-heading text-3xl text-white tracking-wider">
              THE HOOD<span className="text-brand-red">BARBER</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-gray-300 hover:text-white transition-colors duration-200 
                           font-medium tracking-wide text-sm uppercase"
              >
                {link.name}
              </Link>
            ))}
            
            {/* CTA Button */}
            <Link to="/book" className="btn-primary">
              Book Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-white p-2"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              // Close icon (X)
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              // Hamburger icon
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10 animate-fade-in">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-300 hover:text-white transition-colors duration-200 
                             font-medium tracking-wide text-sm uppercase py-2"
                >
                  {link.name}
                </Link>
              ))}
              <Link 
                to="/book" 
                onClick={() => setIsMenuOpen(false)}
                className="btn-primary text-center mt-2"
              >
                Book Now
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
