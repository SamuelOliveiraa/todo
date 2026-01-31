import type { FastifyInstance } from "fastify";

export function todosRoute(app: FastifyInstance) {
  app.get("/", (request, reply) => {
    reply.send({ message: "Hello World!" });
  });

  app.post("/", (request, reply) => {
    reply.send({ message: "Hello World!" });
  });
}
