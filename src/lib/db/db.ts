import {
    PLANETSCALE_DB_HOST,
    PLANETSCALE_DB_PASSWORD,
    PLANETSCALE_DB_USERNAME,
} from "$env/static/private";
import { connect } from "@planetscale/database";
import "dotenv/config";
import { drizzle } from "drizzle-orm/planetscale-serverless";

import { eq } from "drizzle-orm";
import { objects, reviews, transactions, users } from "./schemas";

// create the connection
const connection = connect({
    host: PLANETSCALE_DB_HOST,
    username: PLANETSCALE_DB_USERNAME,
    password: PLANETSCALE_DB_PASSWORD,
});

const db = drizzle(connection);

export type Object = typeof objects.$inferSelect;
export type User = typeof users.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;

export async function insertObject(object: typeof objects.$inferInsert) {
    try {
        await db.insert(objects).values(object);
        return true;
    } catch (error) {
        return false;
    }
}

export async function deleteObject(object: Object) {
    try {
        await db.delete(objects).where(eq(objects.id, object.id));
        return true;
    } catch (error) {
        return false;
    }
}

export async function insertUser(user: typeof users.$inferInsert) {
    try {
        await db.insert(users).values(user);
        return true;
    } catch (error) {
        console.log("🚀 ~ insertUser ~ error:", error);
        return false;
    }
}

export async function getUser(email: string): Promise<User | null> {
    const rows = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return rows.at(0) ?? null;
}

export async function insertReview(review: typeof reviews.$inferInsert) {
    try {
        await db.insert(reviews).values(review);
        return true;
    } catch (error) {
        return false;
    }
}

export async function insertTransaction(transaction: typeof transactions.$inferInsert) {
    try {
        await db.insert(transactions).values(transaction);
        return true;
    } catch (error) {
        return false;
    }
}
