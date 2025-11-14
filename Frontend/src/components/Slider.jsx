import React from 'react';

/**
 * Reusable Slider Component
 * 
 * Custom range slider with value display
 * Used for symptom severity inputs in prediction forms
 * 
 * @param {string} label - Slider label text
 * @param {number} value - Current slider value
 * @param {function} onChange - Value change handler
 * @param {number} min - Minimum value (default: 0)
 * @param {number} max - Maximum value (default: 100)
 * @param {number} step - Step size (default: 1)
 * @param {string} unit - Unit to display with value (e.g., '%', 'kg')
 * @param {string} description - Additional description text
 */
const Slider = ({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
  description,
  ...props
}) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <span className="text-sm font-semibold text-blue-600">
          {value}{unit}
        </span>
      </div>
      
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          {...props}
        />
      </div>
      
      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}
      
      <div className="flex justify-between text-xs text-gray-400">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
};

export default Slider;