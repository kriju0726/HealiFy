import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * AuthContext - Global authentication state management
 * 
 * This context manages:
 * - User authentication status
 * - JWT token storage (in-memory for security)
 * - User profile data
 * - Login/logout functionality
 * 
 * Security Note: 
 * - Token is stored in memory (React state) for maximum security
 * - Alternative: localStorage is more persistent but vulnerable to XSS attacks
 * - For production, consider implementing token refresh mechanisms
 */

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on component mount
  useEffect(() => {
    const checkExistingSession = () => {
      try {
        // Optional: Check localStorage for persistent sessions
        // const storedToken = localStorage.getItem('healthapp_token');
        // const storedUser = localStorage.getItem('healthapp_user');
        
        // if (storedToken && storedUser) {
        //   setToken(storedToken);
        //   setUser(JSON.parse(storedUser));
        //   setIsAuthenticated(true);
        // }
        
        setLoading(false);
      } catch (error) {
        console.error('Error checking existing session:', error);
        setLoading(false);
      }
    };

    checkExistingSession();
  }, []);

  /**
   * Login function - sets user data and token in context
   * @param {Object} userData - User data from API response
   * @param {string} authToken - JWT token from API
   */
  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    setIsAuthenticated(true);
    
    // Optional: Store in localStorage for persistence
    // localStorage.setItem('healthapp_token', authToken);
    // localStorage.setItem('healthapp_user', JSON.stringify(userData));
  };

  /**
   * Logout function - clears all authentication data
   */
  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    
    // Clear localStorage if used
    // localStorage.removeItem('healthapp_token');
    // localStorage.removeItem('healthapp_user');
  };

  /**
   * Update user profile in context
   * @param {Object} updatedProfile - Updated profile data
   */
  const updateUserProfile = (updatedProfile) => {
    setUser(prev => ({
      ...prev,
      profile: { ...prev.profile, ...updatedProfile }
    }));
  };

  /**
   * Check if user profile is complete
   * Required fields: age, weight, height
   * @returns {boolean} - Whether profile is complete
   */
  const isProfileComplete = () => {
    if (!user || !user.profile) return false;
    const { age, weight, height } = user.profile;
    return age && weight && height;
  };

  const value = {
    isAuthenticated,
    user,
    token,
    loading,
    login,
    logout,
    updateUserProfile,
    isProfileComplete,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};