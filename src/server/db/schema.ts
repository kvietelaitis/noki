import { int, bigint, text, time, singlestoreEnum, json, singlestoreTable, serial, singlestoreTableCreator } from "drizzle-orm/singlestore-core";

export const createTable = singlestoreTableCreator((name) => `noki_${name}`)

export const habits = createTable("habits_table", {
  id: bigint("id", { mode: "bigint" }).primaryKey().autoincrement(),
  name: text("name").notNull(),
  color: text('color').default("#6b7280"),
  frequency: singlestoreEnum(["daily", "weekly", "monthly"]),
  scheduledTime: time(),
  completions: json().$type<{ date: string, completions: number }>(),
})