import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { listingsAPI } from '../services/api';
import {
  MapPinIcon,
  StarIcon,
  UserIcon,
  CheckBadgeIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  ClockIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';

const ListingDetail = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    try {
      const response = await listingsAPI.getListing(id);
      if (response.data.success) {
        setListing(response.data.data);
      } else {
        setError('Listing not found');
      }
    } catch (error) {
      setError('Failed to load listing');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-teal-800 mb-4">{error}</h1>
          <Link to="/listings" className="text-teal-600 hover:text-teal-700 font-medium">
            Back to listings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-teal-600">
            <li><Link to="/" className="hover:text-teal-700 font-medium">Home</Link></li>
            <li>/</li>
            <li><Link to="/listings" className="hover:text-teal-700 font-medium">Listings</Link></li>
            <li>/</li>
            <li className="text-teal-800 font-semibold">{listing.title}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden mb-8 border border-white/50">
              {listing.images && listing.images.length > 0 ? (
                <div>
                  <div className="relative h-96">
                    <img
                      src={listing.images[currentImageIndex]?.imageUrl}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                    {listing.isFeatured && (
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                        Featured
                      </div>
                    )}
                    {listing.isVerified && (
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-teal-500 to-teal-600 p-2 rounded-full shadow-lg">
                        <CheckBadgeIcon className="h-5 w-5 text-white" />
                      </div>
                    )}
                  </div>
                  {listing.images.length > 1 && (
                    <div className="flex space-x-2 p-4 overflow-x-auto">
                      {listing.images.map((image, index) => (
                        <button
                          key={image.imageId}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                            index === currentImageIndex ? 'border-teal-500 shadow-lg' : 'border-teal-200 hover:border-teal-400'
                          }`}
                        >
                          <img
                            src={image.imageUrl}
                            alt={`${listing.title} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-96 bg-gradient-to-br from-teal-100 to-cyan-100 flex items-center justify-center">
                  <span className="text-6xl text-teal-400">🏗️</span>
                </div>
              )}
            </div>

            {/* Listing Details */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-8 border border-white/50">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-teal-800 mb-2">{listing.title}</h1>
                  <div className="flex items-center space-x-4 text-teal-600">
                    <div className="flex items-center">
                      <MapPinIcon className="h-5 w-5 mr-1 text-teal-500" />
                      {listing.address}, {listing.city}, {listing.state}
                    </div>
                    <div className="flex items-center">
                      <CalendarIcon className="h-5 w-5 mr-1 text-teal-500" />
                      Listed {new Date(listing.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                {listing.priceRange && (
                  <div className="text-right">
                    <p className="text-2xl font-bold text-teal-600 bg-teal-50 px-4 py-2 rounded-lg border border-teal-200">{listing.priceRange}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center">
                  <StarIcon className="h-5 w-5 text-yellow-400 fill-current mr-1" />
                  <span className="font-medium text-teal-800">
                    {listing.averageRating > 0 ? listing.averageRating.toFixed(1) : 'New'}
                  </span>
                  <span className="text-teal-600 ml-1">
                    ({listing.reviewCount} reviews)
                  </span>
                </div>
                <div className="flex items-center text-teal-600">
                  <UserIcon className="h-5 w-5 mr-1 text-teal-500" />
                  {listing.providerName}
                </div>
                <div className="text-sm text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                  Category: {listing.categoryName}
                </div>
              </div>

              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold mb-3 text-teal-800">Description</h3>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{listing.description}</p>
              </div>

              {listing.yearsExperience && (
                <div className="mt-6 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg p-4 border border-teal-200">
                  <h3 className="text-xl font-semibold mb-2 text-teal-800">Experience</h3>
                  <p className="text-teal-700">{listing.yearsExperience} years of experience</p>
                </div>
              )}

              {listing.businessHours && (
                <div className="mt-6 bg-gradient-to-r from-cyan-50 to-emerald-50 rounded-lg p-4 border border-cyan-200">
                  <h3 className="text-xl font-semibold mb-2 text-teal-800">Business Hours</h3>
                  <div className="flex items-center text-teal-700">
                    <ClockIcon className="h-5 w-5 mr-2 text-teal-500" />
                    {listing.businessHours}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 sticky top-8 border border-white/50">
              <h2 className="text-xl font-semibold mb-4 text-teal-800">Contact Information</h2>
              
              <div className="space-y-4">
                {listing.contactPhone && (
                  <div className="flex items-center bg-teal-50 p-3 rounded-lg border border-teal-200">
                    <PhoneIcon className="h-5 w-5 text-teal-500 mr-3" />
                    <a
                      href={`tel:${listing.contactPhone}`}
                      className="text-teal-600 hover:text-teal-700 font-medium"
                    >
                      {listing.contactPhone}
                    </a>
                  </div>
                )}

                {listing.contactEmail && (
                  <div className="flex items-center bg-cyan-50 p-3 rounded-lg border border-cyan-200">
                    <EnvelopeIcon className="h-5 w-5 text-cyan-500 mr-3" />
                    <a
                      href={`mailto:${listing.contactEmail}`}
                      className="text-teal-600 hover:text-teal-700 font-medium"
                    >
                      {listing.contactEmail}
                    </a>
                  </div>
                )}

                {listing.website && (
                  <div className="flex items-center bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                    <GlobeAltIcon className="h-5 w-5 text-emerald-500 mr-3" />
                    <a
                      href={listing.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-600 hover:text-teal-700 font-medium"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-teal-200 space-y-3">
                <button className="w-full bg-gradient-to-r from-teal-600 to-teal-700 text-white py-3 px-4 rounded-lg hover:from-teal-700 hover:to-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300 font-medium shadow-lg">
                  Contact Provider
                </button>
                <button className="w-full border-2 border-teal-300 text-teal-700 py-3 px-4 rounded-lg hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300 font-medium">
                  Save to Favorites
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-teal-200">
                <h3 className="font-semibold mb-3 text-teal-800">Quick Facts</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center bg-teal-50 p-2 rounded-lg">
                    <span className="text-sm text-teal-600">Views:</span>
                    <span className="text-sm font-medium text-teal-800">{listing.viewCount}</span>
                  </div>
                  <div className="flex justify-between items-center bg-cyan-50 p-2 rounded-lg">
                    <span className="text-sm text-teal-600">Verified:</span>
                    <span className={`text-sm font-medium ${listing.isVerified ? 'text-emerald-600' : 'text-gray-600'}`}>
                      {listing.isVerified ? '✓ Yes' : 'No'}
                    </span>
                  </div>
                  {listing.yearsExperience && (
                    <div className="flex justify-between items-center bg-emerald-50 p-2 rounded-lg">
                      <span className="text-sm text-teal-600">Experience:</span>
                      <span className="text-sm font-medium text-teal-800">{listing.yearsExperience} years</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Listings */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-teal-800 mb-6">Similar Services</h2>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/50">
            <div className="text-teal-400 text-4xl mb-2">🔍</div>
            <p className="text-teal-600">Related listings will be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail; 