import fastify from "fastify";
import { tasksRoute } from "./routes/tasks.ts";

export const app = fastify({
  logger: true
});

app.register(tasksRoute, {
  prefix: "/tasks"
});
