import moment from "moment";
import type { CampanaCSVRow, CSVResultado } from "../Interfaces/Campanas";
import { normalizarFecha } from "../Helper/NormalizarFecha";

export const leerCSVYValidar = (
  file: File
): Promise<{ resultado: CSVResultado; csvBlob: Blob }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      try {
        const text = reader.result as string;
        const rows = text
          .split("\n")
          .map((r) => r.trim())
          .filter(Boolean);

        const encabezadoEsperado = [
          "NOMBRE_CLIENTE",
          "NUMERO",
          "MONTO",
          "FECHA_VENCIMIENTO",
        ];

        const encabezado = rows[0]?.split(";");
        const errores: string[] = [];
        const data: CampanaCSVRow[] = [];
        const numerosSet = new Set<string>();

        if (encabezado?.join(";") !== encabezadoEsperado.join(";")) {
          errores.push("El encabezado no coincide con la plantilla oficial");
        }

        rows.slice(1).forEach((row, index) => {
          const fila = index + 2;
          const [NOMBRE_CLIENTE, NUMERO, MONTO, FECHA_VENCIMIENTO] =
            row.split(";");

          if (!NOMBRE_CLIENTE || !NUMERO || !MONTO || !FECHA_VENCIMIENTO) {
            errores.push(`Fila ${fila}: campos incompletos`);
            return;
          }

          if (isNaN(Number(NUMERO)) || Number(NUMERO) <= 0) {
            errores.push(`Fila ${fila}: número inválido`);
            return;
          }

          if (numerosSet.has(NUMERO)) {
            errores.push(`Fila ${fila}: número duplicado`);
            return;
          }

          if (isNaN(Number(MONTO)) || Number(MONTO) <= 0) {
            errores.push(`Fila ${fila}: monto inválido`);
            return;
          }

          const fechaNormalizada = normalizarFecha(FECHA_VENCIMIENTO);

          if (!moment(fechaNormalizada, "YYYY-MM-DD", true).isValid()) {
            errores.push(`Fila ${fila}: fecha inválida (YYYY-MM-DD)`);
            return;
          }

          numerosSet.add(NUMERO);

          data.push({
            NOMBRE_CLIENTE: NOMBRE_CLIENTE.trim(),
            NUMERO: NUMERO.trim(),
            MONTO: MONTO.trim(),
            FECHA_VENCIMIENTO: fechaNormalizada.trim(),
          });
        });

        const csvString = [
          encabezadoEsperado.join(";"),
          ...data.map(
            (r) =>
              `${r.NOMBRE_CLIENTE};${r.NUMERO};${r.MONTO};${r.FECHA_VENCIMIENTO}`
          ),
        ].join("\n");

        const csvBlob = new Blob([csvString], {
          type: "text/csv;charset=utf-8;",
        });

        resolve({
          resultado: { data, errores },
          csvBlob,
        });
      } catch (e) {
        reject(e);
      }
    };

    reader.readAsText(file);
  });
};
