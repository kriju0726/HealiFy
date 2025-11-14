import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Loading Spinner Component
 * 
 * Reusable loading indicator with different sizes
 * Used throughout the app for loading states
 * 
 * @param {string} size - Spinner size: 'small', 'medium', 'large'
 * @param {string} text - Optional loading text to display
 */
const LoadingSpinner = ({ size = 'medium', text }) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-6 w-6',
    large: 'h-8 w-8'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-600`} />
      {text && (
        <p className="text-sm text-gray-600 animate-pulse">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;