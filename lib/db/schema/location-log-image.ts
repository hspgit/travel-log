import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { user } from "./auth";
import { locationLog } from "./location-log";

export const locationLogImage = sqliteTable("locationLogImage", {
    id: int().primaryKey({ autoIncrement: true }),
    keyof: text().notNull(),
    description: text(),
    userId: int().notNull().references(() => user.id),
    locationLogId: int().notNull().references(() => locationLog.id),
    updatedAt: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
});
