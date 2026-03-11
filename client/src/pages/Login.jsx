import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Login form state
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });

  // Registration form state
  const [registerData, setRegisterData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    businessType: '',
  });

  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.login(loginData.username, loginData.password);
      
      if (response.user && response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        navigate('/dashboard');
      } else {
        setError(response.message || 'Login failed');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await api.register({
        username: registerData.username,
        password: registerData.password,
        businessName: registerData.businessName,
        ownerName: registerData.ownerName,
        email: registerData.email,
        phone: registerData.phone,
        address: registerData.address,
        businessType: registerData.businessType,
      });
      
      if (response.user && response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        navigate('/dashboard');
      } else {
        setError(response.message || 'Registration failed');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-8 px-4">
      <div className="max-w-lg w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Electronics Repair POS
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isLogin ? 'Sign in to manage your repair shop' : 'Register your business'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {isLogin ? (
          // Login Form
          <form className="mt-8 space-y-6" onSubmit={handleLoginSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="login-username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  id="login-username"
                  name="username"
                  type="text"
                  required
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your username"
                  value={loginData.username}
                  onChange={handleLoginChange}
                />
              </div>
              <div className="relative">
                <label htmlFor="login-password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-r-0 top-6 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(false);
                  setError('');
                }}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Don't have an account? Register your business
              </button>
            </div>
          </form>
        ) : (
          // Registration Form
          <form className="mt-8 space-y-4" onSubmit={handleRegisterSubmit}>
            <div className="border-b border-gray-200 pb-4 mb-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Account Details</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="reg-username" className="block text-sm font-medium text-gray-700">
                    Username *
                  </label>
                  <input
                    id="reg-username"
                    name="username"
                    type="text"
                    required
                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Choose a username"
                    value={registerData.username}
                    onChange={handleRegisterChange}
                  />
                </div>
                <div className="relative">
                  <label htmlFor="reg-password" className="block text-sm font-medium text-gray-700">
                    Password *
                  </label>
                  <input
                    id="reg-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Create a password"
                    value={registerData.password}
                    onChange={handleRegisterChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-r-0 top-6 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    )}
                  </button>
                </div>
                <div className="relative">
                  <label htmlFor="reg-confirm-password" className="block text-sm font-medium text-gray-700">
                    Confirm Password *
                  </label>
                  <input
                    id="reg-confirm-password"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Confirm your password"
                    value={registerData.confirmPassword}
                    onChange={handleRegisterChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-r-0 top-6 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="border-b border-gray-200 pb-4 mb-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Business Information</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="reg-business-name" className="block text-sm font-medium text-gray-700">
                    Business Name
                  </label>
                  <input
                    id="reg-business-name"
                    name="businessName"
                    type="text"
                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="e.g., TechFix Repair Shop"
                    value={registerData.businessName}
                    onChange={handleRegisterChange}
                  />
                </div>
                <div>
                  <label htmlFor="reg-owner-name" className="block text-sm font-medium text-gray-700">
                    Owner Name
                  </label>
                  <input
                    id="reg-owner-name"
                    name="ownerName"
                    type="text"
                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Your full name"
                    value={registerData.ownerName}
                    onChange={handleRegisterChange}
                  />
                </div>
                <div>
                  <label htmlFor="reg-business-type" className="block text-sm font-medium text-gray-700">
                    Business Type
                  </label>
                  <select
                    id="reg-business-type"
                    name="businessType"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={registerData.businessType}
                    onChange={handleRegisterChange}
                  >
                    <option value="">Select business type</option>
                    <option value="Electronics Repair">Electronics Repair</option>
                    <option value="Phone Repair">Phone Repair</option>
                    <option value="Computer Repair">Computer Repair</option>
                    <option value="Multi-Service">Multi-Service</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Contact Information</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="reg-email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    id="reg-email"
                    name="email"
                    type="email"
                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="business@example.com"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                  />
                </div>
                <div>
                  <label htmlFor="reg-phone" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    id="reg-phone"
                    name="phone"
                    type="tel"
                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="+254 700 000 000"
                    value={registerData.phone}
                    onChange={handleRegisterChange}
                  />
                </div>
                <div>
                  <label htmlFor="reg-address" className="block text-sm font-medium text-gray-700">
                    Business Address
                  </label>
                  <textarea
                    id="reg-address"
                    name="address"
                    rows="2"
                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Your business location"
                    value={registerData.address}
                    onChange={handleRegisterChange}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Register Business'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(true);
                  setError('');
                }}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Already have an account? Sign in
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default Login;