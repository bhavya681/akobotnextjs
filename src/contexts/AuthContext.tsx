"use client";

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { authAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';

/** Proactive token refresh interval: 5 minutes */
const TOKEN_REFRESH_INTERVAL_MS = 5 * 60 * 1000;

interface User {
  id: string;
  role?: string;
  username?: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const userData = authAPI.getCurrentUser();
        if (userData) {
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error loading user:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();

    // Listen for storage changes (e.g., from other tabs or after login)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user' || e.key === 'accessToken') {
        loadUser();
      }
    };

    // Also listen for custom storage events (for same-tab updates)
    const handleCustomStorageChange = () => {
      loadUser();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('auth-storage-change', handleCustomStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-storage-change', handleCustomStorageChange);
    };
  }, []);

  // Proactive token refresh every 5 minutes when authenticated
  const refreshIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const hasRefreshToken = typeof window !== "undefined" && !!localStorage.getItem("refreshToken");
    if (!authAPI.isAuthenticated() || !authAPI.getCurrentUser() || !hasRefreshToken) {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
      return;
    }

    const doRefresh = async () => {
      try {
        await authAPI.refresh();
        // Don't dispatch auth-storage-change here - token is in localStorage, user object unchanged.
        // Dispatching would trigger loadUser → setUser → re-run effect → infinite loop.
      } catch (err) {
        // Avoid forced logout on transient refresh/network failures.
        // Actual unauthorized states are handled by request interceptors and guarded routes.
        console.warn('Token refresh skipped/failed; will retry on next cycle:', err);
      }
    };

    doRefresh();
    refreshIntervalRef.current = setInterval(doRefresh, TOKEN_REFRESH_INTERVAL_MS);

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    };
  }, [user]);

  const refreshUser = () => {
    const userData = authAPI.getCurrentUser();
    setUser(userData);
  };

  const login = async (identifier: string, password: string) => {
    try {
      const result = await authAPI.login(identifier, password);
      if (result.accessToken && result.user) {
        setUser(result.user);
        // Dispatch custom event for immediate UI updates
        window.dispatchEvent(new Event('auth-storage-change'));
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (email: string, username: string, password: string) => {
    try {
      const result = await authAPI.register(email, username, password);
      if (result.accessToken && result.user) {
        setUser(result.user);
        // Dispatch custom event for immediate UI updates
        window.dispatchEvent(new Event('auth-storage-change'));
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      setUser(null);
      // Dispatch custom event for immediate UI updates
      window.dispatchEvent(new Event('auth-storage-change'));
      router.push('/');
    } catch (error) {
      // Even if logout fails, clear local state
      setUser(null);
      window.dispatchEvent(new Event('auth-storage-change'));
      router.push('/');
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user && authAPI.isAuthenticated(),
    isLoading,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

