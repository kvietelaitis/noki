import type { habits_table } from "~/server/db/schema";
import { Card } from "~/components/ui/card"
import { HabitGrid } from "~/components/habit-grid"
import { Check, Settings } from "lucide-react"
import { Button } from "~/components/ui/button";

export function HabitRow(props: {
    habit: typeof habits_table.$inferSelect
    onComplete: (id: typeof habits_table.$inferSelect["id"]) => void
    onEdit: (h: typeof habits_table.$inferSelect) => void
}) {
    const { habit, onComplete, onEdit } = props;

    return (
        <Card key={habit.id} className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: habit.color }} />
                      <h3 className="font-semibold text-lg">{habit.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1)} • {habit.scheduledTime.slice(0, 5)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button onClick={() => onComplete(habit.id)} size="sm">
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {onEdit(habit)}}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <HabitGrid habit={habit} />
              </div>
            </Card>
    )
}