import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile } from '../types';
import { authService } from '../services/authService';
import { isFirebaseConfigured, ADMIN_UID } from '../services/firebase';
import { useToast } from './ToastContext';

interface AuthContextType {
  currentUser: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  isFirebaseConfigured: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, name: string) => Promise<void>;
  signInAsGuest: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { showToast } = useToast();
  const isAutoConnecting = React.useRef(false);

  useEffect(() => {
    let isMounted = true;
    const unsubscribe = authService.subscribe(async (user) => {
      if (!isMounted) return;
      setCurrentUser(user);
      setLoading(false);

      const manualSignOut = typeof window !== 'undefined' && sessionStorage.getItem('manual_sign_out') === 'true';
      if (!user && !manualSignOut && !isAutoConnecting.current) {
        isAutoConnecting.current = true;
        try {
          await authService.signInAsGuest();
        } catch {
          // Fallback to manual sign-in if guest auth fails
        } finally {
          isAutoConnecting.current = false;
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const isAdmin = currentUser?.uid === ADMIN_UID || currentUser?.isAdmin === true;

  const signIn = async (email: string, pass: string) => {
    try {
      if (typeof window !== 'undefined') sessionStorage.removeItem('manual_sign_out');
      const user = await authService.signIn(email, pass);
      showToast(`Welcome back, ${user.name}!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to sign in', 'error');
      throw err;
    }
  };

  const register = async (email: string, pass: string, name: string) => {
    try {
      if (typeof window !== 'undefined') sessionStorage.removeItem('manual_sign_out');
      const user = await authService.register(email, pass, name);
      showToast(`Account created for ${user.name}!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to register', 'error');
      throw err;
    }
  };

  const signInAsGuest = async () => {
    try {
      if (typeof window !== 'undefined') sessionStorage.removeItem('manual_sign_out');
      showToast('Connecting to live stream...', 'info');
      const user = await authService.signInAsGuest();
      showToast(`Connected as ${user.name}!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to connect as guest', 'error');
      throw err;
    }
  };

  const signOut = async () => {
    try {
      if (typeof window !== 'undefined') sessionStorage.setItem('manual_sign_out', 'true');
      await authService.signOut();
      showToast('Signed out', 'info');
    } catch (err: any) {
      showToast(err.message || 'Failed to sign out', 'error');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        isAdmin,
        isFirebaseConfigured,
        signIn,
        register,
        signInAsGuest,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
