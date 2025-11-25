import { QueryTypes } from "sequelize";
import { generarJWT } from "../Helper/jwt.js";
import md5 from "md5";
import { db4 } from "../DB/config.js";

export const LoginRequest = async (req, res) => {
  try {
    const { usuario, password } = req.body;

    const result = await db4.query(
      `
      SELECT * 
      FROM personal 
      WHERE USUARIO = :usuario
        AND IDESTADO = 1
        AND TIPO_PERSONAL IN ('HUMANO', 'DESARROLLO')
      `,
      {
        replacements: { usuario },
        type: QueryTypes.SELECT,
      }
    );

    if (result.length === 0) {
      return res.status(400).json({
        ok: false,
        msg: "Usuario no encontrado o no autorizado",
      });
    }

    const userDB = result[0];

    if (md5(password) !== userDB.PASSWORD) {
      return res.status(400).json({
        ok: false,
        msg: "Credenciales incorrectas",
      });
    }

    const token = await generarJWT(userDB.IDPERSONAL);

    return res.status(200).json({
      ok: true,
      user: userDB,
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      msg: "Error interno en el servidor",
    });
  }
};

export const LogoutRequest = (req, res) => {
  return res.status(200).json({
    ok: true,
    msg: "Logout correcto. El cliente debe eliminar el token.",
  });
};

export const RefreshTokenRequest = async (req, res) => {
  try {
    const id = req.id;

    const result = await db4.query(
      `
      SELECT * 
      FROM personal 
      WHERE IDPERSONAL = :id
        AND IDESTADO = 1
      `,
      {
        replacements: { id },
        type: QueryTypes.SELECT,
      }
    );

    if (result.length === 0) {
      return res.status(404).json({
        ok: false,
        msg: "Usuario no encontrado",
      });
    }

    const userDB = result[0];

    const newToken = await generarJWT(id);

    return res.status(200).json({
      ok: true,
      user: userDB,
      token: newToken,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Error interno en el servidor",
    });
  }
};
