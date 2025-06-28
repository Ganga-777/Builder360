import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { listingsAPI, categoriesAPI } from '../services/api';
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  StarIcon,
  UserIcon,
  CheckBadgeIcon,
  FunnelIcon,
  AdjustmentsHorizontalIcon,
  ViewColumnsIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline';

const Listings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    categoryId: searchParams.get('categoryId') || '',
    city: '',
    state: '',
    minRating: '',
    sortBy: 'newest',
  });
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchData();
    fetchCategories();
  }, [searchParams]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {
        keyword: searchParams.get('keyword') || filters.keyword,
        categoryId: searchParams.get('categoryId') || filters.categoryId,
        city: filters.city,
        state: filters.state,
        minRating: filters.minRating,
        sortBy: filters.sortBy,
        pageSize: 20,
      };

      const response = await listingsAPI.getListings(params);
      if (response.data.success) {
        setListings(response.data.data.data);
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getCategories();
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleSearch = () => {
    const newSearchParams = new URLSearchParams();
    if (filters.keyword) newSearchParams.set('keyword', filters.keyword);
    if (filters.categoryId) newSearchParams.set('categoryId', filters.categoryId);
    setSearchParams(newSearchParams);
  };

  const clearFilters = () => {
    setFilters({
      keyword: '',
      categoryId: '',
      city: '',
      state: '',
      minRating: '',
      sortBy: 'newest',
    });
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="bg-gradient-to-br from-teal-50 to-cyan-50 min-h-screen">
      {/* Search Header */}
      <div className="bg-gradient-to-r from-teal-500 to-teal-600 border-b border-teal-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Search Bar */}
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-teal-400" />
              <input
                type="text"
                placeholder="Search services, contractors..."
                value={filters.keyword}
                onChange={(e) => handleFilterChange('keyword', e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-3 bg-white bg-opacity-90 border-0 rounded-2xl focus:outline-none focus:ring-4 focus:ring-teal-300 text-gray-900 placeholder-gray-600 shadow-lg backdrop-blur-sm"
              />
            </div>
            <motion.button
              onClick={() => setShowFilters(!showFilters)}
              className="p-3 bg-white bg-opacity-20 rounded-2xl hover:bg-white hover:bg-opacity-30 transition-colors backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FunnelIcon className="h-5 w-5 text-white" />
            </motion.button>
          </div>

          {/* Quick Category Filters */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-2 overflow-x-auto pb-2">
              <motion.button
                onClick={() => {
                  handleFilterChange('categoryId', '');
                  handleSearch();
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  !filters.categoryId 
                    ? 'bg-white text-teal-600 shadow-md' 
                    : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                All
              </motion.button>
              {categories.slice(0, 5).map((category) => (
                <motion.button
                  key={category.categoryId}
                  onClick={() => {
                    handleFilterChange('categoryId', category.categoryId.toString());
                    handleSearch();
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    filters.categoryId === category.categoryId.toString()
                      ? 'bg-white text-teal-600 shadow-md'
                      : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category.name}
                </motion.button>
              ))}
            </div>

            {/* View Toggle */}
            <div className="flex bg-white bg-opacity-20 rounded-xl p-1 backdrop-blur-sm">
              <motion.button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-white text-teal-600 shadow-sm' : 'text-white'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Squares2X2Icon className="h-5 w-5" />
              </motion.button>
              <motion.button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-white text-teal-600 shadow-sm' : 'text-white'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ViewColumnsIcon className="h-5 w-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white/90 backdrop-blur-sm border-b border-teal-100"
        >
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-teal-800 mb-2">Category</label>
                <select
                  value={filters.categoryId}
                  onChange={(e) => handleFilterChange('categoryId', e.target.value)}
                  className="w-full px-3 py-2 bg-teal-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.categoryId} value={category.categoryId}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-teal-800 mb-2">City</label>
                <input
                  type="text"
                  placeholder="Enter city"
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                  className="w-full px-3 py-2 bg-teal-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-teal-800 mb-2">Min Rating</label>
                <select
                  value={filters.minRating}
                  onChange={(e) => handleFilterChange('minRating', e.target.value)}
                  className="w-full px-3 py-2 bg-teal-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                >
                  <option value="">Any Rating</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                  <option value="2">2+ Stars</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-teal-800 mb-2">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="w-full px-3 py-2 bg-teal-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                >
                  <option value="newest">Newest First</option>
                  <option value="rating">Highest Rated</option>
                  <option value="name">Name A-Z</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <button
                onClick={clearFilters}
                className="text-teal-600 hover:text-teal-700 text-sm font-medium"
              >
                Clear all filters
              </button>
              <motion.button
                onClick={handleSearch}
                className="px-6 py-2 bg-teal-600 text-white font-medium rounded-xl hover:bg-teal-700 transition-colors shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Apply Filters
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-teal-800">
              {filters.keyword ? `Search results for "${filters.keyword}"` : 'All Services'}
            </h1>
            <p className="text-teal-600 mt-1">
              {loading ? 'Loading...' : `${listings.length} contractors found`}
            </p>
          </div>
        </div>

        {/* Listings Grid/List */}
        {loading ? (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-white/50">
                <div className="bg-gradient-to-br from-teal-200 to-teal-300 h-48 rounded-2xl mb-4"></div>
                <div className="bg-teal-200 h-4 rounded mb-2"></div>
                <div className="bg-teal-200 h-4 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-teal-800 mb-2">No contractors found</h3>
            <p className="text-teal-600 mb-6">Try adjusting your search or filters</p>
            <motion.button
              onClick={clearFilters}
              className="px-6 py-3 bg-teal-600 text-white font-medium rounded-xl hover:bg-teal-700 transition-colors shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Clear Filters
            </motion.button>
          </div>
        ) : (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {listings.map((listing) => (
              <motion.div
                key={listing.listingId}
                whileHover={{ scale: viewMode === 'grid' ? 1.02 : 1.01, y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to={`/listings/${listing.listingId}`}
                  className={`group bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden block border border-white/50 hover:border-teal-200 ${
                    viewMode === 'list' ? 'flex items-center p-4' : 'p-0'
                  }`}
                >
                  <div className={`relative ${viewMode === 'list' ? 'w-24 h-24 flex-shrink-0' : ''}`}>
                    {listing.images && listing.images.length > 0 ? (
                      <img
                        src={listing.images[0].imageUrl}
                        alt={listing.title}
                        className={`object-cover group-hover:scale-105 transition-transform duration-500 ${
                          viewMode === 'list' ? 'w-24 h-24 rounded-2xl' : 'w-full h-48'
                        }`}
                      />
                    ) : (
                      <div className={`bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center ${
                        viewMode === 'list' ? 'w-24 h-24 rounded-2xl' : 'w-full h-48'
                      }`}>
                        <span className="text-4xl">🏗️</span>
                      </div>
                    )}
                    {listing.isFeatured && (
                      <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg">
                        Featured
                      </div>
                    )}
                    {listing.isVerified && (
                      <div className="absolute top-3 right-3 bg-gradient-to-r from-teal-500 to-teal-600 p-1 rounded-full shadow-lg">
                        <CheckBadgeIcon className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>

                  <div className={`${viewMode === 'list' ? 'ml-4 flex-1' : 'p-6'}`}>
                    <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">
                      {listing.title}
                    </h3>
                    <p className={`text-gray-600 mb-3 ${viewMode === 'list' ? 'line-clamp-1' : 'line-clamp-2'}`}>
                      {listing.description}
                    </p>

                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <UserIcon className="h-4 w-4 mr-2 text-teal-500" />
                      {listing.providerName}
                    </div>

                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <MapPinIcon className="h-4 w-4 mr-2 text-teal-500" />
                      {listing.city}, {listing.state}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm font-medium">
                          {listing.averageRating > 0 ? listing.averageRating.toFixed(1) : 'New'}
                        </span>
                        <span className="ml-1 text-sm text-gray-500">
                          ({listing.reviewCount})
                        </span>
                      </div>
                      {listing.priceRange && (
                        <span className="text-sm font-semibold text-teal-600 bg-teal-50 px-2 py-1 rounded-lg border border-teal-100">
                          {listing.priceRange}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Listings; 