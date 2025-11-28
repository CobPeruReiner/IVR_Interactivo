import { createContext } from "react";
import type { CampanasContextProps } from "../Interfaces/Campanas";

export const CampanasContext = createContext<CampanasContextProps>(
  {} as CampanasContextProps
);
