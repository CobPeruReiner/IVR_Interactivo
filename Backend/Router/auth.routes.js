import { Router } from "express";
import { check } from "express-validator";
import { validarCampos } from "../Middleware/validar-campos.js";
import {
  LoginRequest,
  LogoutRequest,
  RefreshTokenRequest,
} from "../Controller/auth.controller.js";
import { validarJWT } from "../Middleware/validar-jwt.js";

export const authRouter = Router();

authRouter.post(
  "/login",
  [
    check("usuario", "El usuario es obligatorio").not().isEmpty(),
    check("password", "El password es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  LoginRequest
);

authRouter.get("/refresh", validarJWT, RefreshTokenRequest);

authRouter.post("/logout", LogoutRequest);
