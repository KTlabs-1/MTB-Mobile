import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await api.adminLogin(email, password);

      if (result.success) {
        if (result.user?.role !== 'admin') {
          setError('Access denied. Admin accounts only.');
          return;
        }
        localStorage.setItem('adminToken', result.token);
        localStorage.setItem('adminUser', JSON.stringify(result.user));
        navigate('/admin/dashboard');
      } else {
        setError(result.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl text-white mb-2">
            MTB<span className="text-brand-red">CUTZ</span>
          </h1>
          <p className="text-gray-400">Admin Dashboard</p>
        </div>

        <div className="bg-brand-surface border border-white/10 rounded-sm p-8">
          <h2 className="font-heading text-xl text-white mb-6">Sign In</h2>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-sm p-3 mb-6">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@mtbcutz.com"
                required
                className="w-full bg-brand-dark border border-white/10 rounded-sm p-3 text-white placeholder-gray-500 focus:border-brand-red focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-brand-dark border border-white/10 rounded-sm p-3 text-white placeholder-gray-500 focus:border-brand-red focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-sm font-heading text-lg transition-all ${
                isLoading
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-brand-red text-white hover:bg-red-700'
              }`}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          <a href="/" className="hover:text-brand-red transition-colors">
            ← Back to website
          </a>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
