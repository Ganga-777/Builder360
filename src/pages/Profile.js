import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/api';
import {
  UserCircleIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  SparklesIcon,
  ShieldCheckIcon,
  CalendarIcon,
  PhoneIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    profileImageUrl: user?.profileImageUrl || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const result = await updateProfile(formData);
      if (result.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setIsEditing(false);
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await authAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (response.data.success) {
        setMessage({ type: 'success', text: 'Password changed successfully!' });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setShowPasswordForm(false);
      } else {
        setMessage({ type: 'error', text: response.data.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to change password' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
      profileImageUrl: user?.profileImageUrl || '',
    });
    setIsEditing(false);
    setMessage({ type: '', text: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section with Profile Summary */}
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl shadow-2xl p-8 mb-8 transform transition-all duration-500 hover:scale-[1.02]">
          <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
            <div className="relative group">
              {formData.profileImageUrl ? (
                <img
                  className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-xl transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                  src={formData.profileImageUrl}
                  alt={`${user?.firstName} ${user?.lastName}`}
                />
              ) : (
                <div className="h-32 w-32 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white shadow-xl flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <UserCircleIcon className="h-20 w-20 text-white" />
                </div>
              )}
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full p-2 shadow-lg animate-bounce">
                <SparklesIcon className="h-5 w-5 text-white" />
              </div>
            </div>
            
            <div className="text-center md:text-left text-white">
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                {user?.firstName} {user?.lastName}
              </h1>
              <p className="text-xl opacity-90 mb-4">{user?.email}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 flex items-center space-x-2">
                  <ShieldCheckIcon className="h-5 w-5" />
                  <span className="text-sm font-medium">
                    {user?.userType === 1 ? 'Service Provider' : 'Customer'}
                  </span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 flex items-center space-x-2">
                  <CalendarIcon className="h-5 w-5" />
                  <span className="text-sm font-medium">
                    Since {new Date(user?.createdAt).getFullYear()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`mb-6 px-6 py-4 rounded-xl shadow-lg transform transition-all duration-500 ${
            message.type === 'success' 
              ? 'bg-gradient-to-r from-green-400 to-green-600 text-white animate-pulse' 
              : 'bg-gradient-to-r from-red-400 to-red-600 text-white animate-pulse'
          }`}>
            <div className="flex items-center space-x-2">
              <CheckIcon className="h-5 w-5" />
              <span className="font-medium">{message.text}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information Card */}
          <div className="lg:col-span-2">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden transform transition-all duration-500 hover:shadow-2xl border border-white/50">
              <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-8 py-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Personal Information</h2>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
                    >
                      <PencilIcon className="h-4 w-4" />
                      <span>Edit</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="p-8">
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Profile Image URL */}
                    {isEditing && (
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-teal-800 mb-3">
                          Profile Image URL
                        </label>
                        <input
                          type="url"
                          name="profileImageUrl"
                          value={formData.profileImageUrl}
                          onChange={handleChange}
                          placeholder="https://example.com/image.jpg"
                          className="w-full px-4 py-3 border-2 border-teal-200 rounded-xl focus:ring-4 focus:ring-teal-300 focus:border-teal-500 transition-all duration-300 bg-gradient-to-r from-teal-50 to-cyan-50"
                        />
                      </div>
                    )}

                    {/* First Name */}
                    <div className="transform transition-all duration-300 hover:translate-y-[-2px]">
                      <label className="block text-sm font-semibold text-teal-800 mb-3">First Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border-2 border-teal-200 rounded-xl focus:ring-4 focus:ring-teal-300 focus:border-teal-500 transition-all duration-300 bg-gradient-to-r from-teal-50 to-cyan-50"
                        />
                      ) : (
                        <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-4 border-l-4 border-teal-500">
                          <p className="text-gray-900 font-medium">{user?.firstName}</p>
                        </div>
                      )}
                    </div>

                    {/* Last Name */}
                    <div className="transform transition-all duration-300 hover:translate-y-[-2px]">
                      <label className="block text-sm font-semibold text-teal-800 mb-3">Last Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border-2 border-teal-200 rounded-xl focus:ring-4 focus:ring-teal-300 focus:border-teal-500 transition-all duration-300 bg-gradient-to-r from-teal-50 to-cyan-50"
                        />
                      ) : (
                        <div className="bg-gradient-to-r from-cyan-50 to-emerald-50 rounded-xl p-4 border-l-4 border-cyan-500">
                          <p className="text-gray-900 font-medium">{user?.lastName}</p>
                        </div>
                      )}
                    </div>

                    {/* Email */}
                    <div className="transform transition-all duration-300 hover:translate-y-[-2px]">
                      <label className="block text-sm font-semibold text-teal-800 mb-3 flex items-center space-x-2">
                        <EnvelopeIcon className="h-4 w-4 text-teal-500" />
                        <span>Email</span>
                      </label>
                      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border-l-4 border-emerald-500">
                        <p className="text-gray-900 font-medium">{user?.email}</p>
                        <p className="text-sm text-emerald-600 mt-1">✓ Verified</p>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="transform transition-all duration-300 hover:translate-y-[-2px]">
                      <label className="block text-sm font-semibold text-teal-800 mb-3 flex items-center space-x-2">
                        <PhoneIcon className="h-4 w-4 text-cyan-500" />
                        <span>Phone</span>
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border-2 border-teal-200 rounded-xl focus:ring-4 focus:ring-cyan-300 focus:border-cyan-500 transition-all duration-300 bg-gradient-to-r from-cyan-50 to-teal-50"
                        />
                      ) : (
                        <div className="bg-gradient-to-r from-cyan-50 to-teal-50 rounded-xl p-4 border-l-4 border-cyan-500">
                          <p className="text-gray-900 font-medium">{user?.phone || 'Not provided'}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {isEditing && (
                    <div className="flex justify-end space-x-4 mt-8 pt-6 border-t-2 border-teal-100">
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="px-6 py-3 border-2 border-teal-300 text-teal-700 rounded-xl hover:bg-teal-50 focus:outline-none focus:ring-4 focus:ring-teal-300 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
                      >
                        <XMarkIcon className="h-4 w-4" />
                        <span>Cancel</span>
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl hover:from-teal-600 hover:to-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-300 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 flex items-center space-x-2"
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <CheckIcon className="h-4 w-4" />
                            <span>Save Changes</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>

          {/* Stats & Password Card */}
          <div className="space-y-8">
            {/* Stats Card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 transform transition-all duration-500 hover:shadow-2xl border border-white/50">
              <h3 className="text-xl font-bold text-teal-800 mb-6 text-center">Account Stats</h3>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-teal-100 to-cyan-100 rounded-xl p-4 text-center transform transition-all duration-300 hover:scale-105">
                  <div className="text-2xl font-bold text-teal-600">
                    {user?.userType === 1 ? 'Provider' : 'Customer'}
                  </div>
                  <div className="text-sm text-teal-600">Account Type</div>
                </div>
                <div className="bg-gradient-to-r from-cyan-100 to-emerald-100 rounded-xl p-4 text-center transform transition-all duration-300 hover:scale-105">
                  <div className="text-2xl font-bold text-cyan-600">
                    {new Date().getFullYear() - new Date(user?.createdAt).getFullYear() || 'New'}
                  </div>
                  <div className="text-sm text-cyan-600">Years Active</div>
                </div>
                <div className="bg-gradient-to-r from-emerald-100 to-teal-100 rounded-xl p-4 text-center transform transition-all duration-300 hover:scale-105">
                  <div className="text-2xl font-bold text-emerald-600">✓</div>
                  <div className="text-sm text-emerald-600">Verified</div>
                </div>
              </div>
            </div>

            {/* Password Section */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden transform transition-all duration-500 hover:shadow-2xl border border-white/50">
              <div className="bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">Security</h3>
                  <button
                    onClick={() => setShowPasswordForm(!showPasswordForm)}
                    className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-3 py-2 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
                  >
                    <PencilIcon className="h-4 w-4" />
                    <span className="text-sm">Change</span>
                  </button>
                </div>
              </div>

              {showPasswordForm ? (
                <div className="p-6">
                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-teal-800 mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        required
                        className="w-full px-4 py-3 border-2 border-teal-200 rounded-xl focus:ring-4 focus:ring-teal-300 focus:border-teal-500 transition-all duration-300 bg-gradient-to-r from-teal-50 to-cyan-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-teal-800 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        required
                        minLength={6}
                        className="w-full px-4 py-3 border-2 border-teal-200 rounded-xl focus:ring-4 focus:ring-teal-300 focus:border-teal-500 transition-all duration-300 bg-gradient-to-r from-teal-50 to-cyan-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-teal-800 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                        className="w-full px-4 py-3 border-2 border-teal-200 rounded-xl focus:ring-4 focus:ring-teal-300 focus:border-teal-500 transition-all duration-300 bg-gradient-to-r from-teal-50 to-cyan-50"
                      />
                    </div>

                    <div className="flex space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setShowPasswordForm(false);
                          setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                          setMessage({ type: '', text: '' });
                        }}
                        className="flex-1 px-4 py-2 border-2 border-teal-300 text-teal-700 rounded-xl hover:bg-teal-50 transition-all duration-300 transform hover:scale-105"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl hover:from-teal-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
                      >
                        {loading ? (
                          <div className="flex items-center justify-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Updating...</span>
                          </div>
                        ) : (
                          'Update'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-emerald-100 to-green-100 p-6 flex items-center justify-center">
                  <div className="flex flex-col items-center">
                    <div className="bg-emerald-500 p-3 rounded-full mb-2">
                      <ShieldCheckIcon className="h-6 w-6 text-white" />
                    </div>
                    <p className="text-sm text-emerald-700 font-medium">Password is secure</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 