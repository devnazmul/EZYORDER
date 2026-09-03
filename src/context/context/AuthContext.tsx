import { IUserData } from "@/utils";
import { createContext } from "react";

export interface IAuthContext {
  user: IUserData | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: IUserData) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<IAuthContext | undefined>(undefined);
