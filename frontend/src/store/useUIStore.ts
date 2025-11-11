import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark" | "system";
interface UIStore {
  theme: Theme;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setTheme: (theme: Theme) => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      isSidebarOpen: true,
      toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),

      theme: "system",
      setTheme: (theme: Theme) => set({ theme }),
    }),
    { name: "ui-storage" },
  ),
);
