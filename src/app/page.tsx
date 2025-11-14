"use client"

import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Card } from "~/components/ui/card"
import { HabitGrid } from "~/components/habit-grid"
import { EditHabitDialog } from "~/components/edit-habit-dialog"
import { Plus, Settings } from "lucide-react"

export type Habit = {
  id: string
  name: string
  color: string
  frequency: "daily" | "weekly" | "monthly"
  time: string
  completions: Record<string, number> // date -> completion count
}

// Mock data - generate last 12 weeks of data
const generateMockData = (): Habit[] => {
  const today = new Date()
  const getRandomCompletions = () => {
    const completions: Record<string, number> = {}
    for (let i = 0; i < 84; i++) {
      // 12 weeks
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split("T")[0]
      
      if (dateStr) {
        // Random completion: 0-4 times per day
        if (Math.random() > 0.3) {
          completions[dateStr] = Math.floor(Math.random() * 4)
        }
      } else {
        console.error("Generated invalid date string")
      }
    }
    return completions
  }

  return [
    {
      id: "1",
      name: "Morning Meditation",
      color: "#10b981",
      frequency: "daily",
      time: "07:00",
      completions: getRandomCompletions(),
    },
    {
      id: "2",
      name: "Exercise",
      color: "#3b82f6",
      frequency: "daily",
      time: "06:30",
      completions: getRandomCompletions(),
    },
    {
      id: "3",
      name: "Read for 30min",
      color: "#8b5cf6",
      frequency: "daily",
      time: "21:00",
      completions: getRandomCompletions(),
    },
    {
      id: "4",
      name: "Drink 8 glasses of water",
      color: "#06b6d4",
      frequency: "daily",
      time: "09:00",
      completions: getRandomCompletions(),
    },
  ]
}

export default function Page() {
  const [habits, setHabits] = useState<Habit[]>(generateMockData())
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
  const [isNewHabit, setIsNewHabit] = useState(false)

  const handleCompleteToday = (habitId: string) => {
    const today = new Date().toISOString().split("T")[0]

    if(!today) {
      console.error("Could not get today's date string")
      return
    }

    setHabits(
      habits.map((h) => {
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

  const handleSaveHabit = (habit: Habit) => {
    if (isNewHabit) {
      setHabits([...habits, habit])
    } else {
      setHabits(habits.map((h) => (h.id === habit.id ? habit : h)))
    }
    setEditingHabit(null)
    setIsNewHabit(false)
  }

  const handleNewHabit = () => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      name: "New Habit",
      color: "#f59e0b",
      frequency: "daily",
      time: "09:00",
      completions: {},
    }
    setEditingHabit(newHabit)
    setIsNewHabit(true)
  }

  const handleDeleteHabit = (habitId: string) => {
    setHabits(habits.filter((h) => h.id !== habitId))
    setEditingHabit(null)
    setIsNewHabit(false)
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
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
          {habits.map((habit) => (
            <Card key={habit.id} className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: habit.color }} />
                      <h3 className="font-semibold text-lg">{habit.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1)} • {habit.time}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button onClick={() => handleCompleteToday(habit.id)} size="sm">
                      Complete Today
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingHabit(habit)
                        setIsNewHabit(false)
                      }}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <HabitGrid habit={habit} />
              </div>
            </Card>
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
