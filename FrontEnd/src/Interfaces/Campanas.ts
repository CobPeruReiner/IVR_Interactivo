import type { RefObject } from "react";

export interface FormCampaignState {
  idCampaign: number | null;
  nameCampaign: string;
  idCarteraCampaign: number | null;
  nameCarteraCampaign: string;
  diaEnvioCampaugn: string;
  fileCampaign: File | null;
  guionIVRCampaign: string;
}

export interface CampaignContextProps {
  formNCampaign: FormCampaignState;
  refMNuevaCampaign: RefObject<HTMLDivElement | null>;
  mNuevaCampaign: boolean;
  openMNuevaCampaign: () => void;
  closeMNuevaCampaign: () => void;
  postingNuevaCampaign: boolean;
  submitNuevaCampaign: (e: React.FormEvent<Element>) => Promise<boolean>;
}

export interface Campaign {
  id: number;
  name: string;
  category: string;
  date: string;
  phones: string;
  status: "finalizado" | "encurso" | "error";
}

export interface CampanasProps {
  campaigns: Campaign[];
}
