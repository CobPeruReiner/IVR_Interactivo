import jwt from "jsonwebtoken";

// Generar JWT
export const generarJWT = async (id = "", expireTime = "6h") => {
  console.log(" ====== GENERAR JSON WEB TOKEN ======");
  console.log(id, expireTime);

  try {
    console.log(`Generando token para el usuario ${id}`);

    const payload = { id };

    const token = jwt.sign(payload, process.env.JWT_KEY || "secret", {
      expiresIn: expireTime,
    });

    return token;
  } catch (error) {
    console.error("Error al generar token:", error);
    throw new Error("No se pudo generar el token");
  }
};

// Verificar JWT
export const comprobarJWT = (token = "") => {
  console.log(" ====== VERIFICAR JSON WEB TOKEN ======");
  console.log(`Verificando token: ${token}`);

  try {
    const { id } = jwt.verify(token, process.env.JWT_KEY || "secret");
    return [true, id];
  } catch (error) {
    console.error("Token inválido:", error);
    return [false, null];
  }
};
