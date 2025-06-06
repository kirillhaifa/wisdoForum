import { atom } from "recoil";

export interface UserData {
  name: string;
  email: string;
  image: string;
  role: string
  country: string;
  uid: string;
  communities: string[],
}

export const userAtom = atom<UserData | null>({
  key: "userAtom",
  default: null,
});
