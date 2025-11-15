'use server'
import { QUERIES } from '~/server/db/queries';
import type { habits_table } from '~/server/db/schema';

export async function addCompletion(habitId: bigint, today: string) {
    QUERIES.addCompletion(habitId, today);
}

export async function insertHabit(habit: typeof habits_table.$inferInsert) {
    return QUERIES.insertHabit(habit)
}

export async function updateHabit(habit: typeof habits_table.$inferInsert) {
    QUERIES.updateHabit(habit)
}

export async function deleteHabit(habitId: bigint) {
    QUERIES.deleteHabit(habitId)
}
