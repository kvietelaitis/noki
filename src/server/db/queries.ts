import "server-only";

import { db } from "~/server/db";
import { habits_table as habitsSchema } from "~/server/db/schema";
import { asc, eq } from "drizzle-orm";

export const QUERIES = {
    getHabits: function (userId: string) {
        return db.select().from(habitsSchema).where(eq(habitsSchema.ownerId, userId)).orderBy(asc(habitsSchema.id));
    },
    deleteHabit: async function (habitID: bigint) {
        return await db.delete(habitsSchema).where(eq(habitsSchema.id, BigInt(habitID)));
    },
    insertHabit: async function (habit: typeof habitsSchema.$inferInsert) {
        const result = await db.insert(habitsSchema).values(habit);
        return result[0].insertId;
    },
    updateHabit: async function (habit: typeof habitsSchema.$inferInsert) {
        if (habit.id) {
            return await db.update(habitsSchema).set({ name: habit.name, color: habit.color, frequency: habit.frequency, scheduledTime: habit.scheduledTime, completions: habit.completions }).where(eq(habitsSchema.id, habit.id));
        }
    },
    addCompletion: async function (habitID: bigint, date: string) {
        const rows = await db.select().from(habitsSchema).where(eq(habitsSchema.id, BigInt(habitID)));
        const row = rows[0];

        const listOfCompletions = row?.completions ?? {};
        const currentValue = typeof listOfCompletions[date] === "number" ? listOfCompletions[date] : 0;
        const updatedList = { ...listOfCompletions, [date]: currentValue + 1 };

        return db.update(habitsSchema).set({ completions: updatedList }).where(eq(habitsSchema.id, BigInt(habitID)));
    }

}