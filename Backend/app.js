import express from "express";
import cors from "cors";
import { authRouter } from "./Router/auth.routes.js";
import { campainaRouter } from "./Router/campaina.routes.js";
import { carterasRouter } from "./Router/carteras.routes.js";

export const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRouter);
app.use("/api/campania", campainaRouter);
app.use("/api/cartera", carterasRouter);
