import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  PlusIcon,
  HomeIcon,
  BuildingOfficeIcon,
  BellIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsProfileMenuOpen(false);
  };

  const navigation = [
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'Services', href: '/listings', icon: BuildingOfficeIcon },
  ];

  return (
    <header className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/" className="flex items-center">
              <div className="w-12 h-12 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg border border-white border-opacity-30 p-1">
                <img 
                  src="/builderimage.jpeg" 
                  alt="Builder360 Logo" 
                  className="h-10 w-10 object-contain rounded-lg"
                />
              </div>
              <span className="ml-3 text-xl font-bold text-white">Builder360</span>
            </Link>
          </motion.div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex md:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-white text-opacity-90 hover:text-white px-3 py-2 text-sm font-medium inline-flex items-center transition-all duration-300 rounded-lg hover:bg-white hover:bg-opacity-10 backdrop-blur-sm"
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <motion.button
                  className="relative p-2 text-white text-opacity-90 hover:text-white hover:bg-white hover:bg-opacity-10 rounded-lg transition-all duration-300 backdrop-blur-sm"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <BellIcon className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-bold shadow-lg">
                    3
                  </span>
                </motion.button>

                {/* Create listing button for providers */}
                {user?.userType === 1 && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/create-listing"
                      className="hidden sm:inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl shadow-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                    >
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Post
                    </Link>
                  </motion.div>
                )}

                {/* Profile dropdown */}
                <div className="relative">
                  <motion.button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center p-1 rounded-xl hover:bg-white hover:bg-opacity-10 transition-colors backdrop-blur-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {user?.profileImageUrl ? (
                      <img
                        className="h-8 w-8 rounded-xl object-cover border-2 border-white border-opacity-30"
                        src={user.profileImageUrl}
                        alt={user.firstName}
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-xl bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 flex items-center justify-center text-white text-sm font-bold">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                      </div>
                    )}
                  </motion.button>

                  {/* Profile dropdown menu */}
                  <AnimatePresence>
                    {isProfileMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl py-2 border border-gray-100"
                      >
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">
                            {user?.firstName} {user?.lastName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {user?.userType === 1 ? 'Service Provider' : 'Customer'}
                          </p>
                        </div>
                        
                        <div className="py-1">
                          <Link
                            to="/profile"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsProfileMenuOpen(false)}
                          >
                            <UserCircleIcon className="h-4 w-4 mr-3" />
                            Profile
                          </Link>
                          
                          {user?.userType === 1 && (
                            <Link
                              to="/my-listings"
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => setIsProfileMenuOpen(false)}
                            >
                              <BuildingOfficeIcon className="h-4 w-4 mr-3" />
                              My Listings
                            </Link>
                          )}
                          
                          <Link
                            to="/settings"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsProfileMenuOpen(false)}
                          >
                            <Cog6ToothIcon className="h-4 w-4 mr-3" />
                            Settings
                          </Link>
                        </div>
                        
                        <div className="border-t border-gray-100 pt-1">
                          <button
                            onClick={handleLogout}
                            className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            Sign out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-white text-opacity-90 hover:text-white px-3 py-2 text-sm font-medium rounded-lg hover:bg-white hover:bg-opacity-10 backdrop-blur-sm transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 backdrop-blur-sm text-white font-medium rounded-xl shadow-sm hover:bg-opacity-30 transition-all duration-300 border border-white border-opacity-30"
                >
                  Sign up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <motion.button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-white text-opacity-90 hover:text-white hover:bg-white hover:bg-opacity-10 rounded-lg backdrop-blur-sm transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="h-5 w-5" />
                ) : (
                  <Bars3Icon className="h-5 w-5" />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 space-y-2 bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl mt-4 border border-white border-opacity-20">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="flex items-center text-white text-opacity-90 hover:text-white px-4 py-3 text-base font-medium rounded-xl hover:bg-white hover:bg-opacity-10 transition-colors mx-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </Link>
                ))}
                
                {isAuthenticated && user?.userType === 1 && (
                  <Link
                    to="/create-listing"
                    className="flex items-center text-white text-opacity-90 hover:text-white px-4 py-3 text-base font-medium rounded-xl hover:bg-white hover:bg-opacity-10 transition-colors mx-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <PlusIcon className="h-5 w-5 mr-3" />
                    Create Listing
                  </Link>
                )}
                
                {!isAuthenticated && (
                  <>
                    <Link
                      to="/login"
                      className="flex items-center text-white text-opacity-90 hover:text-white px-4 py-3 text-base font-medium rounded-xl hover:bg-white hover:bg-opacity-10 transition-colors mx-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign in
                    </Link>
                    <Link
                      to="/register"
                      className="flex items-center bg-white bg-opacity-20 backdrop-blur-sm text-white px-4 py-3 text-base font-medium rounded-xl hover:bg-opacity-30 transition-colors mx-2 border border-white border-opacity-30"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header; 