import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { listingsAPI, categoriesAPI } from '../services/api';
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  StarIcon,
  UserIcon,
  CheckBadgeIcon,
  SparklesIcon,
  PlusIcon,
  FireIcon,
  TrophyIcon,
  ClockIcon,
  BellIcon,
} from '@heroicons/react/24/outline';

const Home = () => {
  const [listings, setListings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const [listingsResponse, categoriesResponse] = await Promise.all([
        listingsAPI.getListings({ pageSize: 6 }),
        categoriesAPI.getCategories(),
      ]);

      if (listingsResponse.data.success) {
        setListings(listingsResponse.data.data.data);
      }
      if (categoriesResponse.data.success) {
        setCategories(categoriesResponse.data.data.slice(0, 6));
      }
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `/listings?keyword=${encodeURIComponent(searchTerm.trim())}`;
    }
  };

  const quickActions = [
    { 
      icon: PlusIcon, 
      label: 'Post Project', 
      gradient: 'bg-gradient-to-r from-teal-500 to-teal-600', 
      href: '/create-listing' 
    },
    { 
      icon: MagnifyingGlassIcon, 
      label: 'Find Services', 
      gradient: 'bg-gradient-to-r from-teal-400 to-teal-500', 
      href: '/listings' 
    },
    { 
      icon: UserIcon, 
      label: 'My Profile', 
      gradient: 'bg-gradient-to-r from-teal-600 to-teal-700', 
      href: '/profile' 
    },
    { 
      icon: BellIcon, 
      label: 'Notifications', 
      gradient: 'bg-gradient-to-r from-teal-500 to-cyan-500', 
      href: '/notifications' 
    },
  ];

  const categoryColors = [
    'bg-gradient-to-br from-teal-100 to-teal-200',
    'bg-gradient-to-br from-cyan-100 to-cyan-200',
    'bg-gradient-to-br from-emerald-100 to-emerald-200',
    'bg-gradient-to-br from-teal-50 to-teal-150',
    'bg-gradient-to-br from-green-100 to-green-200',
    'bg-gradient-to-br from-cyan-50 to-cyan-150',
  ];

  return (
    <div className="bg-gradient-to-br from-teal-50 to-cyan-50 min-h-screen">
      {/* Teal App Header */}
      <div className="bg-gradient-to-r from-teal-500 to-teal-600 border-b border-teal-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white drop-shadow-lg">
                Good morning! 👋
              </h1>
              <p className="text-teal-100 text-lg">Find the perfect contractor for your project</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <motion.div
                  className="p-3 bg-white bg-opacity-20 rounded-2xl backdrop-blur-sm"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <BellIcon className="h-6 w-6 text-white" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-gradient-to-r from-red-400 to-pink-500 rounded-full animate-pulse"></span>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Teal Search Bar */}
          <form onSubmit={handleSearch} className="relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-teal-400" />
            <input
              type="text"
              placeholder="🔍 Search contractors, services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white bg-opacity-90 border-0 rounded-2xl focus:outline-none focus:ring-4 focus:ring-teal-300 text-gray-900 placeholder-gray-600 text-lg shadow-lg backdrop-blur-sm"
            />
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
        {/* Teal Quick Actions */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/50"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <h2 className="text-xl font-bold text-teal-800 mb-6">🚀 Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.label}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={action.href}
                  className="flex flex-col items-center p-6 rounded-3xl bg-white hover:shadow-lg transition-all duration-300 group border border-teal-100"
                >
                  <div className={`${action.gradient} p-4 rounded-2xl mb-4 group-hover:shadow-lg shadow-md`}>
                    <action.icon className="h-8 w-8 text-white" />
                  </div>
                  <span className="text-sm font-bold text-gray-700 group-hover:text-teal-600">{action.label}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Teal Categories */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/50"
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-teal-800">🎨 Browse Categories</h2>
            <Link to="/listings" className="text-teal-600 text-sm font-bold hover:text-teal-700 transition-colors">
              See all ✨
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gradient-to-br from-teal-200 to-teal-300 h-20 w-20 rounded-3xl mx-auto mb-3"></div>
                  <div className="bg-teal-200 h-3 rounded-full mx-auto w-16"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {categories.map((category, index) => (
                <motion.div
                  key={category.categoryId}
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={`/listings?categoryId=${category.categoryId}`}
                    className="group text-center block"
                  >
                    <div className={`${categoryColors[index % categoryColors.length]} p-5 rounded-3xl mb-3 group-hover:shadow-lg transition-all duration-300 border-2 border-white shadow-md`}>
                      {category.iconUrl ? (
                        <img
                          src={category.iconUrl}
                          alt={category.name}
                          className="h-10 w-10 mx-auto group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <span className="text-3xl">🔧</span>
                      )}
                    </div>
                    <span className="text-xs font-bold text-gray-700 group-hover:text-teal-600 transition-all">
                      {category.name}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Teal Featured Professionals */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/50"
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <motion.div
                className="bg-gradient-to-r from-teal-500 to-teal-600 p-2 rounded-xl mr-3"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <FireIcon className="h-6 w-6 text-white" />
              </motion.div>
              <h2 className="text-xl font-bold text-teal-800">🌟 Top Rated</h2>
            </div>
            <Link to="/listings" className="text-teal-600 text-sm font-bold hover:text-teal-700 transition-colors">
              View all 🚀
            </Link>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-center space-x-4 p-4 bg-gradient-to-r from-teal-100 to-teal-200 rounded-3xl">
                  <div className="bg-gradient-to-br from-teal-300 to-teal-400 h-20 w-20 rounded-3xl"></div>
                  <div className="flex-1">
                    <div className="bg-teal-300 h-4 rounded-full mb-2"></div>
                    <div className="bg-teal-300 h-3 rounded-full w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {listings.slice(0, 4).map((listing, index) => (
                <motion.div
                  key={listing.listingId}
                  whileHover={{ scale: 1.02, x: 10 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={`/listings/${listing.listingId}`}
                    className="flex items-center space-x-4 p-4 bg-gradient-to-r from-white via-teal-50 to-cyan-50 hover:from-teal-50 hover:via-cyan-50 hover:to-emerald-50 rounded-3xl transition-all duration-300 shadow-lg hover:shadow-xl group border border-teal-100"
                  >
                    <div className="relative">
                      {listing.images && listing.images.length > 0 ? (
                        <img
                          src={listing.images[0].imageUrl}
                          alt={listing.title}
                          className="h-20 w-20 object-cover rounded-3xl border-4 border-white shadow-lg group-hover:border-teal-200 transition-colors"
                        />
                      ) : (
                        <div className="h-20 w-20 bg-gradient-to-br from-teal-400 to-teal-500 rounded-3xl flex items-center justify-center border-4 border-white shadow-lg">
                          <span className="text-3xl">🏗️</span>
                        </div>
                      )}
                      {listing.isVerified && (
                        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-teal-400 to-teal-500 p-1 rounded-full shadow-lg">
                          <CheckBadgeIcon className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg text-gray-900 truncate group-hover:text-teal-600">{listing.title}</h3>
                      <p className="text-sm text-gray-600 flex items-center mt-1">
                        <UserIcon className="h-4 w-4 mr-2 text-teal-500" />
                        {listing.providerName}
                      </p>
                      <div className="flex items-center mt-2">
                        <div className="flex items-center">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          >
                            <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                          </motion.div>
                          <span className="text-sm text-gray-600 ml-1 font-medium">
                            {listing.averageRating > 0 ? listing.averageRating.toFixed(1) : 'New'}
                          </span>
                        </div>
                        <span className="mx-2 text-gray-300">•</span>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPinIcon className="h-4 w-4 mr-1 text-teal-500" />
                          {listing.city}
                        </div>
                      </div>
                    </div>
                    
                    {listing.priceRange && (
                      <div className="text-right">
                        <span className="text-sm font-bold bg-gradient-to-r from-teal-500 to-teal-600 text-white px-3 py-2 rounded-full shadow-lg">
                          {listing.priceRange}
                        </span>
                      </div>
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Teal Recent Activity */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/50"
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <motion.div
                className="bg-gradient-to-r from-teal-500 to-teal-600 p-2 rounded-xl mr-3"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ClockIcon className="h-6 w-6 text-white" />
              </motion.div>
              <h2 className="text-xl font-bold text-teal-800">⚡ Recent Activity</h2>
            </div>
          </div>
          
          <div className="space-y-4">
            <motion.div 
              className="flex items-center space-x-4 p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl border border-teal-200"
              whileHover={{ x: 5 }}
            >
              <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-3 rounded-2xl">
                <TrophyIcon className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900">🎉 New contractor joined your area</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex items-center space-x-4 p-4 bg-gradient-to-r from-cyan-50 to-emerald-50 rounded-2xl border border-cyan-200"
              whileHover={{ x: 5 }}
            >
              <div className="bg-gradient-to-r from-cyan-500 to-teal-500 p-3 rounded-2xl">
                <CheckBadgeIcon className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900">✅ Project completed successfully</p>
                <p className="text-xs text-gray-500">1 day ago</p>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex items-center space-x-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200"
              whileHover={{ x: 5 }}
            >
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-3 rounded-2xl">
                <SparklesIcon className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900">⭐ 5 new reviews posted</p>
                <p className="text-xs text-gray-500">2 days ago</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Teal Stats */}
        <div className="grid grid-cols-2 gap-6">
          <motion.div 
            className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-3xl p-6 text-white shadow-lg"
            whileHover={{ scale: 1.05, y: -5 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-teal-100 text-sm font-medium">🔥 Active Projects</p>
                <p className="text-4xl font-bold drop-shadow-lg">127</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-3xl backdrop-blur-sm">
                <TrophyIcon className="h-8 w-8 animate-float" />
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-gradient-to-r from-cyan-500 to-teal-500 rounded-3xl p-6 text-white shadow-lg"
            whileHover={{ scale: 1.05, y: -5 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-100 text-sm font-medium">✨ Success Rate</p>
                <p className="text-4xl font-bold drop-shadow-lg">98%</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-3xl backdrop-blur-sm">
                <CheckBadgeIcon className="h-8 w-8 animate-float" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Home; 