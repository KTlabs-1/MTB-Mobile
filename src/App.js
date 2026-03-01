import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ServicesPage from './pages/ServicesPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import BookingPage from './pages/BookingPage';
import CancelBookingPage from './pages/CancelBookingPage';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminSchedule from './pages/admin/AdminSchedule';
import AdminBookings from './pages/admin/AdminBookings';
import Loader from './components/Loader';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-50 w-10 h-10 bg-brand-red rounded-full
                 flex items-center justify-center shadow-lg
                 hover:bg-brand-red-dark transition-all duration-300
                 animate-fade-in"
      aria-label="Scroll to top"
    >
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    </button>
  );
}

/**
 * AppContent — rendered inside Router so it can use useLocation.
 * Hides the public Navbar/Footer for all /admin routes.
 */
function AppContent({ isLoading, setIsLoading }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      <ScrollToTop />
      {isLoading && <Loader onLoadingComplete={() => setIsLoading(false)} />}
      <div className="min-h-screen bg-brand-black flex flex-col">
        {!isAdminRoute && <Navbar />}

        <div className="flex-grow">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/book" element={<BookingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/cancel-booking" element={<CancelBookingPage />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<PlaceholderPage title="Forgot Password" />} />

            {/* Admin routes — no Navbar/Footer */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="schedule" element={<AdminSchedule />} />
              <Route path="bookings" element={<AdminBookings />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        {!isAdminRoute && <Footer />}
        {!isAdminRoute && <ScrollToTopButton />}
      </div>
    </>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Router>
      <AppContent isLoading={isLoading} setIsLoading={setIsLoading} />
    </Router>
  );
}

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
