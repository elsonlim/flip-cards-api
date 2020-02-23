import { Db, Collection } from "mongodb";
import request, { Request, Response } from "supertest";
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
    const agent = request.agent(app);

    beforeEach(async () => {
      await createUser({ username: "bob", password: "apple" });
      Users = db.collection("users");
      const newUser = await Users.findOne({ username: "bob" });
      if (newUser) {
        user = newUser;
      }
    });

    it("should login user", async () => {
      const response = await agent
        .post("/users/login")
        .set("Content-Type", "application/json")
        .send({
          username: "bob",
          password: "apple",
        });

      expect(response.body).toMatchObject({ xsrfToken: expect.any(String) });
      const authCookie = response.get("set-cookie")[0];
      const xsrfCookie = response.get("set-cookie")[1];
      expect(authCookie).toEqual(expect.stringContaining("auth="));
      expect(xsrfCookie).toEqual(expect.stringContaining("XSRF-TOKEN="));
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
    const agent = request.agent(app);
    let user: IUser;
    let Users: Collection;
    let xsrfToken: string;
    let patchUser: (username: string, payload: object) => Promise<Response>;

    beforeEach(async () => {
      await agent
        .post("/users")
        .set("Content-Type", "application/json")
        .send({ username: "bob", password: "password" });

      Users = db.collection("users");
      const newUser = await Users.findOne({ username: "bob" });
      if (newUser) {
        user = newUser;
      }

      const res = await agent
        .post("/users/login")
        .set("Content-Type", "application/json")
        .send({ username: "bob", password: "password" });

      xsrfToken = res.body.xsrfToken;
      patchUser = async (username, body) =>
        await agent
          .patch(`/users/${username}`)
          .set("Content-Type", "application/json")
          .set("X-XSRF-TOKEN", xsrfToken)
          .send(body);
    });

    it("should return 401 if wrong xsrf token is passed in", async () => {
      const res = await agent
        .patch(`/users/bob`)
        .set("Content-Type", "application/json");

      expect(res.status).toBe(401);
    });

    it("should not change password if no password field is supplied", async () => {
      const originalPassword = user.password;
      await patchUser("bob", {});

      const updatedUser = await Users.findOne({ username: "bob" });
      expect(originalPassword).toBe(updatedUser.password);
    });

    it("should change password when editing password", async () => {
      const originalPassword = user.password;
      await patchUser("bob", {
        password: "orange",
      });

      const updatedUser = await Users.findOne({ username: "bob" });
      expect(originalPassword).not.toBe(updatedUser.password);
      expect(updatedUser.password).toEqual(
        expect.stringMatching(/\$2b\$12\$.{53}/),
      );
    });

    it("should return 403 if user does not exist", async () => {
      const res = await patchUser("alice", {
        password: "orange",
      });

      expect(res.status).toBe(403);
    });
  });
});
