import { create } from "zustand";

import { UserInfo } from "@/models/user";

type State = {
  userInfo: UserInfo | null;
  isLoading: boolean;
  setUserInfo: (userInfo: UserInfo) => void;
  setLoading: (isLoading: boolean) => void;
};

export const useGlobalStore = create<State>((set) => ({
  userInfo: null,
  isLoading: false,
  setUserInfo: (userInfo: UserInfo) => set({ userInfo }),
  setLoading: (isLoading: boolean) => set({ isLoading }),
}));
