"use client"

import { useState } from "react"
import type { Habit } from "~/lib/mock-data"
import { Button } from "~/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"

type EditHabitDialogProps = {
  habit: Habit
  isNew: boolean
  open: boolean
  onClose: () => void
  onSave: (habit: Habit) => void
  onDelete: (habitId: string) => void
}

type Frequency = "daily" | "weekly" | "monthly"

const colorOptions = [
  { label: "Green", value: "#10b981" },
  { label: "Blue", value: "#3b82f6" },
  { label: "Purple", value: "#8b5cf6" },
  { label: "Cyan", value: "#06b6d4" },
  { label: "Orange", value: "#f59e0b" },
  { label: "Red", value: "#ef4444" },
  { label: "Pink", value: "#ec4899" },
  { label: "Yellow", value: "#eab308" },
  { label: "Gray", value: "#6b7280" },
]

export function EditHabitDialog({ habit, isNew, open, onClose, onSave, onDelete }: EditHabitDialogProps) {
  const [name, setName] = useState(habit.name)
  const [frequency, setFrequency] = useState(habit.frequency)
  const [color, setColor] = useState(habit.color)
  const [scheduledTime, setTime] = useState(habit.scheduledTime)

  const handleFrequencyChange = (value: string) => {
    if (value === "daily" || value === "weekly" || value === "monthly") {
      setFrequency(value)
    }
  }

  const handleSave = () => {
    onSave({
      ...habit,
      name,
      frequency,
      color,
      scheduledTime,
    })
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isNew ? "Create New Habit" : "Edit Habit"}</DialogTitle>
          <DialogDescription>
            {isNew
              ? "Set up a new habit to track your progress."
              : "Make changes to your habit. Click save when you're done."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Morning Meditation"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="frequency">Frequency</Label>
            <Select value={frequency} onValueChange={handleFrequencyChange}>
              <SelectTrigger id="frequency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="scheduledTime">Time</Label>
            <Input id="time" type="time" value={scheduledTime} onChange={(e) => setTime(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label>Color</Label>
            <div className="grid grid-cols-4 gap-2">
              {colorOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`h-10 rounded-md border-2 transition-all hover:scale-105 ${
                    color === option.value ? "border-foreground ring-2 ring-ring" : "border-border"
                  }`}
                  style={{ backgroundColor: option.value }}
                  onClick={() => setColor(option.value)}
                  title={option.label}
                />
              ))}
            </div>
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          {!isNew && (
            <Button type="button" variant="destructive" onClick={() => onDelete(habit.id)} className="sm:mr-auto">
              Delete
            </Button>
          )}
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            {isNew ? "Create" : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
