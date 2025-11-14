import React from 'react';
import Navbar from './Navbar';

/**
 * Layout Component
 * 
 * Provides consistent layout structure for all pages
 * Includes navigation bar and main content area
 * 
 * @param {React.ReactNode} children - Page content to render
 */
const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {children}
      </main>
    </div>
  );
};

export default Layout;