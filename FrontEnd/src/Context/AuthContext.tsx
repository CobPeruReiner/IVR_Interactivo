import { createContext } from "react";
import type { AuthContextProps } from "../Interfaces/Auth";

export const AuthContext = createContext<AuthContextProps>(
  {} as AuthContextProps
);
