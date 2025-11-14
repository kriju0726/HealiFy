import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import Button from '../components/Button';
import { Activity, Shield, BarChart3, Users, ArrowRight, CheckCircle } from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <Activity className="h-8 w-8 text-blue-600" />,
      title: 'AI-Powered Predictions',
      description: 'Advanced machine learning algorithms analyze your health data to provide accurate disease risk predictions.'
    },
    {
      icon: <Shield className="h-8 w-8 text-green-600" />,
      title: 'Secure & Private',
      description: 'Your health data is encrypted and secured with industry-standard security protocols.'
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-purple-600" />,
      title: 'Detailed Analytics',
      description: 'Comprehensive reports with risk factors analysis and personalized health insights.'
    },
    {
      icon: <Users className="h-8 w-8 text-orange-600" />,
      title: 'Expert Reviewed',
      description: 'Our prediction models are developed and validated by medical professionals.'
    }
  ];

  const benefits = [
    'Early disease detection and prevention',
    'Personalized health risk assessment',
    'Track your health trends over time',
    'Evidence-based health recommendations',
    'Secure medical data storage',
    '24/7 access to your health insights'
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Predict Your Health.
            <span className="text-blue-600"> Protect Your Future.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Harness the power of artificial intelligence to predict potential health risks 
            and take proactive steps towards a healthier lifestyle.
          </p>
          
          {isAuthenticated ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dashboard">
                <Button size="lg" className="w-full sm:w-auto">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/predictions">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  New Prediction
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Sign In
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Why Choose HealthPredict?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-white rounded-2xl p-8 md:p-12 shadow-md">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Take Control of Your Health
          </h2>
          <p className="text-lg text-gray-600 text-center mb-10">
            Our comprehensive health prediction platform empowers you with the knowledge 
            and insights needed to make informed decisions about your wellbeing.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
          
          {!isAuthenticated && (
            <div className="text-center mt-10">
              <Link to="/register">
                <Button size="lg">
                  Start Your Health Journey Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Home;