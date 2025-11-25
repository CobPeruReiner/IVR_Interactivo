import { app } from "./app.js";
import dotenv from "dotenv";
import { db4 } from "./DB/config.js";

dotenv.config();

const PORT = process.env.PORT || 4000;
const IP = process.env.IP_RUNNING || "localhost";

const startServer = async () => {
  try {
    await db4.authenticate();
    console.log("Base de datos conectada correctamente.");

    await db4.sync({ alter: false });
    console.log("Modelos sincronizados.");

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://${IP}:${PORT}`);
    });
  } catch (err) {
    console.error("Error al iniciar el servidor:", err);
  }
};

startServer();
