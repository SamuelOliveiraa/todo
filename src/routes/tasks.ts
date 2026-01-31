import type { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma.ts";
import type { TaskPost, TaskPut } from "../types/task.type.ts";
import { Prisma } from "../generated/prisma/client.ts";

export async function tasksRoute(app: FastifyInstance) {
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
      console.log(error);
      return reply.status(500).send({
        message:
          "An error occurred during fetching tasks, please try again later."
      });
    }
  });

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

  app.delete<{ Params: { id: string } }>("/:id", async (request, reply) => {
    try {
      const { id } = request.params;

      if (!id) {
        reply.status(400).send({ message: "ID is required" });
        return;
      }

      const task = await prisma.tasks.findUnique({
        where: { id }
      });

      if (!task) {
        return reply.status(404).send({ message: "Task not found" });
      } else {
        await prisma.tasks.delete({ where: { id } });

        reply.status(204).send();
      }
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
        console.log(error);
        return reply.status(500).send({
          message:
            "An error occurred during updating of task, please try again later."
        });
      }
    }
  );
}
