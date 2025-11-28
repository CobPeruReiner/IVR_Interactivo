import { Toaster } from "sonner";
import { Layout } from "../../Layout/Layout";
import { Campanas } from "./Components/Cards/Campanas/Campanas";
import { NCampana } from "./Components/Dialog/NCampana";

export const Home = () => {
  return (
    <Layout
      children={
        <>
          <Toaster richColors />
          <Campanas />
          <NCampana />
        </>
      }
    />
  );
};
