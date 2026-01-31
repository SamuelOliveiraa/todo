import { it, beforeAll, afterAll, describe, expect, beforeEach } from "vitest";
import { app } from "../src/app.ts";
import supertest from "supertest";
import { execSync } from "node:child_process";
import { prisma } from "../src/lib/prisma.ts";

describe("Tasks routes", () => {
  beforeAll(async () => {
    execSync("npx dotenv -e .env.test -- npx prisma db push --force-reset");
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await prisma.tasks.deleteMany();
  });

  describe("GET", () => {
    it("should be able to get all tasks empty", async () => {
      const tasks = await supertest(app.server).get("/tasks").expect(200);

      expect(tasks.body).toEqual([]);
    });

    // it("should be able to get all tasks filled", async () => {
    //   await supertest(app.server)
    //     .post("/tasks")
    //     .send({
    //       title: "Teste 1",
    //       description:
    //         "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's."
    //     })
    //     .expect(201);

    //   const tasks = await supertest(app.server).get("/tasks").expect(200);

    //   expect(tasks.body).toEqual([
    //     expect.objectContaining({
    //       title: "Teste 1",
    //       description:
    //         "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's."
    //     })
    //   ]);
    // });
  });

  // describe("POST", () => {
  //   it("should be able to delete a task", async () => {
  //     await supertest(app.server).delete("/tasks/1").expect(500);
  //   });
  // });

  // describe("PUT", () => {
  //   it("should be able to delete a task", async () => {
  //     await supertest(app.server).delete("/tasks/1").expect(500);
  //   });
  // });

  // describe("PATCH", () => {
  //   it("should be able to delete a task", async () => {
  //     await supertest(app.server).delete("/tasks/1").expect(500);
  //   });
  // });

  describe("DELETE", () => {
    it("should be able to delete a task", async () => {
      await supertest(app.server)
        .post("/tasks")
        .send({
          title: "Teste 1",
          description:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's."
        })
        .expect(201);

      const tasks = await supertest(app.server).get("/tasks");

      await supertest(app.server)
        .delete(`/tasks/${tasks.body[0].id}`)
        .expect(204);
    });

    it("should not be able to delete a task with a invalid id", async () => {
      await supertest(app.server).delete("/tasks/1").expect(500);
    });
  });
});
