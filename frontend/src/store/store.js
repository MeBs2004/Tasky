import { create } from "zustand";
import createSelectors from "./selectors";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

const createAuthSlice = (set) => ({
  accessToken: null,
  user: null,
  setAccessToekn: (token) => set({ accessToken: token }),
  clearAccessToekn: () => set({ accessToken: null }),
});

export const useStoreBase = create(
  devtools(
    persist(
      immer((...a) => ({
        ...createAuthSlice(...a),
      })),
      {
        name: "session-storage",
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
  ),
);

export const useStore = createSelectors(useStoreBase);
