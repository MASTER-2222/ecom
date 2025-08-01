import { useState, useEffect, createContext, useContext } from 'react';
import { User, LoginRequest, RegisterRequest } from '@/types';
import { authAPI, setAuthToken, setUser, getUser, getAuthToken } from '@/backend/api';
import { toast } from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginRequest) => Promise<boolean>;
  register: (userData: RegisterRequest) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useAuthState = () => {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing user on mount
    const initAuth = async () => {
      try {
        const token = getAuthToken();
        const savedUser = getUser();
        
        if (token && savedUser) {
          try {
            // Verify token is still valid by fetching fresh user data
            const freshUser = await authAPI.getProfile();
            setUserState(freshUser);
            setUser(freshUser);
          } catch (apiError) {
            // If API call fails, use saved user data instead of failing completely
            console.warn('API call failed, using cached user data:', apiError);
            setUserState(savedUser);
            setUser(savedUser);
          }
        }
      } catch (error) {
        // Token invalid or expired, clear storage
        localStorage.removeItem('ritkart_token');
        localStorage.removeItem('ritkart_user');
        localStorage.removeItem('ritkart_refresh_token');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginRequest): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await authAPI.login(credentials);
      
      setAuthToken(response.token);
      setUser(response.user);
      setUserState(response.user);
      
      // Store refresh token if provided
      if (response.refreshToken) {
        localStorage.setItem('ritkart_refresh_token', response.refreshToken);
      }
      
      toast.success('Welcome back!');
      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterRequest): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await authAPI.register(userData);
      
      setAuthToken(response.token);
      setUser(response.user);
      setUserState(response.user);
      
      // Store refresh token if provided
      if (response.refreshToken) {
        localStorage.setItem('ritkart_refresh_token', response.refreshToken);
      }
      
      toast.success('Account created successfully!');
      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    try {
      authAPI.logout();
    } catch (error) {
      // Ignore errors during logout
    } finally {
      setUserState(null);
      localStorage.removeItem('ritkart_token');
      localStorage.removeItem('ritkart_user');
      localStorage.removeItem('ritkart_refresh_token');
      toast.success('Logged out successfully');
    }
  };

  const updateUser = async (userData: Partial<User>): Promise<void> => {
    try {
      const updatedUser = await authAPI.updateProfile(userData);
      setUserState(updatedUser);
      setUser(updatedUser);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update profile';
      toast.error(message);
      throw error;
    }
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'ADMIN';

  return {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated,
    isAdmin,
  };
};

export default AuthContext;