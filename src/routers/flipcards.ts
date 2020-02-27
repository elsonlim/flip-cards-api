import express from "express";
import FlipCard from "../models/FlipCard.model";

const router = express.Router();

router.get("/", async (req, res) => {
  const flipcards = await FlipCard.find();

  res.json(flipcards);
});

router.delete("/:id", async (req, res) => {
  const card = await FlipCard.findByIdAndRemove(req.params.id);

  res.json(card);
});

router.post("/new", async (req, res, next) => {
  const { index, tags, text, hiragana, furigana, english } = req.body;
  const card = new FlipCard({
    index,
    tags,
    text,
    hiragana,
    furigana,
    english,
  });

  try {
    await card.save();
  } catch (e) {
    return next(e);
  }

  res.sendStatus(201);
});

export default router;
