"use client"

import { useState } from "react"
import { Button } from "~/components/ui/button"
import { EditHabitDialog } from "~/components/edit-habit-dialog"
import { Plus } from "lucide-react"
import type { habits_table } from "~/server/db/schema";
import { HabitRow } from "./habit-row"

export default function HabitContents(props: {habits: typeof habits_table.$inferSelect[]}) {
  const [allHabits, setHabits] = useState<typeof habits_table.$inferSelect[]>(props.habits)
  const [editingHabit, setEditingHabit] = useState<typeof habits_table.$inferSelect| null>(null)
  const [isNewHabit, setIsNewHabit] = useState(false)

  const handleCompleteToday = (habitId: number) => {
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
  }

  const handleSaveHabit = (habit: typeof habits_table.$inferSelect) => {
    if (isNewHabit) {
      setHabits([...allHabits, habit])
    } else {
      setHabits(allHabits.map((h) => (h.id === habit.id ? habit : h)))
    }
    setEditingHabit(null)
    setIsNewHabit(false)
  }

  const handleNewHabit = () => {
    const newHabit: typeof habits_table.$inferSelect = {
      id: 1,
      name: "New Habit",
      color: "#f59e0b",
      frequency: "daily",
      scheduledTime: "09:00",
      completions: {},
    }
    setEditingHabit(newHabit)
    setIsNewHabit(true)
  }

  const handleDeleteHabit = (habitId: number) => {
    setHabits(allHabits.filter((h) => h.id !== habitId))
    setEditingHabit(null)
    setIsNewHabit(false)
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8 min-w-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">noki</h1>
          </div>
          <Button onClick={handleNewHabit} className="gap-2">
            <Plus className="h-4 w-4" />
            New Habit
          </Button>
        </div>

        <div className="space-y-6">
          {allHabits.map((habit) => (
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
