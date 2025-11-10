"use client"

import type { Habit } from "~/app/page"

type HabitGridProps = {
  habit: Habit
}

export function HabitGrid({ habit }: HabitGridProps) {
  // Generate last 12 weeks (84 days)
  const weeks = 12
  const daysPerWeek = 7
  const today = new Date()

  const getDateForCell = (weekIndex: number, dayIndex: number) => {
    const daysAgo = (weeks - 1 - weekIndex) * daysPerWeek + (daysPerWeek - 1 - dayIndex)
    const date = new Date(today)
    date.setDate(date.getDate() - daysAgo)
    return date.toISOString().slice(0, 10)
  }

  const getIntensity = (completions: number) => {
    if (completions === 0) return 0
    if (completions === 1) return 1
    if (completions === 2) return 2
    if (completions === 3) return 3
    return 4
  }

  const getColorForIntensity = (intensity: number, baseColor: string) => {
    if (intensity === 0) return "rgb(var(--muted) / 0.3)"

    // Parse hex color and apply opacity based on intensity
    const hex = baseColor.replace("#", "")
    const r = Number.parseInt(hex.substring(0, 2), 16)
    const g = Number.parseInt(hex.substring(2, 4), 16)
    const b = Number.parseInt(hex.substring(4, 6), 16)

    const opacity = intensity * 0.25
    return `rgba(${r}, ${g}, ${b}, ${opacity})`
  }

  let currentMonth = ""
  const monthPositions: { label: string; position: number }[] = []

  for (let w = 0; w < weeks; w++) {
    const date = new Date(today)
    date.setDate(date.getDate() - (weeks - 1 - w) * daysPerWeek)
    const month = date.toLocaleDateString("en-US", { month: "short" })

    if (month !== currentMonth) {
      currentMonth = month
      monthPositions.push({ label: month, position: w })
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        <div className="w-8" />
        <div className="flex gap-1">
          {monthPositions.map((month, idx) => (
            <div
              key={idx}
              className="text-xs text-muted-foreground"
              style={{
                width: `${12}px`,
                marginLeft: idx === 0 ? 0 : `${(month.position - (monthPositions[idx - 1]?.position ?? 0) - 1) * 13}px`,
              }}
            >
              {month.label}
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-1">
        <div className="flex flex-col justify-between py-1 text-xs text-muted-foreground w-8">
          <span>Mon</span>
          <span>Wed</span>
          <span>Fri</span>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: weeks }).map((_, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {Array.from({ length: daysPerWeek }).map((_, dayIndex) => {
                const dateStr = getDateForCell(weekIndex, dayIndex)
                const completions = habit.completions[dateStr] ?? 0
                const intensity = getIntensity(completions)
                const color = getColorForIntensity(intensity, habit.color)

                return (
                  <div
                    key={dayIndex}
                    className="h-3 w-3 rounded-none border border-border/40 transition-colors hover:ring-2 hover:ring-ring/20"
                    style={{ backgroundColor: color }}
                    title={`${dateStr}: ${completions} completion${completions !== 1 ? "s" : ""}`}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground">
        <span>Less</span>
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className="h-3 w-3 rounded-none border border-border/40"
              style={{ backgroundColor: getColorForIntensity(level, habit.color) }}
            />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  )
}
