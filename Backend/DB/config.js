import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const db4 = new Sequelize({
  dialect: "mysql",
  host: process.env.DB_HOST4,
  username: process.env.DB_USER4,
  password: process.env.DB_PASSWORD4,
  database: process.env.DB4,
  logging: false,
  define: {
    timestamps: false,
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci",
  },
  pool: {
    max: 20,
    min: 0,
    acquire: 60000,
    idle: 10000,
  },
  dialectOptions: {
    multipleStatements: true,
    charset: "utf8mb4",
  },
});
