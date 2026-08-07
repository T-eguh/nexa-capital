import { create } from 'zustand';

export interface NotificationItem {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  timestamp: string;
}

interface NotificationState {
  notifications: NotificationItem[];
  addNotification: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  addNotification: (message, type = 'info') => {
    const newItem: NotificationItem = {
      id: Date.now().toString(),
      message,
      type,
      timestamp: new Date().toLocaleTimeString('id-ID'),
    };
    set((state) => ({
      notifications: [newItem, ...state.notifications].slice(0, 10),
    }));
  },
  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((item) => item.id !== id),
    }));
  },
  clearAll: () => set({ notifications: [] }),
}));
