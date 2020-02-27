import mongoose from "mongoose";

// {
//   "index": 1,
//   "tags": ["N3", "感動"],
//   "text": "問い合わせる",
//   "hiragana": "といあわせる",
//   "furigana": [
//     {
//       "kanji": "問",
//       "furi": "と"
//     }, {
//       "kanji": "合",
//       "furi": "あ"
//     }
//   ]
// }

const flipcardSchema = new mongoose.Schema({
  index: {
    type: Number,
    unique: true,
  },
  tags: [String],
  text: String,
  hiragana: String,
  furigana: [],
  english: String,
});

export default mongoose.model("FlipCard", flipcardSchema);
