export type Habit = {
  id: string
  name: string
  color: string
  frequency: "daily" | "weekly" | "monthly"
  scheduledTime: string
  completions: Record<string, number> // date -> completion count
}

// Mock data - generate last 12 weeks of data
export default function generateMockData(): Habit[] {
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
      scheduledTime: "07:00",
      completions: getRandomCompletions(),
    },
    {
      id: "2",
      name: "Exercise",
      color: "#3b82f6",
      frequency: "daily",
      scheduledTime: "06:30",
      completions: getRandomCompletions(),
    },
    {
      id: "3",
      name: "Read for 30min",
      color: "#8b5cf6",
      frequency: "daily",
      scheduledTime: "21:00",
      completions: getRandomCompletions(),
    },
    {
      id: "4",
      name: "Drink 8 glasses of water",
      color: "#06b6d4",
      frequency: "daily",
      scheduledTime: "09:00",
      completions: getRandomCompletions(),
    },
  ]
}