import HabitContents from "./habit-contents";
import { QUERIES } from "~/server/db/queries";

export default async function Page() {
  const habits = await QUERIES.getHabits();

  return <HabitContents habits={habits}/>
}
