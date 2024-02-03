import type { Config } from "drizzle-kit";
import "dotenv";

export default {
    schema: "./src/lib/db/schemas.ts",
    dbCredentials: {
        host:        process.env.DATABASE_URL as string,
        database: "commupartage",
        user:   process.env.DATABASE_USERNAME as string,
        password: process.env.DATABASE_PASSWORD as string,
    },
    driver: "mysql2",
} satisfies Config;