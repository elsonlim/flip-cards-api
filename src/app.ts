import express from "express";
import "./utils/db";
import flipcardsRouter from "./routers/flipcards";
import usersRouter from "./routers/users";
import morgan from "morgan";

const app = express();

app.use(express.json());
app.use(morgan("tiny"));
app.use("/flipcards", flipcardsRouter);
app.use("/users", usersRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

export default app;
