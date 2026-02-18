import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    setIsLoading(true);
    // Simulate API Auth delay
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#E5E7EB] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-6 sm:p-10 rounded-2xl shadow-sm w-full max-w-md"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Reviewer Login</h1>
        <p className="text-gray-600 mb-8 text-sm">Sign In to your account</p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-600 text-xs rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <form className="space-y-4 sm:space-y-6" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-[#F3F4F6] border-none rounded-lg p-3 sm:p-4 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-[#F3F4F6] border-none rounded-lg p-3 sm:p-4 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="show-pass"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
              className="w-4 h-4 accent-[#003B95]"
            />
            <label htmlFor="show-pass" className="text-sm text-gray-600 cursor-pointer">Show Password</label>
          </div>
          <div className="flex justify-center pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#003B95] text-white px-12 py-3 rounded-full font-semibold w-full sm:w-1/2 hover:bg-blue-800 transition-all active:scale-95 disabled:opacity-50"
            >
              {isLoading ? 'Logging in...' : 'Log in'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;