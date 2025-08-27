import React, { useContext, useState, useEffect, createContext, ReactNode } from 'react';
// FIX: Change Firebase imports to be compatible with Firebase v8 namespaced API.
// By using the v9 compat libraries, we can keep the v8 syntax.
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';

// FIX: Define types using the firebase namespace for v8 compatibility.
type User = firebase.User;
type UserCredential = firebase.auth.UserCredential;
type Auth = firebase.auth.Auth;
type Database = firebase.database.Database;
type FirebaseApp = firebase.app.App;


const firebaseConfig = {
  apiKey: "AIzaSyC7pFds2vSVST2e90cPhFPjivbY_vct-e8",
  authDomain: "fir-180a7.firebaseapp.com",
  databaseURL: "https://fir-180a7-default-rtdb.firebaseio.com",
  projectId: "fir-180a7",
  storageBucket: "fir-180a7.firebasestorage.app",
  messagingSenderId: "909813398090",
  appId: "1:909813398090:web:974673ab6ccc4ad09344b3"
};

// Initialize Firebase
let app: FirebaseApp;
// FIX: Use Firebase v8 syntax for app initialization.
if (!firebase.apps.length) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

// FIX: Use Firebase v8 syntax to get auth and database services.
const auth: Auth = firebase.auth();
export const db: Database = firebase.database();

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<UserCredential>;
  signup: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
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
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // FIX: Use Firebase v8 namespaced API for onAuthStateChanged.
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signup = (email: string, password: string) => {
    // FIX: Use Firebase v8 namespaced API for createUserWithEmailAndPassword.
    return auth.createUserWithEmailAndPassword(email, password);
  };
  
  const login = (email: string, password: string) => {
    // FIX: Use Firebase v8 namespaced API for signInWithEmailAndPassword.
    return auth.signInWithEmailAndPassword(email, password);
  };

  const logout = () => {
    // FIX: Use Firebase v8 namespaced API for signOut.
    return auth.signOut();
  };

  const resetPassword = (email: string) => {
    // FIX: Use Firebase v8 namespaced API for sendPasswordResetEmail.
    return auth.sendPasswordResetEmail(email);
  };

  const value: AuthContextType = {
    currentUser,
    login,
    signup,
    logout,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};