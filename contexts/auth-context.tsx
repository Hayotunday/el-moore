"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import * as customerAuth from "@/lib/api/customer-auth";
import type { Customer } from "@/lib/api/types";

export type User = Customer;

export interface UpdateProfileInput {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<User>;
  updateProfile: (input: UpdateProfileInput) => Promise<User>;
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
  return typeof u.id === "string" && (typeof u.firstName === "string" || typeof u.email === "string");
}

function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return false;
    let base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4 !== 0) {
      base64 += "=";
    }
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    const payload = JSON.parse(jsonPayload);
    if (!payload.exp) return false;
    return payload.exp * 1000 <= Date.now() + 10000;
  } catch {
    return false;
  }
}

const USER_STORAGE_KEY = "el-moore-customer-user";

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

          // If the token is expired, trigger a silent refresh in background without clearing state eagerly
          if (isTokenExpired(token)) {
            customerAuth.refreshCustomerOnce().catch(() => {
              // Handled by onCustomerAuthExpired if refresh token is also invalid
            });
          }
        } else {
          customerAuth.setCustomerToken(null);
          window.localStorage.removeItem(USER_STORAGE_KEY);
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

  const updateProfile = async (input: UpdateProfileInput) => {
    const updatedUser = await customerAuth.updateMyProfile(input);
    window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
    setUser(updatedUser);
    return updatedUser;
  };

  const value: AuthContextType = { user, isLoading, login, logout, refreshProfile, updateProfile };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
