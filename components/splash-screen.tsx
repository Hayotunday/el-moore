"use client";

import { useEffect, useState } from "react";

export default function SplashScreen() {
  const [hide, setHide] = useState(false);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hideTimer = setTimeout(() => setHide(true), reduceMotion ? 200 : 1300);
    const unmountTimer = setTimeout(() => setMounted(false), reduceMotion ? 500 : 1900);
    return () => {
      clearTimeout(hideTimer);
      clearTimeout(unmountTimer);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-200 flex items-center justify-center bg-primary transition-opacity duration-600 ${
        hide ? "opacity-0" : "opacity-100"
      }`}
    >
      <img src="/assets/el-moore-1.png" alt="El-Moore" className="h-auto w-[min(240px,55vw)]" />
    </div>
  );
}
