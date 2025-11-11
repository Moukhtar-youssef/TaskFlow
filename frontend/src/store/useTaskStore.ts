import { create } from "zustand";
import { api } from "@/lib/api";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  projectId: string;
}

interface TaskState {
  tasks: Task[];
  loading: boolean;
  fetchTasks: (projectId: string) => Promise<void>;
  addTask: (projectId: string, title: string) => Promise<void>;
  toggleTask: (taskId: string) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  loading: false,

  fetchTasks: async (projectId) => {
    set({ loading: true });
    const res = await api.get(`/projects/${projectId}/tasks`);
    set({ tasks: res.data, loading: false });
  },

  addTask: async (projectId, title) => {
    const res = await api.post(`/projects/${projectId}/tasks`, { title });
    set((state) => ({ tasks: [...state.tasks, res.data] }));
  },

  toggleTask: async (taskId) => {
    const res = await api.patch(`/tasks/${taskId}/toggle`);
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === taskId ? res.data : t)),
    }));
  },
}));
