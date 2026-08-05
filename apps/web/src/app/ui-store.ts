import { create } from 'zustand';

type ThemePreference = 'telegram' | 'system' | 'light' | 'dark';

interface UiState {
  taskSheet: { open: boolean; taskId: string | null };
  deleteDialogTaskId: string | null;
  toast: { message: string; tone: 'neutral' | 'success' | 'error' } | null;
  themePreference: ThemePreference;
  hapticsEnabled: boolean;
  closingConfirmation: boolean;
  openCreateTask: () => void;
  openEditTask: (taskId: string) => void;
  closeTaskSheet: () => void;
  confirmDelete: (taskId: string | null) => void;
  showToast: (message: string, tone?: 'neutral' | 'success' | 'error') => void;
  clearToast: () => void;
  setThemePreference: (value: ThemePreference) => void;
  setHapticsEnabled: (value: boolean) => void;
  setClosingConfirmation: (value: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  taskSheet: { open: false, taskId: null },
  deleteDialogTaskId: null,
  toast: null,
  themePreference: 'telegram',
  hapticsEnabled: true,
  closingConfirmation: false,
  openCreateTask: () => set({ taskSheet: { open: true, taskId: null } }),
  openEditTask: (taskId) => set({ taskSheet: { open: true, taskId } }),
  closeTaskSheet: () => set({ taskSheet: { open: false, taskId: null } }),
  confirmDelete: (taskId) => set({ deleteDialogTaskId: taskId }),
  showToast: (message, tone = 'neutral') => set({ toast: { message, tone } }),
  clearToast: () => set({ toast: null }),
  setThemePreference: (themePreference) => set({ themePreference }),
  setHapticsEnabled: (hapticsEnabled) => set({ hapticsEnabled }),
  setClosingConfirmation: (closingConfirmation) => set({ closingConfirmation }),
}));
