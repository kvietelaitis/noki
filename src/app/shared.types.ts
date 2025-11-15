import type { habits } from "~/server/db/schema"

export type Habit = typeof habits.$inferSelect;