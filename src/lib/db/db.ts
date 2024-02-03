import { DATABASE_HOST, DATABASE_PASSWORD, DATABASE_USERNAME } from "$env/static/private";
import { connect } from "@planetscale/database";
import "dotenv/config";
import { drizzle } from "drizzle-orm/planetscale-serverless";

import { transactions, objects, reviews,users } from "./schemas";
import { eq } from "drizzle-orm";

// create the connection
const connection = connect({
    host: DATABASE_HOST,
    username: DATABASE_USERNAME,
    password: DATABASE_PASSWORD,
});

const db = drizzle(connection);

export type Object = typeof objects.$inferSelect;
export type User = typeof users.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;

export async function insertObject(object: Object) {
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
export async function insertUser(user: User) {
    try {
        await db.insert(users).values(user);
        return true;
    } catch (error) {
        return false;
    }
}
export async function insertReview(review: Review) {
    try {
        await db.insert(reviews).values(review);
        return true;
    } catch (error) {
        return false;
    }
}
export async function insertTransaction(transaction: Transaction) {
    try {
        await db.insert(transactions).values(transaction);
        return true;
    } catch (error) {
        return false;
    }
}
