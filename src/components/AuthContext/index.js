import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../Api';
import { JWT_ACCESS_TOKEN, JWT_REFRESH_TOKEN } from '../../utils/constants';

const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (credentials) => {
    try {
      const response = await api.post('/api/auth/login', credentials);
      localStorage.setItem(JWT_ACCESS_TOKEN, response.data.accessToken);
      localStorage.setItem(JWT_REFRESH_TOKEN, response.data.refreshToken);
      setUser({
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      });
    } catch (error) {
      console.error('Login failed:', error.message);
      throw error;
    }
  };

  useEffect(() => {
    const savedAccessToken = localStorage.getItem(JWT_ACCESS_TOKEN);
    const savedRefreshToken = localStorage.getItem(JWT_REFRESH_TOKEN);



    if (savedAccessToken && savedRefreshToken) {
      setUser({
        accessToken: savedAccessToken,
        refreshToken: savedRefreshToken,
      });

    } else {

    }
    setIsLoading(false);
  }, []);

  const registration = async (credentials) => {

    try {
      const response = await api.post('/api/auth/register', credentials);

      setUser(response.data);
      localStorage.setItem(JWT_ACCESS_TOKEN, response.data.accessToken);
      localStorage.setItem(JWT_REFRESH_TOKEN, response.data.refreshToken);
    } catch (error) {
      console.error('Registration failed:', error);
      console.error(error.response ? error.response.data : error);
      throw error;
    }
  };

  const logout = () => {

    setUser(null);
    localStorage.removeItem(JWT_ACCESS_TOKEN);
    localStorage.removeItem(JWT_REFRESH_TOKEN);
    window.location.href = '/login';
  };

  const clearAuthAndRedirect = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider
      value={{
        clearAuthAndRedirect,
        user,
        login,
        registration,
        logout,
        setUser,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
