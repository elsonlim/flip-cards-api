import dotenv from "dotenv";
dotenv.config();
import express from "express";
import "./utils/db";
import flipcardsRouter from "./routers/flipcards";
import usersRouter from "./routers/users";
import morgan from "morgan";
import { init as initCookie } from "./utils/cookieHelper";
import cors from "cors";

const app = express();

app.use(
  cors({
    credentials: true,
    origin: ["chrome-search://local-ntp"],
  }),
);
app.use(express.json());
app.use(morgan("tiny"));
app.use(initCookie());
app.use("/flipcards", flipcardsRouter);
app.use("/users", usersRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    res.sendStatus(500);
  },
);

export default app;
