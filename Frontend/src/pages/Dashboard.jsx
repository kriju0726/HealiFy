import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import Button from '../components/Button';
import { Activity, User, BarChart3, Plus, TrendingUp, Shield, Clock } from 'lucide-react';

/**
 * Dashboard Page Component
 * 
 * Main dashboard for authenticated users
 * Features:
 * - Welcome message with user info
 * - Quick action cards for main features
 * - Profile completion status
 * - Recent predictions summary
 * - Health insights and tips
 */
const Dashboard = () => {
  const { user, isProfileComplete } = useAuth();

  // Quick action items for the dashboard
  const quickActions = [
    {
      title: 'New Prediction',
      description: 'Start a new health risk assessment',
      icon: <Plus className="h-8 w-8 text-blue-600" />,
      link: '/predictions',
      color: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
      disabled: !isProfileComplete()
    },
    {
      title: 'View Profile',
      description: 'Update your health information',
      icon: <User className="h-8 w-8 text-green-600" />,
      link: '/profile',
      color: 'bg-green-50 hover:bg-green-100 border-green-200',
      disabled: false
    }
  ];

  // Sample health insights
  const healthInsights = [
    {
      icon: <TrendingUp className="h-5 w-5 text-green-600" />,
      title: 'Stay Active',
      description: 'Regular exercise can reduce disease risk by up to 30%'
    },
    {
      icon: <Shield className="h-5 w-5 text-blue-600" />,
      title: 'Preventive Care',
      description: 'Annual health checkups help catch issues early'
    },
    {
      icon: <Clock className="h-5 w-5 text-orange-600" />,
      title: 'Regular Monitoring',
      description: 'Track your health metrics monthly for best results'
    }
  ];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-8">
          <div className="flex items-center space-x-3 mb-4">
            <Activity className="h-10 w-10 text-blue-100" />
            <div>
              <h1 className="text-3xl font-bold">
                Welcome back, {user?.email?.split('@')[0]}!
              </h1>
              <p className="text-blue-100">
                Ready to take control of your health journey?
              </p>
            </div>
          </div>
          
          {!isProfileComplete() && (
            <div className="bg-yellow-500 text-yellow-900 px-4 py-3 rounded-md">
              <div className="flex items-center space-x-2">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Profile Incomplete</span>
              </div>
              <p className="mt-1 text-sm">
                Please complete your profile to access health predictions.
              </p>
              <Link to="/profile">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="mt-2 bg-white text-yellow-800 hover:bg-gray-100"
                >
                  Complete Profile
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className={`
                  block p-6 border-2 rounded-lg transition-colors duration-200
                  ${action.disabled 
                    ? 'opacity-50 cursor-not-allowed bg-gray-50 border-gray-200' 
                    : action.color
                  }
                `}
                onClick={action.disabled ? (e) => e.preventDefault() : undefined}
              >
                <div className="flex items-center space-x-4">
                  {action.icon}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {action.description}
                    </p>
                    {action.disabled && (
                      <p className="text-xs text-red-600 mt-1">
                        Complete profile to enable
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Profile Status */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Profile Status</h3>
          <div className="space-y-3">
            {user?.profile ? (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Age</span>
                  <span className="font-medium">
                    {user.profile.age ? `${user.profile.age} years` : 'Not provided'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Weight</span>
                  <span className="font-medium">
                    {user.profile.weight ? `${user.profile.weight} kg` : 'Not provided'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Height</span>
                  <span className="font-medium">
                    {user.profile.height ? `${user.profile.height} cm` : 'Not provided'}
                  </span>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    isProfileComplete() 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {isProfileComplete() ? 'Profile Complete' : 'Profile Incomplete'}
                  </div>
                </div>
              </>
            ) : (
              <p className="text-gray-500">No profile data available</p>
            )}
          </div>
        </div>

        {/* Health Insights */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Health Insights</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {healthInsights.map((insight, index) => (
              <div key={index} className="flex space-x-3">
                <div className="flex-shrink-0">
                  {insight.icon}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{insight.title}</h4>
                  <p className="text-sm text-gray-600">{insight.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;


// PASTE THIS IS 'QUICK ACTIONS' ARRAY TO RESTORE THE DELETED ITEM
// ,
//     {
//       title: 'Prediction History',
//       description: 'Review your past assessments',
//       icon: <BarChart3 className="h-8 w-8 text-purple-600" />,
//       link: '/predictions',
//       color: 'bg-purple-50 hover:bg-purple-100 border-purple-200',
//       disabled: false
//     }