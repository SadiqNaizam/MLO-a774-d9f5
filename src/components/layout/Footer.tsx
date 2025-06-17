import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  console.log('Footer component loaded');

  return (
    <footer className="bg-gray-50 border-t border-gray-200 text-gray-600 py-8">
      <div className="container mx-auto px-4 text-center">
        <div className="mb-4">
          <nav className="flex justify-center space-x-6">
            <Link to="/terms" className="text-sm hover:text-gray-900 hover:underline">
              Terms of Service
            </Link>
            <Link to="/privacy" className="text-sm hover:text-gray-900 hover:underline">
              Privacy Policy
            </Link>
            <Link to="/contact" className="text-sm hover:text-gray-900 hover:underline">
              Contact Us
            </Link>
          </nav>
        </div>
        <p className="text-sm">
          &copy; {currentYear} Your Company Name. All rights reserved.
        </p>
        <p className="text-xs mt-2 text-gray-500">
          Empowering eCommerce Insights
        </p>
      </div>
    </footer>
  );
};

export default Footer;