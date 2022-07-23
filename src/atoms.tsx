import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
import { IMovie, ITv } from "./api";

export const overlayState = atom({
  key: "overlay",
  default: false,
});

const { persistAtom: persistMovie } = recoilPersist({
  key: "favsMovie",
});

const { persistAtom: persistTv } = recoilPersist({
  key: "favsTV",
});

export const favsMovieState = atom<IMovie[]>({
  key: "favsMovies",
  default: [],
  effects_UNSTABLE: [persistMovie],
});

export const favsTVState = atom<ITv[]>({
  key: "favsTV",
  default: [],
  effects_UNSTABLE: [persistTv],
});
