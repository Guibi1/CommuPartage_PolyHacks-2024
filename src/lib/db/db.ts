import {
    PLANETSCALE_DB_HOST,
    PLANETSCALE_DB_PASSWORD,
    PLANETSCALE_DB_USERNAME,
} from "$env/static/private";
import { connect } from "@planetscale/database";
import "dotenv/config";
import { drizzle } from "drizzle-orm/planetscale-serverless";

import { and, eq, getTableColumns, isNull, ne, or } from "drizzle-orm";
import { objects, reviews, transactions, users, type Position } from "./schemas";

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

export async function deleteObject(id: string, userId: string) {
    try {
        await db.delete(objects).where(and(eq(objects.id, id), eq(objects.owner_id, userId)));
        return true;
    } catch (error) {
        return false;
    }
}

export async function getObjectsWithLocation(userId: string) {
    const res = await db
        .select({ ...getTableColumns(objects), position: users.position })
        .from(objects)
        .leftJoin(transactions, eq(objects.id, transactions.object_id))
        .innerJoin(users, eq(users.id, objects.owner_id))
        .where(
            and(
                ne(objects.owner_id, userId),
                or(isNull(transactions.active), eq(transactions.active, false))
            )
        );

    return res;
}

export async function getObjectsAndTransactionsOfUser(userId: string) {
    const res = await db
        .select({
            ...getTableColumns(objects),
            transaction: getTableColumns(transactions),
            receiver_name: users.name,
        })
        .from(objects)
        .leftJoin(transactions, eq(objects.id, transactions.object_id))
        .leftJoin(users, eq(transactions.receiver_id, users.id))
        .where(eq(objects.owner_id, userId));

    return res;
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

export async function getUserFromID(id: string): Promise<User | null> {
    const rows = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return rows.at(0) ?? null;
}

export async function getUser(email: string): Promise<User | null> {
    const rows = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return rows.at(0) ?? null;
}

export async function setUserPosition(email: string, pos: Position) {
    try {
        await db.update(users).set({ position: pos }).where(eq(users.email, email));
        return true;
    } catch (error) {
        return false;
    }
}

export async function insertReview(review: typeof reviews.$inferInsert) {
    try {
        await db.insert(reviews).values(review);
        return true;
    } catch (error) {
        return false;
    }
}

export async function getFullReviews(userId: string) {
    return await db
        .select({ ...getTableColumns(reviews), writer: getTableColumns(users) })
        .from(reviews)
        .innerJoin(users, eq(reviews.writer_id, users.id))
        .where(eq(reviews.user_id, userId));
}

export async function insertTransaction(transaction: typeof transactions.$inferInsert) {
    try {
        await db.insert(transactions).values(transaction);
        return true;
    } catch (error) {
        return false;
    }
}
