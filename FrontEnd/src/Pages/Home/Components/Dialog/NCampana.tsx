import { useContext, useRef } from "react";
import { Close, Download, Send, Upload, Volume } from "../../../../UI/Iconos";
import { CampanasContext } from "../../../../Context/CampanasContext";
import {
  buttonExcel,
  buttonPDF,
  buttonSecondary,
  buttonSubmit,
} from "../../../../UI/Buttons";
import { inputTextAreaL, labelTextAreaL } from "../../../../UI/TextArea";
import { inputBorder, labelBorder } from "../../../../UI/Inputs";
import { descargarPlantillaCSV } from "../../../../Utils/PlantillaCampana";
import { insertarEnCursor } from "../../../../Utils/InsertarEnCursor";
import { toast } from "sonner";
import { leerCSVYValidar } from "../../../../Utils/validarPlantillaCampana";

export const NCampana = () => {
  const {
    formNCampaign,
    handleChangeCampaign,
    refMNuevaCampaign,
    mNuevaCampaign,
    closeMNuevaCampaign,
    postingNuevaCampaign,
    saveCampanaRequest,
    carteras,
    csvErrores,
    setCsvErrores,
    csvPreview,
    setCsvPreview,
    clearFileCampaign,
    setFileCampaign,
  } = useContext(CampanasContext);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const insertParametro = (param: string) => {
    if (!textareaRef.current) return;

    const nuevoTexto = insertarEnCursor(
      textareaRef.current,
      formNCampaign.guionIVRCampaign,
      param
    );

    const event = {
      target: {
        name: "guionIVRCampaign",
        value: nuevoTexto,
      },
    } as unknown as React.ChangeEvent<HTMLTextAreaElement>;

    handleChangeCampaign(event);
    textareaRef.current.focus();
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await saveCampanaRequest();

    if (result.ok) {
      toast.success("Campaña creada correctamente");
    } else {
      if (result.type === "validation") {
        toast.warning("Completa todos los campos obligatorios");
      }

      if (result.type === "server") {
        toast.error("Error al guardar la campaña. Intenta nuevamente");
      }
    }
  };

  return (
    <div
      className={`fixed inset-0 z-203 bg-black/40 backdrop-blur-sm transition-all duration-300 ${
        mNuevaCampaign ? "visible opacity-100" : "invisible opacity-0"
      }`}
    >
      {/* Panel lateral */}
      <div
        ref={postingNuevaCampaign ? null : refMNuevaCampaign}
        className={`absolute top-0 right-0 h-full w-full sm:w-[45%] bg-white border-l border-gray-200 shadow-xl transition-transform duration-300 ${
          mNuevaCampaign ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Formulario */}
        <form
          onSubmit={onSubmit}
          autoComplete="off"
          className="flex flex-col gap-6 h-full p-6 overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-800">
              Nueva Campaña IVR
            </h1>

            <button
              type="button"
              onClick={closeMNuevaCampaign}
              disabled={postingNuevaCampaign}
              className="p-2 rounded-full hover:bg-gray-100 transition"
            >
              <Close className="text-gray-600 text-xl" />
            </button>
          </div>

          {/* 1. Selección de Cartera */}
          <div className="space-y-2 flex flex-col gap-2 relative">
            <select
              name="idCarteraCampaign"
              value={formNCampaign.idCarteraCampaign ?? ""}
              onChange={handleChangeCampaign}
              className={inputBorder}
            >
              <option value="">Ninguna Cartera</option>
              {carteras?.map((cartera) => (
                <option key={cartera.id} value={cartera.id}>
                  {cartera.cartera}
                </option>
              ))}
            </select>
            <label className={labelBorder}>Seleccione la Cartera</label>
          </div>

          {/* Descargar plantilla CSV */}
          <div className="space-y-2 flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Plantilla CSV
            </label>

            <div className="container-download-plantilla">
              <button
                type="button"
                className={buttonExcel}
                onClick={descargarPlantillaCSV}
              >
                <Download className="text-lg" />
                Descargar Plantilla (.csv)
              </button>
            </div>
          </div>

          {/* CARGA / PREVIEW CSV */}
          <div className="space-y-2 flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Archivo de Teléfonos (.csv)
            </label>

            {!csvPreview.length ? (
              <div className="relative p-5 border border-gray-300 border-dashed rounded-xl bg-gray-50 hover:bg-gray-100 transition cursor-pointer text-center flex flex-col items-center gap-1.5">
                <input
                  type="file"
                  accept=".csv"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    const { resultado, csvBlob } = await leerCSVYValidar(file);

                    setCsvPreview(resultado.data);
                    setCsvErrores(resultado.errores);

                    if (resultado.data.length > 0) {
                      const csvFileFinal = new File([csvBlob], "carga.csv", {
                        type: "text/csv",
                      });

                      setFileCampaign(csvFileFinal);
                    } else {
                      clearFileCampaign();
                    }
                  }}
                />

                <Upload className="text-3xl text-gray-500 mb-2" />
                <p className="text-sm text-gray-600">
                  Haz clic para seleccionar el archivo
                </p>
                <p className="text-xs text-gray-400">(solo archivos .csv)</p>
              </div>
            ) : (
              <>
                {/* PREVIEW */}
                <div className="max-h-40 overflow-auto">
                  <table className="w-full text-sm">
                    <thead className="border-gray-100 dark:border-gray-800 border-y">
                      <tr>
                        <th className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                          Nombre
                        </th>
                        <th className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                          Teléfono
                        </th>
                        <th className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                          Monto
                        </th>
                        <th className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                          Vencimiento
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {csvPreview.map((r, i) => (
                        <tr key={i}>
                          <td className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                            {r.NOMBRE_CLIENTE}
                          </td>
                          <td className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                            {r.NUMERO}
                          </td>
                          <td className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                            {r.MONTO}
                          </td>
                          <td className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                            {r.FECHA_VENCIMIENTO}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* LIMPIAR */}
                <div className="container-delete-plantilla">
                  <button
                    type="button"
                    className={buttonPDF}
                    onClick={() => {
                      setCsvPreview([]);
                      setCsvErrores([]);
                      clearFileCampaign();
                    }}
                  >
                    Limpiar archivo
                  </button>
                </div>
              </>
            )}
          </div>

          {/* ERRORES */}
          {csvErrores.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-md p-2 text-xs text-red-700">
              <strong>Errores encontrados:</strong>
              <ul className="list-disc pl-4">
                {csvErrores.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Nombre de la campaña */}
          <div className="space-y-2 flex flex-col gap-2 relative">
            <input
              type="text"
              name="nameCampaign"
              value={formNCampaign.nameCampaign}
              onChange={handleChangeCampaign}
              className={inputBorder}
            />
            <label className={labelBorder}>Nombre de la Campaña</label>
          </div>

          {/* Guion IVR */}
          <div className="space-y-2 flex flex-col gap-2 relative">
            <textarea
              ref={textareaRef}
              name="guionIVRCampaign"
              rows={5}
              value={formNCampaign.guionIVRCampaign}
              onChange={handleChangeCampaign}
              className={inputTextAreaL}
            />

            <p className="text-xs text-gray-400 absolute bottom-3 left-2">
              Usa la sintaxis <strong>{"{{parametro}}"}</strong> para invocar
              los datos del CSV
            </p>

            <label className={labelTextAreaL}>
              Guion del IVR (Text-to-Speech)
            </label>
          </div>

          {/* Parámetros Detectados */}
          <div className="space-y-2 flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Parámetros Detectados
            </label>

            <div className="flex flex-wrap gap-2">
              {["{{NOMBRE}}", "{{MONTO}}", "{{FVENC}}", "{{TELEFONO}}"].map(
                (param) => (
                  <button
                    key={param}
                    type="button"
                    onClick={() => insertParametro(param)}
                    className="px-3 py-1.5 rounded-md text-xs bg-green-100 text-green-700 hover:bg-green-200 transition"
                  >
                    {param}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3">
            <button type="button" className={buttonSecondary}>
              <Volume className="text-lg" />
              Escuchar Muestra
            </button>

            <button
              type="submit"
              disabled={postingNuevaCampaign}
              className={buttonSubmit}
            >
              <Send className="text-lg" />
              Enviar Campaña IVR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
