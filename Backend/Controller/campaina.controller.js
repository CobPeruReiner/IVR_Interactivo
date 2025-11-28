import csv from "csv-parser";
import stream from "stream";
import moment from "moment";
import axios from "axios";
import { QueryTypes } from "sequelize";
import { db4 } from "../DB/config.js";
import { normalizarTexto } from "../Helper/normalizar-text.js";
import { normalizarFechaBackend } from "../Helper/normalizarFechaBacjend.js";

// CREAR CAMPAÑA
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

  try {
    //  1. OBTENER CARTERA
    const [carteraData] = await db4.query(
      `
      SELECT cartera
      FROM SISTEMAGEST.cartera
      WHERE id = :ID_CARTERA
      `,
      {
        replacements: { ID_CARTERA },
        type: QueryTypes.SELECT,
      }
    );

    if (!carteraData) {
      return res.status(400).json({
        ok: false,
        msg: "La cartera no existe",
      });
    }

    const siglaCartera = carteraData.cartera
      .split(" ")
      .map((p) => p[0])
      .join("")
      .toUpperCase();

    //  2. FECHA FORMATEADA
    const fechaFormateada = moment(FECHA_INICIO).format("YYYYMMDD");

    //  3. CORRELATIVO
    const [contadorData] = await db4.query(
      `
      SELECT COUNT(*) AS total
      FROM IVR_INTERACTIVO.CAMPANIA
      WHERE ID_CARTERA = :ID_CARTERA
      AND DATE(FECHA_INICIO) = :FECHA_INICIO
      `,
      {
        replacements: {
          ID_CARTERA,
          FECHA_INICIO,
        },
        type: QueryTypes.SELECT,
      }
    );

    const correlativo = String(contadorData.total + 1).padStart(2, "0");

    //  4. NORMALIZAR TEXTO
    const descripcionNormalizada = normalizarTexto(
      NOMBRE_CAMPANIA || "GENERAL"
    );

    //  5. NOMBRE FINAL
    const NOMBRE_CAMPANIA_AUTOMATICO = `CAMP-${siglaCartera}-${fechaFormateada}-${correlativo}-${descripcionNormalizada}`;

    //  6. VALIDAR QUE NO EXISTA
    const [existeNombre] = await db4.query(
      `
      SELECT COUNT(*) AS total
      FROM IVR_INTERACTIVO.CAMPANIA
      WHERE NOMBRE_CAMPANIA = :NOMBRE
      `,
      {
        replacements: { NOMBRE: NOMBRE_CAMPANIA_AUTOMATICO },
        type: QueryTypes.SELECT,
      }
    );

    if (existeNombre.total > 0) {
      return res.status(409).json({
        ok: false,
        msg: "Ya existe una campaña con ese nombre",
      });
    }

    //  7. PROCESAR CSV
    const registrosCSV = [];

    await new Promise((resolve, reject) => {
      const bufferStream = new stream.PassThrough();
      bufferStream.end(archivo.buffer);

      bufferStream
        .pipe(csv({ separator: ";" }))
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

    // 7.1 NORMALIZACIÓN AUTOMÁTICA (EXCEL FRIENDLY)
    registrosCSV.forEach((r) => {
      r.NOMBRE_CLIENTE = String(r.NOMBRE_CLIENTE || "").trim();
      r.NUMERO = String(r.NUMERO || "")
        .replace(/^'+/, "")
        .trim();
      r.MONTO = String(r.MONTO || "")
        .replace(/^'+/, "")
        .trim();
      r.FECHA_VENCIMIENTO = normalizarFechaBackend(r.FECHA_VENCIMIENTO);
    });

    //  7.2 VALIDACIONES FINALES ESTRICTAS
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
        return;
      }

      if (isNaN(r.NUMERO) || Number(r.NUMERO) <= 0) {
        errores.push(`Fila ${fila}: número inválido`);
        return;
      }

      if (isNaN(r.MONTO) || Number(r.MONTO) <= 0) {
        errores.push(`Fila ${fila}: monto inválido`);
        return;
      }

      if (!moment(r.FECHA_VENCIMIENTO, "YYYY-MM-DD", true).isValid()) {
        errores.push(`Fila ${fila}: fecha de vencimiento inválida`);
        return;
      }

      if (numerosSet.has(r.NUMERO)) {
        errores.push(`Fila ${fila}: número duplicado en el CSV`);
        return;
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

    //  8. TRANSACCIÓN
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
            NOMBRE_CAMPANIA: NOMBRE_CAMPANIA_AUTOMATICO,
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
          console.error("Error al originar llamada:", fila.NUMERO);
          console.error(
            "Detalle:",
            callError.response?.data || callError.message
          );
        }
      }

      return res.status(201).json({
        ok: true,
        msg: "Campaña creada correctamente con carga masiva",
        ID_CAMPANIA,
        NOMBRE_CAMPANIA: NOMBRE_CAMPANIA_AUTOMATICO,
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

//  GET DE CAMPAÑAS
export const getCampanasRequest = async (req, res) => {
  try {
    const campaigns = await db4.query(
      `
      SELECT 
        C.ID_CAMPANIA   AS ID_CAMPANA,
        C.NOMBRE_CAMPANIA AS NOMBRE_CAMPANA,
        CA.cartera AS CARTERA_CAMPANA,
        C.FECHA_INICIO AS FECHA_INICIO_CAMPANA,
        COUNT(A.ID_CARGA) AS phones,
        C.ESTADO_CAMPANIA AS ID_ESTADO_CAMPANA,
        CASE C.ESTADO_CAMPANIA
          WHEN 1 THEN 'EN CURSO'
          WHEN 2 THEN 'FINALIZADO'
          ELSE 'ERROR'
        END AS ESTADO_CAMAPANA
      FROM IVR_INTERACTIVO.CAMPANIA C
      INNER JOIN SISTEMAGEST.cartera CA 
        ON CA.id = C.ID_CARTERA
      LEFT JOIN IVR_INTERACTIVO.CARGA_ARCHIVO A
        ON A.ID_CAMPANIA = C.ID_CAMPANIA
      GROUP BY 
        C.ID_CAMPANIA,
        C.NOMBRE_CAMPANIA,
        CA.cartera,
        C.FECHA_INICIO,
        C.ESTADO_CAMPANIA
      ORDER BY C.FECHA_INICIO DESC;
      `,
      {
        type: QueryTypes.SELECT,
      }
    );

    return res.json({
      ok: true,
      campaigns,
    });
  } catch (error) {
    console.error("Error al obtener campañas:", error);

    return res.status(500).json({
      ok: false,
      msg: "Error al obtener campañas",
    });
  }
};
