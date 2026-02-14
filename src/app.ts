import fastify from "fastify";
import { tasksRoute } from "./routes/tasks.ts";
import { fastifyMultipart } from "@fastify/multipart";

export const app = fastify({
  logger: true
});

app.register(fastifyMultipart, {
  limits: {
    fileSize: 1024 * 1024 * 5 // 5MB
  }
});

app.register(tasksRoute, {
  prefix: "/tasks"
});
