import { api } from "@/lib/api";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      loading: false,
      error: null,

      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const res = await api.post("/auth/login", { email, password });
          set({ user: res.data.user, token: res.data.token, loading: false });
        } catch (err: any) {
          set({
            error: err.response?.data?.message || "Login failed",
            loading: false,
          });
        }
      },

      signup: async (name, email, password) => {
        set({ loading: true, error: null });
        try {
          const res = await api.post("/auth/signup", { name, email, password });
          set({ user: res.data.user, token: res.data.token, loading: false });
        } catch (err: any) {
          set({
            error: err.response?.data?.message || "Signup failed",
            loading: false,
          });
        }
      },

      logout: () => set({ user: null, token: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user, token: state.token }),
    },
  ),
);
