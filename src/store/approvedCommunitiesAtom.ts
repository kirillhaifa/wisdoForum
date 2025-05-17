import { atom } from "recoil";

export interface Community {
  id: string;
  title: string;
  image: string;
  membersCount: number;
  approved: boolean;
}

export const approvedCommunitiesAtom = atom<Community[]>({
  key: "approvedCommunitiesAtom",
  default: [],
});
