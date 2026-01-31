import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { env } from "../env/index.ts";
import { PrismaClient } from "../generated/prisma/client.ts";

const adapter = new PrismaBetterSqlite3({
  url: env.DATABASE_URL
});

const prisma = new PrismaClient({ adapter });

export { prisma };
