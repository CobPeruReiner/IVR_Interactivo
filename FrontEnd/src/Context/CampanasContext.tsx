import { createContext } from "react";
import type { CampaignContextProps } from "../Interfaces/Campanas";

export const CampanasContext = createContext<CampaignContextProps>(
  {} as CampaignContextProps
);
