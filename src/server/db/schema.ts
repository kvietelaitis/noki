//import "server-only";

import { bigint, text, time, singlestoreEnum, json, singlestoreTableCreator, index } from "drizzle-orm/singlestore-core";

export const createTable = singlestoreTableCreator((name) => `noki_${name}`)

export const habits_table = createTable("habits_table", {
  id: bigint("id", { mode: "bigint" }).primaryKey().autoincrement(),
  ownerId: text("owner_id").notNull(),
  name: text("name").notNull(),
  color: text('color').default("#6b7280").notNull(),
  frequency: singlestoreEnum(["daily", "weekly", "monthly"]).notNull(),
  scheduledTime: time().notNull(),
  completions: json("completions").$type<Record<string, number>>().notNull()
},
  (t) => {
    return [
      index('owner_id_index').on(t.ownerId)
    ]
  })