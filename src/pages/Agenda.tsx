import { useState } from 'react'
import { AgendaSidebar } from '@/components/agenda/AgendaSidebar'
import { AgendaGrid } from '@/components/agenda/AgendaGrid'
import { AgendaDetails } from '@/components/agenda/AgendaDetails'
import { AgendaStats } from '@/components/agenda/AgendaStats'
import { EventFormDialog } from '@/components/agenda/EventFormDialog'

export type AgendaView = 'day' | 'week' | 'workWeek' | 'month'

export default function Agenda() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [view, setView] = useState<AgendaView>('week')
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const handleEdit = () => {
    setIsFormOpen(true)
  }

  const handleNew = () => {
    setSelectedEventId(null)
    setIsFormOpen(true)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-background overflow-hidden animate-fade-in relative">
      <AgendaStats />

      <div className="flex flex-1 overflow-hidden relative">
        <AgendaSidebar
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          view={view}
          setView={setView}
          onNew={handleNew}
        />

        <AgendaGrid
          selectedDate={selectedDate}
          view={view}
          selectedEventId={selectedEventId}
          setSelectedEventId={setSelectedEventId}
        />

        {selectedEventId && (
          <AgendaDetails
            eventId={selectedEventId}
            onClose={() => setSelectedEventId(null)}
            onEdit={handleEdit}
          />
        )}
      </div>

      <EventFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        eventId={selectedEventId}
        onSuccess={() => setIsFormOpen(false)}
      />
    </div>
  )
}
