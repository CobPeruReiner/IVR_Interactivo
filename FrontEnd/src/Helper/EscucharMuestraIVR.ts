import { toast } from "sonner";

interface CsvMuestra {
  NOMBRE_CLIENTE: string;
  NUMERO: string;
  MONTO: string;
  FECHA_VENCIMIENTO: string;
}

export const escucharMuestraIVR = (
  guion: string,
  csvPreview: CsvMuestra[],
  onStart?: () => void,
  onEnd?: () => void
) => {
  if (!guion) {
    toast.warning("No hay guion para reproducir");
    return;
  }

  if (!csvPreview.length) {
    toast.warning("Debe cargar un archivo CSV primero");
    return;
  }

  const muestra = csvPreview[0];

  const textoProcesado = guion
    .replace(/{{NOMBRE}}/g, muestra.NOMBRE_CLIENTE)
    .replace(/{{MONTO}}/g, muestra.MONTO)
    .replace(/{{FVENC}}/g, muestra.FECHA_VENCIMIENTO)
    .replace(/{{TELEFONO}}/g, muestra.NUMERO);

  const utterance = new SpeechSynthesisUtterance(textoProcesado);
  utterance.lang = "es-PE";
  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.volume = 1;

  utterance.onstart = () => {
    onStart?.();
  };

  utterance.onend = () => {
    onEnd?.();
  };

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
};

export const detenerLecturaIVR = () => {
  window.speechSynthesis.cancel();
};
