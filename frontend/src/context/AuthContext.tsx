"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { ME_QUERY, LOGOUT_MUTATION } from "@/graphql";

export interface BackendUser {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: BackendUser | null;
  loading: boolean;
  setUser: (user: BackendUser | null) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<BackendUser | null>(null);

  const { data, loading } = useQuery(ME_QUERY, {
    fetchPolicy: "network-only",
  });

  const [logoutMutation] = useMutation(LOGOUT_MUTATION);

  useEffect(() => {
    if (data?.me) {
      setUser({
        id: data.me.id,
        email: data.me.email,
        name: data.me.name,
      });
    } else if (!loading) {
      setUser(null);
    }
  }, [data, loading]);

  const logout = async () => {
    try {
      await logoutMutation();
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    setUser,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
