import { create } from "zustand";

interface AuthState {
  isLoggedIn: boolean;
  userName: string;
  setIsLoggedIn: (status: boolean) => void;
  setUserName: (name: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  userName: "",
  setIsLoggedIn: (status) => set({ isLoggedIn: status }),
  setUserName: (name) => set({ userName: name }),
}));
