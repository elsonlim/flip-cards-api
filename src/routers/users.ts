import express from "express";
import User from "../models/User.model";
import { setCookie } from "../utils/cookieHelper";
import {
  verifiedJwt,
  verifiedXsrf,
  RequestWithUser,
} from "../handlers/authHandlers";

import crypto from "crypto";

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

  if (user) {
    const isPasswordCorrect = await user.comparePassword(password);
    if (isPasswordCorrect) {
      const token = user.generateJWT();
      const xsrfToken = crypto.randomBytes(32).toString("hex");
      setCookie(res, "auth", token);
      setCookie(res, "XSRF-TOKEN", xsrfToken);
      return res.json({
        xsrfToken,
      });
    }
  }

  return res.sendStatus(401);
});

router.patch(
  "/:username",
  (req, res, next) => verifiedJwt(req as RequestWithUser, res, next),
  (req, res, next) => verifiedXsrf(req as RequestWithUser, res, next),
  async (req, res) => {
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
    return res.sendStatus(200);
  },
);

export default router;
