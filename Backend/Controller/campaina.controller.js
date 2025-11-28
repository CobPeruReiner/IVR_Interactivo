import csv from "csv-parser";
import stream from "stream";
import moment from "moment";
import axios from "axios";
import { QueryTypes } from "sequelize";
import { db4 } from "../DB/config.js";

export const createCampanaRequest = async (req, res) => {
  const {
    NOMBRE_CAMPANIA,
    ID_CARTERA,
    FECHA_INICIO,
    ID_PERSONAL_REGISTRO,
    NOMBRE,
    CONTENIDO,
    VERSION,
  } = req.body;

  const archivo = req.file;

  if (!moment(FECHA_INICIO, "YYYY-MM-DD", true).isValid()) {
    return res.status(400).json({
      ok: false,
      msg: "La fecha de inicio no es válida",
    });
  }

  const registrosCSV = [];

  try {
    await new Promise((resolve, reject) => {
      const bufferStream = new stream.PassThrough();
      bufferStream.end(archivo.buffer);

      bufferStream
        .pipe(csv())
        .on("data", (row) => {
          registrosCSV.push({
            NOMBRE_CLIENTE: row.NOMBRE_CLIENTE,
            NUMERO: row.NUMERO,
            MONTO: row.MONTO,
            FECHA_VENCIMIENTO: row.FECHA_VENCIMIENTO,
          });
        })
        .on("end", resolve)
        .on("error", reject);
    });

    if (registrosCSV.length === 0) {
      return res.status(400).json({
        ok: false,
        msg: "El archivo CSV está vacío",
      });
    }

    const errores = [];
    const numerosSet = new Set();

    registrosCSV.forEach((r, index) => {
      const fila = index + 2;

      if (
        !r.NOMBRE_CLIENTE ||
        !r.NUMERO ||
        r.MONTO == null ||
        !r.FECHA_VENCIMIENTO
      ) {
        errores.push(`Fila ${fila}: campos incompletos`);
      }

      if (isNaN(r.NUMERO)) {
        errores.push(`Fila ${fila}: número inválido`);
      }

      if (isNaN(r.MONTO) || Number(r.MONTO) < 0) {
        errores.push(`Fila ${fila}: monto inválido`);
      }

      if (!moment(r.FECHA_VENCIMIENTO, "YYYY-MM-DD", true).isValid()) {
        errores.push(`Fila ${fila}: fecha de vencimiento inválida`);
      }

      if (numerosSet.has(r.NUMERO)) {
        errores.push(`Fila ${fila}: número duplicado en el CSV`);
      }

      numerosSet.add(r.NUMERO);
    });

    if (errores.length > 0) {
      return res.status(400).json({
        ok: false,
        msg: "El archivo CSV contiene errores",
        errores,
      });
    }

    const transaction = await db4.transaction();

    try {
      const [ID_CAMPANIA] = await db4.query(
        `
        INSERT INTO IVR_INTERACTIVO.CAMPANIA
        (NOMBRE_CAMPANIA, ID_CARTERA, FECHA_INICIO, ESTADO_CAMPANIA, ID_PERSONAL_REGISTRO)
        VALUES
        (:NOMBRE_CAMPANIA, :ID_CARTERA, :FECHA_INICIO, 1, :ID_PERSONAL_REGISTRO)
        `,
        {
          replacements: {
            NOMBRE_CAMPANIA,
            ID_CARTERA,
            FECHA_INICIO,
            ID_PERSONAL_REGISTRO,
          },
          type: QueryTypes.INSERT,
          transaction,
        }
      );

      const values = registrosCSV.map((r) => [
        ID_CAMPANIA,
        r.NOMBRE_CLIENTE,
        r.NUMERO,
        r.MONTO,
        r.FECHA_VENCIMIENTO,
      ]);

      await db4.query(
        `
        INSERT INTO IVR_INTERACTIVO.CARGA_ARCHIVO
        (ID_CAMPANIA, NOMBRE_CLIENTE, NUMERO, MONTO, FECHA_VENCIMIENTO)
        VALUES ?
        `,
        {
          replacements: [values],
          type: QueryTypes.INSERT,
          transaction,
        }
      );

      await db4.query(
        `
        INSERT INTO IVR_INTERACTIVO.IVR_PROMPT
        (ID_CAMPANIA, NOMBRE, CONTENIDO, VERSION)
        VALUES
        (:ID_CAMPANIA, :NOMBRE, :CONTENIDO, :VERSION)
        `,
        {
          replacements: {
            ID_CAMPANIA,
            NOMBRE,
            CONTENIDO,
            VERSION,
          },
          type: QueryTypes.INSERT,
          transaction,
        }
      );

      await transaction.commit();

      for (const fila of registrosCSV) {
        try {
          await axios.post("http://192.168.1.29:7000/originate", {
            telefono: fila.NUMERO,
            nombre: fila.NOMBRE_CLIENTE,
            monto: fila.MONTO,
            fvenc: fila.FECHA_VENCIMIENTO,
            id_campania: ID_CAMPANIA,
            id_carga: 1,
            id_prompt: 1,
          });
        } catch (callError) {
          console.error(
            "Error al originar llamada:",
            fila.NUMERO,
            callError.message
          );
        }
      }

      return res.status(201).json({
        ok: true,
        msg: "Campaña creada correctamente con carga masiva",
        ID_CAMPANIA,
        totalRegistros: registrosCSV.length,
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error("Error createCampanaRequest:", error);

    return res.status(500).json({
      ok: false,
      msg: "Error al crear la campaña",
      error: error.message,
    });
  }
};
