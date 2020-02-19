import { Db } from "mongodb";
import request from "supertest";
import app from "../app";

declare var db: Db;

describe("flipcards", () => {
  it("should insert a flipcard into the database", async () => {
    const response = await request(app)
      .post("/flipcards/new")
      .set("Content-Type", "application/json")
      .send();

    expect(response.status).toBe(201);

    const flipcards = db.collection("flipcards");
    const card = await flipcards.findOne({ hiragana: "さくじつ" });
    expect(card).toMatchObject({
      hiragana: "さくじつ",
      katagana: "昨日",
      english: "yesterday",
    });
  });
});
