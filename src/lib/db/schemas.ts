// drizzle/schema.ts
import { boolean, datetime, int, json, mysqlTable, varchar } from "drizzle-orm/mysql-core";

export type Position = {
    lat: number;
    lng: number;
};

export const objects = mysqlTable("objects", {
    id: varchar("id", { length: 24 })
        .primaryKey()
        .$defaultFn(() => generateRandomString(24)),
    owner_id: varchar("owner_id", { length: 24 }).notNull(),
    name: varchar("name", { length: 50 }).notNull(),
    image: varchar("image", { length: 200 }).notNull(),
    value: int("value").notNull(),
    category: varchar("category", { length: 256 }),
});

export const users = mysqlTable("users", {
    id: varchar("id", { length: 24 })
        .primaryKey()
        .$defaultFn(() => generateRandomString(24)),
    name: varchar("name", { length: 24 }).notNull(),
    email: varchar("email", { length: 50 }).notNull(),
    avatar: varchar("avatar", { length: 200 }).notNull(),
    position: json("position").notNull().$type<Position>(),
});

export const reviews = mysqlTable("reviews", {
    id: varchar("id", { length: 24 })
        .primaryKey()
        .$defaultFn(() => generateRandomString(24)),
    object_id: varchar("object_id", { length: 24 }).notNull(),
    user_id: varchar("user_id", { length: 24 }).notNull(),
    writer_id: varchar("writer_id", { length: 24 }).notNull(),
    rating: int("rating").notNull(),
    description: varchar("description", { length: 256 }).notNull(),
    weight: int("weight").notNull(),
});

export const transactions = mysqlTable("transactions", {
    id: varchar("id", { length: 24 })
        .primaryKey()
        .$defaultFn(() => generateRandomString(24)),
    object_id: varchar("object_id", { length: 24 }).notNull(),
    lender_id: varchar("lender_id", { length: 24 }).notNull(),
    receiver_id: varchar("receiver_id", { length: 24 }).notNull(),
    date_start: datetime("date_start").notNull(),
    date_end: datetime("date_end").notNull(),
    active: boolean("active").notNull(),
});

function generateRandomString(length: number) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const randomBytes = crypto.getRandomValues(new Uint8Array(length));

    let result = "";
    for (let i = 0; i < length; i++) {
        result += charset.charAt(randomBytes[i] % charset.length);
    }

    return result;
}
