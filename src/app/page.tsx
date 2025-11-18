import HabitContents from "./habit-contents";
import { QUERIES } from "~/server/db/queries";
import { ThemeProvider } from "~/app/context/ThemeContext"

export default async function Page() {
  const habits = await QUERIES.getHabits();

  return (
    <ThemeProvider>
      <HabitContents habits={habits}/>
    </ThemeProvider>
  );
}
