import { useRef, useState, type PropsWithChildren } from "react";
import { CampanasContext } from "../Context/CampanasContext";
import type { FormCampaignState } from "../Interfaces/Campanas";
import { useOutsideClick } from "../Hooks/useOutsideClick";

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
  const [formNCampaign, setFormNCampaign] = useState(initialCampaign);

  const refMNuevaCampaign = useRef<HTMLDivElement | null>(null);
  const [mNuevaCampaign, setMNuevaCampaign] = useState(false);
  const [postingNuevaCampaign, setPostingNuevaCampaign] = useState(false);

  const openMNuevaCampaign = () => setMNuevaCampaign(true);

  const closeMNuevaCampaign = () => {
    setMNuevaCampaign(false);
    setFormNCampaign(initialCampaign);
  };

  useOutsideClick(refMNuevaCampaign, () => setMNuevaCampaign(false));

  const submitNuevaCampaign = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setPostingNuevaCampaign(true);

      return true;
    } catch (error) {
      console.log(error);

      return false;
    } finally {
      setPostingNuevaCampaign(false);
    }
  };

  return (
    <CampanasContext.Provider
      value={{
        formNCampaign,
        refMNuevaCampaign,
        mNuevaCampaign,
        openMNuevaCampaign,
        closeMNuevaCampaign,
        postingNuevaCampaign,
        submitNuevaCampaign,
      }}
    >
      {children}
    </CampanasContext.Provider>
  );
};
