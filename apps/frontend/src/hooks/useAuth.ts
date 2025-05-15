import { createEffect } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { userStore } from '../stores/userStore';
import { User, UserRole } from '../types/user';

export const useAuth = () => {
  const navigate = useNavigate();

  const initializeAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      userStore.setUser(null);
      userStore.setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        userStore.setUser(data.user);
      } else {
        localStorage.removeItem('token');
        userStore.setUser(null);
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('token');
      userStore.setUser(null);
    } finally {
      userStore.setLoading(false);
    }
  };

  createEffect(() => {
    initializeAuth();
  });

  const login = async (phone: string, password: string) => {
    try {
      const response = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phone, password })
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        userStore.setUser(data.user);
        navigate('/');
        return { success: true, user: data.user };
      } else {
        return {
          success: false,
          error: data.message || 'Login failed'
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Login failed'
      };
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    try {
      const response = await fetch('http://localhost:4000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password, role })
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        userStore.setUser(data.user);
        navigate('/');
        return { success: true };
      } else {
        return {
          success: false,
          error: data.message || 'Registration failed'
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Registration failed'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    userStore.clearUser();
    navigate('/login');
  };

  return {
    user: () => userStore.state.user,
    loading: () => userStore.state.loading,
    login,
    register,
    logout
  };
}; 