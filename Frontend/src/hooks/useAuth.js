import { useState, useEffect } from 'react';
import axios from 'axios';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status
  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5001/token/details', {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data && response.data.role) {
        setUser({
          role: response.data.role,
          userId: response.data.userId,
          isAuthenticated: true
        });
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      const userType = user?.role === 'donor' ? 'donor' : 'receiver';
      await axios.post(`http://localhost:5001/${userType}/logout`, {}, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('token');
      
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: 'Logout failed' };
    }
  };

  // Check auth status on hook initialization
  useEffect(() => {
    checkAuthStatus();
  }, []);

  return {
    user,
    loading,
    isAuthenticated,
    logout,
    checkAuthStatus,
  };
};
