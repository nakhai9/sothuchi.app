import { create } from "zustand";

import { UserInfo } from "@/models/user";

type State = {
  userInfo: UserInfo | null;
  setUserInfo: (userInfo: UserInfo) => void;
};

export const useGlobalStore = create<State>((set) => ({
  userInfo: null,
  setUserInfo: (userInfo: UserInfo) => set({ userInfo }),
}));
