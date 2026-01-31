import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string(),
  PORT: z.number().default(3000)
});

const envConfig = envSchema.safeParse(process.env);

if (envConfig.success === false) {
  console.error("Invalid enviroment variables", envConfig.error.format());

  throw new Error("Invalid enviroment variables");
}

export const env = envConfig.data;
