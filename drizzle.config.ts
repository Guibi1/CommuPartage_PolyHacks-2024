import { config } from "dotenv";
import type { Config } from "drizzle-kit";

config();
config({ path: ".env.local" });

export default {
    schema: "./src/lib/db/schemas.ts",
    out: "./.drizzle",
    driver: "mysql2",
    dbCredentials: {
        uri: `mysql://${process.env.PLANETSCALE_DB_USERNAME}:${process.env.PLANETSCALE_DB_PASSWORD}@${process.env.PLANETSCALE_DB_HOST}/${process.env.PLANETSCALE_DB}?ssl={"rejectUnauthorized":true}`,
    },
} satisfies Config;
