"use client";

import { useUIStore } from "@/store/useUIStore";
import { ReactNode, useEffect } from "react";

interface DarkModeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: DarkModeProviderProps) {
  const theme = useUIStore((state) => state.theme);

  useEffect(() => {
    const applyTheme = () => {
      if (theme === "light") {
        document.documentElement.classList.remove("dark");
      } else if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        // system
        const isSystemDark = window.matchMedia(
          "(prefers-color-scheme: dark)",
        ).matches;
        if (isSystemDark) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    };

    applyTheme();

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      if (theme === "system") {
        if (e.matches) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    };
    mediaQuery.addEventListener("change", handler);

    return () => mediaQuery.removeEventListener("change", handler);
  }, [theme]);

  return <>{children}</>;
}
