import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, User } from '../services/api';

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string, fullName?: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(authApi.getUser());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Verify token on mount
    if (authApi.isLoggedIn()) {
      authApi.getMe()
        .then(u => setUser(u))
        .catch(() => {
          authApi.logout();
          setUser(null);
        });
    }
  }, []);

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const result = await authApi.login({ username, password });
      setUser(result.user);
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, username: string, password: string, fullName?: string) => {
    setLoading(true);
    try {
      const result = await authApi.register({ email, username, password, full_name: fullName });
      setUser(result.user);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        login,
        register,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
