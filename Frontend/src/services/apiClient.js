import axios from 'axios';

/**
 * API Client Configuration
 * 
 * Centralized axios client for all API calls
 * Base URL points to dummy backend (to be replaced with actual backend)
 * 
 * Note: We're not using interceptors to keep the code simple and beginner-friendly
 * Instead, we use helper functions to attach authentication headers manually
 */

// Base API configuration
const API_BASE_URL = 'http://localhost:3001/api'; // Replace with actual backend URL

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Helper function to create authenticated headers
 * @param {string} token - JWT token
 * @returns {Object} - Headers object with Authorization
 */
export const createAuthHeaders = (token) => ({
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json',
});

/**
 * DUMMY API FUNCTIONS
 * These simulate real backend responses for development
 * Replace these with actual API calls when backend is ready
 */

/**
 * Authentication API calls
 */
export const authAPI = {
  /**
   * User login
   * @param {Object} credentials - { email, password }
   * @returns {Promise} - API response
   */
  login: async (credentials) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Dummy validation - replace with actual API call
    if (credentials.email === 'user@example.com' && credentials.password === 'password123') {
      return {
        data: {
          success: true,
          statusCode: 200,
          message: 'Login successful.',
          data: {
            token: 'dummy-jwt-token-12345',
            user: {
              id: 'user-123',
              email: credentials.email,
              profile: {
                age: 28,
                weight: 70,
                height: 175,
                smoking: false,
                drinking: true
              }
            }
          }
        }
      };
    } else {
      throw new Error(JSON.stringify({
        success: false,
        statusCode: 401,
        message: 'Invalid credentials.'
      }));
    }
  },

  /**
   * User registration
   * @param {Object} userData - { email, password }
   * @returns {Promise} - API response
   */
  register: async (userData) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Dummy validation
    if (userData.email && userData.password) {
      return {
        data: {
          success: true,
          statusCode: 201,
          message: 'User registered successfully.'
        }
      };
    } else {
      throw new Error(JSON.stringify({
        success: false,
        statusCode: 400,
        message: 'Registration failed. Please check your details.'
      }));
    }
  },
};

/**
 * Profile API calls
 */
export const profileAPI = {
  /**
   * Get user profile
   * @param {string} token - JWT token
   * @returns {Promise} - API response with profile data
   */
  getProfile: async (token) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      data: {
        success: true,
        statusCode: 200,
        message: 'Profile fetched successfully.',
        data: {
          age: 28,
          weight: 70,
          height: 175,
          smoking: false,
          drinking: true
        }
      }
    };
  },

  /**
   * Update user profile
   * @param {Object} profileData - Updated profile data
   * @param {string} token - JWT token
   * @returns {Promise} - API response
   */
  updateProfile: async (profileData, token) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      data: {
        success: true,
        statusCode: 200,
        message: 'Profile updated successfully.',
        data: profileData
      }
    };
  },
};

/**
 * Predictions API calls
 */
export const predictionsAPI = {
  /**
   * Get disease prediction
   * @param {string} disease - Disease type (diabetes, thyroid, etc.)
   * @param {Object} symptoms - Symptom data
   * @param {string} token - JWT token
   * @returns {Promise} - API response with prediction
   */
  getPrediction: async (disease, symptoms, token) => {
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate ML processing time
    
    // Dummy prediction calculation based on input values
    const avgSymptomScore = Object.values(symptoms).reduce((a, b) => a + b, 0) / Object.values(symptoms).length;
    const predictionPercentage = Math.min(Math.max(avgSymptomScore + Math.random() * 20 - 10, 5), 95);
    
    return {
      data: {
        success: true,
        statusCode: 200,
        data: {
          disease: disease,
          prediction_percentage: Math.round(predictionPercentage),
          risk_factors: [
            { name: 'High BMI', impact: Math.round(Math.random() * 50) },
            { name: 'Age Factor', impact: Math.round(Math.random() * 30) },
            { name: 'Lifestyle', impact: Math.round(Math.random() * 25) }
          ].sort((a, b) => b.impact - a.impact),
          timestamp: new Date().toISOString()
        }
      }
    };
  },

  /**
   * Get user's prediction history
   * @param {string} token - JWT token
   * @returns {Promise} - API response with predictions array
   */
  getPredictionHistory: async (token) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      data: {
        success: true,
        statusCode: 200,
        data: [
          { disease: 'diabetes', date: '2024-01-15', result_percentage: 72 },
          { disease: 'thyroid', date: '2024-01-10', result_percentage: 34 },
          { disease: 'diabetes', date: '2024-01-05', result_percentage: 68 },
          { disease: 'heart_disease', date: '2024-01-01', result_percentage: 45 }
        ]
      }
    };
  },
};

export default apiClient;