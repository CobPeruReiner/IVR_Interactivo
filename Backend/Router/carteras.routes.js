import { Router } from "express";
import { getAllCarterasRequest } from "../Controller/carteras.controller.js";

export const carterasRouter = Router();

carterasRouter.get("/", getAllCarterasRequest);
