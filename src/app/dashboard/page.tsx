import { auth } from "@clerk/nextjs/server";
import { QUERIES } from "~/server/db/queries";
import { ThemeProvider } from "../context/ThemeContext";
import HabitContents from "./habit-contents";

export default async function Dashboard() {
    const user = await auth()

    if (!user.userId){
        return { error: "Unauthorized" };
    }

    const habits = await QUERIES.getHabits(user.userId);
    
    return (
    <ThemeProvider>
      <HabitContents habits={habits}/>
    </ThemeProvider>
  );
}