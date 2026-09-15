"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import * as customerAuth from "@/lib/api/customer-auth";
import type { Customer } from "@/lib/api/types";

export type User = Customer;

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Guards against a corrupted or outdated cached user (e.g. left over from an
 * earlier session shape, or a partial write) reaching the rest of the app as
 * if it were a real, fully-formed user — which crashes anything that assumes
 * fields like `firstName` are always present.
 */
function isValidCachedUser(value: unknown): value is User {
  if (!value || typeof value !== "object") return false;
  const u = value as Record<string, unknown>;
  return typeof u.id === "string" && typeof u.firstName === "string" && typeof u.phone === "string";
}

const USER_STORAGE_KEY = "el-moore-customer-user";

/**
 * Backed by the purpose-built customer identity system (lib/api/customer-auth.ts) —
 * a Customer record, not the generic "basic" ManagementUser role this used to sign
 * in via lib/api/auth.ts. See lib/api/customer-auth.ts's module comment for why
 * that's a separate token/session from the old system.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = customerAuth.getCustomerToken();
    const cachedUser = window.localStorage.getItem(USER_STORAGE_KEY);
    if (token && cachedUser) {
      try {
        const parsed = JSON.parse(cachedUser);
        if (isValidCachedUser(parsed)) {
          setUser(parsed);
        } else {
          throw new Error("Cached user is missing required fields.");
        }
      } catch {
        customerAuth.setCustomerToken(null);
        window.localStorage.removeItem(USER_STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  // If a background request's silent token refresh fails (the refresh-token
  // cookie itself expired), drop the stale in-memory user right away instead of
  // leaving the UI looking signed in while every request keeps 401ing.
  useEffect(() => {
    return customerAuth.onCustomerAuthExpired(() => {
      window.localStorage.removeItem(USER_STORAGE_KEY);
      setUser(null);
    });
  }, []);

  const login = async (email: string, password: string) => {
    const { customer } = await customerAuth.loginCustomer(email, password);
    window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(customer));
    setUser(customer);
    return customer;
  };

  const logout = async () => {
    await customerAuth.logoutCustomer();
    window.localStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
  };

  const refreshProfile = async () => {
    const freshUser = await customerAuth.getCustomerProfile();
    window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(freshUser));
    setUser(freshUser);
    return freshUser;
  };

  const value: AuthContextType = { user, isLoading, login, logout, refreshProfile };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
