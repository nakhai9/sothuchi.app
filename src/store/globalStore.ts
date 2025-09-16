import { deleteCookie } from "cookies-next";
import { create } from "zustand";

import { UserInfo } from "@/types/user";

type State = {
  userInfo: UserInfo | null;
  isLoading: boolean;
  setUserInfo: (userInfo: UserInfo) => void;
  setLoading: (isLoading: boolean) => void;
  clearUserInfo: () => void;
};

export const useGlobalStore = create<State>((set) => ({
  userInfo: null,
  isLoading: false,
  setUserInfo: (userInfo: UserInfo) => set({ userInfo }),
  setLoading: (isLoading: boolean) => set({ isLoading }),
  clearUserInfo: () => {
    set({ userInfo: null });
    deleteCookie("accessToken");
  },
}));
