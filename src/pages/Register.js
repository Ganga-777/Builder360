import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  EyeIcon, 
  EyeSlashIcon, 
  UserPlusIcon, 
  UserIcon,
  WrenchScrewdriverIcon,
  ShoppingBagIcon,
  CheckCircleIcon,
  XCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    userType: 0, // 0 = Customer, 1 = Provider
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const value = e.target.type === 'radio' ? parseInt(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (formData.phone && !/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) newErrors.phone = 'Phone number is invalid';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const { confirmPassword, ...registrationData } = formData;
      const result = await register(registrationData);
      if (result.success) {
        navigate('/');
      } else {
        setErrors({ general: result.message });
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-400 via-teal-500 to-teal-600 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white bg-opacity-10 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-white bg-opacity-10 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-white bg-opacity-10 rounded-full animate-pulse delay-500"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Main Form Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="text-center p-8 pb-6">
            <div className="mx-auto h-20 w-20 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center mb-6">
              <div className="text-white font-bold text-2xl">B</div>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Sign Up...
            </h2>
            <p className="text-gray-600 text-sm mb-4">Create your new account</p>
            
            <p className="text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-teal-600 hover:text-teal-700 transition-colors duration-300">
                Sign in here
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-5">
            {/* Error Message */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                <div className="flex items-center space-x-2">
                  <XCircleIcon className="h-5 w-5" />
                  <span className="text-sm">{errors.general}</span>
                </div>
              </div>
            )}

            {/* User Type Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Account Type</label>
              <div className="grid grid-cols-2 gap-3">
                <label className={`relative flex items-center p-3 cursor-pointer rounded-lg border-2 transition-all duration-300 ${
                  formData.userType === 0 
                    ? 'border-teal-500 bg-teal-50' 
                    : 'border-gray-200 bg-white hover:border-teal-300'
                }`}>
                  <input 
                    type="radio" 
                    name="userType" 
                    value={0} 
                    checked={formData.userType === 0} 
                    onChange={handleChange} 
                    className="sr-only" 
                  />
                  <ShoppingBagIcon className={`h-5 w-5 mr-2 ${formData.userType === 0 ? 'text-teal-600' : 'text-gray-400'}`} />
                  <div className="flex-1">
                    <span className={`text-sm font-medium ${formData.userType === 0 ? 'text-teal-900' : 'text-gray-700'}`}>
                      Customer
                    </span>
                  </div>
                  {formData.userType === 0 && (
                    <CheckCircleIcon className="h-5 w-5 text-teal-600" />
                  )}
                </label>

                <label className={`relative flex items-center p-3 cursor-pointer rounded-lg border-2 transition-all duration-300 ${
                  formData.userType === 1 
                    ? 'border-teal-500 bg-teal-50' 
                    : 'border-gray-200 bg-white hover:border-teal-300'
                }`}>
                  <input 
                    type="radio" 
                    name="userType" 
                    value={1} 
                    checked={formData.userType === 1} 
                    onChange={handleChange} 
                    className="sr-only" 
                  />
                  <WrenchScrewdriverIcon className={`h-5 w-5 mr-2 ${formData.userType === 1 ? 'text-teal-600' : 'text-gray-400'}`} />
                  <div className="flex-1">
                    <span className={`text-sm font-medium ${formData.userType === 1 ? 'text-teal-900' : 'text-gray-700'}`}>
                      Provider
                    </span>
                  </div>
                  {formData.userType === 1 && (
                    <CheckCircleIcon className="h-5 w-5 text-teal-600" />
                  )}
                </label>
              </div>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input 
                    id="firstName" 
                    name="firstName" 
                    type="text" 
                    required 
                    value={formData.firstName} 
                    onChange={handleChange} 
                    placeholder="John"
                    className={`w-full pl-9 pr-3 py-2.5 border rounded-lg focus:ring-2 transition-all duration-300 text-sm ${
                      errors.firstName 
                        ? 'border-red-300 focus:ring-red-200 focus:border-red-500' 
                        : 'border-gray-300 focus:ring-teal-200 focus:border-teal-500'
                    }`} 
                  />
                </div>
                {errors.firstName && (
                  <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last name
                </label>
                <input 
                  id="lastName" 
                  name="lastName" 
                  type="text" 
                  required 
                  value={formData.lastName} 
                  onChange={handleChange} 
                  placeholder="Doe"
                  className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 transition-all duration-300 text-sm ${
                    errors.lastName 
                      ? 'border-red-300 focus:ring-red-200 focus:border-red-500' 
                      : 'border-gray-300 focus:ring-teal-200 focus:border-teal-500'
                  }`} 
                />
                {errors.lastName && (
                  <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input 
                  id="email" 
                  name="email" 
                  type="email" 
                  required 
                  value={formData.email} 
                  onChange={handleChange} 
                  placeholder="john@example.com"
                  className={`w-full pl-9 pr-3 py-2.5 border rounded-lg focus:ring-2 transition-all duration-300 text-sm ${
                    errors.email 
                      ? 'border-red-300 focus:ring-red-200 focus:border-red-500' 
                      : 'border-gray-300 focus:ring-teal-200 focus:border-teal-500'
                  }`} 
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone (optional)
              </label>
              <div className="relative">
                <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input 
                  id="phone" 
                  name="phone" 
                  type="tel" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  placeholder="+1 (555) 123-4567"
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-200 focus:border-teal-500 transition-all duration-300 text-sm" 
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input 
                  id="password" 
                  name="password" 
                  type={showPassword ? 'text' : 'password'} 
                  required 
                  value={formData.password} 
                  onChange={handleChange} 
                  placeholder="Enter password"
                  className={`w-full pl-9 pr-10 py-2.5 border rounded-lg focus:ring-2 transition-all duration-300 text-sm ${
                    errors.password 
                      ? 'border-red-300 focus:ring-red-200 focus:border-red-500' 
                      : 'border-gray-300 focus:ring-teal-200 focus:border-teal-500'
                  }`} 
                />
                <button 
                  type="button" 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input 
                  id="confirmPassword" 
                  name="confirmPassword" 
                  type={showConfirmPassword ? 'text' : 'password'} 
                  required 
                  value={formData.confirmPassword} 
                  onChange={handleChange} 
                  placeholder="Confirm password"
                  className={`w-full pl-9 pr-10 py-2.5 border rounded-lg focus:ring-2 transition-all duration-300 text-sm ${
                    errors.confirmPassword 
                      ? 'border-red-300 focus:ring-red-200 focus:border-red-500' 
                      : 'border-gray-300 focus:ring-teal-200 focus:border-teal-500'
                  }`} 
                />
                <button 
                  type="button" 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Sign Up</span>
                </>
              ) : (
                <>
                  <span>Sign Up</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register; 