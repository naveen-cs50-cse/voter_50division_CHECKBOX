import mongoose from "mongoose";

const VoterSchema = new mongoose.Schema(
  {
    Name: String,
    "Relation Name": String,
    Sex: String,
    Age: Number,

    "EPIC No": mongoose.Schema.Types.Mixed,
    "House No": mongoose.Schema.Types.Mixed,

    Address: String,

    name_te: String,
    relation_te: String,
    hno_filtered: String
  },
  {
    collection: "voter", // 🔥 THIS IS THE KEY LINE
    strict: false         // because your data is messy / nested
  }
);

export default mongoose.model("Voter", VoterSchema);
