import "dotenv/config";

import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || process.env.DATABASE_URL;

if (!uri) {
  throw new Error("MONGODB_URI or DATABASE_URL is required.");
}

const client = new MongoClient(uri);

console.log(
  "Resetting database:",
  uri.includes("mongodb+srv") ? "Atlas database (Production)" : "local database"
);

async function resetDb() {
  try {
    await client.connect();

    const db = client.db("portfolio");

    await db.dropDatabase();

    console.log("Database dropped successfully.");
  } catch (error) {
    console.error("Failed to reset database:", error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

resetDb();
