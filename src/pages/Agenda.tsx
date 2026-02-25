import { useState } from 'react'
import { AgendaSidebar } from '@/components/agenda/AgendaSidebar'
import { AgendaGrid } from '@/components/agenda/AgendaGrid'
import { AgendaDetails } from '@/components/agenda/AgendaDetails'
import { AgendaStats } from '@/components/agenda/AgendaStats'
import { EventFormDialog } from '@/components/agenda/EventFormDialog'
import { AgendaOptimizer } from '@/components/agenda/AgendaOptimizer'
import { AgendaProfitability } from '@/components/agenda/AgendaProfitability'
import { format } from 'date-fns'

export type AgendaView = 'day' | 'week' | 'workWeek' | 'month'

export default function Agenda() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [view, setView] = useState<AgendaView>('week')
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [showOptimizer, setShowOptimizer] = useState(false)
  const [showProfitability, setShowProfitability] = useState(false)
  const [showRiskOverlay, setShowRiskOverlay] = useState(false)

  const [initialFormDate, setInitialFormDate] = useState<string | undefined>()
  const [initialFormTime, setInitialFormTime] = useState<string | undefined>()

  const handleEdit = () => {
    setIsFormOpen(true)
  }

  const handleNew = () => {
    setSelectedEventId(null)
    setInitialFormDate(format(selectedDate, 'yyyy-MM-dd'))
    setInitialFormTime('08:00')
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
          onOpenOptimizer={() => setShowOptimizer(true)}
          onOpenProfitability={() => setShowProfitability(true)}
          showRiskOverlay={showRiskOverlay}
          setShowRiskOverlay={setShowRiskOverlay}
        />

        {showProfitability ? (
          <AgendaProfitability onClose={() => setShowProfitability(false)} />
        ) : (
          <AgendaGrid
            selectedDate={selectedDate}
            view={view}
            selectedEventId={selectedEventId}
            setSelectedEventId={setSelectedEventId}
            showRiskOverlay={showRiskOverlay}
          />
        )}

        {selectedEventId && !showProfitability && (
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
        initialDate={initialFormDate}
        initialTime={initialFormTime}
      />

      <AgendaOptimizer
        open={showOptimizer}
        onOpenChange={setShowOptimizer}
        selectedDate={selectedDate}
        onSelectSlot={(slot) => {
          setInitialFormDate(slot.date)
          setInitialFormTime(slot.startTime)
          setSelectedEventId(null)
          setIsFormOpen(true)
        }}
      />
    </div>
  )
}
