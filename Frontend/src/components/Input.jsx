import React from 'react';

/**
 * Reusable Input Component
 * 
 * Customizable input field with validation states
 * Supports different types and error handling
 * 
 * @param {string} label - Input label text
 * @param {string} type - Input type (text, email, password, number, etc.)
 * @param {string} error - Error message to display
 * @param {string} placeholder - Placeholder text
 * @param {boolean} required - Whether input is required
 * @param {string} className - Additional CSS classes
 */
const Input = ({
  label,
  type = 'text',
  error,
  placeholder,
  required = false,
  className = '',
  ...props
}) => {
  const inputClasses = `
    w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
    ${error 
      ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500' 
      : 'border-gray-300 text-gray-900'
    }
    ${className}
  `.replace(/\s+/g, ' ').trim();

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        className={inputClasses}
        placeholder={placeholder}
        required={required}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Input;