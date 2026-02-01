import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ServicesPage from './pages/ServicesPage';
import Loader from './components/Loader';

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
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Router>
      {isLoading && <Loader onLoadingComplete={() => setIsLoading(false)} />}
      <div className="min-h-screen bg-brand-black flex flex-col">
        {/* Navigation - always visible */}
        <Navbar />
        
        {/* Main content area - grows to fill space */}
        <div className="flex-grow">
          <Routes>
            {/* Landing/Home Page */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Placeholder routes - we'll build these pages next */}
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/book" element={<PlaceholderPage title="Book Now" />} />
            <Route path="/about" element={<PlaceholderPage title="About" />} />
            <Route path="/contact" element={<PlaceholderPage title="Contact" />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<PlaceholderPage title="Forgot Password" />} />
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
