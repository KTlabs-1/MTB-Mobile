import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';

/**
 * Main App Component
 * 
 * Sets up:
 * - React Router for navigation
 * - Persistent Navbar and Footer
 * - Route definitions for each page
 * 
 * As we build more pages, we'll add them to the Routes section.
 */
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-brand-black flex flex-col">
        {/* Navigation - always visible */}
        <Navbar />
        
        {/* Main content area - grows to fill space */}
        <div className="flex-grow pt-20">
          <Routes>
            {/* Landing/Home Page */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Placeholder routes - we'll build these pages next */}
            <Route path="/services" element={<PlaceholderPage title="Services" />} />
            <Route path="/book" element={<PlaceholderPage title="Book Now" />} />
            <Route path="/about" element={<PlaceholderPage title="About" />} />
            <Route path="/contact" element={<PlaceholderPage title="Contact" />} />
          </Routes>
        </div>
        
        {/* Footer - always visible */}
        <Footer />
      </div>
    </Router>
  );
}

/**
 * Placeholder Page Component
 * 
 * Temporary component for pages we haven't built yet.
 * Shows a simple message so navigation works.
 */
function PlaceholderPage({ title }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-heading text-4xl text-white mb-4">{title}</h1>
        <p className="text-gray-500">This page is coming soon.</p>
      </div>
    </div>
  );
}

export default App;
