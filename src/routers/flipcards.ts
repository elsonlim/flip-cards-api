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

router.post("/new", async (req, res) => {
  const { hiragana, katagana, english, kanji } = req.body;
  const card = new FlipCard({
    hiragana,
    katagana,
    kanji,
    english,
  });

  await card.save();

  res.sendStatus(201);
});

export default router;
