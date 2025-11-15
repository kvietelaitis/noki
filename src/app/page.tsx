import { db } from "~/server/db";
import { habits_table as habitsSchema} from "~/server/db/schema";
import { asc } from "drizzle-orm";
import HabitContents from "./habit-contents";

export default async function Page() {
  const habits = await db.select().from(habitsSchema).orderBy(asc(habitsSchema.id));

  return <HabitContents habits={habits}/>
}
