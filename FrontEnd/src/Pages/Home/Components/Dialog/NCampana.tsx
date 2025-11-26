import { useContext } from "react";
import { Close, Download, Send, Upload, Volume } from "../../../../UI/Iconos";
import { CampanasContext } from "../../../../Context/CampanasContext";
import {
  buttonExcel,
  buttonSecondary,
  buttonSubmit,
} from "../../../../UI/Buttons";
import { inputTextAreaL, labelTextAreaL } from "../../../../UI/TextArea";
import { inputBorder, labelBorder } from "../../../../UI/Inputs";

export const NCampana = () => {
  const {
    formNCampaign,
    refMNuevaCampaign,
    mNuevaCampaign,
    closeMNuevaCampaign,
    postingNuevaCampaign,
    submitNuevaCampaign,
  } = useContext(CampanasContext);

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
          onSubmit={submitNuevaCampaign}
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
            <select name="idCarteraCampaign" className={inputBorder}>
              <option value="">Ninguna Cartera</option>
              <option value="1">Cartera A</option>
              <option value="2">Cartera B</option>
            </select>
            <label className={labelBorder}>Seleccione la Cartera</label>
          </div>

          {/* Descargar plantilla CSV */}
          <div className="space-y-2 flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Plantilla CSV
            </label>

            <div className="container-button-download-plantilla">
              <button type="button" className={buttonExcel}>
                <Download className="text-lg" />
                Descargar Plantilla (.csv)
              </button>
            </div>
          </div>

          {/* Carga de archivo - DropZone moderno */}
          <div className="space-y-2 flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Archivo de Teléfonos (.csv)
            </label>

            <div className="relative p-5 border border-gray-300 border-dashed rounded-xl bg-gray-50 hover:bg-gray-100 transition cursor-pointer text-center">
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept=".csv"
              />

              <div className="flex flex-col items-center">
                <Upload className="text-3xl text-gray-500 mb-2" />
                <p className="text-sm text-gray-600">
                  Haz clic para seleccionar el archivo
                </p>
                <p className="text-xs text-gray-400">(solo CSV)</p>
              </div>
            </div>
          </div>

          {/* Nombre de la campaña */}
          <div className="space-y-2 flex flex-col gap-2 relative">
            <input
              type="text"
              name="nameCampaign"
              placeholder=""
              className={inputBorder}
            />
            <label className={labelBorder}>Nombre de la Campaña</label>
          </div>

          <div className="space-y-2 flex flex-col gap-2 relative">
            <textarea
              name="guionIVRCampaign"
              rows={5}
              placeholder=""
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
              {[
                "{{nombre}}",
                "{{monto}}",
                "{{fecha_limite}}",
                "{{telefono}}",
              ].map((param) => (
                <button
                  key={param}
                  type="button"
                  className="px-3 py-1.5 rounded-md text-xs bg-green-100 text-green-700 hover:bg-green-200 transition"
                >
                  {param}
                </button>
              ))}
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
