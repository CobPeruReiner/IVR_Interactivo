import { QueryTypes } from "sequelize";
import { generarJWT } from "../Helper/jwt.js";
import md5 from "md5";
import { db4 } from "../DB/config.js";
import jwt from "jsonwebtoken";
import { Email } from "../Email/Email.js";
import crypto from "crypto";

export const LoginRequest = async (req, res) => {
  try {
    const { usuario, password } = req.body;

    console.log(" =========== LOGIN ===========");
    console.log("Credenciales enviadas: ", usuario, password);

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

    console.log(`Usuario encontrado: ${userDB.NOMBRES} ${userDB.APELLIDOS}`);

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
  console.log(" ========= LOG OUT =========");

  return res.status(200).json({
    ok: true,
    msg: "Logout correcto. El cliente debe eliminar el token.",
  });
};

export const ForgetPasswordRequest = async (req, res) => {
  try {
    const { email } = req.body;

    const result = await db4.query(
      `
      SELECT IDPERSONAL, NOMBRES, EMAIL 
      FROM personal 
      WHERE EMAIL = :email
        AND IDESTADO = 1
      LIMIT 1
      `,
      {
        replacements: { email },
        type: QueryTypes.SELECT,
      }
    );

    if (result.length === 0) {
      return res.status(404).json({
        ok: false,
        msg: "Correo no registrado",
      });
    }

    const user = result[0];

    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*?_";
    let newPassword = "";

    for (let i = 0; i < 5; i++) {
      const index = crypto.randomInt(0, chars.length);
      newPassword += chars[index];
    }

    const newPasswordMD5 = md5(newPassword);

    await db4.query(
      `
      UPDATE personal 
      SET PASSWORD = :password
      WHERE IDPERSONAL = :id
      `,
      {
        replacements: {
          password: newPasswordMD5,
          id: user.IDPERSONAL,
        },
        type: QueryTypes.UPDATE,
      }
    );

    const emailService = new Email(user.EMAIL);

    await emailService.sendNewPassword({
      name: user.NOMBRES,
      password: newPassword,
    });

    return res.json({
      ok: true,
      msg: "Se envió una nueva contraseña al correo",
    });
  } catch (error) {
    console.error("Forget password error:", error);
    return res.status(500).json({
      ok: false,
      msg: "Error al enviar correo",
    });
  }
};

export const ResetPasswordRequest = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const { id } = jwt.verify(token, process.env.JWT_KEY);

    const newPasswordMD5 = md5(newPassword);

    await db4.query(
      `
      UPDATE personal 
      SET PASSWORD = :password
      WHERE IDPERSONAL = :id
      `,
      {
        replacements: {
          password: newPasswordMD5,
          id,
        },
        type: QueryTypes.UPDATE,
      }
    );

    return res.json({
      ok: true,
      msg: "Contraseña actualizada correctamente",
    });
  } catch (error) {
    return res.status(401).json({
      ok: false,
      msg: "Token inválido o expirado",
    });
  }
};

export const RefreshTokenRequest = async (req, res) => {
  try {
    const id = req.id;

    console.log(" ======== Refresh Token ========");
    console.log("ID: ", id);

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

    console.log(`Usuario encontrado: ${userDB.NOMBRES} ${userDB.APELLIDOS}`);

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
