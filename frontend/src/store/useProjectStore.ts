import { api } from "@/lib/api";
import { create } from "zustand";

interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

interface ProjectState {
  projects: Project[];
  loading: boolean;
  fetchProjects: () => Promise<void>;
  addProject: (name: string, description?: string) => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  loading: false,

  fetchProjects: async () => {
    set({ loading: true });
    const res = await api.get("/projects");
    set({ projects: res.data, loading: false });
  },

  addProject: async (name, description) => {
    const res = await api.post("/projects", { name, description });
    set((state) => ({ projects: [...state.projects, res.data] }));
  },
}));
