import { atom } from "recoil";

export const communitiesAtom = atom<any[]>({
  key: "communitiesAtom",
  default: [],
});
