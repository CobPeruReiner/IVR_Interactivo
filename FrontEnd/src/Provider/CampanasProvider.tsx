import {
  useContext,
  useEffect,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";
import { CampanasContext } from "../Context/CampanasContext";
import type {
  Campaign,
  CampanaCSVRow,
  FormCampaignState,
  SaveCampanaResult,
} from "../Interfaces/Campanas";
import { useOutsideClick } from "../Hooks/useOutsideClick";
import { api } from "../Api/api";
import { AuthContext } from "../Context/AuthContext";
import type { Cartera } from "../Interfaces/Cartera";
import moment from "moment";

const initialCampaign: FormCampaignState = {
  idCampaign: null,
  nameCampaign: "",
  idCarteraCampaign: null,
  nameCarteraCampaign: "",
  diaEnvioCampaugn: "",
  fileCampaign: null,
  guionIVRCampaign: "",
};

export const CampanasProvider = ({ children }: PropsWithChildren) => {
  const { auth } = useContext(AuthContext);

  const [campanas, setCampanas] = useState<Campaign[]>([]);
  const [loadingCampanas, setLoadingCampanas] = useState(false);

  const [carteras, setCarteras] = useState<Cartera[] | []>([]);

  const [formNCampaign, setFormNCampaign] =
    useState<FormCampaignState>(initialCampaign);

  const [csvPreview, setCsvPreview] = useState<CampanaCSVRow[]>([]);
  const [csvErrores, setCsvErrores] = useState<string[]>([]);

  const refMNuevaCampaign = useRef<HTMLDivElement | null>(null);
  const [mNuevaCampaign, setMNuevaCampaign] = useState(false);
  const [postingNuevaCampaign, setPostingNuevaCampaign] = useState(false);

  const openMNuevaCampaign = () => setMNuevaCampaign(true);

  const closeMNuevaCampaign = () => {
    setMNuevaCampaign(false);
    setFormNCampaign(initialCampaign);
    setCsvPreview([]);
    setCsvErrores([]);
  };

  useOutsideClick(refMNuevaCampaign, () => setMNuevaCampaign(false));

  const handleChangeCampaign = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;

    if (name === "fileCampaign") {
      setFormNCampaign((prev) => ({
        ...prev,
        fileCampaign: files?.[0] || null,
      }));
    } else {
      setFormNCampaign((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const setFileCampaign = (file: File | null) => {
    setFormNCampaign((prev) => ({
      ...prev,
      fileCampaign: file,
    }));
  };

  const clearFileCampaign = () => {
    setFormNCampaign((prev) => ({
      ...prev,
      fileCampaign: null,
    }));
  };

  const saveCampanaRequest = async (): Promise<SaveCampanaResult> => {
    const today = moment().format("YYYY-MM-DD HH:mm:ss");

    // console.log("File: ", formNCampaign);

    if (
      !formNCampaign.nameCampaign ||
      !formNCampaign.idCarteraCampaign ||
      !formNCampaign.fileCampaign ||
      !formNCampaign.guionIVRCampaign
    ) {
      return { ok: false, type: "validation" };
    }

    try {
      setPostingNuevaCampaign(true);

      const formData = new FormData();

      formData.append("NOMBRE_CAMPANIA", formNCampaign.nameCampaign);
      formData.append("ID_CARTERA", String(formNCampaign.idCarteraCampaign));
      formData.append("FECHA_INICIO", today);
      formData.append(
        "ID_PERSONAL_REGISTRO",
        auth.user?.IDPERSONAL.toString() || ""
      );

      formData.append("NOMBRE", "PROMPT AUTOMATICO");
      formData.append("CONTENIDO", formNCampaign.guionIVRCampaign);
      formData.append("VERSION", "1");
      formData.append("archivo", formNCampaign.fileCampaign);

      await api.post("/campania/save-campana", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      closeMNuevaCampaign();
      setFormNCampaign(initialCampaign);
      setCsvPreview([]);
      setCsvErrores([]);
      getCampanasRequest();

      return { ok: true };
    } catch (error) {
      console.error("Error al crear campaña:", error);
      return { ok: false, type: "server" };
    } finally {
      setPostingNuevaCampaign(false);
    }
  };

  const getCarterasRequest = async () => {
    try {
      const { data } = await api.get("/cartera");
      setCarteras(data.carteras);
    } catch (error) {
      console.error("Error al obtener las carteras:", error);
      setCarteras([]);
    }
  };

  const getCampanasRequest = async (): Promise<void> => {
    try {
      setLoadingCampanas(true);

      const { data } = await api.get("/campania/get-campanas");

      if (data.ok) {
        setCampanas(data.campaigns);
      }
    } catch (error) {
      console.error("Error al obtener campañas:", error);
      setCampanas([]);
    } finally {
      setLoadingCampanas(false);
    }
  };

  useEffect(() => {
    getCarterasRequest();
    getCampanasRequest();
  }, []);

  return (
    <CampanasContext.Provider
      value={{
        formNCampaign,
        handleChangeCampaign,
        refMNuevaCampaign,
        mNuevaCampaign,
        openMNuevaCampaign,
        closeMNuevaCampaign,
        postingNuevaCampaign,
        saveCampanaRequest,
        carteras,

        campanas,
        loadingCampanas,
        getCampanasRequest,

        csvErrores,
        setCsvErrores,
        csvPreview,
        setCsvPreview,
        clearFileCampaign,
        setFileCampaign,
      }}
    >
      {children}
    </CampanasContext.Provider>
  );
};
