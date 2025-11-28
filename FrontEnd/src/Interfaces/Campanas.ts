import type { Cartera } from "./Cartera";

export interface GetCampanasResponse {
  ok: boolean;
  campaigns: Campaign[];
}

export interface Campaign {
  ID_CAMPANA: number;
  NOMBRE_CAMPANA: string;
  CARTERA_CAMPANA: string;
  FECHA_INICIO_CAMPANA: Date;
  phones: number;
  ID_ESTADO_CAMPANA: number;
  ESTADO_CAMAPANA: string;
}

export interface FormCampaignState {
  idCampaign: number | null;
  nameCampaign: string;
  idCarteraCampaign: number | null;
  nameCarteraCampaign: string;
  diaEnvioCampaugn: string;
  fileCampaign: File | null;
  guionIVRCampaign: string;
}

export interface SaveCampanaResult {
  ok: boolean;
  type?: "validation" | "server";
}

export interface CampanaCSVRow {
  NOMBRE_CLIENTE: string;
  NUMERO: string;
  MONTO: string;
  FECHA_VENCIMIENTO: string;
}

export interface CSVResultado {
  data: CampanaCSVRow[];
  errores: string[];
}

export interface CampanasContextProps {
  formNCampaign: FormCampaignState;
  handleChangeCampaign: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;

  mNuevaCampaign: boolean;
  openMNuevaCampaign: () => void;
  closeMNuevaCampaign: () => void;
  refMNuevaCampaign: React.RefObject<HTMLDivElement | null>;

  postingNuevaCampaign: boolean;
  saveCampanaRequest: () => Promise<SaveCampanaResult>;

  carteras: Cartera[];

  campanas: Campaign[];
  loadingCampanas: boolean;
  getCampanasRequest: () => Promise<void>;

  csvPreview: CampanaCSVRow[];
  setCsvPreview: React.Dispatch<React.SetStateAction<CampanaCSVRow[]>>;
  csvErrores: string[];
  setCsvErrores: React.Dispatch<React.SetStateAction<string[]>>;
  clearFileCampaign: () => void;
  setFileCampaign: (file: File | null) => void;
}
