import { Db } from "mongodb";
import request from "supertest";
import app from "../app";

declare var db: Db;

interface MockData {
  hiragana?: string;
  katagana?: string;
  kanji?: string;
  english?: string;
}

describe("flipcards", () => {
  let mockData: MockData;
  beforeEach(() => {
    mockData = {
      hiragana: "さくじつ",
      kanji: "昨日",
      english: "yesterday",
    };
  });

  const insertData = (data: MockData): request.Request => {
    return request(app)
      .post("/flipcards/new")
      .set("Content-Type", "application/json")
      .send(data);
  };

  it("POST /new should insert a flipcard into the database", async () => {
    const response = await insertData(mockData);

    expect(response.status).toBe(201);

    const flipcards = db.collection("flipcards");
    const card = await flipcards.findOne({ hiragana: mockData.hiragana });
    expect(card).toMatchObject(mockData);
  });

  it("GET / should return all flipcards", async () => {
    await insertData(mockData);
    await insertData(mockData);

    const response = await request(app).get("/flipcards");
    console.log(response);
    expect(response.body).toHaveLength(2);
  });

  it("delete /:id should delete a record", async () => {
    await insertData(mockData);

    const flipcards = db.collection("flipcards");
    const card = await flipcards.findOne({ hiragana: mockData.hiragana });

    await request(app)
      .delete(`/flipcards/${card._id}`)
      .set("Content-Type", "application/json");

    const cardAfterDelete = await flipcards.findOne({
      hiragana: mockData.hiragana,
    });

    expect(cardAfterDelete).toBeNull();
  });
});
