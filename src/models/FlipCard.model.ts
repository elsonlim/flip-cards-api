import mongoose from "mongoose";

const flipcardSchema = new mongoose.Schema({
  hiragana: String,
  katagana: String,
  english: String,
});

export default mongoose.model("FlipCard", flipcardSchema);
