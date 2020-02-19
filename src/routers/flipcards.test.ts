import { Db } from "mongodb";
import request from "supertest";
import app from "../app";

declare var db: Db;

describe("flipcards", () => {
  it("should insert a flipcard into the database", async () => {
    const mockData = {
      hiragana: "さくじつ",
      katagana: null,
      kanji: "昨日",
      english: "yesterday",
    };

    const response = await request(app)
      .post("/flipcards/new")
      .set("Content-Type", "application/json")
      .send(mockData);

    expect(response.status).toBe(201);

    const flipcards = db.collection("flipcards");
    const card = await flipcards.findOne({ hiragana: mockData.hiragana });
    expect(card).toMatchObject(mockData);
  });
});
