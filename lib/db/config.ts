import { MongoClient, type Db } from "mongodb";

declare global {
  var mongoClient: MongoClient | undefined;
}

const uri = process.env.MONGODB_URI || process.env.DATABASE_URL;

if (!uri) {
  throw new Error("MONGODB_URI or DATABASE_URL is required.");
}

export const client = globalThis.mongoClient || new MongoClient(uri);

if (process.env.NODE_ENV !== "production") {
  globalThis.mongoClient = client;
}

export const db: Db = client.db(process.env.MONGODB_DB || "portfolio");
