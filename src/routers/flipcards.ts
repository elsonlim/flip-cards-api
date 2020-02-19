import express from "express";
import FlipCard from "../models/FlipCard.model";

const router = express.Router();

router.get("/all", async (req, res) => {
  const flipcards = await FlipCard.find();

  res.json(flipcards);
});

router.post("/new", async (req, res) => {
  const card = new FlipCard({
    hiragana: "さくじつ",
    katagana: "昨日",
    english: "yesterday",
  });

  await card.save();

  res.sendStatus(201);
});

export default router;
