"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type AuthDrawerView = "signin" | "signup";

interface AuthDrawerContextType {
  isOpen: boolean;
  view: AuthDrawerView;
  open: (view?: AuthDrawerView) => void;
  close: () => void;
  setView: (view: AuthDrawerView) => void;
}

const AuthDrawerContext = createContext<AuthDrawerContextType | undefined>(undefined);

export function AuthDrawerProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<AuthDrawerView>("signin");

  const open = (nextView?: AuthDrawerView) => {
    if (nextView) setView(nextView);
    setIsOpen(true);
  };

  return (
    <AuthDrawerContext.Provider value={{ isOpen, view, open, close: () => setIsOpen(false), setView }}>
      {children}
    </AuthDrawerContext.Provider>
  );
}

export function useAuthDrawer() {
  const context = useContext(AuthDrawerContext);
  if (!context) throw new Error("useAuthDrawer must be used within AuthDrawerProvider");
  return context;
}
