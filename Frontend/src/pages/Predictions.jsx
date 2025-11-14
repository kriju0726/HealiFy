import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import Button from '../components/Button';
import { BarChart3, Heart, Droplet, Activity, ArrowRight, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

/**
 * Predictions Overview Page Component
 * 
 * Central hub for all health predictions
 * Features:
 * - Disease prediction cards
 * - Profile completion check
 * - Navigation to individual prediction forms
 * - Responsive grid layout
 */
const Predictions = () => {
  const { isProfileComplete } = useAuth();
  const navigate = useNavigate();

  /**
   * Available disease predictions with their configurations
   */
  const diseaseCards = [
    {
      id: 'diabetes',
      title: 'Diabetes Risk',
      description: 'Assess your risk of developing Type 2 diabetes based on lifestyle and health factors.',
      icon: <Droplet className="h-8 w-8 text-blue-600" />,
      color: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
      symptoms: [
        'Frequent urination',
        'Excessive thirst',
        'Unexplained weight loss',
        'Fatigue levels',
        'Blurred vision',
        'Slow healing wounds'
      ]
    },
    {
      id: 'heart_disease',
      title: 'Heart Disease Risk',
      description: 'Evaluate cardiovascular disease risk factors and heart health indicators.',
      icon: <Heart className="h-8 w-8 text-red-600" />,
      color: 'bg-red-50 hover:bg-red-100 border-red-200',
      symptoms: [
        'Chest pain frequency',
        'Shortness of breath',
        'High blood pressure',
        'Cholesterol levels',
        'Exercise tolerance',
        'Family history'
      ]
    },
    {
      id: 'thyroid',
      title: 'Thyroid Disorder',
      description: 'Check for potential thyroid dysfunction symptoms and metabolic indicators.',
      icon: <Activity className="h-8 w-8 text-green-600" />,
      color: 'bg-green-50 hover:bg-green-100 border-green-200',
      symptoms: [
        'Weight changes',
        'Energy levels',
        'Temperature sensitivity',
        'Hair and skin changes',
        'Mood changes',
        'Sleep patterns'
      ]
    }
  ];

  /**
   * Handle prediction card click
   * Checks profile completion before navigation
   */
  const handlePredictionClick = (diseaseId) => {
    if (!isProfileComplete()) {
      toast.error('Please complete your profile before making predictions.');
      navigate('/profile');
      return;
    }
    
    navigate(`/predict/${diseaseId}`);
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <BarChart3 className="h-10 w-10 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Health Predictions</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Get AI-powered insights into your health risks. Our advanced machine learning models
            analyze your profile and symptoms to provide personalized risk assessments.
          </p>
        </div>

        {/* Profile Completion Warning */}
        {!isProfileComplete() && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-medium text-yellow-800">Complete Your Profile</h3>
                <p className="text-yellow-700 mt-1">
                  To access health predictions, please complete your profile with basic health information
                  like age, weight, and height. This ensures more accurate predictions.
                </p>
                <Link to="/profile">
                  <Button variant="secondary" size="sm" className="mt-3 bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                    Complete Profile Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Disease Prediction Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {diseaseCards.map((disease) => (
            <div
              key={disease.id}
              className={`
                p-6 border-2 rounded-lg transition-all duration-200 cursor-pointer
                ${!isProfileComplete() 
                  ? 'opacity-50 cursor-not-allowed bg-gray-50 border-gray-200' 
                  : disease.color
                }
              `}
              onClick={() => handlePredictionClick(disease.id)}
            >
              {/* Card Header */}
              <div className="flex items-center space-x-3 mb-4">
                {disease.icon}
                <h3 className="text-xl font-semibold text-gray-900">
                  {disease.title}
                </h3>
              </div>

              {/* Card Description */}
              <p className="text-gray-600 mb-4">
                {disease.description}
              </p>

              {/* Symptoms List */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Assessment includes:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {disease.symptoms.slice(0, 4).map((symptom, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <div className="h-1.5 w-1.5 bg-gray-400 rounded-full"></div>
                      <span>{symptom}</span>
                    </li>
                  ))}
                  {disease.symptoms.length > 4 && (
                    <li className="text-gray-500 text-xs">
                      +{disease.symptoms.length - 4} more factors
                    </li>
                  )}
                </ul>
              </div>

              {/* Action Button */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-500">
                  ~5 minutes
                </span>
                <Button
                  size="sm"
                  disabled={!isProfileComplete()}
                  className="flex items-center space-x-1"
                >
                  <span>Start Assessment</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Information Section */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Complete Assessment</h3>
              <p className="text-sm text-gray-600">
                Answer questions about your symptoms and health indicators using our intuitive sliders.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <span className="text-green-600 font-bold">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">AI Analysis</h3>
              <p className="text-sm text-gray-600">
                Our machine learning models analyze your data against medical databases and research.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <span className="text-purple-600 font-bold">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Get Results</h3>
              <p className="text-sm text-gray-600">
                Receive detailed risk assessment with personalized insights and recommendations.
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-2">Important Medical Disclaimer</h3>
          <p className="text-sm text-gray-600">
            These predictions are for informational purposes only and should not replace professional medical advice.
            Always consult with healthcare professionals for proper diagnosis and treatment. Our AI models provide
            risk assessments based on statistical patterns and should be used as a supplementary tool only.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Predictions;