import express from "express";
import User from "../models/User.model";
const router = express.Router();

router.post("/", async (req, res) => {
  const { username, password } = req.body;
  const user = new User({
    username,
    password,
  });
  await user.save();
  res.status(201).json({ username });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  const isPasswordCorrect = !!user && (await user.comparePassword(password));

  if (user && isPasswordCorrect) {
    return res.json({
      username: user.username,
    });
  }

  return res.sendStatus(401);
});

router.patch("/:username", async (req, res, next) => {
  const username = req.params.username;
  const password = req.body.password;

  const user = await User.findOne({
    username,
  });

  if (!user) {
    return res.sendStatus(403);
  }

  if (password) {
    user.password = password;
  }

  await user.save();

  res.sendStatus(200);
});

export default router;
