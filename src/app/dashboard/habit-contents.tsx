"use client"

import { useState } from "react"
import { Button } from "~/components/ui/button"
import { EditHabitDialog } from "~/components/edit-habit-dialog"
import { Moon, Plus, Sun } from "lucide-react"
import type { habits_table } from "~/server/db/schema";
import { HabitRow } from "../../components/habit-row"
import { addCompletion, deleteHabit, insertHabit, updateHabit } from "../../server/db/actions"
import { useTheme } from "~/app/context/ThemeContext"
import { SignedIn, UserButton, useUser } from "@clerk/nextjs"

export default function HabitContents(props: {habits: typeof habits_table.$inferSelect[]}) {
  const [allHabits, setHabits] = useState(props.habits)
  const [editingHabit, setEditingHabit] = useState<typeof habits_table.$inferSelect| null>(null)
  const [isNewHabit, setIsNewHabit] = useState(false)
  const { toggleTheme, darkMode } = useTheme()
  const { user } = useUser()

  const handleCompleteToday = async (habitId: bigint) => {
    const today = new Date().toISOString().split("T")[0]

    if(!today) {
      console.error("Could not get today's date string")
      return
    }

    setHabits(
      allHabits.map((h) => {
        if (h.id === habitId) {
          const currentCount = h.completions[today] ?? 0
          return {
            ...h,
            completions: {
              ...h.completions,
              [today]: currentCount + 1,
            },
          }
        }
        return h
      }),
    )

    const result = await addCompletion(habitId, today);

    if(result.success != true) {
      setHabits(allHabits)
    }
  }

  const handleSaveHabit = async (habit: typeof habits_table.$inferSelect) => {
    if (isNewHabit) {
      await insertHabit(habit)
      //const updatedHabit = { ...habitData, id: BigInt(newID) }
      //setHabits([...allHabits, updatedHabit])
    } else {
      //setHabits(allHabits.map((h) => (h.id === habit.id ? habit : h)))
      await updateHabit(habit)
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
              New Habit
            </Button>
            <Button onClick={toggleTheme}>
              { darkMode ? <Sun /> : <Moon />}
            </Button>
            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "size-8",
                  },
                }}
              />
            </SignedIn>
          </div>
        </div>

        <div className="space-y-6 max-w-4xl mx-auto pt-4 px-4 sm:px-6 lg:px-8">
          {props.habits.length > 0 ? 
          props.habits.map((habit) => (
            <HabitRow
              key={habit.id.toString()}
              habit={habit}
              onComplete={handleCompleteToday}
              onEdit={setEditingHabit}
            />
          )) : 
          <h1 className="flex justify-center pt-10 font-semibold text-lg">Add a new habit!</h1>
          }
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
