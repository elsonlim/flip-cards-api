import express from "express";
import "./utils/db";
import flipcardsRouter from "./routers/flipcards";

const app = express();

app.use("/flipcards", flipcardsRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

export default app;
