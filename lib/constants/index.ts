export const isDevelopment = process.env.NODE_ENV === "development";
export const isProduction = process.env.NODE_ENV === "production";

const devOrigins = ["http://localhost:3000", "http://localhost:3001"];

const prodOrigins = ["https://www.talktoayo.xyz", "https://portfolio-4p0i.onrender.com"];

export const allowedOrigins = isProduction ? prodOrigins : devOrigins;

export const BASE_URL =
  process.env.BETTER_AUTH_URL ||
  process.env.BASE_URL ||
  (isDevelopment ? "http://localhost:3000" : "https://portfolio-4p0i.onrender.com");

export const FRONTEND_BASE_URL =
  process.env.FRONTEND_BASE_URL ||
  (isDevelopment ? "http://localhost:3001" : "https://portfolio-4p0i.onrender.com");
