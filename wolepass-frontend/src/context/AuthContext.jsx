import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('wolepass_token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize context and assume authenticated if token exists locally
  useEffect(() => {
    if (token) {
      setUser({ authenticated: true });
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    const response = await api.post('/login', { email, password });
    
    // Support varying API structures (token or access_token)
    const accessData = response.data.data || response.data;
    const resolvedToken = accessData.token || accessData.access_token;
    
    if (resolvedToken) {
      localStorage.setItem('wolepass_token', resolvedToken);
      setToken(resolvedToken);
      setUser(accessData.user || { email });
    }
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('wolepass_token');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    login,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
