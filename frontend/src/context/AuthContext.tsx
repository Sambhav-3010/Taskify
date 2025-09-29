"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

export interface BackendUser {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: BackendUser | null;
  loading: boolean;
  setUser: (user: BackendUser | null) => void;
  login?: (email: string, password: string) => Promise<void>;
  signup?: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<void>;
  logout?: () => Promise<void>;
  loginWithGoogle?: (googleToken: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<BackendUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get(
          process.env.NEXT_PUBLIC_BACKEND_URL + "/auth/me",
          { withCredentials: true }
        );
        if (response.data?.user) {
          setUser(response.data.user);
          console.log("User found:", response.data.user);
          console.log(response.data);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
