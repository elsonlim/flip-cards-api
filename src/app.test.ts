import request from "supertest";
import app from "./app";

describe("App", () => {
  it("GET / should return Hello World!", async () => {
    const res = await request(app).get("/");

    expect(res.status).toBe(200);
  });
});
