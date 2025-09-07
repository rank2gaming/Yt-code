import React, { useContext, useState, useEffect, createContext, ReactNode } from 'react';
// FIX: Switched to Firebase compat imports to resolve module export errors.
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';


const firebaseConfig = {
  apiKey: "AIzaSyDuQ0SxvLc5ap1282qR5WhV5P-0fozTZLQ",
  authDomain: "fir-my-app-on1.firebaseapp.com",
  databaseURL: "https://fir-my-app-on1-default-rtdb.firebaseio.com",
  projectId: "fir-my-app-on1",
  storageBucket: "fir-my-app-on1.firebasestorage.app",
  messagingSenderId: "127873891009",
  appId: "1:127873891009:web:6b740ecbc57f856906f240",
  measurementId: "G-LSBYB4ZT2Q"
};

// Initialize Firebase
// FIX: Used firebase.initializeApp from the compat library.
const app = firebase.initializeApp(firebaseConfig);
// FIX: Used namespaced firebase.auth() and firebase.database() from the compat library.
export const auth = firebase.auth();
export const db = firebase.database();

interface AuthContextType {
  // FIX: Used firebase types from the compat library.
  currentUser: firebase.User | null;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<firebase.auth.UserCredential>;
  signup: (email: string, password: string) => Promise<firebase.auth.UserCredential>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // FIX: Used firebase.User type from the compat library.
  const [currentUser, setCurrentUser] = useState<firebase.User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // FIX: Used firebase types from the compat library.
    let adminValueListener: ((snapshot: firebase.database.DataSnapshot) => any) | undefined;
    let adminRef: firebase.database.Reference | null = null;
  
    // FIX: Used auth.onAuthStateChanged from the compat library.
    const unsubscribe = auth.onAuthStateChanged(user => {
      // Clean up previous listener if it exists
      if (adminRef && adminValueListener) {
        // FIX: Used ref.off() to detach listener.
        adminRef.off('value', adminValueListener);
      }
      adminRef = null;
      adminValueListener = undefined;
  
      setCurrentUser(user);
      if (user) {
        // FIX: Used db.ref() and ref.on() from the compat library.
        adminRef = db.ref('config/adminEmail');
        adminValueListener = adminRef.on('value', snapshot => {
          setIsAdmin(snapshot.val() === user.email);
          // Set loading to false once we have the admin status
          setLoading(false); 
        });
      } else {
        setIsAdmin(false);
        setLoading(false);
      }
    });
  
    return () => {
      unsubscribe();
      // Clean up listener on component unmount
      if (adminRef && adminValueListener) {
        // FIX: Used ref.off() to detach listener.
        adminRef.off('value', adminValueListener);
      }
    };
  }, []);

  const signup = async (email: string, password: string) => {
    // FIX: Used auth.createUserWithEmailAndPassword from the compat library.
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    if (userCredential.user) {
      // Send verification email upon signup. No need to await.
      // FIX: Used user.sendEmailVerification() from the compat library.
      userCredential.user.sendEmailVerification();
    }
    // The onAuthStateChanged listener will handle setting the new user state.
    return userCredential;
  };
  
  const login = (email: string, password: string) => {
    // FIX: Used auth.signInWithEmailAndPassword from the compat library.
    return auth.signInWithEmailAndPassword(email, password);
  };

  const logout = () => {
    // FIX: Used auth.signOut from the compat library.
    return auth.signOut();
  };

  const resetPassword = (email: string) => {
    // FIX: Used auth.sendPasswordResetEmail from the compat library.
    return auth.sendPasswordResetEmail(email);
  };

  const resendVerificationEmail = () => {
    if (currentUser && !currentUser.emailVerified) {
      // FIX: Used currentUser.sendEmailVerification from the compat library.
      return currentUser.sendEmailVerification();
    }
    return Promise.reject(new Error('User is not logged in or is already verified.'));
  };
  
  const deleteAccount = async () => {
    if (!currentUser) {
        throw new Error("No user is currently signed in.");
    }

    const userId = currentUser.uid;

    // Delete user data from Realtime Database. For now, this is just the wishlist.
    // FIX: Used db.ref() from the compat library.
    const wishlistRef = db.ref(`wishlists/${userId}`);
    // FIX: Used ref.remove() from the compat library.
    await wishlistRef.remove();

    // Delete the user from Firebase Authentication.
    // FIX: Used currentUser.delete() from the compat library.
    await currentUser.delete();
    // The onAuthStateChanged listener will automatically update the app state.
  };

  const value: AuthContextType = {
    currentUser,
    isAdmin,
    login,
    signup,
    logout,
    resetPassword,
    resendVerificationEmail,
    deleteAccount,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};