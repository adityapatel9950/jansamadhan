import dotenv from "dotenv";
import { randomBytes } from "node:crypto";

dotenv.config();

const jwtSecret =
  process.env.JWT_SECRET ||
  (process.env.NODE_ENV === "production"
    ? undefined
    : randomBytes(32).toString("hex"));

if (!jwtSecret) {
  throw new Error("JWT_SECRET must be set in production.");
}

if (process.env.NODE_ENV === "production" && !process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set in production.");
}

export const config = {
  port: parseInt(process.env.PORT || "3000", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  database: {
    url: process.env.DATABASE_URL,
    host: process.env.PGHOST || "localhost",
    port: parseInt(process.env.PGPORT || "5432", 10),
    user: process.env.PGUSER || "postgres",
    password: process.env.PGPASSWORD || "postgres",
    database: process.env.PGDATABASE || "jansamadhan",
    ssl:
      process.env.PGSSL === "true" ? { rejectUnauthorized: false } : undefined,
  },
};
