// drizzle/schema.ts
import { datetime, int, json, mysqlTable, varchar } from "drizzle-orm/mysql-core";

export const objects = mysqlTable("objects", {
    id: varchar("id", { length: 24 }).primaryKey(),
    owner_id: varchar("owner_id", { length: 24 }),
    name: varchar("name", { length: 50 }),
    image: varchar("image", { length: 200 }),
    value: varchar("value", { length: 256 }),
    category: varchar("category", { length: 256 }),
});

export const users = mysqlTable("users", {
    id: varchar("id", { length: 24 }).primaryKey(),
    name: varchar("name", { length: 24 }),
    email: varchar("email", { length: 50 }),
    position: json("position"),
    avatar: varchar("avatar", { length: 200 }),
});

export const reviews = mysqlTable("reviews", {
    id: varchar("id", { length: 24 }).primaryKey(),
    object_id: varchar("object_id", { length: 24 }),
    user_id: varchar("user_id", { length: 24 }),
    writer_id: varchar("writer_id", { length: 24 }),
    rating: int("rating"),
    description: varchar("description", { length: 256 }),
    weight: int("weight"),
});

export const transactions = mysqlTable("reviews", {
    id: varchar("id", { length: 24 }).primaryKey(),
    object_id: varchar("object_id", { length: 24 }),
    lender_id: varchar("lender_id", { length: 24 }),
    receiver_id: varchar("receiver_id", { length: 24 }),
    date_start: datetime("date_start"),
    date_end: datetime("date_end"),
});
