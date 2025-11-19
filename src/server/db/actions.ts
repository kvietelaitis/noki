'use server'
import { auth } from '@clerk/nextjs/server';
import { habits_table } from '~/server/db/schema';
import { db } from '.';
import { and, eq, sql } from 'drizzle-orm';
import { cookies } from 'next/headers';

export async function addCompletion(habitId: bigint, date: string) {
    const session = await auth();

    if (!session.userId) {
        return { error: "Unauthorized" };
    }

    await db
        .update(habits_table)
        .set({
            completions: sql`JSON_SET_DOUBLE(
                ${habits_table.completions},
                ${date},
                COALESCE(JSON_EXTRACT_DOUBLE(${habits_table.completions}, ${date}), 0) + 1
            )`
        })
        .where(eq(habits_table.id, habitId));

    const c = await cookies();

    c.set("force-refresh", JSON.stringify(Math.random()));

    return { success: true };
}

export async function insertHabit(habit: typeof habits_table.$inferInsert) {
    const session = await auth();

    if (!session.userId) {
        return { error: "Unauthorized" };
    }

    await db.insert(habits_table).values({ ownerId: session.userId, name: habit.name, color: habit.color, frequency: habit.frequency, scheduledTime: habit.scheduledTime, completions: habit.completions });

    const c = await cookies();

    c.set("force-refresh", JSON.stringify(Math.random()));

    return { success: true };
}

export async function updateHabit(habit: typeof habits_table.$inferInsert) {
    const session = await auth();

    if (!session.userId) {
        return { error: "Unauthorized" };
    }


    if (habit.id) {
        await db.update(habits_table).set({ name: habit.name, color: habit.color, frequency: habit.frequency, scheduledTime: habit.scheduledTime, completions: habit.completions }).where(eq(habits_table.id, habit.id));
    }

    const c = await cookies();

    c.set("force-refresh", JSON.stringify(Math.random()));

    return { success: true };
}

export async function deleteHabit(habitId: bigint) {
    const session = await auth();

    if (!session.userId) {
        return { error: "Unauthorized" };
    }

    await db.delete(habits_table).where(and(eq(habits_table.id, habitId), eq(habits_table.ownerId, session.userId)));

    const c = await cookies();

    c.set("force-refresh", JSON.stringify(Math.random()));

    return { success: true };
}
