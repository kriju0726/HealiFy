import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { predictionsAPI } from '../services/apiClient';
import Layout from '../components/Layout';
import Slider from '../components/Slider';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowLeft, Activity, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * Disease Prediction Form Component
 * 
 * Dynamic prediction form that adapts based on disease type
 * Features:
 * - Disease-specific symptom questionnaires
 * - Slider inputs for symptom severity (0-100)
 * - Real-time validation
 * - AI prediction processing with loading states
 * - Results display with charts and risk factor analysis
 * - Skeleton loading screens
 */
const PredictionForm = () => {
  const { diseaseType } = useParams();
  const { token, isProfileComplete } = useAuth();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState('form'); // 'form', 'loading', 'results'
  const [symptoms, setSymptoms] = useState({});
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  /**
   * Disease configurations with specific symptoms/questions
   */
  const diseaseConfigs = {
    diabetes: {
      title: 'Diabetes Risk Assessment',
      description: 'Rate the severity or frequency of each symptom/factor on a scale of 0-100',
      icon: <Activity className="h-6 w-6 text-blue-600" />,
      color: 'text-blue-600',
      questions: [
        {
          key: 'frequent_urination',
          label: 'Frequent Urination',
          description: 'How often do you need to urinate, especially at night?',
          unit: '%'
        },
        {
          key: 'excessive_thirst',
          label: 'Excessive Thirst',
          description: 'How often do you feel unusually thirsty?',
          unit: '%'
        },
        {
          key: 'unexplained_weight_loss',
          label: 'Unexplained Weight Loss',
          description: 'Have you lost weight without trying?',
          unit: '%'
        },
        {
          key: 'fatigue',
          label: 'Fatigue Levels',
          description: 'How tired or fatigued do you feel regularly?',
          unit: '%'
        },
        {
          key: 'blurred_vision',
          label: 'Blurred Vision',
          description: 'How often do you experience blurred vision?',
          unit: '%'
        },
        {
          key: 'slow_healing',
          label: 'Slow Healing Wounds',
          description: 'Do cuts and wounds take longer to heal?',
          unit: '%'
        }
      ]
    },
    heart_disease: {
      title: 'Heart Disease Risk Assessment',
      description: 'Rate the severity or frequency of each cardiovascular symptom/factor',
      icon: <Activity className="h-6 w-6 text-red-600" />,
      color: 'text-red-600',
      questions: [
        {
          key: 'chest_pain',
          label: 'Chest Pain Frequency',
          description: 'How often do you experience chest pain or discomfort?',
          unit: '%'
        },
        {
          key: 'shortness_breath',
          label: 'Shortness of Breath',
          description: 'How often are you short of breath during normal activities?',
          unit: '%'
        },
        {
          key: 'high_blood_pressure',
          label: 'Blood Pressure Concerns',
          description: 'Rate your blood pressure levels (if known)',
          unit: '%'
        },
        {
          key: 'cholesterol_levels',
          label: 'Cholesterol Levels',
          description: 'Rate your cholesterol concerns (if known)',
          unit: '%'
        },
        {
          key: 'exercise_tolerance',
          label: 'Exercise Intolerance',
          description: 'How difficult is it to exercise or do physical activity?',
          unit: '%'
        },
        {
          key: 'family_history',
          label: 'Family History',
          description: 'How strong is your family history of heart disease?',
          unit: '%'
        }
      ]
    },
    thyroid: {
      title: 'Thyroid Disorder Assessment',
      description: 'Rate the severity or frequency of each thyroid-related symptom',
      icon: <Activity className="h-6 w-6 text-green-600" />,
      color: 'text-green-600',
      questions: [
        {
          key: 'weight_changes',
          label: 'Unexplained Weight Changes',
          description: 'Have you experienced sudden weight gain or loss?',
          unit: '%'
        },
        {
          key: 'energy_levels',
          label: 'Low Energy Levels',
          description: 'How often do you feel unusually tired or sluggish?',
          unit: '%'
        },
        {
          key: 'temperature_sensitivity',
          label: 'Temperature Sensitivity',
          description: 'Are you unusually sensitive to hot or cold?',
          unit: '%'
        },
        {
          key: 'hair_skin_changes',
          label: 'Hair and Skin Changes',
          description: 'Have you noticed changes in hair or skin texture?',
          unit: '%'
        },
        {
          key: 'mood_changes',
          label: 'Mood Changes',
          description: 'Have you experienced mood swings or depression?',
          unit: '%'
        },
        {
          key: 'sleep_patterns',
          label: 'Sleep Pattern Changes',
          description: 'Have your sleep patterns changed significantly?',
          unit: '%'
        }
      ]
    }
  };

  const currentDisease = diseaseConfigs[diseaseType];

  /**
   * Initialize symptoms state when component mounts
   */
  useEffect(() => {
    const disease = diseaseConfigs[diseaseType];
    if (!disease) {
      toast.error('Invalid disease type');
      navigate('/predictions');
      return;
    }

    if (!isProfileComplete()) {
      toast.error('Please complete your profile first');
      navigate('/profile');
      return;
    }

    // Initialize symptoms with default values (0)
    const initialSymptoms = {};
    disease.questions.forEach(question => {
      initialSymptoms[question.key] = 0;
    });
    setSymptoms(initialSymptoms);
  }, [diseaseType]);

  /**
   * Handle symptom slider changes
   */
  const handleSymptomChange = (key, value) => {
    setSymptoms(prev => ({
      ...prev,
      [key]: value
    }));
  };

  /**
   * Validate form before submission
   */
  const validateForm = () => {
    const totalScore = Object.values(symptoms).reduce((sum, value) => sum + value, 0);
    if (totalScore === 0) {
      toast.error('Please provide at least some symptom information');
      return false;
    }
    return true;
  };

  /**
   * Submit prediction form
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setCurrentStep('loading');

    try {
      // Call prediction API
      const response = await predictionsAPI.getPrediction(diseaseType, symptoms, token);
      
      if (response.data.success) {
        setPrediction(response.data.data);
        setCurrentStep('results');
        toast.success('Prediction completed successfully!');
      }
    } catch (error) {
      console.error('Prediction error:', error);
      toast.error('Failed to generate prediction. Please try again.');
      setCurrentStep('form');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Go back to form
   */
  const handleBack = () => {
    if (currentStep === 'results') {
      setCurrentStep('form');
      setPrediction(null);
    } else {
      navigate('/predictions');
    }
  };

  /**
   * Risk level helper function
   */
  const getRiskLevel = (percentage) => {
    if (percentage < 25) return { level: 'Low', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (percentage < 50) return { level: 'Moderate', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    if (percentage < 75) return { level: 'High', color: 'text-orange-600', bgColor: 'bg-orange-100' };
    return { level: 'Very High', color: 'text-red-600', bgColor: 'bg-red-100' };
  };

  // Return early if disease not found
  if (!currentDisease) {
    return (
      <Layout>
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Disease Not Found</h2>
          <p className="text-gray-600 mb-4">The requested disease type is not available.</p>
          <Button onClick={() => navigate('/predictions')}>
            Back to Predictions
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>
          
          <div className="flex items-center space-x-3">
            {currentDisease.icon}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{currentDisease.title}</h1>
              <p className="text-gray-600">{currentDisease.description}</p>
            </div>
          </div>
        </div>

        {/* Form Step */}
        {currentStep === 'form' && (
          <div className="bg-white p-8 rounded-lg shadow-md">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Symptoms Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {currentDisease.questions.map((question) => (
                  <div key={question.key} className="bg-gray-50 p-4 rounded-lg">
                    <Slider
                      label={question.label}
                      value={symptoms[question.key] || 0}
                      onChange={(value) => handleSymptomChange(question.key, value)}
                      min={0}
                      max={100}
                      step={1}
                      unit={question.unit}
                      description={question.description}
                    />
                  </div>
                ))}
              </div>

              {/* Progress Indicator */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-800">Form Completion</span>
                  <span className="text-sm text-blue-600">
                    {Object.values(symptoms).filter(v => v > 0).length} / {currentDisease.questions.length} answered
                  </span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${(Object.values(symptoms).filter(v => v > 0).length / currentDisease.questions.length) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  size="lg"
                  disabled={loading}
                >
                  Generate Prediction
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Loading Step */}
        {currentStep === 'loading' && (
          <div className="bg-white p-12 rounded-lg shadow-md text-center">
            <LoadingSpinner size="large" text="Analyzing your health data..." />
            <div className="mt-6 space-y-2">
              <p className="text-gray-600">Our AI is processing your symptoms</p>
              <p className="text-sm text-gray-500">This may take a few moments...</p>
            </div>
          </div>
        )}

        {/* Results Step */}
        {currentStep === 'results' && prediction && (
          <div className="space-y-6">
            {/* Risk Score Card */}
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="mb-6">
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${getRiskLevel(prediction.prediction_percentage).bgColor} mb-4`}>
                  <span className={`text-2xl font-bold ${getRiskLevel(prediction.prediction_percentage).color}`}>
                    {prediction.prediction_percentage}%
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {getRiskLevel(prediction.prediction_percentage).level} Risk
                </h2>
                <p className="text-gray-600">
                  Based on your symptoms and profile, your risk for {currentDisease.title.toLowerCase()} is{' '}
                  <span className={`font-semibold ${getRiskLevel(prediction.prediction_percentage).color}`}>
                    {getRiskLevel(prediction.prediction_percentage).level.toLowerCase()}
                  </span>
                </p>
              </div>
            </div>

            {/* Risk Factors Analysis */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <span>Risk Factors Analysis</span>
              </h3>
              
              {prediction.risk_factors && prediction.risk_factors.length > 0 && (
                <div className="space-y-4">
                  {/* Chart */}
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={prediction.risk_factors}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="name" 
                          angle={-45}
                          textAnchor="end"
                          height={80}
                          fontSize={12}
                        />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => [`${value}%`, 'Impact']}
                          labelStyle={{ color: '#374151' }}
                        />
                        <Bar dataKey="impact" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Risk Factors List */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {prediction.risk_factors.map((factor, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-900">{factor.name}</span>
                        <span className={`font-bold ${
                          factor.impact > 40 ? 'text-red-600' : 
                          factor.impact > 20 ? 'text-orange-600' : 'text-yellow-600'
                        }`}>
                          {factor.impact}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Recommendations */}
            <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>Next Steps</span>
              </h3>
              <div className="space-y-2 text-blue-800">
                {getRiskLevel(prediction.prediction_percentage).level === 'Low' ? (
                  <>
                    <p>• Continue maintaining your healthy lifestyle</p>
                    <p>• Schedule regular checkups with your healthcare provider</p>
                    <p>• Monitor any changes in symptoms</p>
                  </>
                ) : (
                  <>
                    <p>• Consult with a healthcare professional about your symptoms</p>
                    <p>• Consider lifestyle modifications to reduce risk factors</p>
                    <p>• Schedule appropriate medical screenings</p>
                    <p>• Keep track of your symptoms and any changes</p>
                  </>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={() => navigate('/predictions')} className="flex-1">
                Try Another Prediction
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => navigate('/profile')}
                className="flex-1"
              >
                View Prediction History
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PredictionForm;