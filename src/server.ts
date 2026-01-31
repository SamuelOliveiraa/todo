import fastify from "fastify";
import { todosRoute } from "./routes/todos.js";
import { env } from "./env/index.js";

const app = fastify({
  logger: true
});

app.register(todosRoute, {
  prefix: "/todos"
});

app.listen({ port: env.PORT }, () => {
  return `Server is running on port ${env.PORT}`;
});
