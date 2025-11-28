import { QueryTypes } from "sequelize";
import { db4 } from "../DB/config.js";

export const getAllCarterasRequest = async (req, res) => {
  try {
    const query = `SELECT * from cartera WHERE estado = 1 ORDER BY cartera;`;

    const result = await db4.query(query, {
      type: QueryTypes.SELECT,
    });

    return res.status(200).json({
      ok: true,
      carteras: result,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      ok: false,
      msg: "Error al obtener las carteras",
    });
  }
};
