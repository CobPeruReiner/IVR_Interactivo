import { Toaster } from "sonner";
import type { Campaign } from "../../Interfaces/Campanas";
import { Layout } from "../../Layout/Layout";
import { Campanas } from "./Components/Cards/Campanas/Campanas";
import { NCampana } from "./Components/Dialog/NCampana";

export const Home = () => {
  const campaigns: Campaign[] = [
    {
      id: 1001,
      name: "Recordatorio_Octubre_Mora",
      category: "Clientes Atrasados",
      date: "2025-10-25 10:30",
      phones: "15,000",
      status: "finalizado",
    },
    {
      id: 1002,
      name: "Promo_Navideña_2025",
      category: "Promociones y Ofertas",
      date: "2025-11-20 15:00",
      phones: "5,200",
      status: "encurso",
    },
    {
      id: 1003,
      name: "Alerta_Factura_120",
      category: "Clientes Atrasados",
      date: "2025-11-15 08:00",
      phones: "200",
      status: "error",
    },
  ];

  return (
    <Layout
      children={
        <>
          <Toaster richColors />
          <Campanas campaigns={campaigns} />
          <NCampana />
        </>
      }
    />
  );
};
