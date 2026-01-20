import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGO_URI; // Atlas URI
const DB_NAME = "election49";
const COLLECTION = "voter";

async function runTests() {
  const client = new MongoClient(uri);

  try {
    console.log("⏳ Connecting to MongoDB Atlas...");
    await client.connect();
    console.log("✅ Connected");

    const db = client.db("election50");
    const collection = db.collection("voter");

//     const sample1 = await collection.findOne({});
// if (!sample1) {
//   console.log("⚠️ No sample document found");
//   return;
// }
// console.log("📄 Sample keys:", Object.keys(sample));

    /* ===== BASIC COUNT ===== */
    const total = await collection.countDocuments();
    console.log("📊 Total voters:", total);

    /* ===== HOUSE EXACT MATCH ===== */
    const houseExact = "12-106";
    const exactResults = await collection.find({
      hno_filtered: houseExact
    }).toArray();

    console.log(`🏠 Exact house (${houseExact}) →`, exactResults.length);

    /* ===== HOUSE REGEX MATCH ===== */
    const houseRegex = "12-106";
    const regexResults = await collection.find({
      hno_filtered: { $regex: houseRegex }
    }).toArray();

    console.log(`🏠 Regex house (${houseRegex}) →`, regexResults.length);

    /* ===== EPIC SEARCH ===== */
    const epic = "RUA1646712";
    const epicResult = await collection.findOne({
      epic_clean: epic
    });

    console.log("🆔 EPIC found:", epicResult ? "YES" : "NO");

    if (epicResult) {
      console.log("   Name:", epicResult.Name);
      console.log("   House:", epicResult.hno_filtered);
      console.log("   Status:", epicResult.support_status);
    }

    /* ===== SAMPLE DOCUMENT ===== */
    const sample = await collection.findOne({});
    console.log("📄 Sample keys:", Object.keys(sample));

  } catch (err) {
    console.error("❌ TEST FAILED:", err.message);
  } finally {
    await client.close();
    console.log("🔌 Connection closed");
  }
}

runTests();
