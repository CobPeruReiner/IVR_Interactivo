import { useContext } from "react";
import { Add, Search } from "../../../../../UI/Iconos";
import { CampanasContext } from "../../../../../Context/CampanasContext";
import moment from "moment";

const statusStylesById: Record<number, string> = {
  1: "border-[rgb(255,193,7)] text-[rgb(255,193,7)]",
  2: "border-[rgb(76,175,80)] text-[rgb(76,175,80)]",
  3: "border-[rgb(244,67,53)] text-[rgb(244,67,53)]",
};

export const Campanas = () => {
  const { campanas, openMNuevaCampaign } = useContext(CampanasContext);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/3 sm:px-6">
      {/* Encabezado */}
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Historial de Envíos y Detalle
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={openMNuevaCampaign}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/3 dark:hover:text-gray-200 transition-all duration-500 cursor-pointer"
          >
            <Add />
            Crear Campaña
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-gray-100 dark:border-gray-800 border-y">
            <tr>
              <th className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                ID
              </th>
              <th className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Campaña
              </th>
              <th className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Cartera
              </th>
              <th className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Fecha de Envío
              </th>
              <th className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Teléfonos
              </th>
              <th className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Estado
              </th>
              <th className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Detalle
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {campanas?.map((c) => (
              <tr key={c.ID_CAMPANA}>
                <td className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {c.ID_CAMPANA}
                </td>
                <td className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {c.NOMBRE_CAMPANA}
                </td>
                <td className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {c.CARTERA_CAMPANA}
                </td>
                <td className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {moment(c.FECHA_INICIO_CAMPANA).utc().format("DD/MM/YYYY")}
                </td>
                <td className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {c.phones}
                </td>
                <td className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  <span
                    className={`px-3 py-1 rounded-sm text-xs font-medium border border-solid ${
                      statusStylesById[c.ID_ESTADO_CAMPANA] ??
                      "border-gray-400 text-gray-400"
                    }`}
                  >
                    {c.ESTADO_CAMAPANA}
                  </span>
                </td>
                <td className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 active:scale-[0.98] transition px-3 py-1.5 rounded-md text-sm cursor-pointer">
                    <Search className="text-lg" />
                    <span className="">Ver Registros</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
