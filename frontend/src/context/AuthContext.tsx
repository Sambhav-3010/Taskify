"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { useQuery, useMutation, useApolloClient } from "@apollo/client";
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

  // Track if we've synchronized the user state with the query data at least once
  const [isAuthCheckComplete, setIsAuthCheckComplete] = useState(false);

  const { data, loading: queryLoading } = useQuery(ME_QUERY, {
    fetchPolicy: "network-only",
  });

  const [logoutMutation] = useMutation(LOGOUT_MUTATION);

  useEffect(() => {
    if (!queryLoading) {
      if (data?.me) {
        setUser({
          id: data.me.id,
          email: data.me.email,
          name: data.me.name,
        });
      } else {
        setUser(null);
      }
      setIsAuthCheckComplete(true);
    }
  }, [data, queryLoading]);

  const client = useApolloClient();

  const logout = async () => {
    try {
      await logoutMutation();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
      await client.resetStore();
    }
  };

  const value: AuthContextType = {
    user,
    // Only verify loading is false when query is done AND we've updated the user state
    loading: queryLoading || !isAuthCheckComplete,
    setUser,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
