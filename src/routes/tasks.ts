import type { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma.ts";
import type { TaskPost, TaskPut } from "../types/task.type.ts";
import { Prisma } from "../generated/prisma/client.ts";

import { parse } from "csv-parse";
import { stringify } from "csv-stringify/sync";

export async function tasksRoute(app: FastifyInstance) {
  // Return all tasks or search for tasks that match the search query by title or description
  app.get<{ Querystring: { search?: string } }>("/", async (request, reply) => {
    try {
      const { search } = request.query;

      const data = await prisma.tasks.findMany({
        where: search
          ? {
              OR: [
                {
                  title: {
                    contains: search
                  }
                },
                {
                  description: {
                    contains: search
                  }
                }
              ]
            }
          : {},
        orderBy: { created_at: "desc" }
      });

      reply.send(data);
    } catch (error) {
      return reply.status(500).send({
        message:
          "An error occurred during fetching tasks, please try again later."
      });
    }
  });

  // Create a new task
  app.post<{ Body: TaskPost }>("/", async (request, reply) => {
    try {
      const { body } = request;

      if (!body || !body.title || !body.description) {
        reply
          .status(400)
          .send({ message: "Title and description are required" });
        return;
      }

      await prisma.tasks.create({
        data: {
          title: body.title,
          description: body.description
        }
      });

      reply.status(201).send({ message: "Task created successfully" });
    } catch (error) {
      console.log(error);
      return reply.status(500).send({
        message:
          "An error occurred during creation of a task, please try again later."
      });
    }
  });

  // Delete a task by ID
  app.delete<{ Params: { id: string } }>("/:id", async (request, reply) => {
    try {
      const { id } = request.params;

      if (!id) {
        reply.status(400).send({ message: "ID is required" });
        return;
      }

      await prisma.tasks.delete({ where: { id } });

      reply.status(204).send();
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          return reply.status(404).send({ message: "Task not found" });
        }
      }
      console.log(error);
      return reply.status(500).send({
        message:
          "An error occurred during deletion of task, please try again later."
      });
    }
  });

  // Update a title and description of a task by ID
  app.put<{ Params: { id: string }; Body: TaskPut }>(
    "/:id",
    async (request, reply) => {
      try {
        const { id } = request.params;
        const { description, title } = request.body;

        if (!id) {
          reply.status(400).send({ message: "ID is required" });
          return;
        }

        if (!title && !description) {
          reply
            .status(400)
            .send({ message: "Title or description is required" });
          return;
        }

        const task = await prisma.tasks.findUnique({
          where: { id }
        });

        if (!task) {
          reply.status(404).send({ message: "Task not found" });
          return;
        }

        await prisma.tasks.update({
          where: { id },
          data: {
            ...(title && { title }),
            ...(description && { description })
          }
        });

        reply.status(200).send({ message: "Task updated successfully" });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2025") {
            return reply.status(404).send({ message: "Task not found" });
          }
        }
        console.log(error);
        return reply.status(500).send({
          message:
            "An error occurred during updating of task, please try again later."
        });
      }
    }
  );

  // Change the status of a task by ID
  app.patch<{ Params: { id: string } }>(
    "/:id/complete",
    async (request, reply) => {
      try {
        const { id } = request.params;

        if (!id) {
          reply.status(400).send({ message: "ID is required" });
          return;
        }

        const task = await prisma.tasks.findUnique({ where: { id } });

        if (!task) {
          reply.status(404).send({ message: "Task not found" });
          return;
        }

        await prisma.tasks.update({
          where: { id },
          data: {
            completed_at: task.completed_at ? null : new Date()
          }
        });

        reply.status(200).send({ message: "Task completed successfully" });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2025") {
            return reply.status(404).send({ message: "Task not found" });
          }
        }
        console.error("Erro ao atualizar tarefa:", error);
        return reply.status(500).send({
          message:
            "An error occurred during updating of task, please try again later."
        });
      }
    }
  );

  // Create a new task from a CSV file
  app.post("/upload_csv", async (request, reply) => {
    const fileData = await request.file();

    if (!fileData) {
      reply.status(400).send({ message: "File is required" });
      return;
    }

    if (fileData.mimetype !== "text/csv") {
      reply.status(400).send({ message: "Invalid file type" });
      return;
    }

    const csvStream = fileData.file.pipe(
      parse({ columns: true, delimiter: "," })
    );

    for await (const record of csvStream) {
      const { title, description } = record;

      if (!title || !description) {
        console.warn("Invalid Line: ", record);
        continue;
      }

      try {
        await prisma.tasks.createMany({
          data: {
            title,
            description
          }
        });
      } catch (error) {
        console.error("Erro ao criar tarefa:", error);
      }
    }

    return reply.status(201).send({ message: "CSV uploaded successfully" });
  });

  app.get("/export_csv", async (request, reply) => {
    try {
      const tasks = await prisma.tasks.findMany({
        orderBy: { created_at: "desc" }
      });

      // Format tasks data for CSV
      const tasksDataForCSV = tasks.map(task => ({
        title: task.title,
        description: task.description,
        completed_at: task.completed_at ? task.completed_at.toISOString() : null
      }));

      // Convert tasks data to CSV string
      const csvString = stringify(tasksDataForCSV, {
        header: true,
        delimiter: ",",
        bom: true
      });

      reply
        .header("Content-Type", "text/csv")
        .header("Content-Disposition", "attachment; filename=tasks.csv")
        .send(csvString);
    } catch (error) {
      console.error("Erro ao exportar CSV:", error);
      return reply.status(500).send({
        message:
          "An error occurred during exporting of CSV, please try again later."
      });
    }
  });
}
