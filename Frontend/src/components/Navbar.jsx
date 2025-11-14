import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, User, LogOut, Menu, X, Home, BarChart3 } from 'lucide-react';

/**
 * Navigation Bar Component
 * 
 * Responsive navigation with:
 * - Logo and brand name
 * - Navigation links (authenticated vs unauthenticated)
 * - Mobile menu toggle
 * - User profile dropdown
 * - Logout functionality
 */
const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  /**
   * Handle user logout
   * Clears authentication state and redirects to home
   */
  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  /**
   * Check if current route is active
   * @param {string} path - Route path to check
   * @returns {boolean} - Whether route is active
   */
  const isActiveRoute = (path) => location.pathname === path;

  /**
   * Navigation link component with active state styling
   */
  const NavLink = ({ to, children, onClick }) => (
    <Link
      to={to}
      onClick={onClick}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
        isActiveRoute(to)
          ? 'bg-blue-100 text-blue-700'
          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      {children}
    </Link>
  );

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-2">
            <Activity className="h-8 w-8 text-blue-600" />
            <Link 
              to="/" 
              className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
            >
              HealthPredict
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard">
                  <div className="flex items-center space-x-1">
                    <Home className="h-4 w-4" />
                    <span>Dashboard</span>
                  </div>
                </NavLink>
                <NavLink to="/profile">
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </div>
                </NavLink>
                <NavLink to="/predictions">
                  <div className="flex items-center space-x-1">
                    <BarChart3 className="h-4 w-4" />
                    <span>Predictions</span>
                  </div>
                </NavLink>
                
                {/* User Menu */}
                <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-200">
                  <span className="text-sm text-gray-700">
                    Welcome, {user?.email?.split('@')[0]}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <NavLink to="/login">Login</NavLink>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-gray-900 p-2"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-2">
            {isAuthenticated ? (
              <div className="flex flex-col space-y-2">
                <NavLink to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="flex items-center space-x-2">
                    <Home className="h-4 w-4" />
                    <span>Dashboard</span>
                  </div>
                </NavLink>
                <NavLink to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </div>
                </NavLink>
                <NavLink to="/predictions" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-4 w-4" />
                    <span>Predictions</span>
                  </div>
                </NavLink>
                
                <div className="pt-2 border-t border-gray-200">
                  <p className="text-sm text-gray-600 px-3 py-1">
                    {user?.email}
                  </p>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md w-full text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <NavLink to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  Login
                </NavLink>
                <NavLink to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                  Sign Up
                </NavLink>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;