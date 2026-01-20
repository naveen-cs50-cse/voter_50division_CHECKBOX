import express from "express";
import cors from "cors";
import { connectDB, getVoterCollection } from "./db.js";

import path from "path";
import { fileURLToPath } from "url";

// import connectDB from "./db.js";
// import Voter from "./models/Voter.js";

await connectDB();

const app = express();
const PORT = 5000;

/* Middleware */
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* Serve frontend */
app.use(express.static(path.join(__dirname, "public")));

/* Connect MongoDB */
connectDB();

/* ============================
   HOUSE NUMBER SEARCH
   ============================ */
app.get("/api/voters/house/:hno", async (req, res) => {
  try {
    const raw = req.params.hno.trim();
    const collection = getVoterCollection();

    const voters = await collection.find({
      hno_filtered: { $regex: `^${raw}`, $options: "i" }
    }).toArray();

    res.json({
      house: raw,
      totalVoters: voters.length,
      voters
    });
  } catch (err) {
    console.error("❌ House search error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


/* ============================
   EPIC SEARCH
   ============================ */
app.get("/api/voters/epic/:epic", async (req, res) => {
  try {
    const epic = req.params.epic.trim().toUpperCase();
    const collection = getVoterCollection();

    const voter = await collection.findOne({ epic_clean: epic }).toArray();

    if (!voter) {
      return res.status(404).json({ message: "No voter found" });
    }

    res.json(voter);
  } catch (err) {
    console.error("EPIC search error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ============================
   UPDATE VOTE STATUS (3-STATE)
   ============================ */
app.post("/api/voters/vote", async (req, res) => {
  try {
    const { epic, status } = req.body;
    const collection = getVoterCollection();

    if (!epic || !["our", "opp", "undecided"].includes(status)) {
      return res.status(400).json({ error: "Invalid request" });
    }

    await collection.updateOne(
      { epic_clean: epic },
      { $set: { vote_status: status } }
    );

    res.json({ success: true });
  } catch (err) {
    console.error("❌ Vote update error:", err);
    res.status(500).json({ error: "Server error" });
  }
});



// serve frontend
app.use(express.static("public"));

// optional fallback
app.get("/", (req, res) => {
  res.sendFile(path.resolve("public/index.html"));
});

/* Start server */
// app.listen(PORT, "0.0.0.0", () => {
//   console.log(`✅ MongoDB server running on ${PORT}`);
// });
// const PORT = 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on ${PORT}`);
});


