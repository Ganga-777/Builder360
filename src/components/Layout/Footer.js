import React from 'react';
import { motion } from 'framer-motion';
import { HeartIcon } from '@heroicons/react/24/outline';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-8">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="text-center">
          <motion.p 
            className="text-sm text-gray-500 flex items-center justify-center"
            whileHover={{ color: '#374151' }}
          >
            Made with{' '}
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="inline-block mx-1"
            >
              <HeartIcon className="h-4 w-4 text-red-500 inline fill-current" />
            </motion.span>
            {' '}by Builder360 Team © {currentYear}
          </motion.p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 