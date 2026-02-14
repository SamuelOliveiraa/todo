import { it, beforeAll, afterAll, describe, expect, beforeEach } from "vitest";
import supertest from "supertest";
import { execSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { app } from "../app.ts";
import { prisma } from "../lib/prisma.ts";

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

    it("should be able to get all tasks filled", async () => {
      await supertest(app.server)
        .post("/tasks")
        .send({
          title: "Teste 1",
          description:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's."
        })
        .expect(201);

      const tasks = await supertest(app.server).get("/tasks").expect(200);

      expect(tasks.body).toEqual([
        expect.objectContaining({
          title: "Teste 1",
          description:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's."
        })
      ]);
    });

    it("should be able to get all tasks filtered by title", async () => {
      await supertest(app.server)
        .post("/tasks")
        .send({
          title: "Teste 1",
          description:
            "Qualquer outro texto aqui para terstar se realmente funciona."
        })
        .expect(201);

      await supertest(app.server)
        .post("/tasks")
        .send({
          title: "Teste 2",
          description:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's."
        })
        .expect(201);

      const tasks = await supertest(app.server)
        .get("/tasks?search=2")
        .expect(200);

      expect(tasks.body).toEqual([
        expect.objectContaining({
          title: expect.stringContaining("2")
        })
      ]);
    });

    it("should be able to get all tasks filtered by description", async () => {
      await supertest(app.server)
        .post("/tasks")
        .send({
          title: "Teste 1",
          description:
            "Qualquer outro texto aqui para terstar se realmente funciona."
        })
        .expect(201);

      await supertest(app.server)
        .post("/tasks")
        .send({
          title: "Teste 2",
          description:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's."
        })
        .expect(201);

      const tasks = await supertest(app.server)
        .get("/tasks?search=outro")
        .expect(200);

      expect(tasks.body).toEqual([
        expect.objectContaining({
          description: expect.stringContaining("outro")
        })
      ]);
    });
  });

  describe("POST", () => {
    it("should be able to create a task", async () => {
      await supertest(app.server)
        .post("/tasks")
        .send({
          title: "Teste 2",
          description:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's."
        })
        .expect(201);

      const tasks = await supertest(app.server).get("/tasks").expect(200);

      expect(tasks.body).toEqual([
        expect.objectContaining({
          title: "Teste 2",
          description:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's."
        })
      ]);
    });

    it("should not be able to create a task without title", async () => {
      await supertest(app.server)
        .post("/tasks")
        .send({
          description:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's."
        })
        .expect(400);
    });

    it("should not be able to create a task without description", async () => {
      await supertest(app.server)
        .post("/tasks")
        .send({
          title: "Teste 1"
        })
        .expect(400);
    });
  });

  describe("PUT", () => {
    it("should not be able to update a task without title or description", async () => {
      await supertest(app.server)
        .post("/tasks")
        .send({
          title: "Teste 2",
          description:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's."
        })
        .expect(201);

      const task = await supertest(app.server).get("/tasks").expect(200);

      await supertest(app.server)
        .put(`/tasks/${task.body[0].id}`)
        .send({})
        .expect(400);
    });

    it("should be able to update a title of a task", async () => {
      await supertest(app.server)
        .post("/tasks")
        .send({
          title: "Teste 2",
          description:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's."
        })
        .expect(201);

      const task = await supertest(app.server).get("/tasks").expect(200);

      await supertest(app.server)
        .put(`/tasks/${task.body[0].id}`)
        .send({
          title: "Texto alterado"
        })
        .expect(200);

      const taskAfterUpdate = await supertest(app.server)
        .get("/tasks")
        .expect(200);

      expect(taskAfterUpdate.body).toEqual([
        expect.objectContaining({
          title: "Texto alterado"
        })
      ]);
    });

    it("should be able to update a description of a task", async () => {
      await supertest(app.server)
        .post("/tasks")
        .send({
          title: "Teste 2",
          description:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's."
        })
        .expect(201);

      const task = await supertest(app.server).get("/tasks").expect(200);

      await supertest(app.server)
        .put(`/tasks/${task.body[0].id}`)
        .send({
          description: "Texto alterado"
        })
        .expect(200);

      const taskAfterUpdate = await supertest(app.server)
        .get("/tasks")
        .expect(200);

      expect(taskAfterUpdate.body).toEqual([
        expect.objectContaining({
          description: "Texto alterado"
        })
      ]);
    });

    it("should not be able to update a description or title of a task with a invalid ID", async () => {
      const id = randomUUID();

      await supertest(app.server)
        .put(`/tasks/${id}`)
        .send({
          title: "Alterando title",
          description: "Texto alterado"
        })
        .expect(404);
    });
  });

  describe("PATCH", () => {
    it("should not be able to update a completed_at of a task with a invalid ID", async () => {
      const id = randomUUID();

      await supertest(app.server)
        .patch(`/tasks/${id}/complete`)
        .send()
        .expect(404);
    });

    it("should be able to update a completed_at of a task", async () => {
      await supertest(app.server)
        .post("/tasks")
        .send({
          title: "Teste 1",
          description:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's."
        })
        .expect(201);

      const task = await supertest(app.server).get("/tasks").expect(200);

      await supertest(app.server)
        .patch(`/tasks/${task.body[0].id}/complete`)
        .send()
        .expect(200);

      const taskAfterUpdate = await supertest(app.server)
        .get("/tasks")
        .expect(200);

      expect(taskAfterUpdate.body).toEqual([
        expect.objectContaining({
          completed_at: expect.any(String)
        })
      ]);
    });
  });

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

      const tasksRemoved = await supertest(app.server)
        .get("/tasks")
        .expect(200);

      expect(tasksRemoved.body).toEqual([]);
    });

    it("should not be able to delete a task with a invalid ID", async () => {
      const id = randomUUID();
      await supertest(app.server).delete(`/tasks/${id}`).expect(404);
    });
  });

  describe("CSV Files", () => {
    it("should be able to export tasks to CSV", async () => {
      await supertest(app.server)
        .post("/tasks")
        .send({
          title: "Teste 1",
          description:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's."
        })
        .expect(201);

      const tasksCSV = await supertest(app.server)
        .get("/tasks/export_csv")
        .expect(200);

      console.log(tasksCSV);

      expect(tasksCSV.header["content-type"]).toBe("text/csv");
      expect(tasksCSV.header["content-disposition"]).toContain("attachment");

      expect(tasksCSV.text).toContain("Teste 1");
    });
  });
});
