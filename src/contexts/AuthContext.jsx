import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signOut, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendEmailVerification
} from 'firebase/auth';
import { auth } from '../firebaseConfig';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    
    return unsubscribe;
  }, []);

  const signup = async (email, password) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      try {
        await sendEmailVerification(result.user, {
          url: window.location.origin + '/admin-login',
          handleCodeInApp: true
        });
      } catch (verificationError) {
        try {
          await sendEmailVerification(result.user, {
            url: window.location.origin + '/admin-login',
            handleCodeInApp: true
          });
        } catch (retryError) {
          throw new Error('فشل في إرسال رابط التفعيل. يرجى المحاولة مرة أخرى.');
        }
      }

      await signOut(auth);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const resendVerificationEmail = async (email, password) => {
    try {
     
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      try {
        await sendEmailVerification(result.user, {
          url: window.location.origin + '/admin-login',
          handleCodeInApp: true
        });
      } catch (verificationError) {
        try {
          await sendEmailVerification(result.user, {
            url: window.location.origin + '/admin-login',
            handleCodeInApp: true
          });
        } catch (retryError) {
          throw new Error('فشل في إعادة إرسال رابط التفعيل. يرجى المحاولة مرة أخرى.');
        }
      }

      await signOut(auth);
      return true;
    } catch (error) {
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      if (!result.user.emailVerified) {
        await signOut(auth);
        const error = new Error('يجب تفعيل البريد الإلكتروني أولاً. يمكنك طلب إعادة إرسال رابط التفعيل.');
        error.code = 'auth/email-not-verified';
        error.email = email;
        throw error;
      }
      return result;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  };

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    isLoading: loading,
    signup,
    login,
    logout,
    resendVerificationEmail
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}