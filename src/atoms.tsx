import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

export const overlayState = atom({
  key: "overlay",
  default: false,
});

const { persistAtom } = recoilPersist({
  key: "favs",
});

export const favsState = atom<number[]>({
  key: "favs",
  default: [],
  effects_UNSTABLE: [persistAtom],
});
