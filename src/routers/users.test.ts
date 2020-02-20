import { Db, Collection } from "mongodb";
import request, { Request } from "supertest";
import app from "../app";
import { IUser } from "../models/User.model";

declare var db: Db;

describe("User", () => {
  const createUser = (user: IUser): Request => {
    return request(app)
      .post("/users")
      .set("Content-Type", "application/json")
      .send(user);
  };

  it("POST /users should create a new user", async () => {
    const response = await createUser({
      username: "alice",
      password: "123",
    });

    expect(response.status).toBe(201);

    const Users = db.collection("users");
    const data = await Users.findOne({ username: "alice" });
    expect(data).toMatchObject({
      username: "alice",
      password: expect.stringMatching(/\$2b\$12\$.{53}/),
    });
  });

  describe("POST /users/login", () => {
    let user: IUser;
    let Users: Collection;

    beforeEach(async () => {
      await createUser({ username: "bob", password: "apple" });
      Users = db.collection("users");
      const newUser = await Users.findOne({ username: "bob" });
      if (newUser) {
        user = newUser;
      }
    });

    it("should login user", async () => {
      const response = await request(app)
        .post("/users/login")
        .set("Content-Type", "application/json")
        .send({
          username: "bob",
          password: "apple",
        });

      expect(response.body).toMatchObject({ username: "bob" });
    });

    it("should not be able to login if username does not exist", async () => {
      const response = await request(app)
        .post("/users/login")
        .set("Content-Type", "application/json")
        .send({
          username: "bob1",
          password: "apple",
        });

      expect(response.status).toBe(401);
    });

    it("should not be able to login if password is wrong", async () => {
      const response = await request(app)
        .post("/users/login")
        .set("Content-Type", "application/json")
        .send({
          username: "bob",
          password: "apple1",
        });

      expect(response.status).toBe(401);
    });
  });

  describe("PATCH /users/:username", () => {
    let user: IUser;
    let Users: Collection;

    beforeEach(async () => {
      await createUser({ username: "bob", password: "apple" });
      Users = db.collection("users");
      const newUser = await Users.findOne({ username: "bob" });
      if (newUser) {
        user = newUser;
      }
    });

    it("should not change password if no password field is supply", async () => {
      const originalPassword = user.password;
      await request(app)
        .patch("/users/bob")
        .set("Content-Type", "application/json")
        .send({});

      const updatedUser = await Users.findOne({ username: "bob" });
      expect(originalPassword).toBe(updatedUser.password);
    });

    it("should change password", async () => {
      const originalPassword = user.password;
      await request(app)
        .patch("/users/bob")
        .set("Content-Type", "application/json")
        .send({
          password: "orange",
        });

      const updatedUser = await Users.findOne({ username: "bob" });
      expect(originalPassword).not.toBe(updatedUser.password);
      expect(updatedUser.password).toEqual(
        expect.stringMatching(/\$2b\$12\$.{53}/),
      );
    });

    it("should return 403 if user does not exist", async () => {
      const res = await request(app)
        .patch("/users/alice")
        .set("Content-Type", "application/json")
        .send({
          password: "orange",
        });

      expect(res.status).toBe(403);
    });
  });
});
