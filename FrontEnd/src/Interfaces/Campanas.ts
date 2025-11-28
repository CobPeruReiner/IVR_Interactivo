import type { RefObject } from "react";
import type { Cartera } from "./Cartera";

export type SaveCampanaResult =
  | { ok: true }
  | { ok: false; type: "validation" | "server" };

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
  handleChangeCampaign: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  refMNuevaCampaign: RefObject<HTMLDivElement | null>;
  mNuevaCampaign: boolean;
  openMNuevaCampaign: () => void;
  closeMNuevaCampaign: () => void;
  postingNuevaCampaign: boolean;
  saveCampanaRequest: () => Promise<SaveCampanaResult>;
  carteras: [] | Cartera[];
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
