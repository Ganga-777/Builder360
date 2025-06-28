import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { listingsAPI, categoriesAPI } from '../services/api';
import {
  SparklesIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  ClockIcon,
  TrophyIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';

const CreateListing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    categoryId: '',
    title: '',
    description: '',
    priceRange: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    contactPhone: user?.phone || '',
    contactEmail: user?.email || '',
    website: '',
    businessHours: '',
    yearsExperience: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user && user.userType !== 1) {
      navigate('/');
      return;
    }
    fetchCategories();
  }, [user, navigate]);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getCategories();
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to load categories');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.categoryId) newErrors.categoryId = 'Category is required';
      if (!formData.title.trim()) newErrors.title = 'Title is required';
      if (!formData.description.trim()) newErrors.description = 'Description is required';
    } else if (step === 2) {
      if (!formData.address.trim()) newErrors.address = 'Address is required';
      if (!formData.city.trim()) newErrors.city = 'City is required';
      if (!formData.state.trim()) newErrors.state = 'State is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    setLoading(true);
    const loadingToast = toast.loading('Creating your listing... ✨');

    try {
      const listingData = {
        ...formData,
        categoryId: parseInt(formData.categoryId),
        yearsExperience: formData.yearsExperience ? parseInt(formData.yearsExperience) : null,
      };

      const response = await listingsAPI.createListing(listingData);
      if (response.data.success) {
        toast.success('🎉 Listing created successfully!', { id: loadingToast });
        navigate('/my-listings');
      } else {
        toast.error(response.data.message, { id: loadingToast });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create listing', { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  if (user && user.userType !== 1) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-500 to-teal-600">
        <motion.div 
          className="text-center text-white"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-4">🚫 Access Denied</h1>
          <p className="text-xl mb-8">Only service providers can create listings.</p>
          <motion.button 
            onClick={() => navigate('/')} 
            className="bg-white text-teal-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🏠 Go back home
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const steps = [
    { number: 1, title: 'Basic Info', icon: SparklesIcon, color: 'text-teal-500' },
    { number: 2, title: 'Location', icon: MapPinIcon, color: 'text-teal-500' },
    { number: 3, title: 'Contact', icon: PhoneIcon, color: 'text-teal-500' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full mb-6 shadow-lg">
            <PlusIcon className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal-600 to-teal-700 bg-clip-text text-transparent mb-4">
            ✨ Create New Listing
          </h1>
          <p className="text-xl text-teal-700 max-w-2xl mx-auto">
            Share your amazing services with customers who need your expertise
          </p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div 
          className="flex justify-center mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center space-x-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                className="flex items-center"
                variants={itemVariants}
              >
                <div className={`relative flex items-center justify-center w-16 h-16 rounded-full transition-all duration-300 ${
                  currentStep >= step.number 
                    ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg' 
                    : 'bg-white text-teal-400 border-2 border-teal-200'
                }`}>
                  <step.icon className="h-8 w-8" />
                  {currentStep > step.number && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center"
                    >
                      <span className="text-white text-xs">✓</span>
                    </motion.div>
                  )}
                </div>
                <div className="ml-3 hidden sm:block">
                  <div className={`text-sm font-semibold ${currentStep >= step.number ? 'text-teal-600' : 'text-teal-400'}`}>
                    Step {step.number}
                  </div>
                  <div className={`text-xs ${currentStep >= step.number ? 'text-teal-600' : 'text-teal-400'}`}>
                    {step.title}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`ml-8 w-16 h-1 transition-all duration-300 ${
                    currentStep > step.number ? 'bg-gradient-to-r from-teal-500 to-teal-600' : 'bg-teal-200'
                  }`} />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Form */}
        <motion.div 
          className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/50"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-teal-800 mb-2">📝 Basic Information</h2>
                    <p className="text-teal-600">Tell us about your service</p>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-teal-800 mb-2">
                        🏷️ Category *
                      </label>
                      <select
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border-2 border-teal-200 rounded-xl focus:ring-4 focus:ring-teal-300 focus:border-teal-500 transition-all duration-300 bg-gradient-to-r from-teal-50 to-cyan-50 text-gray-900 ${errors.categoryId ? 'border-red-300' : ''}`}
                      >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                          <option key={category.categoryId} value={category.categoryId}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      {errors.categoryId && <p className="mt-1 text-sm text-red-600">{errors.categoryId}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-teal-800 mb-2">
                        ✨ Title *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g., Professional Home Renovation Services"
                        className={`w-full px-4 py-3 border-2 border-teal-200 rounded-xl focus:ring-4 focus:ring-teal-300 focus:border-teal-500 transition-all duration-300 bg-gradient-to-r from-teal-50 to-cyan-50 text-gray-900 ${errors.title ? 'border-red-300' : ''}`}
                      />
                      {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-teal-800 mb-2">
                        📋 Description *
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Describe your services, experience, and what makes you unique..."
                        className={`w-full px-4 py-3 border-2 border-teal-200 rounded-xl focus:ring-4 focus:ring-teal-300 focus:border-teal-500 transition-all duration-300 bg-gradient-to-r from-teal-50 to-cyan-50 text-gray-900 resize-none ${errors.description ? 'border-red-300' : ''}`}
                      />
                      {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-teal-800 mb-2">
                          💰 Price Range
                        </label>
                        <input
                          type="text"
                          name="priceRange"
                          value={formData.priceRange}
                          onChange={handleChange}
                          placeholder="e.g., $50-100/hour"
                          className="w-full px-4 py-3 border-2 border-teal-200 rounded-xl focus:ring-4 focus:ring-teal-300 focus:border-teal-500 transition-all duration-300 bg-gradient-to-r from-teal-50 to-cyan-50 text-gray-900"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-teal-800 mb-2">
                          🏆 Years of Experience
                        </label>
                        <input
                          type="number"
                          name="yearsExperience"
                          value={formData.yearsExperience}
                          onChange={handleChange}
                          min="0"
                          max="50"
                          placeholder="Years"
                          className="w-full px-4 py-3 border-2 border-teal-200 rounded-xl focus:ring-4 focus:ring-teal-300 focus:border-teal-500 transition-all duration-300 bg-gradient-to-r from-teal-50 to-cyan-50 text-gray-900"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Location */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-teal-800 mb-2">📍 Location Details</h2>
                    <p className="text-teal-600">Where do you provide your services?</p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-teal-800 mb-2">
                        🏠 Address *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Street address"
                        className={`w-full px-4 py-3 border-2 border-teal-200 rounded-xl focus:ring-4 focus:ring-teal-300 focus:border-teal-500 transition-all duration-300 bg-gradient-to-r from-teal-50 to-cyan-50 text-gray-900 ${errors.address ? 'border-red-300' : ''}`}
                      />
                      {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-teal-800 mb-2">
                          🏙️ City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border-2 border-teal-200 rounded-xl focus:ring-4 focus:ring-teal-300 focus:border-teal-500 transition-all duration-300 bg-gradient-to-r from-teal-50 to-cyan-50 text-gray-900 ${errors.city ? 'border-red-300' : ''}`}
                        />
                        {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-teal-800 mb-2">
                          🗺️ State *
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border-2 border-teal-200 rounded-xl focus:ring-4 focus:ring-teal-300 focus:border-teal-500 transition-all duration-300 bg-gradient-to-r from-teal-50 to-cyan-50 text-gray-900 ${errors.state ? 'border-red-300' : ''}`}
                        />
                        {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-teal-800 mb-2">
                          📮 Postal Code
                        </label>
                        <input
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border-2 border-teal-200 rounded-xl focus:ring-4 focus:ring-teal-300 focus:border-teal-500 transition-all duration-300 bg-gradient-to-r from-teal-50 to-cyan-50 text-gray-900"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Contact Information */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-teal-800 mb-2">📞 Contact Information</h2>
                    <p className="text-teal-600">How can customers reach you?</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-teal-800 mb-2">
                        📱 Phone
                      </label>
                      <input
                        type="tel"
                        name="contactPhone"
                        value={formData.contactPhone}
                        onChange={handleChange}
                        placeholder="Your contact phone"
                        className="w-full px-4 py-3 border-2 border-teal-200 rounded-xl focus:ring-4 focus:ring-teal-300 focus:border-teal-500 transition-all duration-300 bg-gradient-to-r from-teal-50 to-cyan-50 text-gray-900"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-teal-800 mb-2">
                        📧 Email
                      </label>
                      <input
                        type="email"
                        name="contactEmail"
                        value={formData.contactEmail}
                        onChange={handleChange}
                        placeholder="Your contact email"
                        className="w-full px-4 py-3 border-2 border-teal-200 rounded-xl focus:ring-4 focus:ring-teal-300 focus:border-teal-500 transition-all duration-300 bg-gradient-to-r from-teal-50 to-cyan-50 text-gray-900"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-teal-800 mb-2">
                        🌐 Website
                      </label>
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        placeholder="https://yourwebsite.com"
                        className="w-full px-4 py-3 border-2 border-teal-200 rounded-xl focus:ring-4 focus:ring-teal-300 focus:border-teal-500 transition-all duration-300 bg-gradient-to-r from-teal-50 to-cyan-50 text-gray-900"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-teal-800 mb-2">
                        🕒 Business Hours
                      </label>
                      <input
                        type="text"
                        name="businessHours"
                        value={formData.businessHours}
                        onChange={handleChange}
                        placeholder="e.g., Mon-Fri 9AM-5PM"
                        className="w-full px-4 py-3 border-2 border-teal-200 rounded-xl focus:ring-4 focus:ring-teal-300 focus:border-teal-500 transition-all duration-300 bg-gradient-to-r from-teal-50 to-cyan-50 text-gray-900"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-8 border-t border-teal-200 mt-8">
              <motion.button
                type="button"
                onClick={currentStep > 1 ? prevStep : () => navigate('/my-listings')}
                className="px-8 py-3 border-2 border-teal-300 text-teal-700 rounded-xl hover:bg-teal-50 font-semibold transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {currentStep > 1 ? '← Previous' : 'Cancel'}
              </motion.button>

              {currentStep < 3 ? (
                <motion.button
                  type="button"
                  onClick={nextStep}
                  className="px-8 py-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl hover:from-teal-700 hover:to-teal-800 font-semibold transition-all duration-300 shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Next →
                </motion.button>
              ) : (
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-800 font-semibold transition-all duration-300 shadow-lg disabled:opacity-50"
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                >
                  {loading ? '⏳ Creating...' : '🚀 Create Listing'}
                </motion.button>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateListing;