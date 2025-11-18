"use client"

import { useEffect, useState } from "react"
import { Button } from "~/components/ui/button"
import { EditHabitDialog } from "~/components/edit-habit-dialog"
import { Plus } from "lucide-react"
import type { habits_table } from "~/server/db/schema";
import { HabitRow } from "./habit-row"
import { addCompletion, deleteHabit, insertHabit, updateHabit } from "./actions"
import { useTheme } from "~/app/context/ThemeContext"
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

export default function HabitContents(props: {habits: typeof habits_table.$inferSelect[]}) {
  const [editingHabit, setEditingHabit] = useState<typeof habits_table.$inferSelect| null>(null)
  const [isNewHabit, setIsNewHabit] = useState(false)
  const { toggleTheme, darkMode } = useTheme()
  const { user } = useUser()
  const navigate = useRouter()

  const handleCompleteToday = async (habitId: bigint) => {
    const today = new Date().toISOString().split("T")[0]

    if(!today) {
      console.error("Could not get today's date string")
      return
    }
    await addCompletion(habitId, today);
    navigate.refresh()
  }

  const handleSaveHabit = async (habit: typeof habits_table.$inferSelect) => {
    if (isNewHabit) {
      const { id, ...habitData} = habit
      const newID = await insertHabit(habitData)
      navigate.refresh()
      //const updatedHabit = { ...habitData, id: BigInt(newID) }
      //setHabits([...allHabits, updatedHabit])
    } else {
      //setHabits(allHabits.map((h) => (h.id === habit.id ? habit : h)))
      await updateHabit(habit)
      navigate.refresh()
    }
    setEditingHabit(null)
    setIsNewHabit(false)
  }

  const handleNewHabit = () => {

    if(!user?.id) {
      console.error("User is not authorized")
      return
    }

    const newHabit: typeof habits_table.$inferSelect = {
      id: BigInt(-1),
      ownerId: user.id,
      name: "New Habit",
      color: "#f59e0b",
      frequency: "daily",
      scheduledTime: "09:00:00",
      completions: {},
    }
    setEditingHabit(newHabit)
    setIsNewHabit(true)
  }

  const handleDeleteHabit = async (habitId: bigint) => {
    //setHabits(allHabits.filter((h) => h.id !== habitId))
    setEditingHabit(null)
    setIsNewHabit(false)
    await deleteHabit(habitId)
    navigate.refresh()
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8 min-w-xs">
        <div className="flex items-center">
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight dark:text-white">noki</h1>
          </div>
          <div className="flex gap-2 justify-center">
            <Button onClick={handleNewHabit} className="gap-2">
              <Plus className="h-4 w-4" />
              New habit
            </Button>
            <Button onClick={toggleTheme}>
              { darkMode ? "Light Mode" : "Dark Mode"}
            </Button>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>

        <div className="space-y-6 max-w-4xl mx-auto">
          {props.habits.map((habit) => (
            <HabitRow
              key={habit.id.toString()}
              habit={habit}
              onComplete={handleCompleteToday}
              onEdit={setEditingHabit}
            />
          ))}
        </div>
      </div>

      {editingHabit && (
        <EditHabitDialog
          habit={editingHabit}
          isNew={isNewHabit}
          open={!!editingHabit}
          onClose={() => {
            setEditingHabit(null)
            setIsNewHabit(false)
          }}
          onSave={handleSaveHabit}
          onDelete={handleDeleteHabit}
        />
      )}
    </div>
  )
}
