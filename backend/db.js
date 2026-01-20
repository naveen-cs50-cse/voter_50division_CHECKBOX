import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const client = new MongoClient(process.env.MONGO_URI);

let db;
let voterCollection;

export async function connectDB() {
  if (db) return;

  await client.connect();
  db = client.db("election50");      // DATABASE NAME
  voterCollection = db.collection("voter"); // COLLECTION NAME

  console.log("✅ MongoDB Atlas connected");
}

export function getVoterCollection() {
  return voterCollection;
}
