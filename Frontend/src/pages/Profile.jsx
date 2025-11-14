import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { profileAPI, predictionsAPI } from '../services/apiClient';
import Layout from '../components/Layout';
import Input from '../components/Input';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import { User, Save, History, Calendar, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * Profile Page Component
 * 
 * User profile management with:
 * - Editable profile form (age, weight, height, lifestyle factors)
 * - Form validation
 * - Past predictions history table
 * - Profile completion status
 * - Responsive design with mobile optimization
 */
const Profile = () => {
  const { user, token, updateUserProfile } = useAuth();
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    smoking: false,
    drinking: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [predictionsLoading, setPredictionsLoading] = useState(true);

  /**
   * Initialize form data with user profile on component mount
   */
  useEffect(() => {
    if (user?.profile) {
      setFormData({
        age: user.profile.age || '',
        weight: user.profile.weight || '',
        height: user.profile.height || '',
        smoking: user.profile.smoking || false,
        drinking: user.profile.drinking || false
      });
    }
  }, [user]);

  /**
   * Fetch user's prediction history
   */
  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const response = await predictionsAPI.getPredictionHistory(token);
        if (response.data.success) {
          setPredictions(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching predictions:', error);
        toast.error('Failed to load prediction history');
      } finally {
        setPredictionsLoading(false);
      }
    };

    fetchPredictions();
  }, [token]);

  /**
   * Handle form input changes
   * Clears field-specific errors when user starts typing
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  /**
   * Validate form data
   * @returns {boolean} - Whether form is valid
   */
  const validateForm = () => {
    const newErrors = {};

    // Age validation
    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else if (formData.age < 13 || formData.age > 120) {
      newErrors.age = 'Please enter a valid age (13-120)';
    }

    // Weight validation
    if (!formData.weight) {
      newErrors.weight = 'Weight is required';
    } else if (formData.weight < 20 || formData.weight > 200) {
      newErrors.weight = 'Please enter a valid weight (20-200 kg)';
    }

    // Height validation
    if (!formData.height) {
      newErrors.height = 'Height is required';
    } else if (formData.height < 50 || formData.height > 300) {
      newErrors.height = 'Please enter a valid height (50-300 cm)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   * Updates user profile via API and local context
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors below');
      return;
    }

    setLoading(true);

    try {
      // Convert string values to numbers for numeric fields
      const profileData = {
        ...formData,
        age: Number(formData.age),
        weight: Number(formData.weight),
        height: Number(formData.height)
      };

      // Call update profile API
      const response = await profileAPI.updateProfile(profileData, token);
      
      if (response.data.success) {
        // Update user profile in context
        updateUserProfile(profileData);
        
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Format date for display
   * @param {string} dateString - ISO date string
   * @returns {string} - Formatted date
   */
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  /**
   * Get risk level color based on percentage
   * @param {number} percentage - Risk percentage
   * @returns {string} - CSS class for color
   */
  const getRiskColor = (percentage) => {
    if (percentage < 25) return 'text-green-600 bg-green-100';
    if (percentage < 50) return 'text-yellow-600 bg-yellow-100';
    if (percentage < 75) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex items-center space-x-3">
          <User className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            <p className="text-gray-600">Manage your health information and view prediction history</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Profile Form */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-2 mb-6">
              <Save className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Health Information</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Age"
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Enter your age"
                  error={errors.age}
                  min="1"
                  max="120"
                  required
                />
                <Input
                  label="Weight (kg)"
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="Enter weight in kg"
                  error={errors.weight}
                  min="20"
                  max="500"
                  step="0.1"
                  required
                />
              </div>

              <Input
                label="Height (cm)"
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                placeholder="Enter height in cm"
                error={errors.height}
                min="50"
                max="300"
                step="0.1"
                required
              />

              {/* Lifestyle Factors */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Lifestyle Factors</h3>
                
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="smoking"
                      checked={formData.smoking}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-700">Smoking</span>
                      <p className="text-xs text-gray-500">Do you currently smoke?</p>
                    </div>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="drinking"
                      checked={formData.drinking}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-700">Alcohol Consumption</span>
                      <p className="text-xs text-gray-500">Do you regularly consume alcohol?</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                loading={loading}
              >
                Update Profile
              </Button>
            </form>
          </div>

          {/* Prediction History */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-2 mb-6">
              <History className="h-5 w-5 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-900">Prediction History</h2>
            </div>

            {predictionsLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner text="Loading predictions..." />
              </div>
            ) : predictions.length > 0 ? (
              <div className="space-y-4">
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Disease
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Risk Level
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {predictions.map((prediction, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <TrendingUp className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="text-sm font-medium text-gray-900 capitalize">
                                {prediction.disease.replace('_', ' ')}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="text-sm text-gray-900">
                                {formatDate(prediction.date)}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRiskColor(prediction.result_percentage)}`}>
                              {prediction.result_percentage}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-3">
                  {predictions.map((prediction, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-gray-900 capitalize">
                          {prediction.disease.replace('_', ' ')}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRiskColor(prediction.result_percentage)}`}>
                          {prediction.result_percentage}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {formatDate(prediction.date)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No predictions yet</p>
                <p className="text-sm text-gray-400">
                  Complete your profile and start making predictions to see your history here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;