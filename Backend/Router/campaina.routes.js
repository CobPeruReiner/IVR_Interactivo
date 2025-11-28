import { Router } from "express";
import { check } from "express-validator";
import { validarCampos } from "../Middleware/validar-campos.js";
import { createCampanaRequest } from "../Controller/campaina.controller.js";
import { upload } from "../Middleware/upload.js";

export const campainaRouter = Router();

campainaRouter.post(
  "/save-campana",
  [
    upload.single("archivo"),

    check("NOMBRE_CAMPANIA", "El nombre de la campaña es obligatorio")
      .not()
      .isEmpty(),

    check("ID_CARTERA", "El ID de cartera es obligatorio").isInt(),

    check("FECHA_INICIO", "La fecha de inicio es obligatoria").not().isEmpty(),

    check("ID_PERSONAL_REGISTRO", "El usuario es obligatorio").isInt(),

    check("NOMBRE", "El nombre del prompt es obligatorio").not().isEmpty(),

    check("CONTENIDO", "El contenido del prompt es obligatorio")
      .not()
      .isEmpty(),

    check("VERSION", "La versión es obligatoria").isInt(),

    validarCampos,
  ],
  createCampanaRequest
);
