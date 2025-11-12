import { api } from "@/lib/api";
import { create } from "zustand";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post("/auth/login", { email, password });
      set({ user: res.data.user, loading: false });
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
      set({ user: res.data.user, loading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Signup failed",
        loading: false,
      });
    }
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      set({ user: null });
    }
  },
}));
