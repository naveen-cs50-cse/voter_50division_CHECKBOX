import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();
const url="mongodb+srv://PAWSOME:naveen123@pawsome.s3jceki.mongodb.net/?appName=PAWSOME";
const client = new MongoClient(url);

async function test() {
  try {
    await client.connect();
    console.log("✅ Atlas connected successfully");
    process.exit(0);
  } catch (e) {
    console.error("❌ Atlas connection failed", e.message);
    process.exit(1);
  }
}

test();
