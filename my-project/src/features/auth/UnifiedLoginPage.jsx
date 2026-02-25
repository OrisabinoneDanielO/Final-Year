import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from './authSlice';

const ROLE_SETTINGS = {
  reviewer: { title: 'Reviewer Login', color: '#003B95' },
  researcher: { title: 'Researcher Login', color: '#003B95' },
  admin: { title: 'Administrator Login', color: '#003B95' },
};

// ── Researcher Sign-Up Form ───────────────────────────────────────────────────
const ResearcherSignUp = ({ onBack }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '', email: '', dob: '', institution: '', occupation: '', password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      dispatch(login({ email: form.email, name: form.name, role: 'researcher' }));
      setIsLoading(false);
      navigate('/dashboard');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#E5E7EB] flex items-center justify-center p-4">
      <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-sm w-full max-w-md">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Researcher Sign Up</h1>
        <p className="text-gray-600 mb-6 text-sm">Create a researcher account</p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Name</label>
            <input
              name="name" value={form.name} onChange={handleChange} required
              className="w-full bg-[#F3F4F6] rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Email</label>
            <input
              type="email" name="email" value={form.email} onChange={handleChange} required
              className="w-full bg-[#F3F4F6] rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Date of Birth</label>
            <input
              type="date" name="dob" value={form.dob} onChange={handleChange} required
              className="w-full bg-[#F3F4F6] rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            />
          </div>

          {/* Institution */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Institution</label>
            <input
              name="institution" value={form.institution} onChange={handleChange} required
              className="w-full bg-[#F3F4F6] rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Occupation */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Occupation</label>
            <input
              name="occupation" value={form.occupation} onChange={handleChange} required
              className="w-full bg-[#F3F4F6] rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password" value={form.password} onChange={handleChange} required
              className="w-full bg-[#F3F4F6] rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Show password */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox" id="su-show-pass" checked={showPassword}
              onChange={() => setShowPassword((s) => !s)}
              className="w-4 h-4" style={{ accentColor: '#003B95' }}
            />
            <label htmlFor="su-show-pass" className="text-sm text-gray-600 cursor-pointer">Show Password</label>
          </div>

          {/* Submit */}
          <div className="flex justify-center pt-2">
            <button
              type="submit" disabled={isLoading}
              className="w-full sm:w-1/2 bg-[#003B95] hover:bg-blue-900 text-white py-3 rounded-full font-semibold transition-all active:scale-95 disabled:opacity-50"
            >
              {isLoading ? 'Creating account...' : 'Sign Up'}
            </button>
          </div>

          {/* Back to login */}
          <p className="text-center text-sm text-gray-500">
            Already have an account?{' '}
            <button type="button" onClick={onBack} className="text-[#003B95] font-semibold hover:underline">
              Log in
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

// ── Unified Login Page ────────────────────────────────────────────────────────
const UnifiedLoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { role } = useParams();
  const currentRole = role && ROLE_SETTINGS[role] ? role : 'reviewer';

  const [showSignUp, setShowSignUp] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // If researcher wants to sign up, show sign-up form
  if (currentRole === 'researcher' && showSignUp) {
    return <ResearcherSignUp onBack={() => setShowSignUp(false)} />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      const user = { email: formData.email, role: currentRole };
      dispatch(login(user));
      setIsLoading(false);
      navigate('/dashboard');
    }, 1200);
  };

  const settings = ROLE_SETTINGS[currentRole];

  return (
    <div className="min-h-screen bg-[#E5E7EB] flex items-center justify-center p-4">
      <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-sm w-full max-w-md">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{settings.title}</h1>
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
              type="email" name="email" value={formData.email} onChange={handleChange}
              className="w-full bg-[#F3F4F6] border-none rounded-lg p-3 sm:p-4 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Password</label>
            <input
              type={showPassword ? 'text' : 'password'} name="password"
              value={formData.password} onChange={handleChange}
              className="w-full bg-[#F3F4F6] border-none rounded-lg p-3 sm:p-4 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center space-x-3">
            <input
              type="checkbox" id="show-pass" checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
              className="w-4 h-4" style={{ accentColor: settings.color }}
            />
            <label htmlFor="show-pass" className="text-sm text-gray-600 cursor-pointer">Show Password</label>
          </div>
          <div className="flex justify-center pt-2">
            <button
              type="submit" disabled={isLoading}
              className="text-white px-12 py-3 rounded-full font-semibold w-full sm:w-1/2 transition-all active:scale-95 disabled:opacity-50"
              style={{ backgroundColor: settings.color }}
            >
              {isLoading ? 'Logging in...' : 'Log in'}
            </button>
          </div>
        </form>

        {/* Sign-up link — only for researcher */}
        {currentRole === 'researcher' && (
          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <button
              onClick={() => setShowSignUp(true)}
              className="text-[#003B95] font-semibold hover:underline"
            >
              Create one
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default UnifiedLoginPage;
